use timbre::{AppState, Config};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_target(false)
        .compact()
        .init();

    let config = Config::new();
    let state = AppState::new(config.clone()).await;
    let app = timbre::app(state);

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", config.port))
        .await
        .unwrap_or_else(|_| panic!("Failed to bind port {}", config.port));

    tracing::info!("Server running on port {}", config.port);
    axum::serve(listener, app).await.unwrap();
}
