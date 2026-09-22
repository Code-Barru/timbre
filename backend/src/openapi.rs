#![allow(
    dead_code,
    reason = "OpenAPI documentation only, served by the dev-only Swagger UI"
)]

use utoipa::openapi::security::{ApiKey, ApiKeyValue, SecurityScheme};
use utoipa::{Modify, OpenApi, ToSchema};

use crate::middleware::auth::SESSION_COOKIE;

#[derive(ToSchema)]
pub struct ApiResponse<T: ToSchema> {
    success: bool,
    data: T,
}

#[derive(ToSchema)]
pub struct ApiEmptyResponse {
    success: bool,
    #[schema(value_type = Option<Object>)]
    data: Option<serde_json::Value>,
}

#[derive(ToSchema)]
pub struct ApiError {
    success: bool,
    error: ApiErrorBody,
}

#[derive(ToSchema)]
pub struct ApiErrorBody {
    message: String,
    #[schema(value_type = Option<Object>)]
    data: Option<serde_json::Value>,
}

#[derive(OpenApi)]
#[openapi(
    paths(
        crate::app::health_db,
        crate::auth::handlers::register,
        crate::auth::handlers::login,
        crate::auth::handlers::logout,
        crate::user::handlers::get_me,
        crate::user::handlers::patch_me,
        crate::user::handlers::delete_me,
        crate::user::handlers::change_password,
        crate::user::handlers::get_my_preferences,
        crate::user::handlers::patch_my_preferences,
    ),
    security(("session" = [])),
    modifiers(&SessionCookie),
)]
pub struct ApiDoc;

struct SessionCookie;

impl Modify for SessionCookie {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        let components = openapi.components.get_or_insert_with(Default::default);
        components.add_security_scheme(
            "session",
            SecurityScheme::ApiKey(ApiKey::Cookie(ApiKeyValue::with_description(
                SESSION_COOKIE,
                "Log in with POST /api/auth/login via Try it out; the browser then sends the cookie automatically. The Authorize button cannot set cookies.",
            ))),
        );
    }
}

#[cfg(all(debug_assertions, feature = "swagger"))]
pub fn swagger_router() -> axum::Router<crate::AppState> {
    utoipa_swagger_ui::SwaggerUi::new("/api/docs")
        .url("/api-docs/openapi.json", ApiDoc::openapi())
        .into()
}
