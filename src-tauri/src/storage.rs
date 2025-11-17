use crate::error::AppError;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use tauri_plugin_secure_storage::SecureStorageExt;

const CREDENTIALS_KEY: &str = "api_credentials";

/// API credentials structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiCredentials {
    pub username: String,
    pub api_key: String,
    pub endpoint: String,
}

impl ApiCredentials {
    /// Validate credentials
    pub fn validate(&self) -> Result<(), AppError> {
        if self.username.is_empty() {
            return Err(AppError::ValidationError(
                "Username cannot be empty".to_string(),
            ));
        }
        if self.api_key.is_empty() {
            return Err(AppError::ValidationError(
                "API key cannot be empty".to_string(),
            ));
        }
        if self.endpoint.is_empty() {
            return Err(AppError::ValidationError(
                "API endpoint cannot be empty".to_string(),
            ));
        }

        // Validate endpoint URL
        url::Url::parse(&self.endpoint)?;

        Ok(())
    }

    /// Get authorization header value
    pub fn get_auth_header(&self) -> String {
        let credentials = format!("{}:{}", self.username, self.api_key);
        format!("Basic {}", base64::prelude::BASE64_STANDARD.encode(credentials))
    }
}

/// Save API credentials securely
pub fn save_credentials(app: &AppHandle, credentials: &ApiCredentials) -> Result<(), AppError> {
    credentials.validate()?;

    let storage = app
        .secure_storage()
        .map_err(|e| AppError::StorageError(format!("Failed to access storage: {}", e)))?;

    let creds_json = serde_json::to_string(credentials)?;

    storage
        .set(CREDENTIALS_KEY, creds_json)
        .map_err(|e| AppError::StorageError(format!("Failed to save credentials: {}", e)))?;

    Ok(())
}

/// Retrieve API credentials from secure storage
pub fn get_credentials(app: &AppHandle) -> Result<ApiCredentials, AppError> {
    let storage = app
        .secure_storage()
        .map_err(|e| AppError::StorageError(format!("Failed to access storage: {}", e)))?;

    let creds_json = storage
        .get(CREDENTIALS_KEY)
        .map_err(|e| AppError::StorageError(format!("Failed to retrieve credentials: {}", e)))?
        .ok_or_else(|| AppError::ConfigError("No credentials found".to_string()))?;

    let credentials: ApiCredentials = serde_json::from_str(&creds_json)?;
    Ok(credentials)
}

/// Delete API credentials from secure storage
pub fn delete_credentials(app: &AppHandle) -> Result<(), AppError> {
    let storage = app
        .secure_storage()
        .map_err(|e| AppError::StorageError(format!("Failed to access storage: {}", e)))?;

    storage
        .delete(CREDENTIALS_KEY)
        .map_err(|e| AppError::StorageError(format!("Failed to delete credentials: {}", e)))?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_credentials_validation() {
        let valid = ApiCredentials {
            username: "test".to_string(),
            api_key: "key123".to_string(),
            endpoint: "https://onetimesecret.com".to_string(),
        };
        assert!(valid.validate().is_ok());

        let invalid_empty_username = ApiCredentials {
            username: "".to_string(),
            api_key: "key123".to_string(),
            endpoint: "https://onetimesecret.com".to_string(),
        };
        assert!(invalid_empty_username.validate().is_err());

        let invalid_url = ApiCredentials {
            username: "test".to_string(),
            api_key: "key123".to_string(),
            endpoint: "not-a-url".to_string(),
        };
        assert!(invalid_url.validate().is_err());
    }

    #[test]
    fn test_auth_header() {
        let creds = ApiCredentials {
            username: "user".to_string(),
            api_key: "pass".to_string(),
            endpoint: "https://onetimesecret.com".to_string(),
        };
        let header = creds.get_auth_header();
        assert!(header.starts_with("Basic "));
    }
}
