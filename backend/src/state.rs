use crate::Config;
use crate::util::{Id, hex_encode};
use axum::extract::FromRef;
use rand::Rng;
use sqlx::postgres::{PgConnectOptions, PgPoolOptions};
use sqlx::{PgPool, Postgres, Transaction};
use std::str::FromStr;
use std::sync::Arc;
use std::time::Duration;
use tracing::info;

#[derive(Clone, Debug)]
pub struct AppState {
    pub config: Arc<Config>,
    /// Owner role: migrations, session purge, and the `/auth` bootstrap
    /// queries (login/register look up `users` by email, before any
    /// `app.user_id` identity exists to filter by).
    pub pool: PgPool,
    /// `app_user` role: RLS-enforced, used by every per-user data route
    /// via [`AppState::rls_transaction`].
    pub rls_pool: PgPool,
}

impl AppState {
    /// # Panics
    ///
    /// Panics if a connection pool cannot be established to `config.database_url`,
    /// if pending migrations fail to apply, or if the `app_user` role cannot be
    /// provisioned.
    pub async fn new(config: Config) -> AppState {
        let pool = PgPool::connect(config.database_url.as_str())
            .await
            .unwrap_or_else(|_| {
                panic!("Could not connect to database url: {}", config.database_url)
            });

        sqlx::migrate!("./migrations")
            .run(&pool)
            .await
            .unwrap_or_else(|e| panic!("Failed to run migrations: {e}"));

        info!("migrations applied");

        let rls_pool = Self::provision_app_user(&pool, &config).await;

        let state = AppState {
            config: Arc::new(config),
            pool,
            rls_pool,
        };
        state.spawn_session_purge_task();
        state
    }

    /// Sets `app_user`'s password to a fresh random value and connects a
    /// pool as that role. Nothing persists the password: it lives only in
    /// this process's memory, so there's no secret to provision or leak.
    ///
    /// Only safe with a single backend instance — a second instance booting
    /// concurrently would reset the password out from under the first one's
    /// pool. Fine for this project's current single-container deployment;
    /// revisit if backend replicas are ever scaled beyond one.
    async fn provision_app_user(pool: &PgPool, config: &Config) -> PgPool {
        let mut password_bytes = [0u8; 32];
        rand::rng().fill_bytes(&mut password_bytes);
        let password = hex_encode(&password_bytes);

        sqlx::query(sqlx::AssertSqlSafe(format!(
            "ALTER ROLE app_user WITH LOGIN PASSWORD '{password}'"
        )))
        .execute(pool)
        .await
        .unwrap_or_else(|e| panic!("Failed to provision app_user: {e}"));

        let options = PgConnectOptions::from_str(&config.database_url)
            .unwrap_or_else(|e| panic!("Invalid database url: {e}"))
            .username("app_user")
            .password(&password);

        PgPoolOptions::new()
            .max_connections(config.db_max_connections)
            .connect_with(options)
            .await
            .unwrap_or_else(|e| panic!("Could not connect as app_user: {e}"))
    }

    /// Opens a transaction on the RLS-enforced pool with `app.user_id` set
    /// for its lifetime. Every query run through it is scoped to `user_id`
    /// by the policies in `migrations/0006_rls.sql`. Caller commits.
    ///
    /// # Errors
    ///
    /// Returns an error if the transaction cannot be opened or `set_config` fails.
    pub async fn rls_transaction(
        &self,
        user_id: Id,
    ) -> sqlx::Result<Transaction<'static, Postgres>> {
        let mut tx = self.rls_pool.begin().await?;
        sqlx::query("SELECT set_config('app.user_id', $1, true)")
            .bind(user_id.to_string())
            .execute(&mut *tx)
            .await?;
        Ok(tx)
    }

    fn spawn_session_purge_task(&self) {
        let database_url = self.config.database_url.clone();
        tokio::spawn(async move {
            let pool = match PgPoolOptions::new()
                .max_connections(1)
                .connect(&database_url)
                .await
            {
                Ok(pool) => pool,
                Err(e) => {
                    tracing::error!("session purge task: failed to connect: {e}");
                    return;
                }
            };

            let mut interval = tokio::time::interval(Duration::from_hours(1));
            loop {
                interval.tick().await;
                match crate::auth::purge_expired_sessions(&pool).await {
                    Ok(n) if n > 0 => info!("purged {n} expired sessions"),
                    Ok(_) => {}
                    Err(_) => tracing::warn!("session purge failed"),
                }
            }
        });
    }
}

impl FromRef<AppState> for PgPool {
    fn from_ref(state: &AppState) -> Self {
        state.pool.clone()
    }
}

impl FromRef<AppState> for Arc<Config> {
    fn from_ref(state: &AppState) -> Self {
        state.config.clone()
    }
}
