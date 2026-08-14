use axum::{
    extract::{FromRef, FromRequestParts},
    http::{StatusCode, request::Parts},
};
use axum_extra::extract::CookieJar;
use serde::Serialize;
use sha2::{Digest, Sha256};
use sqlx::PgPool;
use uuid::Uuid;

use crate::AppError;

pub const SESSION_COOKIE: &str = "session";

#[derive(Debug, Clone, Serialize, sqlx::FromRow)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub display_name: String,
    pub is_admin: bool,
    pub timezone: String,
}

impl<S> FromRequestParts<S> for User
where
    PgPool: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let jar = CookieJar::from_headers(&parts.headers);
        let token = jar.get(SESSION_COOKIE).ok_or_else(unauthorized)?.value();

        let token_hash = Sha256::digest(token.as_bytes());

        let pool = PgPool::from_ref(state);
        sqlx::query_as::<_, User>(
            "SELECT u.id, u.email, u.display_name, u.is_admin, u.timezone
             FROM sessions s
             JOIN users u ON u.id = s.user_id
             WHERE s.token_hash = $1 AND s.expires_at > now()",
        )
        .bind(token_hash.as_slice())
        .fetch_optional(&pool)
        .await
        .map_err(|err| {
            AppError::new(
                format!("Cannot read session {err}"),
                StatusCode::INTERNAL_SERVER_ERROR,
            )
        })?
        .ok_or_else(unauthorized)
    }
}

fn unauthorized() -> AppError {
    AppError::new("Unauthorized".to_string(), StatusCode::UNAUTHORIZED)
}
