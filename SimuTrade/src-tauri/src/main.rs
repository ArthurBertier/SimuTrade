mod stock_data;
mod user_management;
mod trade_data;
mod trade_management;

use log::info;
use tauri::{generate_handler, Builder};

fn main() {
    env_logger::init();
    info!("Starting Tauri application");

    Builder::default()
        .invoke_handler(generate_handler![
            user_management::login,
            user_management::register,
            stock_data::get_stocks_list,
            stock_data::get_stock_detail,
            stock_data::get_stock_periods,
            trade_data::submit_trade,
            trade_data::get_user_trades,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
