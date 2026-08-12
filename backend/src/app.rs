use axum::{Router, extract::State, routing::get};
use sqlx::PgPool;
use tower_http::trace::{self, TraceLayer};
use tracing::Level;

use crate::AppState;

pub fn app(state: AppState) -> Router {
    Router::new()
        .route("/health", get(|| async { "Up and running!" }))
        .route("/health/db", get(health_db))
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(trace::DefaultMakeSpan::new().level(Level::INFO))
                .on_response(trace::DefaultOnResponse::new().level(Level::INFO)),
        )
        .with_state(state)
}

async fn health_db(State(pool): State<PgPool>) -> &'static str {
    match sqlx::query("SELECT 1").execute(&pool).await {
        Ok(_) => "ok",
        Err(_) => "db error",
    }
}
