use sqlx::{Pool, Postgres, Result};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pool: Pool<Postgres> = Pool::connect("postgres://timbre:timbre@localhost/timbre").await?;
    println!("{pool:?}");
    let res = sqlx::query("SELECT 1").execute(&pool).await?;
    println!("{res:?}");
    pool.close().await;
    Ok(())
}
