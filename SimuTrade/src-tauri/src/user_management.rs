use reqwest::Client;
use serde::{Deserialize, Serialize};
use tauri::command;
use log::{info, warn};

#[derive(Deserialize, Serialize)]
pub struct AuthPayload {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize, Serialize)]
pub struct AuthResponse {
    pub success: bool,
    pub message: String,
    pub user_id: Option<String>,
}

const BASE_URL: &str = "http://localhost:8080";

#[command]
pub async fn login(payload: AuthPayload) -> Result<AuthResponse, String> {
    let client = Client::new();
    info!("Attempting to log in user: {}", payload.email);
    let response = client.post(format!("{}/api/login", BASE_URL))
        .json(&payload)
        .send()
        .await
        .map_err(|e| {
            warn!("Failed to send login request: {}", e);
            e.to_string()
        })?;

    response.json::<AuthResponse>().await.map_err(|e| {
        warn!("Failed to parse login response: {}", e);
        e.to_string()
    })
}

#[command]
pub async fn register(payload: AuthPayload) -> Result<AuthResponse, String> {
    let client = Client::new();
    info!("Attempting to register user: {}", payload.email);
    let response = client.post(format!("{}/api/register", BASE_URL))
        .json(&payload)
        .send()
        .await
        .map_err(|e| {
            warn!("Failed to send registration request: {}", e);
            e.to_string()
        })?;

    response.json::<AuthResponse>().await.map_err(|e| {
        warn!("Failed to parse registration response: {}", e);
        e.to_string()
    })
}
