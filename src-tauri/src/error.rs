use serde::{Deserialize, Serialize};
use thiserror::Error;

/// Application error types
#[derive(Error, Debug)]
pub enum AppError {
    #[error("Storage error: {0}")]
    Storage(String),

    #[error("API error: {0}")]
    Api(String),

    #[error("Network error: {0}")]
    Network(String),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    #[error("Invalid input: {0}")]
    InvalidInput(String),

    #[error("Authentication failed: {0}")]
    Authentication(String),

    #[error("Configuration error: {0}")]
    Configuration(String),
}

impl From<reqwest::Error> for AppError {
    fn from(err: reqwest::Error) -> Self {
        AppError::Network(err.to_string())
    }
}

impl From<keyring::Error> for AppError {
    fn from(err: keyring::Error) -> Self {
        AppError::Storage(err.to_string())
    }
}

impl From<url::ParseError> for AppError {
    fn from(err: url::ParseError) -> Self {
        AppError::InvalidInput(format!("Invalid URL: {}", err))
    }
}

/// Serializable error response for IPC
#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: String,
    pub kind: String,
}

impl From<AppError> for ErrorResponse {
    fn from(err: AppError) -> Self {
        let kind = match &err {
            AppError::Storage(_) => "Storage",
            AppError::Api(_) => "Api",
            AppError::Network(_) => "Network",
            AppError::Serialization(_) => "Serialization",
            AppError::InvalidInput(_) => "InvalidInput",
            AppError::Authentication(_) => "Authentication",
            AppError::Configuration(_) => "Configuration",
        };

        ErrorResponse {
            error: err.to_string(),
            kind: kind.to_string(),
        }
    }
}

/// Result type alias for application operations
pub type AppResult<T> = Result<T, AppError>;
