use axum::http::StatusCode;
use rand::Rng;
use sha2::{Digest, Sha256};
use sqlx::PgPool;
use tracing::error;

use crate::{
    AppError,
    auth::{dto::RegisterRequest, hash_password},
    user::User,
    util::{Id, hex_encode},
};

// Every function here takes the owner pool from AppState, never app_user.
// users is RLS-protected on id = current_app_user() (migrations/0006_rls.sql),
// but these queries run before an app.user_id identity exists: email
// lookup, account creation, session token resolution. sessions stays
// outside RLS for the same reason.

pub async fn create_user(pool: &PgPool, user: RegisterRequest) -> Result<User, AppError> {
    let id = Id::generate();
    let password_hash = hash_password(&user.password)?;

    let user = sqlx::query_as::<_, User>(
    "INSERT INTO users (id, email, password_hash, display_name, timezone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, display_name, is_admin, timezone, password_hash",
  )
  .bind(id)
  .bind(user.email)
  .bind(password_hash)
  .bind(user.display_name)
  .bind(user.timezone)
  .fetch_one(pool)
  .await
  .map_err(|e| {
    error!("Failed to create user: {e:?}");
    AppError::new(
      "Internal server error".to_string(),
      StatusCode::INTERNAL_SERVER_ERROR,
    )
  })?;

    Ok(user)
}

/// Returns the plaintext token for the cookie.
/// Only its sha256 goes to `sessions.token_hash`
pub async fn create_session(
    pool: &PgPool,
    user_id: &Id,
    ttl_days: u16,
) -> Result<String, AppError> {
    let mut token_bytes = [0u8; 32];
    rand::rng().fill_bytes(&mut token_bytes);
    let token = hex_encode(&token_bytes);
    let token_hash = Sha256::digest(token.as_bytes());

    sqlx::query(
        "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, now() + ($3 * interval '1 day'))",
    )
    .bind(token_hash.as_slice())
    .bind(user_id)
    .bind(i32::from(ttl_days))
    .execute(pool)
    .await
    .map_err(|_| {
        AppError::new(
            "Internal server error".to_string(),
            StatusCode::INTERNAL_SERVER_ERROR,
        )
    })?;

    Ok(token)
}

/// Called from the `User` extractor on every protected route. Its `user.id`
/// return value is what handlers pass to `AppState::rls_transaction`.
pub async fn get_user_from_session(pool: &PgPool, token: &[u8]) -> Result<Option<User>, AppError> {
    let token_hash = Sha256::digest(token);

    let user = sqlx::query_as::<_, User>(
        "SELECT u.id, u.email, u.display_name, u.is_admin, u.timezone, u.password_hash
         FROM sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.token_hash = $1 AND s.expires_at > now()",
    )
    .bind(token_hash.as_slice())
    .fetch_optional(pool)
    .await
    .map_err(|_| {
        AppError::new(
            "Internal server error".to_string(),
            StatusCode::INTERNAL_SERVER_ERROR,
        )
    })?;

    match user {
        Some(user) => Ok(Some(user)),
        None => Ok(None),
    }
}

pub async fn get_user_from_email(pool: &PgPool, email: &str) -> Result<Option<User>, AppError> {
    let user = sqlx::query_as::<_, User>(
        "SELECT id, email, display_name, is_admin, timezone, password_hash FROM users WHERE email = $1",
    )
    .bind(email)
    .fetch_optional(pool)
    .await
    .map_err(|_| {
        AppError::new(
            "Internal server error".to_string(),
            StatusCode::INTERNAL_SERVER_ERROR,
        )
    })?;

    Ok(user)
}

pub async fn user_exists(pool: &PgPool, email: &str) -> Result<bool, AppError> {
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users WHERE email = $1")
        .bind(email)
        .fetch_one(pool)
        .await
        .map_err(|_| {
            AppError::new(
                "Internal server error".to_string(),
                StatusCode::INTERNAL_SERVER_ERROR,
            )
        })?;

    Ok(count > 0)
}

pub async fn revoke_session(pool: &PgPool, token: &[u8]) -> Result<(), AppError> {
    let token_hash = Sha256::digest(token);

    sqlx::query("DELETE FROM sessions WHERE token_hash = $1")
        .bind(token_hash.as_slice())
        .execute(pool)
        .await
        .map_err(AppError::from)?;

    Ok(())
}

pub async fn revoke_all_sessions(pool: &PgPool, user_id: Id) -> Result<(), AppError> {
    sqlx::query("DELETE FROM sessions WHERE user_id = $1")
        .bind(user_id)
        .execute(pool)
        .await
        .map_err(AppError::from)?;

    Ok(())
}

pub async fn purge_expired_sessions(pool: &PgPool) -> Result<u64, AppError> {
    let result = sqlx::query("DELETE FROM sessions WHERE expires_at <= now()")
        .execute(pool)
        .await
        .map_err(AppError::from)?;

    Ok(result.rows_affected())
}
