use serde::{Deserialize, Serialize};
use thiserror::Error;

/// Application error types
#[derive(Error, Debug)]
pub enum AppError {
    #[error("API request failed: {0}")]
    ApiError(String),

    #[error("Authentication failed: {0}")]
    AuthError(String),

    #[error("Invalid configuration: {0}")]
    ConfigError(String),

    #[error("Secret not found")]
    NotFound,

    #[error("Network error: {0}")]
    NetworkError(String),

    #[error("Storage error: {0}")]
    StorageError(String),

    #[error("Serialization error: {0}")]
    SerializationError(String),

    #[error("Invalid input: {0}")]
    ValidationError(String),

    #[error("Operation not permitted: {0}")]
    PermissionError(String),
}

/// Serializable error response for IPC
#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: String,
    pub code: String,
}

impl From<AppError> for ErrorResponse {
    fn from(err: AppError) -> Self {
        let code = match &err {
            AppError::ApiError(_) => "API_ERROR",
            AppError::AuthError(_) => "AUTH_ERROR",
            AppError::ConfigError(_) => "CONFIG_ERROR",
            AppError::NotFound => "NOT_FOUND",
            AppError::NetworkError(_) => "NETWORK_ERROR",
            AppError::StorageError(_) => "STORAGE_ERROR",
            AppError::SerializationError(_) => "SERIALIZATION_ERROR",
            AppError::ValidationError(_) => "VALIDATION_ERROR",
            AppError::PermissionError(_) => "PERMISSION_ERROR",
        };

        ErrorResponse {
            error: err.to_string(),
            code: code.to_string(),
        }
    }
}

impl From<reqwest::Error> for AppError {
    fn from(err: reqwest::Error) -> Self {
        if err.is_timeout() {
            AppError::NetworkError("Request timeout".to_string())
        } else if err.is_connect() {
            AppError::NetworkError("Connection failed".to_string())
        } else if let Some(status) = err.status() {
            if status.as_u16() == 401 {
                AppError::AuthError("Invalid credentials".to_string())
            } else if status.as_u16() == 404 {
                AppError::NotFound
            } else {
                AppError::ApiError(format!("HTTP {}: {}", status.as_u16(), err))
            }
        } else {
            AppError::NetworkError(err.to_string())
        }
    }
}

impl From<serde_json::Error> for AppError {
    fn from(err: serde_json::Error) -> Self {
        AppError::SerializationError(err.to_string())
    }
}

impl From<url::ParseError> for AppError {
    fn from(err: url::ParseError) -> Self {
        AppError::ValidationError(format!("Invalid URL: {}", err))
    }
}
