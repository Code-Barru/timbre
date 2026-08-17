use serde::Deserialize;

#[derive(Clone, Debug, Deserialize)]
pub struct Config {
    #[serde(default = "d_db_url")]
    pub database_url: String,
    #[serde(default = "d_port")]
    pub port: u16,
    #[serde(default = "d_pool")]
    pub db_max_connections: u32,
    #[serde(default)]
    pub public_url: Option<String>,

    #[serde(default = "d_true")]
    pub allow_registration: bool,
    #[serde(default = "d_session")]
    pub session_ttl_days: u16,
    #[serde(default = "d_true")]
    pub cookie_secure: bool,
}

impl Config {
    /// # Panics
    ///
    /// Panics if the environment variables cannot be deserialized into a `Config`.
    #[must_use]
    #[allow(clippy::new_without_default)]
    pub fn new() -> Self {
        envy::from_env::<Self>().unwrap_or_else(|e| panic!("Failed to load config: {e}"))
    }
}

fn d_db_url() -> String {
    "postgres://timbre:timbre@localhost/timbre".to_string()
}
fn d_port() -> u16 {
    3000
}
fn d_pool() -> u32 {
    10
}
fn d_session() -> u16 {
    30
}
fn d_true() -> bool {
    true
}
