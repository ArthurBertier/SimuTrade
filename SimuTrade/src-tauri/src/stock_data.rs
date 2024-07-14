use reqwest::Client;
use serde_json::Value;
use tauri::command;
use log::{info, warn, debug};
use serde::{Deserialize, Serialize};
use chrono::prelude::*;
use reqwest::Client as ReqwestClient;
use std::time::Duration;
use tokio::time::sleep;

#[derive(Serialize, Deserialize)]
pub struct StockDataV2 {
    symbol: String,
    period: String,
    interval: String,
    timestamps: Vec<i64>,
    opens: Vec<f64>,
    highs: Vec<f64>,
    lows: Vec<f64>,
    closes: Vec<f64>,
    volumes: Vec<u64>,
}

#[derive(Serialize, Deserialize)]
pub struct StockListingPayload {
    pub user_id: Option<String>,
    pub industry: Option<String>,
    pub sector: String,
    pub page: Option<u32>,
    pub items_per_page: Option<u32>, 
}

#[derive(Deserialize, Serialize)]
pub struct StockListingResponse {
    pub documents: Vec<StockData>,
}

#[derive(Serialize, Deserialize)]
pub struct StockData {
    pub name: String,
    pub ticker: String,
    pub price_data: Vec<PriceData>,
}

#[derive(Serialize, Deserialize)]
pub struct PriceData {
    pub date: String,
    pub price: f32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct StockDetailsResponse {
    pub ticker: String,
    pub financials: Option<Financials>,
    pub key_statistics: Option<KeyStatistics>,
    pub price_data: Option<Vec<PriceDataDetails>>,
    pub profile: Option<Profile>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Profile {
    address: Option<String>,
    city: Option<String>,
    state: Option<String>,
    country: Option<String>,
    industry: Option<String>,
    sector: Option<String>,
    #[serde(rename = "longBusinessSummary")]
    long_business_summary: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PriceDataDetails {
    period: String,
    interval: String,
    closes: Vec<f64>,
    highs: Vec<f64>,
    lows: Vec<f64>,
    opens: Vec<f64>,
    timestamps: Vec<String>,
    volumes: Vec<u64>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Financials {
    beta: Option<Metric>,
    #[serde(rename = "dayHigh")]
    day_high: Option<Metric>,
    #[serde(rename = "dayLow")]
    day_low: Option<Metric>,
    #[serde(rename = "dividendRate")]
    dividend_rate: Option<Metric>,
    #[serde(rename = "dividendYield")]
    dividend_yield: Option<Metric>,
    #[serde(rename = "forwardPE")]
    forward_pe: Option<Metric>,
    #[serde(rename = "marketCap")]
    market_cap: Option<MarketCap>,
    open: Option<Metric>,
    #[serde(rename = "previousClose")]
    previous_close: Option<Metric>,
    #[serde(rename = "trailingPE")]
    trailing_pe: Option<Metric>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Metric {
    fmt: Option<String>,
    raw: Option<f64>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MarketCap {
    fmt: Option<String>,
    raw: Option<f64>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct KeyStatistics {
    #[serde(rename = "enterpriseValue")]
    enterprise_value: Option<EnterpriseValue>,
    #[serde(rename = "forwardEPS")]
    forward_eps: Option<Metric>,
    #[serde(rename = "pegRatio")]
    peg_ratio: Option<Metric>,
    #[serde(rename = "profitMargins")]
    profit_margins: Option<Metric>,
    #[serde(rename = "sharesOutstanding")]
    shares_outstanding: Option<SharesOutstanding>,
    #[serde(rename = "trailingEPS")]
    trailing_eps: Option<Metric>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct EnterpriseValue {
    fmt: Option<String>,
    raw: Option<f64>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SharesOutstanding {
    fmt: Option<String>,
    raw: Option<i64>,
}

const BASE_URL: &str = "http://localhost:8080/api";

#[tauri::command]
pub async fn get_stocks_list(payload: StockListingPayload) -> Result<StockListingResponse, String> {
    let client = Client::new();
    info!("Attempting to get stock industry: {}", payload.sector);
    let response = client.post(format!("{}/stock-list", BASE_URL))
        .json(&payload)
        .send()
        .await
        .map_err(|e| {
            warn!("Failed to send stock list request: {}", e);
            e.to_string()
        })?;

    response.json::<StockListingResponse>().await.map_err(|e| {
        warn!("Failed to parse stock list response: {}", e);
        e.to_string()
    })
}

#[tauri::command]
pub async fn get_stock_detail(ticker: String) -> Result<StockDetailsResponse, String> {
    let client = Client::new();

    info!("Attempting to get stock details: {}", ticker);
    let response = client
        .post(format!("{}/stock-details/{}", BASE_URL, ticker))
        .send()
        .await
        .map_err(|e| {
            warn!("Failed to send stock details request: {}", e);
            e.to_string()
        })?;

    response.json::<StockDetailsResponse>().await.map_err(|e| {
        warn!("Failed to parse stock details response: {}", e);
        e.to_string()
    })
}

async fn fetch_stock_data(client: ReqwestClient, symbol: &str, period: &str, interval: &str) -> Result<StockDataV2, reqwest::Error> {
    let url = format!(
        "https://query1.finance.yahoo.com/v8/finance/chart/{}?range={}&interval={}",
        symbol, period, interval
    );
    info!("Fetching data from URL: {}", url);

    loop {
        let response = client.get(&url).send().await?;
        debug!("Received response: {:?}", response);

        if response.status() == 429 {
            warn!("Received status 429: Too Many Requests. Retrying after delay.");
            sleep(Duration::from_secs(60)).await;
            continue;
        }

        let json: Value = response.json().await?;
        debug!("Parsed JSON: {:?}", json);

        let result = &json["chart"]["result"][0];
        let timestamps: Vec<i64> = result["timestamp"].as_array().unwrap_or(&vec![])
            .iter().filter_map(|x| x.as_i64()).collect();
        let indicators = &result["indicators"]["quote"][0];

        let opens: Vec<f64> = indicators["open"].as_array().unwrap_or(&vec![])
            .iter().filter_map(|x| x.as_f64()).collect();
        let highs: Vec<f64> = indicators["high"].as_array().unwrap_or(&vec![])
            .iter().filter_map(|x| x.as_f64()).collect();
        let lows: Vec<f64> = indicators["low"].as_array().unwrap_or(&vec![])
            .iter().filter_map(|x| x.as_f64()).collect();
        let closes: Vec<f64> = indicators["close"].as_array().unwrap_or(&vec![])
            .iter().filter_map(|x| x.as_f64()).collect();
        let volumes: Vec<u64> = indicators["volume"].as_array().unwrap_or(&vec![])
            .iter().filter_map(|x| x.as_u64()).collect();

        info!("Fetched data for {} with period {} and interval {}", symbol, period, interval);
        return Ok(StockDataV2 {
            symbol: symbol.to_string(),
            period: period.to_string(),
            interval: interval.to_string(),
            timestamps,
            opens,
            highs,
            lows,
            closes,
            volumes,
        });
    }
}

#[tauri::command]
pub async fn get_stock_periods(ticker: String, period: String, interval: String) -> Result<StockDetailsResponse, String> {
    let reqwest_client = ReqwestClient::builder()
        .user_agent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
        .build()
        .map_err(|e| e.to_string())?;
        
    info!("Attempting to get stock periods: {} - Period: {} - Interval: {}", ticker, period, interval);
    
    match fetch_stock_data(reqwest_client, &ticker, &period, &interval).await {
        Ok(stock_data) => {
            let price_data_details = PriceDataDetails {
                period: stock_data.period,
                interval: stock_data.interval,
                closes: stock_data.closes,
                highs: stock_data.highs,
                lows: stock_data.lows,
                opens: stock_data.opens,
                timestamps: stock_data.timestamps.iter().map(|ts| {
                    let dt = chrono::NaiveDateTime::from_timestamp_opt(*ts, 0).unwrap();
                    dt.format("%Y-%m-%dT%H:%M:%SZ").to_string()
                }).collect(),
                volumes: stock_data.volumes,
            };

            let stock_details = StockDetailsResponse {
                ticker: stock_data.symbol,
                financials: None, // Populate as needed
                price_data: Some(vec![price_data_details]),
                profile: None, // Populate as needed
                key_statistics: None, // Populate as needed 
            };

            Ok(stock_details)
        },
        Err(e) => {
            warn!("Failed to fetch stock data: {}", e);
            Err(e.to_string())
        }
    }
}
