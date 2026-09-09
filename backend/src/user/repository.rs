use sqlx::{PgConnection, QueryBuilder};

use crate::auth::hash_password;
use crate::error::AppError;
use crate::user::dto::{PatchPreferencesRequest, PatchUserRequest};
use crate::user::{User, UserPreferences};
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

pub async fn get_preferences(
    user_id: &Id,
    conn: &mut PgConnection,
) -> Result<UserPreferences, AppError> {
    sqlx::query_as::<_, UserPreferences>("SELECT * FROM user_preferences WHERE user_id = $1")
        .bind(user_id)
        .fetch_one(conn)
        .await
        .map_err(AppError::from)
}

pub async fn update_preferences(
    user_id: &Id,
    patch: &PatchPreferencesRequest,
    conn: &mut PgConnection,
) -> Result<UserPreferences, AppError> {
    let mut builder = QueryBuilder::new("UPDATE user_preferences SET ");
    let mut separated = builder.separated(", ");
    let mut has_update = false;
    if let Some(new_per_day) = patch.new_per_day {
        separated.push("new_per_day = ");
        separated.push_bind_unseparated(new_per_day);
        has_update = true;
    }
    if let Some(reviews_per_day) = patch.reviews_per_day {
        separated.push("reviews_per_day = ");
        separated.push_bind_unseparated(reviews_per_day);
        has_update = true;
    }
    if let Some(learning_steps_min) = &patch.learning_steps_min {
        separated.push("learning_steps_min = ");
        separated.push_bind_unseparated(learning_steps_min);
        has_update = true;
    }
    if let Some(relearning_steps_min) = &patch.relearning_steps_min {
        separated.push("relearning_steps_min = ");
        separated.push_bind_unseparated(relearning_steps_min);
        has_update = true;
    }
    if let Some(max_interval_days) = patch.max_interval_days {
        separated.push("max_interval_days = ");
        separated.push_bind_unseparated(max_interval_days);
        has_update = true;
    }
    if let Some(desired_retention) = patch.desired_retention {
        separated.push("desired_retention = ");
        separated.push_bind_unseparated(desired_retention);
        has_update = true;
    }
    if let Some(bury_siblings) = patch.bury_siblings {
        separated.push("bury_siblings = ");
        separated.push_bind_unseparated(bury_siblings);
        has_update = true;
    }
    if let Some(max_new_per_group_per_day) = patch.max_new_per_group_per_day {
        separated.push("max_new_per_group_per_day = ");
        separated.push_bind_unseparated(max_new_per_group_per_day);
        has_update = true;
    }
    if let Some(ui) = &patch.ui {
        separated.push("ui = ");
        separated.push_bind_unseparated(ui);
        has_update = true;
    }

    if !has_update {
        return get_preferences(user_id, conn).await;
    }

    builder.push(" WHERE user_id = ");
    builder.push_bind(user_id);
    builder.push(" RETURNING *");

    builder
        .build_query_as::<UserPreferences>()
        .fetch_one(conn)
        .await
        .map_err(AppError::from)
}
