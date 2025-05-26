use tauri_plugin_sql::{Migration, MigrationKind};
use tauri::{AppHandle, Manager};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
async fn exchange_github_code(code: String) -> Result<String, String> {
    println!("=== GitHub OAuth Debug Info ===");
    println!("Code received: {}", code);

    // Debug environment variables
    println!("\nEnvironment Variables:");
    println!(
        "VITE_GITHUB_CLIENT_ID: {}",
        std::env::var("VITE_GITHUB_CLIENT_ID").unwrap_or_else(|_| "Not found".to_string())
    );
    println!(
        "VITE_GITHUB_REDIRECT_URI: {}",
        std::env::var("VITE_GITHUB_REDIRECT_URI").unwrap_or_else(|_| "Not found".to_string())
    );
    println!(
        "GITHUB_CLIENT_SECRET: {}",
        if std::env::var("GITHUB_CLIENT_SECRET").is_ok() {
            "Found"
        } else {
            "Not found"
        }
    );

    let client = reqwest::Client::new();

    // These values would be loaded from app config or environment
    let client_id = match std::env::var("VITE_GITHUB_CLIENT_ID") {
        Ok(id) => {
            println!("Client ID found: {}", id);
            id
        }
        Err(_) => {
            let err = "Missing GitHub client ID".to_string();
            println!("Error: {}", err);
            return Err(err);
        }
    };

    let client_secret = match std::env::var("GITHUB_CLIENT_SECRET") {
        Ok(secret) => {
            println!("Client secret found (not displaying for security)");
            secret
        }
        Err(_) => {
            let err = "Missing GitHub client secret".to_string();
            println!("Error: {}", err);
            return Err(err);
        }
    };

    println!("\nSending request to GitHub OAuth token endpoint");
    println!("URL: https://github.com/login/oauth/access_token");
    println!("Headers: Accept: application/json");
    println!("Form data: client_id, client_secret, code");

    let res = client
        .post("https://github.com/login/oauth/access_token")
        .header("Accept", "application/json")
        .form(&[
            ("client_id", client_id.as_str()),
            ("client_secret", client_secret.as_str()),
            ("code", code.as_str()),
        ])
        .send()
        .await
        .map_err(|e| {
            let err = format!("Request error: {}", e);
            println!("Error: {}", err);
            err
        })?;

    println!("\nResponse status: {}", res.status());

    // Get the response text first for debugging
    let response_text = res.text().await.map_err(|e| {
        let err = format!("Failed to get response text: {}", e);
        println!("Error: {}", err);
        err
    })?;

    println!("\nRaw response: {}", response_text);

    // Parse the JSON response
    let json: serde_json::Value = serde_json::from_str(&response_text).map_err(|e| {
        let err = format!("Failed to parse JSON: {}", e);
        println!("Error: {}", err);
        err
    })?;

    println!("\nResponse JSON: {}", json);

    // Check for error response first
    if let Some(error) = json.get("error") {
        let error_description = json
            .get("error_description")
            .and_then(|v| v.as_str())
            .unwrap_or("Unknown error");
        let err = format!("GitHub OAuth error: {} - {}", error, error_description);
        println!("Error: {}", err);
        return Err(err);
    }

    // Try to get the access token
    match json.get("access_token") {
        Some(token) => {
            if let Some(token_str) = token.as_str() {
                if token_str.is_empty() {
                    let err = "Received empty access token".to_string();
                    println!("Error: {}", err);
                    return Err(err);
                }
                println!("\nSuccessfully retrieved access token");
                Ok(token_str.to_string())
            } else {
                let err = "Access token is not a string".to_string();
                println!("Error: {}", err);
                Err(err)
            }
        }
        None => {
            let err = "No access token in response".to_string();
            println!("Error: {}", err);
            Err(err)
        }
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

    let mut builder = tauri::Builder::default();
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, args, cwd| {
            let _ = app.get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }));
    }
        builder
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
