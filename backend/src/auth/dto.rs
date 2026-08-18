use serde::Deserialize;
use validator::{Validate, ValidationError};

#[derive(Debug, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct RegisterRequest {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 1, max = 25))]
    pub display_name: String,
    #[validate(
        length(
            min = 8,
            max = 50,
            message = "Password must be between 8 and 50 characters"
        ),
        custom(function = "validate_password_complexity")
    )]
    pub password: String,
    pub timezone: String,
}

fn validate_password_complexity(password: &str) -> Result<(), ValidationError> {
    let has_lowercase = password.chars().any(|c| c.is_ascii_lowercase());
    let has_uppercase = password.chars().any(|c| c.is_ascii_uppercase());
    let has_digit = password.chars().any(|c| c.is_ascii_digit());

    if has_lowercase && has_uppercase && has_digit {
        Ok(())
    } else {
        Err(ValidationError::new("password_complexity").with_message(
            "Password must contain at least one lowercase, one uppercase letter, and one digit"
                .into(),
        ))
    }
}

#[derive(Debug, Deserialize, Validate)]
pub struct LoginRequest {
    #[validate(email)]
    pub email: String,
    pub password: String,
}
