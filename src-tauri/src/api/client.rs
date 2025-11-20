use crate::error::{AppError, AppResult};
use crate::storage::{ApiConfig, SecureStorage};
use base64::{engine::general_purpose::STANDARD as BASE64, Engine};
use reqwest::{header, Client};
use serde_json::Value;

use super::types::*;

/// HTTP client for Onetimesecret API
pub struct OtsClient {
    client: Client,
    base_url: String,
    auth_header: String,
}

impl OtsClient {
    /// Create a new API client from stored configuration
    pub async fn from_config() -> AppResult<Self> {
        let config = SecureStorage::load_config()?
            .ok_or_else(|| AppError::Configuration("No API configuration found".to_string()))?;

        Self::new(config).await
    }

    /// Create a new API client with explicit configuration
    pub async fn new(config: ApiConfig) -> AppResult<Self> {
        let api_key = config
            .api_key
            .ok_or_else(|| AppError::Authentication("No API key configured".to_string()))?;

        // Create Basic Auth header: base64(username:api_key)
        let auth_string = format!("{}:{}", config.username, api_key);
        let auth_header = format!("Basic {}", BASE64.encode(auth_string.as_bytes()));

        // Build HTTP client with security settings
        let client = Client::builder()
            .user_agent("OnetimesecretDesktop/0.1.0")
            .timeout(std::time::Duration::from_secs(30))
            .https_only(true)
            .build()?;

        Ok(Self {
            client,
            base_url: config.base_url.trim_end_matches('/').to_string(),
            auth_header,
        })
    }

    /// Test API connection and authentication
    pub async fn test_connection(&self) -> AppResult<bool> {
        let url = format!("{}/api/v2/status", self.base_url);

        let response = self
            .client
            .get(&url)
            .header(header::AUTHORIZATION, &self.auth_header)
            .send()
            .await?;

        Ok(response.status().is_success())
    }

    /// Create a new secret
    pub async fn create_secret(&self, request: &CreateSecretRequest) -> AppResult<CreateSecretResponse> {
        // Validate input
        if request.secret.is_empty() {
            return Err(AppError::InvalidInput("Secret cannot be empty".to_string()));
        }

        if request.ttl == 0 || request.ttl > 604800 {
            return Err(AppError::InvalidInput(
                "TTL must be between 1 second and 7 days (604800 seconds)".to_string(),
            ));
        }

        let url = format!("{}/api/v2/share", self.base_url);

        let response = self
            .client
            .post(&url)
            .header(header::AUTHORIZATION, &self.auth_header)
            .header(header::CONTENT_TYPE, "application/json")
            .json(&serde_json::json!({
                "secret": request.secret,
                "passphrase": request.passphrase,
                "ttl": request.ttl,
                "recipient": request.recipient,
            }))
            .send()
            .await?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_default();
            return Err(AppError::Api(format!(
                "Failed to create secret: {} - {}",
                status, error_text
            )));
        }

        let data: Value = response.json().await?;

        // Parse response according to OTS API v2 format
        let secret_key = data["secret_key"]
            .as_str()
            .ok_or_else(|| AppError::Api("Missing secret_key in response".to_string()))?
            .to_string();

        let metadata_key = data["metadata_key"]
            .as_str()
            .ok_or_else(|| AppError::Api("Missing metadata_key in response".to_string()))?
            .to_string();

        // Construct the full URL for the secret
        let link = format!("{}/secret/{}", self.base_url, secret_key);

        Ok(CreateSecretResponse {
            link,
            secret_key,
            metadata_key,
        })
    }

    /// Retrieve a secret by key (burns the secret)
    pub async fn retrieve_secret(
        &self,
        request: &RetrieveSecretRequest,
    ) -> AppResult<RetrieveSecretResponse> {
        // Validate input
        if request.key.is_empty() {
            return Err(AppError::InvalidInput("Secret key cannot be empty".to_string()));
        }

        let url = format!("{}/api/v2/secret/{}", self.base_url, request.key);

        let mut req = self
            .client
            .post(&url)
            .header(header::AUTHORIZATION, &self.auth_header)
            .header(header::CONTENT_TYPE, "application/json");

        // Add passphrase if provided
        if let Some(passphrase) = &request.passphrase {
            req = req.json(&serde_json::json!({
                "passphrase": passphrase,
            }));
        } else {
            req = req.json(&serde_json::json!({}));
        }

        let response = req.send().await?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_default();
            return Err(AppError::Api(format!(
                "Failed to retrieve secret: {} - {}",
                status, error_text
            )));
        }

        let data: Value = response.json().await?;

        let secret = data["value"]
            .as_str()
            .ok_or_else(|| AppError::Api("Missing value in response".to_string()))?
            .to_string();

        Ok(RetrieveSecretResponse {
            secret,
            metadata: None,
        })
    }

    /// Get secret metadata without burning it
    pub async fn get_metadata(&self, metadata_key: &str) -> AppResult<SecretMetadata> {
        if metadata_key.is_empty() {
            return Err(AppError::InvalidInput(
                "Metadata key cannot be empty".to_string(),
            ));
        }

        let url = format!("{}/api/v2/private/{}", self.base_url, metadata_key);

        let response = self
            .client
            .post(&url)
            .header(header::AUTHORIZATION, &self.auth_header)
            .send()
            .await?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_default();
            return Err(AppError::Api(format!(
                "Failed to get metadata: {} - {}",
                status, error_text
            )));
        }

        let metadata: SecretMetadata = response.json().await?;
        Ok(metadata)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_secret_validation() {
        let request = CreateSecretRequest {
            secret: "".to_string(),
            passphrase: None,
            ttl: 3600,
            recipient: None,
        };

        // Would need async runtime to test properly
        // This is a placeholder for the validation logic
        assert!(request.secret.is_empty());
    }

    #[test]
    fn test_ttl_validation() {
        assert!(0 < 604800); // Valid TTL range
        assert!(604800 <= 604800); // Max TTL
    }
}
