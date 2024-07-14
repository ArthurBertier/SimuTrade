use futures::future::err;
use log::{info, warn, error};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use tauri::command;


#[derive(Serialize, Deserialize)]
pub struct TradeData {
    ticker: String,
    position: String,
    amount: f64,
    price: f64,
    take_profit: Option<f64>,
    stop_loss: Option<f64>,
    trade_type: String,
    quantity: u32,
    money: f64,
    user_id: String,
    user_balance: f64,
}
const BASE_URL: &str = "http://localhost:8080/api";


#[command]
pub async fn submit_trade(trade_data: TradeData) -> Result<(), String> {
    // Send trade data to the central server
    let client = reqwest::Client::new();
    match client.post(format!("{}/trade_submit", BASE_URL))
        .json(&trade_data)
        .send()
        .await {
            Ok(response) => {
                if response.status().is_success() {
                    Ok(())
                } else {
                    Err("Failed to submit trade".into())
                }
            },
            Err(err) => Err(format!("Request error: {}", err))
        }
}


#[derive(Serialize, Deserialize, Debug)]
pub struct Trade {
    id: String,
    ticker: String,
    position: String,
    quantity: u32,
    price: f64,
    take_profit: Option<f64>,
    stop_loss: Option<f64>,
    status: String,
    user_id: String,
    amount: f64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UserTradesResponse {
    trades: Vec<Trade>,
}

#[tauri::command]
pub async fn get_user_trades(user_id: String) -> Result<UserTradesResponse, String> {
    let client = Client::new();
    let url = format!("{}/user_trades?user_id={}", BASE_URL, user_id);

    match client.get(&url).send().await {
        Ok(response) => {
            if response.status().is_success() {
                match response.json::<UserTradesResponse>().await {
                    Ok(data) => {
                        info!("Successfully fetched user trades");
                        Ok(data)
                    },
                    Err(err) => {
                        error!("Failed to parse user trades response: {}", err);
                        Err("Failed to parse user trades response".into())
                    }
                }
            } else {
                warn!("Failed to fetch user trades, status: {}", response.status());
                Err("Failed to fetch user trades".into())
            }
        },
        Err(err) => {
            error!("Error sending request to fetch user trades: {}", err);
            Err("Error sending request to fetch user trades".into())
        }
    }
}


