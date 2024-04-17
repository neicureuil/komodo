use ::jwt::VerifyWithKey;
use anyhow::{anyhow, Context};
use async_timing_util::unix_timestamp_ms;
use axum::{
  extract::Request, http::HeaderMap, middleware::Next,
  response::Response,
};
use monitor_client::entities::{monitor_timestamp, user::User};
use mungos::mongodb::bson::doc;
use rand::{distributions::Alphanumeric, thread_rng, Rng};
use serde::Deserialize;
use serror::AuthError;

use crate::{db::db_client, helpers::query::get_user};

use self::jwt::{jwt_client, JwtClaims};

pub mod github;
pub mod google;
pub mod jwt;

mod local;

const STATE_PREFIX_LENGTH: usize = 20;

#[derive(Deserialize)]
pub struct RedirectQuery {
  pub redirect: Option<String>,
}

#[instrument(level = "debug")]
pub async fn auth_request(
  headers: HeaderMap,
  mut req: Request,
  next: Next,
) -> Result<Response, AuthError> {
  let user = authenticate_check_enabled(&headers).await?;
  req.extensions_mut().insert(user);
  Ok(next.run(req).await)
}

pub fn random_string(length: usize) -> String {
  thread_rng()
    .sample_iter(&Alphanumeric)
    .take(length)
    .map(char::from)
    .collect()
}

#[instrument(level = "debug")]
pub async fn get_user_id_from_headers(
  headers: &HeaderMap,
) -> anyhow::Result<String> {
  match (
    headers.get("authorization"),
    headers.get("x-api-key"),
    headers.get("x-api-secret"),
  ) {
    (Some(jwt), _, _) => {
      // USE JWT
      let jwt = jwt.to_str().context("jwt is not str")?;
      auth_jwt_get_user_id(jwt)
        .await
        .context("failed to authenticate jwt")
    }
    (None, Some(key), Some(secret)) => {
      // USE API KEY / SECRET
      let key = key.to_str().context("key is not str")?;
      let secret = secret.to_str().context("secret is not str")?;
      auth_api_key_get_user_id(key, secret)
        .await
        .context("failed to authenticate api key")
    }
    _ => {
      // AUTH FAIL
      Err(anyhow!("must attach either AUTHORIZATION header with jwt OR pass X-API-KEY and X-API-SECRET"))
    }
  }
}

#[instrument(level = "debug")]
pub async fn authenticate_check_enabled(
  headers: &HeaderMap,
) -> anyhow::Result<User> {
  let user_id = get_user_id_from_headers(headers).await?;
  let user = get_user(&user_id).await?;
  if user.enabled {
    Ok(user)
  } else {
    Err(anyhow!("user not enabled"))
  }
}

#[instrument(level = "debug")]
pub async fn auth_jwt_get_user_id(
  jwt: &str,
) -> anyhow::Result<String> {
  let claims: JwtClaims = jwt
    .verify_with_key(&jwt_client().key)
    .context("failed to verify claims")?;
  if claims.exp > unix_timestamp_ms() {
    Ok(claims.id)
  } else {
    Err(anyhow!("token has expired"))
  }
}

#[instrument(level = "debug")]
pub async fn auth_jwt_check_enabled(
  jwt: &str,
) -> anyhow::Result<User> {
  let user_id = auth_jwt_get_user_id(jwt).await?;
  check_enabled(user_id).await
}

#[instrument(level = "debug")]
pub async fn auth_api_key_get_user_id(
  key: &str,
  secret: &str,
) -> anyhow::Result<String> {
  let key = db_client()
    .await
    .api_keys
    .find_one(doc! { "key": key }, None)
    .await
    .context("failed to query db")?
    .context("no api key matching key")?;
  if key.expires != 0 && key.expires < monitor_timestamp() {
    return Err(anyhow!("api key expired"));
  }
  if bcrypt::verify(secret, &key.secret)
    .context("failed to verify secret hash")?
  {
    // secret matches
    Ok(key.user_id)
  } else {
    // secret mismatch
    Err(anyhow!("invalid api secret"))
  }
}

#[instrument(level = "debug")]
pub async fn auth_api_key_check_enabled(
  key: &str,
  secret: &str,
) -> anyhow::Result<User> {
  let user_id = auth_api_key_get_user_id(key, secret).await?;
  check_enabled(user_id).await
}

#[instrument(level = "debug")]
async fn check_enabled(user_id: String) -> anyhow::Result<User> {
  let user = get_user(&user_id).await?;
  if user.enabled {
    Ok(user)
  } else {
    Err(anyhow!("user not enabled"))
  }
}
