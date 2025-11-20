use crate::error::{AppError, AppResult};
use keyring::Entry;
use serde::{Deserialize, Serialize};

const SERVICE_NAME: &str = "com.onetimesecret.desktop";
const API_KEY_NAME: &str = "api_key";
const CONFIG_KEY_NAME: &str = "config";

/// API configuration stored in secure storage
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiConfig {
    pub base_url: String,
    pub username: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub api_key: Option<String>,
}

/// Secure storage manager using platform-specific keychains
pub struct SecureStorage;

impl SecureStorage {
    /// Save API configuration to secure storage
    /// API key is stored in the platform keychain, other data in preferences
    pub fn save_config(config: &ApiConfig) -> AppResult<()> {
        // Validate configuration
        Self::validate_config(config)?;

        // Store API key in keychain if provided
        if let Some(api_key) = &config.api_key {
            let entry = Entry::new(SERVICE_NAME, API_KEY_NAME)
                .map_err(|e| AppError::Storage(e.to_string()))?;
            entry.set_password(api_key)?;
        }

        // Store configuration (without API key) in keychain
        let config_without_key = ApiConfig {
            base_url: config.base_url.clone(),
            username: config.username.clone(),
            api_key: None,
        };

        let config_json = serde_json::to_string(&config_without_key)?;
        let entry = Entry::new(SERVICE_NAME, CONFIG_KEY_NAME)
            .map_err(|e| AppError::Storage(e.to_string()))?;
        entry.set_password(&config_json)?;

        Ok(())
    }

    /// Load API configuration from secure storage
    pub fn load_config() -> AppResult<Option<ApiConfig>> {
        // Load configuration
        let entry = Entry::new(SERVICE_NAME, CONFIG_KEY_NAME)
            .map_err(|e| AppError::Storage(e.to_string()))?;

        let config_json = match entry.get_password() {
            Ok(json) => json,
            Err(keyring::Error::NoEntry) => return Ok(None),
            Err(e) => return Err(AppError::Storage(e.to_string())),
        };

        let mut config: ApiConfig = serde_json::from_str(&config_json)?;

        // Load API key from keychain
        let key_entry = Entry::new(SERVICE_NAME, API_KEY_NAME)
            .map_err(|e| AppError::Storage(e.to_string()))?;

        match key_entry.get_password() {
            Ok(api_key) => config.api_key = Some(api_key),
            Err(keyring::Error::NoEntry) => {
                // API key not set yet, that's ok
            }
            Err(e) => return Err(AppError::Storage(e.to_string())),
        }

        Ok(Some(config))
    }

    /// Get only the API key from secure storage
    pub fn get_api_key() -> AppResult<Option<String>> {
        let entry = Entry::new(SERVICE_NAME, API_KEY_NAME)
            .map_err(|e| AppError::Storage(e.to_string()))?;

        match entry.get_password() {
            Ok(key) => Ok(Some(key)),
            Err(keyring::Error::NoEntry) => Ok(None),
            Err(e) => Err(AppError::Storage(e.to_string())),
        }
    }

    /// Delete all stored credentials
    pub fn clear_config() -> AppResult<()> {
        let config_entry = Entry::new(SERVICE_NAME, CONFIG_KEY_NAME)
            .map_err(|e| AppError::Storage(e.to_string()))?;
        let _ = config_entry.delete_credential();

        let key_entry = Entry::new(SERVICE_NAME, API_KEY_NAME)
            .map_err(|e| AppError::Storage(e.to_string()))?;
        let _ = key_entry.delete_credential();

        Ok(())
    }

    /// Validate configuration before saving
    fn validate_config(config: &ApiConfig) -> AppResult<()> {
        if config.base_url.is_empty() {
            return Err(AppError::InvalidInput(
                "Base URL cannot be empty".to_string(),
            ));
        }

        // Validate URL format
        url::Url::parse(&config.base_url)?;

        if config.username.is_empty() {
            return Err(AppError::InvalidInput(
                "Username cannot be empty".to_string(),
            ));
        }

        // Basic email validation
        if !config.username.contains('@') {
            return Err(AppError::InvalidInput(
                "Username must be a valid email address".to_string(),
            ));
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_config() {
        let valid_config = ApiConfig {
            base_url: "https://onetimesecret.com".to_string(),
            username: "test@example.com".to_string(),
            api_key: Some("test-key".to_string()),
        };
        assert!(SecureStorage::validate_config(&valid_config).is_ok());

        let invalid_url = ApiConfig {
            base_url: "not-a-url".to_string(),
            username: "test@example.com".to_string(),
            api_key: None,
        };
        assert!(SecureStorage::validate_config(&invalid_url).is_err());

        let invalid_email = ApiConfig {
            base_url: "https://onetimesecret.com".to_string(),
            username: "not-an-email".to_string(),
            api_key: None,
        };
        assert!(SecureStorage::validate_config(&invalid_email).is_err());
    }
}
