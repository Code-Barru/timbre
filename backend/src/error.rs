use axum::{Json, http::StatusCode, response::IntoResponse, response::Response};
use serde::Serialize;
use serde_json::json;

pub struct AppError {
    error: anyhow::Error,
    status: StatusCode,
    details: Option<serde_json::Value>,
}

impl AppError {
    #[must_use]
    pub fn new(error_message: String, status: StatusCode) -> Self {
        let error = anyhow::anyhow!(error_message);
        Self {
            error,
            status,
            details: None,
        }
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let mut error = json!({ "message": format!("{}", self.error) });
        if let Some(details) = self.details {
            error["data"] = details;
        }
        (
            self.status,
            Json(json!({ "success": false, "error": error })),
        )
            .into_response()
    }
}

pub struct Data<T> {
    pub data: T,
    pub status: StatusCode,
}

impl<T> Data<T> {
    #[must_use]
    pub fn new(data: T) -> Self {
        Self {
            data,
            status: StatusCode::OK,
        }
    }

    #[must_use]
    pub fn with_status(data: T, status: StatusCode) -> Self {
        Self { data, status }
    }
}

#[allow(non_snake_case)]
pub fn Data<T>(data: T) -> Data<T> {
    Data::new(data)
}

impl<T: Serialize> IntoResponse for Data<T> {
    fn into_response(self) -> Response {
        if self.status == StatusCode::NO_CONTENT {
            return self.status.into_response();
        }
        (
            self.status,
            Json(json!({ "success": true, "data": self.data })),
        )
            .into_response()
    }
}

pub type AppResult<T> = Result<Data<T>, AppError>;

impl From<validator::ValidationErrors> for AppError {
    fn from(errors: validator::ValidationErrors) -> Self {
        let fields: serde_json::Map<String, serde_json::Value> = errors
            .field_errors()
            .into_iter()
            .map(|(field, errors)| {
                let messages: Vec<String> = errors
                    .iter()
                    .map(|error| {
                        error
                            .message
                            .as_ref()
                            .map_or_else(|| error.code.to_string(), ToString::to_string)
                    })
                    .collect();
                (field.to_string(), json!(messages))
            })
            .collect();

        Self {
            error: anyhow::anyhow!("Validation failed"),
            status: StatusCode::BAD_REQUEST,
            details: Some(serde_json::Value::Object(fields)),
        }
    }
}

impl From<sqlx::Error> for AppError {
    fn from(err: sqlx::Error) -> Self {
        Self {
            error: anyhow::anyhow!(err),
            status: StatusCode::INTERNAL_SERVER_ERROR,
            details: None,
        }
    }
}
