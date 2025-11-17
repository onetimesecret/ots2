use crate::api::{
    CreateSecretRequest, CreateSecretResponse, OtsApiClient, RetrieveSecretRequest,
    RetrieveSecretResponse, SecretMetadata,
};
use crate::error::{AppError, ErrorResponse};
use crate::storage::{self, ApiCredentials};
use tauri::{AppHandle, State};

/// Create a new secret
#[tauri::command]
pub async fn create_secret(
    app: AppHandle,
    secret: String,
    passphrase: Option<String>,
    ttl: Option<u32>,
    recipient: Option<String>,
) -> Result<CreateSecretResponse, ErrorResponse> {
    // Get credentials from secure storage
    let credentials = storage::get_credentials(&app).map_err(|e| ErrorResponse::from(e))?;

    // Create API client
    let client = OtsApiClient::new(credentials).map_err(|e| ErrorResponse::from(e))?;

    // Create secret request
    let request = CreateSecretRequest {
        secret,
        passphrase,
        ttl,
        recipient,
    };

    // Call API
    client
        .create_secret(request)
        .await
        .map_err(|e| ErrorResponse::from(e))
}

/// Retrieve a secret
#[tauri::command]
pub async fn retrieve_secret(
    app: AppHandle,
    secret_key: String,
    passphrase: Option<String>,
) -> Result<RetrieveSecretResponse, ErrorResponse> {
    let credentials = storage::get_credentials(&app).map_err(|e| ErrorResponse::from(e))?;
    let client = OtsApiClient::new(credentials).map_err(|e| ErrorResponse::from(e))?;

    let request = RetrieveSecretRequest {
        secret_key,
        passphrase,
    };

    client
        .retrieve_secret(request)
        .await
        .map_err(|e| ErrorResponse::from(e))
}

/// Delete/burn a secret
#[tauri::command]
pub async fn delete_secret(
    app: AppHandle,
    metadata_key: String,
) -> Result<SecretMetadata, ErrorResponse> {
    let credentials = storage::get_credentials(&app).map_err(|e| ErrorResponse::from(e))?;
    let client = OtsApiClient::new(credentials).map_err(|e| ErrorResponse::from(e))?;

    client
        .delete_secret(&metadata_key)
        .await
        .map_err(|e| ErrorResponse::from(e))
}

/// Get secret metadata
#[tauri::command]
pub async fn get_secret_metadata(
    app: AppHandle,
    metadata_key: String,
) -> Result<SecretMetadata, ErrorResponse> {
    let credentials = storage::get_credentials(&app).map_err(|e| ErrorResponse::from(e))?;
    let client = OtsApiClient::new(credentials).map_err(|e| ErrorResponse::from(e))?;

    client
        .get_metadata(&metadata_key)
        .await
        .map_err(|e| ErrorResponse::from(e))
}

/// Save API credentials to secure storage
#[tauri::command]
pub async fn save_credentials(
    app: AppHandle,
    username: String,
    api_key: String,
    endpoint: String,
) -> Result<(), ErrorResponse> {
    let credentials = ApiCredentials {
        username,
        api_key,
        endpoint,
    };

    storage::save_credentials(&app, &credentials).map_err(|e| ErrorResponse::from(e))
}

/// Get API credentials from secure storage
#[tauri::command]
pub async fn get_credentials(app: AppHandle) -> Result<ApiCredentials, ErrorResponse> {
    storage::get_credentials(&app).map_err(|e| ErrorResponse::from(e))
}

/// Delete API credentials from secure storage
#[tauri::command]
pub async fn delete_credentials(app: AppHandle) -> Result<(), ErrorResponse> {
    storage::delete_credentials(&app).map_err(|e| ErrorResponse::from(e))
}

/// Test API connection
#[tauri::command]
pub async fn test_connection(app: AppHandle) -> Result<(), ErrorResponse> {
    let credentials = storage::get_credentials(&app).map_err(|e| ErrorResponse::from(e))?;
    let client = OtsApiClient::new(credentials).map_err(|e| ErrorResponse::from(e))?;

    client
        .test_connection()
        .await
        .map_err(|e| ErrorResponse::from(e))
}
