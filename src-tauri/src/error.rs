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

    #[error("Rate limit exceeded. Please wait before trying again.")]
    RateLimitExceeded,

    #[error("Service temporarily unavailable. Please try again later.")]
    ServiceUnavailable,

    #[error("Request timeout. Please check your connection and try again.")]
    RequestTimeout,
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
            AppError::RateLimitExceeded => "RATE_LIMIT_EXCEEDED",
            AppError::ServiceUnavailable => "SERVICE_UNAVAILABLE",
            AppError::RequestTimeout => "REQUEST_TIMEOUT",
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
            AppError::RequestTimeout
        } else if err.is_connect() {
            AppError::NetworkError("Connection failed. Please check your internet connection.".to_string())
        } else if let Some(status) = err.status() {
            match status.as_u16() {
                401 => AppError::AuthError("Invalid credentials. Please check your API key.".to_string()),
                404 => AppError::NotFound,
                429 => AppError::RateLimitExceeded,
                500..=599 => AppError::ServiceUnavailable,
                _ => AppError::ApiError(format!("HTTP {}: {}", status.as_u16(), err)),
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
