mod dto;
pub(crate) mod handlers;
mod model;
mod repository;

use dto::{ChangePasswordRequest, PatchPreferencesRequest, PatchUserRequest};
pub use handlers::get_router;
pub use model::User;
use model::UserPreferences;
use repository::{
    delete_user, get_preferences, update_preferences, update_user, update_user_password,
};
