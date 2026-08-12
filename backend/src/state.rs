use axum::extract::FromRef;
use crate::Config;
use sqlx::PgPool;
use std::sync::Arc;

#[derive(Clone, Debug)]
pub struct AppState {
    pub config: Arc<Config>,
    pub pool: PgPool,
}

impl AppState {
    /// # Panics
    ///
    /// Panics if a connection pool cannot be established to `config.database_url`.
    pub async fn new(config: Config) -> AppState {
        let pool = PgPool::connect(config.database_url.as_str())
            .await
            .unwrap_or_else(|_| {
                panic!("Could not connect to database url: {}", config.database_url)
            });

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
