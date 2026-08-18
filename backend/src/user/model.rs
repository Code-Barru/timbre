use serde::Serialize;

use crate::util::Id;

#[derive(Debug, Clone, Serialize, sqlx::FromRow)]
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
