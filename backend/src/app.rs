use axum::{Router, extract::State, http::StatusCode, routing::get};
use sqlx::PgPool;
use tower_http::trace::{self, TraceLayer};
use tracing::Level;

use crate::{AppError, AppState};

pub fn app(state: AppState) -> Router {
    Router::new()
        .route("/health", get(health_db))
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(trace::DefaultMakeSpan::new().level(Level::INFO))
                .on_response(trace::DefaultOnResponse::new().level(Level::INFO)),
        )
        .with_state(state)
}

async fn health_db(State(pool): State<PgPool>) -> Result<&'static str, AppError> {
    match sqlx::query("SELECT 1").execute(&pool).await {
        Ok(_) => Ok("Up and healthy!"),
        Err(err) => Err(AppError::new(
            format!("Cannot connect to database {err}"),
            StatusCode::INTERNAL_SERVER_ERROR,
        )),
    }
}
