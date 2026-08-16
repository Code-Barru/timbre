use argon2::Argon2;
use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString};
use axum::http::StatusCode;

use crate::AppError;

/// Argon2id, params from the crate's `Default` (OWASP-recommended).
/// Failure means the crypto primitive broke, not caller input, so it
/// collapses to a generic 500.
pub fn hash_password(password: &str) -> Result<String, AppError> {
    let salt = SaltString::generate(&mut OsRng);
    Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(|_| {
            AppError::new(
                "Internal server error".to_string(),
                StatusCode::INTERNAL_SERVER_ERROR,
            )
        })
}

/// `Ok(false)` means wrong password, an expected outcome. `Err` means the
/// stored hash is malformed, a server-side problem. Callers map `Ok(false)`
/// to 401 and `Err` to 500.
pub fn verify_password(password: &str, hash: &str) -> Result<bool, AppError> {
    let parsed_hash = PasswordHash::new(hash).map_err(|_| {
        AppError::new(
            "Internal server error".to_string(),
            StatusCode::INTERNAL_SERVER_ERROR,
        )
    })?;

    Ok(Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok())
}
