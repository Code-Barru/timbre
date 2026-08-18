use axum::{Router, extract::State, http::StatusCode, routing::get};
use sqlx::PgPool;
use tower_http::trace::{self, TraceLayer};
use tracing::Level;

use crate::{AppError, AppResult, AppState, Data};

pub fn app(state: AppState) -> Router {
    let api = Router::new()
        .nest("/auth", crate::auth::get_router())
        .nest("/user", crate::user::get_router())
        .route("/health", get(health_db))
        .fallback(api_not_found);

    let router = Router::new().nest("/api", api);

    #[cfg(not(debug_assertions))]
    let router = {
        use tower_http::services::{ServeDir, ServeFile};
        let serve_dir = ServeDir::new("/app/static")
            .not_found_service(ServeFile::new("/app/static/index.html"));
        router.fallback_service(serve_dir)
    };

    router
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(trace::DefaultMakeSpan::new().level(Level::INFO))
                .on_response(trace::DefaultOnResponse::new().level(Level::INFO)),
        )
        .with_state(state)
}

async fn api_not_found() -> StatusCode {
    StatusCode::NOT_FOUND
}

async fn health_db(State(pool): State<PgPool>) -> AppResult<&'static str> {
    match sqlx::query("SELECT 1").execute(&pool).await {
        Ok(_) => Ok(Data("Up and healthy!")),
        Err(err) => Err(AppError::new(
            format!("Cannot connect to database {err}"),
            StatusCode::INTERNAL_SERVER_ERROR,
        )),
    }
}
