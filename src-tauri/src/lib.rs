use tauri_plugin_sql::{Migration, MigrationKind};

// Learn more about Tauri commands at https://tauri.app/develo  p/calling-rust/
#[tauri::command]
async fn exchange_github_code(code: String) -> Result<String, String> {
    let client = reqwest::Client::new();

    // These values would be loaded from app config or environment
    let client_id = std::env::var("VITE_GITHUB_CLIENT_ID")
        .map_err(|_| "Missing GitHub client ID".to_string())?;
    let client_secret = std::env::var("GITHUB_CLIENT_SECRET")
        .map_err(|_| "Missing GitHub client secret".to_string())?;

    let res = client.post("https://github.com/login/oauth/access_token")
        .header("Accept", "application/json")
        .form(&[
            ("client_id", client_id.as_str()),
            ("client_secret", client_secret.as_str()),
            ("code", code.as_str()),
        ])
        .send()
        .await
        .map_err(|e| e.to_string())?;

    // Use the json() method with proper error handling
    let json: serde_json::Value = res.json()
        .await
        .map_err(|e| format!("Failed to parse JSON: {}", e))?;

    match json.get("access_token") {
        Some(token) => Ok(token.as_str().unwrap_or("").to_string()),
        None => Err("Failed to get access token".to_string()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "Initial migration",
        kind: MigrationKind::Up,
        sql: "CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    email TEXT,
                    password TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );",
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:wtftoday.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![exchange_github_code])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
