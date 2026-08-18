use crate::AppError;
use crate::auth::{create_session, verify_password};
use crate::middleware::auth::build_session_cookie;
// PATCH /user/me
// PATCH /user/me/password
use super::{
    ChangePasswordRequest, PatchUserRequest, delete_user, update_user, update_user_password,
};
use crate::auth::revoke_all_sessions;
use crate::extract::AppJson;
use crate::user::User;
use crate::{AppState, Data};
use axum::extract::State;
use axum::http::StatusCode;
use axum::{
    Router,
    routing::{delete, get, patch},
};
use axum_extra::extract::CookieJar;

pub fn get_router() -> Router<AppState> {
    Router::new()
        .route("/me", get(get_me))
        .route("/me", delete(delete_me))
        .route("/me", patch(patch_me))
        .route("/me/password", patch(change_password))
}

pub async fn get_me(user: User) -> Data<User> {
    Data(user)
}

pub async fn patch_me(
    user: User,
    State(state): State<AppState>,
    AppJson(body): AppJson<PatchUserRequest>,
) -> Result<Data<User>, AppError> {
    let mut tx = state.rls_transaction(user.id).await?;
    let updated = update_user(&user.id, &body, &mut tx).await?;
    tx.commit().await?;
    Ok(Data(updated))
}

pub async fn change_password(
    State(state): State<AppState>,
    user: User,
    jar: CookieJar,
    AppJson(body): AppJson<ChangePasswordRequest>,
) -> Result<(CookieJar, Data<()>), AppError> {
    if !verify_password(&body.old_password, &user.password_hash)? {
        return Err(AppError::new(
            "Invalid old password".to_string(),
            StatusCode::UNAUTHORIZED,
        ));
    }

    let mut tx = state.rls_transaction(user.id).await?;
    update_user_password(&body.new_password, &user.id, &mut tx).await?;
    tx.commit().await?;

    revoke_all_sessions(&state.pool, user.id).await?;
    let token = create_session(&state.pool, &user.id, state.config.session_ttl_days).await?;
    let cookie = build_session_cookie(token, &state.config);
    Ok((jar.add(cookie), Data(())))
}

pub async fn delete_me(user: User, State(state): State<AppState>) -> Result<Data<()>, AppError> {
    let mut tx = state.rls_transaction(user.id).await?;
    delete_user(&user.id, &mut tx).await?;
    tx.commit().await?;
    Ok(Data(()))
}
