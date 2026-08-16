use crate::Config;
use axum::extract::FromRef;
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;
use std::sync::Arc;
use std::time::Duration;
use tracing::info;

#[derive(Clone, Debug)]
pub struct AppState {
    pub config: Arc<Config>,
    pub pool: PgPool,
}

impl AppState {
    /// # Panics
    ///
    /// Panics if a connection pool cannot be established to `config.database_url`,
    /// or if pending migrations fail to apply.
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

        let state = AppState {
            config: Arc::new(config),
            pool,
        };
        state.spawn_session_purge_task();
        state
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
