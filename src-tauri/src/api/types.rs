use serde::{Deserialize, Serialize};

/// Request to create a new secret
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateSecretRequest {
    pub secret: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub passphrase: Option<String>,
    pub ttl: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub recipient: Option<String>,
}

/// Response from creating a secret
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateSecretResponse {
    pub link: String,
    pub secret_key: String,
    pub metadata_key: String,
}

/// Request to retrieve a secret
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RetrieveSecretRequest {
    pub key: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub passphrase: Option<String>,
}

/// Response from retrieving a secret
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RetrieveSecretResponse {
    pub secret: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<SecretMetadata>,
}

/// Secret metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecretMetadata {
    #[serde(rename = "custid")]
    pub customer_id: String,
    #[serde(rename = "metadata_key")]
    pub metadata_key: String,
    #[serde(rename = "secret_key")]
    pub secret_key: String,
    pub ttl: u32,
    #[serde(rename = "created")]
    pub created_at: String,
    #[serde(rename = "updated")]
    pub updated_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub recipient: Option<Vec<String>>,
}

/// API status response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StatusResponse {
    pub status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
