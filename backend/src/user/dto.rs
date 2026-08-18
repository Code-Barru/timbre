use serde::Deserialize;
use validator::Validate;

use crate::auth::validate_password_complexity;

#[derive(Debug, Clone, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct PatchUserRequest {
    #[validate(email)]
    pub email: Option<String>,
    #[validate(length(min = 1, max = 25))]
    pub display_name: Option<String>,
    pub timezone: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct ChangePasswordRequest {
    pub old_password: String,
    #[validate(
        length(
            min = 8,
            max = 50,
            message = "Password must be between 8 and 50 characters"
        ),
        custom(function = "validate_password_complexity")
    )]
    pub new_password: String,
}
