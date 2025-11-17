use crate::error::AppError;
use crate::storage::ApiCredentials;
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};
use std::time::Duration;

/// OneTimeSecret API client
pub struct OtsApiClient {
    client: Client,
    credentials: ApiCredentials,
}

/// Request to create a secret
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSecretRequest {
    pub secret: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub passphrase: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ttl: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub recipient: Option<String>,
}

/// Response from creating a secret
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateSecretResponse {
    pub secret_key: String,
    pub metadata_key: String,
    pub ttl: u32,
    pub metadata_ttl: u32,
    pub secret_ttl: u32,
    pub state: String,
    pub updated: i64,
    pub created: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub recipient: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub passphrase_required: Option<bool>,
}

/// Request to retrieve a secret
#[derive(Debug, Serialize, Deserialize)]
pub struct RetrieveSecretRequest {
    pub secret_key: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub passphrase: Option<String>,
}

/// Response from retrieving a secret
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RetrieveSecretResponse {
    pub secret_key: String,
    pub value: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata_key: Option<String>,
}

/// Secret metadata
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SecretMetadata {
    pub secret_key: String,
    pub metadata_key: String,
    pub ttl: u32,
    pub metadata_ttl: u32,
    pub secret_ttl: u32,
    pub state: String,
    pub updated: i64,
    pub created: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub recipient: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub passphrase_required: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub received: Option<i64>,
}

impl OtsApiClient {
    /// Create a new API client
    pub fn new(credentials: ApiCredentials) -> Result<Self, AppError> {
        credentials.validate()?;

        let client = Client::builder()
            .timeout(Duration::from_secs(30))
            .connect_timeout(Duration::from_secs(10))
            .https_only(true)
            .build()
            .map_err(|e| AppError::ConfigError(format!("Failed to create HTTP client: {}", e)))?;

        Ok(Self {
            client,
            credentials,
        })
    }

    /// Create a new secret
    pub async fn create_secret(
        &self,
        request: CreateSecretRequest,
    ) -> Result<CreateSecretResponse, AppError> {
        // Validate request
        if request.secret.is_empty() {
            return Err(AppError::ValidationError(
                "Secret value cannot be empty".to_string(),
            ));
        }

        let url = format!("{}/api/v2/share", self.credentials.endpoint.trim_end_matches('/'));

        let response = self
            .client
            .post(&url)
            .header("Authorization", self.credentials.get_auth_header())
            .header("Content-Type", "application/json")
            .json(&request)
            .send()
            .await?;

        self.handle_response(response).await
    }

    /// Retrieve a secret
    pub async fn retrieve_secret(
        &self,
        request: RetrieveSecretRequest,
    ) -> Result<RetrieveSecretResponse, AppError> {
        if request.secret_key.is_empty() {
            return Err(AppError::ValidationError(
                "Secret key cannot be empty".to_string(),
            ));
        }

        let url = format!(
            "{}/api/v2/secret/{}",
            self.credentials.endpoint.trim_end_matches('/'),
            request.secret_key
        );

        let mut req = self
            .client
            .post(&url)
            .header("Authorization", self.credentials.get_auth_header())
            .header("Content-Type", "application/json");

        // Add passphrase if provided
        if let Some(passphrase) = request.passphrase {
            req = req.json(&serde_json::json!({ "passphrase": passphrase }));
        }

        let response = req.send().await?;

        self.handle_response(response).await
    }

    /// Delete/burn a secret
    pub async fn delete_secret(&self, metadata_key: &str) -> Result<SecretMetadata, AppError> {
        if metadata_key.is_empty() {
            return Err(AppError::ValidationError(
                "Metadata key cannot be empty".to_string(),
            ));
        }

        let url = format!(
            "{}/api/v2/private/{}",
            self.credentials.endpoint.trim_end_matches('/'),
            metadata_key
        );

        let response = self
            .client
            .post(&url)
            .header("Authorization", self.credentials.get_auth_header())
            .header("Content-Type", "application/json")
            .json(&serde_json::json!({ "action": "burn" }))
            .send()
            .await?;

        self.handle_response(response).await
    }

    /// Get secret metadata
    pub async fn get_metadata(&self, metadata_key: &str) -> Result<SecretMetadata, AppError> {
        if metadata_key.is_empty() {
            return Err(AppError::ValidationError(
                "Metadata key cannot be empty".to_string(),
            ));
        }

        let url = format!(
            "{}/api/v2/private/{}",
            self.credentials.endpoint.trim_end_matches('/'),
            metadata_key
        );

        let response = self
            .client
            .get(&url)
            .header("Authorization", self.credentials.get_auth_header())
            .send()
            .await?;

        self.handle_response(response).await
    }

    /// Test API connection
    pub async fn test_connection(&self) -> Result<(), AppError> {
        let url = format!("{}/api/v2/status", self.credentials.endpoint.trim_end_matches('/'));

        let response = self
            .client
            .get(&url)
            .header("Authorization", self.credentials.get_auth_header())
            .send()
            .await?;

        if response.status().is_success() {
            Ok(())
        } else {
            Err(AppError::ApiError(format!(
                "Connection test failed with status: {}",
                response.status()
            )))
        }
    }

    /// Handle API response
    async fn handle_response<T: for<'de> Deserialize<'de>>(
        &self,
        response: reqwest::Response,
    ) -> Result<T, AppError> {
        let status = response.status();

        if status.is_success() {
            response.json::<T>().await.map_err(|e| {
                AppError::SerializationError(format!("Failed to parse response: {}", e))
            })
        } else {
            let error_text = response
                .text()
                .await
                .unwrap_or_else(|_| "Unknown error".to_string());

            match status {
                StatusCode::UNAUTHORIZED => {
                    Err(AppError::AuthError("Invalid credentials".to_string()))
                }
                StatusCode::NOT_FOUND => Err(AppError::NotFound),
                StatusCode::BAD_REQUEST => Err(AppError::ValidationError(error_text)),
                StatusCode::FORBIDDEN => Err(AppError::PermissionError(error_text)),
                _ => Err(AppError::ApiError(format!(
                    "HTTP {}: {}",
                    status.as_u16(),
                    error_text
                ))),
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_secret_request_validation() {
        let valid = CreateSecretRequest {
            secret: "test secret".to_string(),
            passphrase: None,
            ttl: Some(3600),
            recipient: None,
        };
        assert!(!valid.secret.is_empty());

        let invalid = CreateSecretRequest {
            secret: "".to_string(),
            passphrase: None,
            ttl: None,
            recipient: None,
        };
        assert!(invalid.secret.is_empty());
    }

    #[test]
    fn test_retrieve_secret_request_validation() {
        let valid = RetrieveSecretRequest {
            secret_key: "abc123".to_string(),
            passphrase: None,
        };
        assert!(!valid.secret_key.is_empty());

        let invalid = RetrieveSecretRequest {
            secret_key: "".to_string(),
            passphrase: None,
        };
        assert!(invalid.secret_key.is_empty());
    }
}
