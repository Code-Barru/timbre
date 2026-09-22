use serde::Serialize;
use utoipa::ToSchema;

use crate::util::Id;

#[derive(Debug, Clone, Serialize, sqlx::FromRow, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct User {
    #[serde(skip)]
    pub id: Id,
    pub email: String,
    pub display_name: String,
    pub is_admin: bool,
    #[serde(skip)]
    pub password_hash: String,
    pub timezone: String,
}

#[derive(Debug, Clone, Serialize, sqlx::FromRow, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UserPreferences {
    pub new_per_day: i32,
    pub reviews_per_day: i32,
    pub learning_steps_min: Vec<i32>,
    pub relearning_steps_min: Vec<i32>,
    pub max_interval_days: i32,
    pub desired_retention: f64,
    pub bury_siblings: bool,
    pub max_new_per_group_per_day: i32,
    #[schema(value_type = Object)]
    pub ui: serde_json::Value,
}
