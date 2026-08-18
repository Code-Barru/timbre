use sqlx::{PgConnection, QueryBuilder};

use crate::auth::hash_password;
use crate::error::AppError;
use crate::user::User;
use crate::user::dto::PatchUserRequest;
use crate::util::Id;

pub async fn update_user(
    user_id: &Id,
    patch: &PatchUserRequest,
    conn: &mut PgConnection,
) -> Result<User, AppError> {
    if patch.email.is_none() && patch.display_name.is_none() && patch.timezone.is_none() {
        return sqlx::query_as::<_, User>(
            "SELECT id, email, display_name, is_admin, password_hash, timezone FROM users WHERE id = $1",
        )
        .bind(user_id)
        .fetch_one(conn)
        .await
        .map_err(AppError::from);
    }

    let mut builder = QueryBuilder::new("UPDATE users SET ");
    let mut separated = builder.separated(", ");
    if let Some(email) = &patch.email {
        separated.push("email = ");
        separated.push_bind_unseparated(email);
    }
    if let Some(display_name) = &patch.display_name {
        separated.push("display_name = ");
        separated.push_bind_unseparated(display_name);
    }
    if let Some(timezone) = &patch.timezone {
        separated.push("timezone = ");
        separated.push_bind_unseparated(timezone);
    }
    builder.push(" WHERE id = ");
    builder.push_bind(user_id);
    builder.push(" RETURNING id, email, display_name, is_admin, password_hash, timezone");

    builder
        .build_query_as::<User>()
        .fetch_one(conn)
        .await
        .map_err(AppError::from)
}

pub async fn delete_user(user_id: &Id, conn: &mut PgConnection) -> Result<(), AppError> {
    sqlx::query("DELETE FROM users WHERE id = $1")
        .bind(user_id)
        .execute(conn)
        .await
        .map_err(AppError::from)?;
    Ok(())
}

pub async fn update_user_password(
    password: &str,
    user_id: &Id,
    conn: &mut PgConnection,
) -> Result<(), AppError> {
    let hash = hash_password(password)?;
    sqlx::query("UPDATE users SET password_hash = $1 WHERE id = $2")
        .bind(hash)
        .bind(user_id)
        .execute(conn)
        .await
        .map_err(AppError::from)?;

    Ok(())
}
