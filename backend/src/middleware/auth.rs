use axum::{
    extract::{FromRef, FromRequestParts},
    http::{StatusCode, request::Parts},
};
use axum_extra::extract::CookieJar;
use axum_extra::extract::cookie::{Cookie, SameSite};
use sqlx::PgPool;
use time::Duration;

use crate::user::User;

use crate::{AppError, Config, auth::get_user_from_session};

pub const SESSION_COOKIE: &str = "session";

impl<S> FromRequestParts<S> for User
where
    PgPool: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let jar = CookieJar::from_headers(&parts.headers);
        let token = jar.get(SESSION_COOKIE).ok_or_else(unauthorized)?.value();
        let pool = PgPool::from_ref(state);
        let user = get_user_from_session(&pool, token.as_bytes()).await?;
        match user {
            Some(user) => Ok(user),
            None => Err(unauthorized()),
        }
    }
}

fn unauthorized() -> AppError {
    AppError::new("Unauthorized".to_string(), StatusCode::UNAUTHORIZED)
}

#[must_use]
pub fn build_session_cookie(token: String, config: &Config) -> Cookie<'static> {
    Cookie::build((SESSION_COOKIE, token))
        .path("/")
        .http_only(true)
        .secure(config.cookie_secure)
        .same_site(SameSite::Lax)
        .max_age(Duration::days(i64::from(config.session_ttl_days)))
        .build()
}
