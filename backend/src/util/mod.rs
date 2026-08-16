use std::fmt;

use serde::{Deserialize, Serialize};
use sqlx::encode::IsNull;
use sqlx::error::BoxDynError;
use sqlx::postgres::{PgArgumentBuffer, PgHasArrayType, PgTypeInfo, PgValueRef};
use sqlx::{Decode, Encode, Postgres, Type};
use ulid::Ulid;

/// Primary key: a ULID, stored as `text` (its 26-char canonical form).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(transparent)]
pub struct Id(pub Ulid);

impl Id {
    #[must_use]
    pub fn generate() -> Self {
        Self(Ulid::generate())
    }
}

impl fmt::Display for Id {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Display::fmt(&self.0, f)
    }
}

impl Type<Postgres> for Id {
    fn type_info() -> PgTypeInfo {
        <&str as Type<Postgres>>::type_info()
    }

    fn compatible(ty: &PgTypeInfo) -> bool {
        <&str as Type<Postgres>>::compatible(ty)
    }
}

impl PgHasArrayType for Id {
    fn array_type_info() -> PgTypeInfo {
        <&str as PgHasArrayType>::array_type_info()
    }
}

impl Encode<'_, Postgres> for Id {
    fn encode_by_ref(&self, buf: &mut PgArgumentBuffer) -> Result<IsNull, BoxDynError> {
        buf.extend(self.0.to_string().as_bytes());
        Ok(IsNull::No)
    }
}

impl Decode<'_, Postgres> for Id {
    fn decode(value: PgValueRef<'_>) -> Result<Self, BoxDynError> {
        Ok(Id(Ulid::from_string(value.as_str()?)?))
    }
}
