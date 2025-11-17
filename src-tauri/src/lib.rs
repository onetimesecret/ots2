// Modules
mod api;
mod commands;
mod error;
mod storage;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(
      tauri_plugin_log::Builder::default()
        .level(log::LevelFilter::Info)
        .build(),
    )
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![
      load_api_config,
      save_api_config,
      test_api_connection,
      create_secret,
      retrieve_secret,
      get_secret_metadata,
      clear_api_config,
    ])
    .setup(|app| {
      log::info!("Onetimesecret Desktop v{} starting", env!("CARGO_PKG_VERSION"));

      #[cfg(debug_assertions)]
      {
        let window = app.get_webview_window("main").unwrap();
        window.open_devtools();
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
