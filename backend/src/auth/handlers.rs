use std::sync::Arc;

use axum::{Router, extract::State, http::StatusCode, routing::post};
use axum_extra::extract::CookieJar;
use sqlx::PgPool;
use validator::Validate;

use crate::{
    AppError, AppState, Config, Data,
    auth::{
        User, create_session, create_user,
        dto::{LoginDto, RegisterDto},
        get_user_from_email, revoke_session, user_exists, verify_password,
    },
    extract::AppJson,
    middleware::auth::{SESSION_COOKIE, build_session_cookie},
};

pub fn get_router() -> Router<AppState> {
    Router::new()
        .route("/register", post(register))
        .route("/login", post(login))
        .route("/logout", post(logout))
}

pub async fn register(
    State(pool): State<PgPool>,
    State(config): State<Arc<Config>>,
    jar: CookieJar,
    AppJson(body): AppJson<RegisterDto>,
) -> Result<(CookieJar, Data<User>), AppError> {
    if !config.allow_registration {
        return Err(AppError::new(
            "Registration is not allowed".to_string(),
            StatusCode::FORBIDDEN,
        ));
    }
    body.validate()?;
    if user_exists(&pool, &body.email).await? {
        return Err(AppError::new(
            "Email already exists".to_string(),
            StatusCode::CONFLICT,
        ));
    }

    let user = create_user(&pool, body).await?;
    let token = create_session(&pool, user.id, config.session_ttl_days).await?;
    let cookie = build_session_cookie(token, &config);

    Ok((
        jar.add(cookie),
        Data::with_status(user, StatusCode::CREATED),
    ))
}

pub async fn login(
    State(pool): State<PgPool>,
    State(config): State<Arc<Config>>,
    jar: CookieJar,
    AppJson(body): AppJson<LoginDto>,
) -> Result<(CookieJar, Data<User>), AppError> {
    body.validate()?;
    let Ok(Some(user)) = get_user_from_email(&pool, &body.email).await else {
        return Err(AppError::new(
            "Invalid email or password".to_string(),
            StatusCode::UNAUTHORIZED,
        ));
    };

    if !verify_password(&body.password, &user.password_hash)? {
        return Err(AppError::new(
            "Invalid email or password".to_string(),
            StatusCode::UNAUTHORIZED,
        ));
    }

    let token = create_session(&pool, user.id, config.session_ttl_days).await?;
    let cookie = build_session_cookie(token, &config);
    Ok((jar.add(cookie), Data(user)))
}

pub async fn logout(
    State(pool): State<PgPool>,
    jar: CookieJar,
) -> Result<(CookieJar, Data<()>), AppError> {
    if let Some(cookie) = jar.get(SESSION_COOKIE) {
        revoke_session(&pool, cookie.value().as_bytes()).await?;
    }
    Ok((
        jar.remove(SESSION_COOKIE),
        Data::with_status((), StatusCode::NO_CONTENT),
    ))
}
