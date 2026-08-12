use axum::{http::StatusCode, response::IntoResponse, response::Response};

pub struct AppError {
    error: anyhow::Error,
    status: StatusCode,
}

impl AppError {
    #[must_use]
    pub fn new(error_message: String, status: StatusCode) -> Self {
        let error = anyhow::anyhow!(error_message);
        Self { error, status }
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        (self.status, format!("{}", self.error)).into_response()
    }
}
