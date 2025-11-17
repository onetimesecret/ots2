// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use std::time::Duration;
use tauri::State;

// Application state for shared resources
pub struct AppState {
    http_client: reqwest::Client,
    settings: Mutex<AppSettings>,
}

// Application settings
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub api_endpoint: String,
    pub default_ttl: u32,
    pub theme: String,
    pub api_username: Option<String>,
    pub api_key: Option<String>,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            api_endpoint: "https://onetimesecret.dev".to_string(),
            default_ttl: 604800, // 7 days
            theme: "system".to_string(),
            api_username: None,
            api_key: None,
        }
    }
}

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
    state: State<'_, AppState>,
) -> Result<SecretResponse, String> {
    // Get current settings
    let settings = state.settings.lock()
        .map_err(|e| {
            log::error!("Failed to acquire settings lock: {}", e);
            "Internal error".to_string()
        })?
        .clone();

    let api_endpoint = format!("{}/api/v2/share", settings.api_endpoint);

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

    // Make the API request with authentication if configured
    let mut request = state.http_client.post(&api_endpoint).json(&payload);

    // Add basic auth if configured
    if let (Some(username), Some(api_key)) = (&settings.api_username, &settings.api_key) {
        request = request.basic_auth(username, Some(api_key));
    }

    let response = request
        .send()
        .await
        .map_err(|e| {
            log::error!("Network error creating secret: {}", e);
            "Unable to connect to server. Please check your connection.".to_string()
        })?;

    if !response.status().is_success() {
        let status = response.status();
        log::error!("API error creating secret: {}", status);
        return Err(match status.as_u16() {
            401 => "Authentication failed. Please check your API credentials.".to_string(),
            403 => "Access forbidden. Please verify your permissions.".to_string(),
            429 => "Rate limit exceeded. Please try again later.".to_string(),
            500..=599 => "Server error. Please try again later.".to_string(),
            _ => "Failed to create secret. Please try again.".to_string(),
        });
    }

    let result: SecretResponse = response
        .json()
        .await
        .map_err(|e| {
            log::error!("Failed to parse response: {}", e);
            "Invalid response from server".to_string()
        })?;

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
    state: State<'_, AppState>,
) -> Result<SecretValue, String> {
    // Get current settings
    let settings = state.settings.lock()
        .map_err(|e| {
            log::error!("Failed to acquire settings lock: {}", e);
            "Internal error".to_string()
        })?
        .clone();

    let api_endpoint = format!("{}/api/v2/secret/{}", settings.api_endpoint, secret_key);

    // Build the request
    let mut request = state.http_client.get(&api_endpoint);

    // Add basic auth if configured
    if let (Some(username), Some(api_key)) = (&settings.api_username, &settings.api_key) {
        request = request.basic_auth(username, Some(api_key));
    }

    // Add passphrase if provided
    if let Some(pass) = passphrase {
        request = request.query(&[("passphrase", pass)]);
    }

    let response = request
        .send()
        .await
        .map_err(|e| {
            log::error!("Network error retrieving secret: {}", e);
            "Unable to connect to server. Please check your connection.".to_string()
        })?;

    if !response.status().is_success() {
        let status = response.status();
        log::error!("API error retrieving secret: {}", status);
        return Err(match status.as_u16() {
            401 => "Authentication failed. Please check your API credentials.".to_string(),
            403 => "Access forbidden or incorrect passphrase.".to_string(),
            404 => "Secret not found or already viewed.".to_string(),
            429 => "Rate limit exceeded. Please try again later.".to_string(),
            500..=599 => "Server error. Please try again later.".to_string(),
            _ => "Failed to retrieve secret. Please try again.".to_string(),
        });
    }

    let result: SecretValue = response
        .json()
        .await
        .map_err(|e| {
            log::error!("Failed to parse response: {}", e);
            "Invalid response from server".to_string()
        })?;

    Ok(result)
}

/**
 * Get metadata for a secret without destroying it
 */
#[tauri::command]
async fn get_secret_metadata(
    metadata_key: String,
    state: State<'_, AppState>,
) -> Result<SecretMetadata, String> {
    // Get current settings
    let settings = state.settings.lock()
        .map_err(|e| {
            log::error!("Failed to acquire settings lock: {}", e);
            "Internal error".to_string()
        })?
        .clone();

    let api_endpoint = format!(
        "{}/api/v2/secret/{}/metadata",
        settings.api_endpoint, metadata_key
    );

    // Build the request
    let mut request = state.http_client.get(&api_endpoint);

    // Add basic auth if configured
    if let (Some(username), Some(api_key)) = (&settings.api_username, &settings.api_key) {
        request = request.basic_auth(username, Some(api_key));
    }

    let response = request
        .send()
        .await
        .map_err(|e| {
            log::error!("Network error getting metadata: {}", e);
            "Unable to connect to server. Please check your connection.".to_string()
        })?;

    if !response.status().is_success() {
        let status = response.status();
        log::error!("API error getting metadata: {}", status);
        return Err(match status.as_u16() {
            401 => "Authentication failed. Please check your API credentials.".to_string(),
            403 => "Access forbidden. Please verify your permissions.".to_string(),
            404 => "Secret metadata not found.".to_string(),
            429 => "Rate limit exceeded. Please try again later.".to_string(),
            500..=599 => "Server error. Please try again later.".to_string(),
            _ => "Failed to get secret metadata. Please try again.".to_string(),
        });
    }

    let result: SecretMetadata = response
        .json()
        .await
        .map_err(|e| {
            log::error!("Failed to parse response: {}", e);
            "Invalid response from server".to_string()
        })?;

    Ok(result)
}

/**
 * Save application settings to secure storage
 */
#[tauri::command]
async fn save_settings(
    settings_json: String,
    state: State<'_, AppState>,
    app: tauri::AppHandle,
) -> Result<(), String> {
    // Parse the settings JSON
    let new_settings: AppSettings = serde_json::from_str(&settings_json)
        .map_err(|e| {
            log::error!("Failed to parse settings: {}", e);
            "Invalid settings format".to_string()
        })?;

    // Update the app state
    {
        let mut settings = state.settings.lock()
            .map_err(|e| {
                log::error!("Failed to acquire settings lock: {}", e);
                "Internal error".to_string()
            })?;
        *settings = new_settings.clone();
    }

    // Save to secure storage
    use tauri_plugin_secure_storage::SecureStorageExt;
    app.secure_storage()
        .set("app_settings", &settings_json)
        .map_err(|e| {
            log::error!("Failed to save settings to secure storage: {}", e);
            "Failed to save settings securely".to_string()
        })?;

    log::info!("Settings saved successfully");
    Ok(())
}

/**
 * Load application settings from secure storage
 */
#[tauri::command]
async fn load_settings(app: tauri::AppHandle) -> Result<String, String> {
    use tauri_plugin_secure_storage::SecureStorageExt;

    // Try to load from secure storage
    match app.secure_storage().get("app_settings") {
        Ok(settings_json) => {
            log::info!("Settings loaded from secure storage");
            Ok(settings_json)
        }
        Err(e) => {
            log::warn!("Failed to load settings from secure storage: {}", e);
            // Return default settings
            let default_settings = AppSettings::default();
            let json = serde_json::to_string(&default_settings)
                .map_err(|e| {
                    log::error!("Failed to serialize default settings: {}", e);
                    "Internal error".to_string()
                })?;
            Ok(json)
        }
    }
}

fn main() {
    // Initialize logging
    env_logger::init();

    // Create HTTP client with timeout and other configurations
    let http_client = reqwest::Client::builder()
        .timeout(Duration::from_secs(30))
        .connect_timeout(Duration::from_secs(10))
        .user_agent(format!("OneTimeSecret-Desktop/{}", env!("CARGO_PKG_VERSION")))
        .build()
        .expect("Failed to build HTTP client");

    // Initialize app state with default settings
    let app_state = AppState {
        http_client,
        settings: Mutex::new(AppSettings::default()),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_secure_storage::Builder::default().build())
        .plugin(tauri_plugin_http::init())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            create_secret,
            retrieve_secret,
            get_secret_metadata,
            save_settings,
            load_settings,
        ])
        .setup(|app| {
            // Load settings from secure storage on startup
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                use tauri_plugin_secure_storage::SecureStorageExt;
                if let Ok(settings_json) = app_handle.secure_storage().get("app_settings") {
                    if let Ok(settings) = serde_json::from_str::<AppSettings>(&settings_json) {
                        if let Some(state) = app_handle.try_state::<AppState>() {
                            if let Ok(mut app_settings) = state.settings.lock() {
                                *app_settings = settings;
                                log::info!("Settings loaded from secure storage on startup");
                            }
                        }
                    }
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
