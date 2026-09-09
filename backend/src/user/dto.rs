use serde::Deserialize;
use validator::{Validate, ValidationError};

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

#[derive(Debug, Clone, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct PatchPreferencesRequest {
    #[validate(range(min = 0))]
    pub new_per_day: Option<i32>,
    #[validate(range(min = 0))]
    pub reviews_per_day: Option<i32>,
    #[validate(custom(function = "validate_steps"))]
    pub learning_steps_min: Option<Vec<i32>>,
    #[validate(custom(function = "validate_steps"))]
    pub relearning_steps_min: Option<Vec<i32>>,
    #[validate(range(min = 1))]
    pub max_interval_days: Option<i32>,
    #[validate(range(min = 0.70, max = 0.99))]
    pub desired_retention: Option<f64>,
    pub bury_siblings: Option<bool>,
    #[validate(range(min = 0))]
    pub max_new_per_group_per_day: Option<i32>,
    pub ui: Option<serde_json::Value>,
}

fn validate_steps(steps: &[i32]) -> Result<(), ValidationError> {
    if steps.is_empty() {
        return Err(ValidationError::new("steps_empty")
            .with_message("Steps must contain at least one value".into()));
    }
    if steps.iter().any(|&step| step <= 0) {
        return Err(ValidationError::new("steps_positive")
            .with_message("Steps must all be greater than zero".into()));
    }
    Ok(())
}
