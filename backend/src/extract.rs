use axum::extract::rejection::JsonRejection;
use axum::extract::{FromRequest, Json, Request};
use serde::de::DeserializeOwned;

use crate::AppError;

pub struct AppJson<T>(pub T);

impl<S, T> FromRequest<S> for AppJson<T>
where
    T: DeserializeOwned,
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        match Json::<T>::from_request(req, state).await {
            Ok(Json(value)) => Ok(Self(value)),
            Err(rejection) => {
                let message = match &rejection {
                    JsonRejection::JsonDataError(err) => format!("Invalid request body: {err}"),
                    JsonRejection::JsonSyntaxError(_) => {
                        "Request body contains malformed JSON".to_string()
                    }
                    JsonRejection::MissingJsonContentType(_) => {
                        "Content-Type must be application/json".to_string()
                    }
                    _ => "Invalid request body".to_string(),
                };
                Err(AppError::new(message, rejection.status()))
            }
        }
    }
}
