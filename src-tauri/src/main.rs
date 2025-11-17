// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use reqwest;

// Type definitions matching the frontend API types
#[derive(Debug, Serialize, Deserialize)]
struct SecretMetadata {
    id: String,
    created: String,
    ttl: u32,
    metadata_key: Option<String>,
    secret_key: Option<String>,
    passphrase_required: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct SecretResponse {
    id: String,
    secret_key: String,
    metadata_key: String,
    ttl: u32,
    created: String,
    updated: String,
    passphrase_required: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct SecretValue {
    value: String,
    secret_key: String,
    metadata_key: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct CreateSecretPayload {
    secret: String,
    passphrase: Option<String>,
    ttl: Option<u32>,
    recipient: Option<String>,
}

/**
 * Create a new secret via the OTS API
 *
 * This command handles all API communication in Rust for security.
 * The frontend should never make direct API calls.
 */
#[tauri::command]
async fn create_secret(
    secret: String,
    passphrase: Option<String>,
    ttl: Option<u32>,
    recipient: Option<String>,
) -> Result<SecretResponse, String> {
    // Default API endpoint - in production, this should be configurable via settings
    let api_endpoint = "https://onetimesecret.dev/api/v2/share";

    // Build the request payload
    let mut payload = serde_json::json!({
        "secret": secret,
    });

    if let Some(pass) = passphrase {
        payload["passphrase"] = serde_json::json!(pass);
    }

    if let Some(t) = ttl {
        payload["ttl"] = serde_json::json!(t);
    }

    if let Some(recip) = recipient {
        payload["recipient"] = serde_json::json!(recip);
    }

    // Make the API request
    let client = reqwest::Client::new();
    let response = client
        .post(api_endpoint)
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Network error: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("API error: {}", response.status()));
    }

    let result: SecretResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    Ok(result)
}

/**
 * Retrieve a secret by its key
 *
 * WARNING: This will destroy the secret after retrieval!
 */
#[tauri::command]
async fn retrieve_secret(
    secret_key: String,
    passphrase: Option<String>,
) -> Result<SecretValue, String> {
    // Default API endpoint
    let api_endpoint = format!("https://onetimesecret.dev/api/v2/secret/{}", secret_key);

    // Build the request
    let client = reqwest::Client::new();
    let mut request = client.get(&api_endpoint);

    // Add passphrase if provided
    if let Some(pass) = passphrase {
        request = request.query(&[("passphrase", pass)]);
    }

    let response = request
        .send()
        .await
        .map_err(|e| format!("Network error: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("API error: {}", response.status()));
    }

    let result: SecretValue = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    Ok(result)
}

/**
 * Get metadata for a secret without destroying it
 */
#[tauri::command]
async fn get_secret_metadata(metadata_key: String) -> Result<SecretMetadata, String> {
    let api_endpoint = format!(
        "https://onetimesecret.dev/api/v2/secret/{}/metadata",
        metadata_key
    );

    let client = reqwest::Client::new();
    let response = client
        .get(&api_endpoint)
        .send()
        .await
        .map_err(|e| format!("Network error: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("API error: {}", response.status()));
    }

    let result: SecretMetadata = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    Ok(result)
}

/**
 * Save application settings to secure storage
 */
#[tauri::command]
async fn save_settings(settings: String) -> Result<(), String> {
    // Implementation would use tauri-plugin-secure-storage
    // For now, this is a placeholder
    Ok(())
}

/**
 * Load application settings from secure storage
 */
#[tauri::command]
async fn load_settings() -> Result<String, String> {
    // Implementation would use tauri-plugin-secure-storage
    // For now, return default settings
    Ok(String::from("{}"))
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_secure_storage::Builder::default().build())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            create_secret,
            retrieve_secret,
            get_secret_metadata,
            save_settings,
            load_settings,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
