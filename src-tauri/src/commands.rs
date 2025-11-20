use crate::api::{CreateSecretRequest, CreateSecretResponse, OtsClient, RetrieveSecretRequest, RetrieveSecretResponse};
use crate::error::{AppError, AppResult};
use crate::storage::{ApiConfig, SecureStorage};
use serde::{Deserialize, Serialize};

/// Test connection result
#[derive(Debug, Serialize, Deserialize)]
pub struct TestConnectionResult {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

/// Load API configuration from secure storage
#[tauri::command]
pub async fn load_api_config() -> Result<Option<ApiConfig>, String> {
    SecureStorage::load_config()
        .map_err(|e| e.to_string())
}

/// Save API configuration to secure storage
/// API key is stored in platform-specific keychain
#[tauri::command]
pub async fn save_api_config(config: ApiConfig) -> Result<(), String> {
    SecureStorage::save_config(&config)
        .map_err(|e| e.to_string())
}

/// Test API connection and authentication
#[tauri::command]
pub async fn test_api_connection() -> Result<TestConnectionResult, String> {
    match test_connection_internal().await {
        Ok(success) => Ok(TestConnectionResult {
            success,
            error: None,
        }),
        Err(e) => Ok(TestConnectionResult {
            success: false,
            error: Some(e.to_string()),
        }),
    }
}

async fn test_connection_internal() -> AppResult<bool> {
    let client = OtsClient::from_config().await?;
    client.test_connection().await
}

/// Create a new secret
#[tauri::command]
pub async fn create_secret(request: CreateSecretRequest) -> Result<CreateSecretResponse, String> {
    create_secret_internal(request)
        .await
        .map_err(|e| e.to_string())
}

async fn create_secret_internal(request: CreateSecretRequest) -> AppResult<CreateSecretResponse> {
    let client = OtsClient::from_config().await?;
    client.create_secret(&request).await
}

/// Retrieve a secret by key (burns the secret)
#[tauri::command]
pub async fn retrieve_secret(
    request: RetrieveSecretRequest,
) -> Result<RetrieveSecretResponse, String> {
    retrieve_secret_internal(request)
        .await
        .map_err(|e| e.to_string())
}

async fn retrieve_secret_internal(
    request: RetrieveSecretRequest,
) -> AppResult<RetrieveSecretResponse> {
    let client = OtsClient::from_config().await?;
    client.retrieve_secret(&request).await
}

/// Get secret metadata without burning it
#[tauri::command]
pub async fn get_secret_metadata(metadata_key: String) -> Result<String, String> {
    get_metadata_internal(metadata_key)
        .await
        .map_err(|e| e.to_string())
}

async fn get_metadata_internal(metadata_key: String) -> AppResult<String> {
    let client = OtsClient::from_config().await?;
    let metadata = client.get_metadata(&metadata_key).await?;
    Ok(serde_json::to_string(&metadata)?)
}

/// Clear all stored configuration and credentials
#[tauri::command]
pub async fn clear_api_config() -> Result<(), String> {
    SecureStorage::clear_config()
        .map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_command_serialization() {
        let request = CreateSecretRequest {
            secret: "test secret".to_string(),
            passphrase: Some("test passphrase".to_string()),
            ttl: 3600,
            recipient: None,
        };

        let json = serde_json::to_string(&request).unwrap();
        assert!(json.contains("test secret"));
    }
}
