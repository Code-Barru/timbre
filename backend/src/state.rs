use crate::Config;
use axum::extract::FromRef;
use sqlx::PgPool;
use std::sync::Arc;
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

        AppState {
            config: Arc::new(config),
            pool,
        }
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
