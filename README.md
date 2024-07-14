# SimuTrade

## Overview

Welcome to SimuTrade! This application is a cross-platform desktop tool developed with Tauri, a framework designed to build applications that are smaller, faster, and more secure than those built with traditional methods like Electron.

### Features

- **Cross-platform Compatibility**: Runs seamlessly on Windows, macOS, and Linux.
- **Lightweight**: Thanks to Tauri, SimuTrade is not only efficient but also compact, ensuring high performance without the bloat.
- **Enhanced Security**: Utilizes direct system APIs for improved security features.

## Getting Started

### Prerequisites

Before installing SimuTrade, ensure that you have the following software installed on your system:
- Node.js
- Rust

### Installation

To get started with SimuTrade, clone the repository and set up the environment:

```bash
git clone https://github.com/ArthurBertier/SimuTrade.git
cd SimuTrade
cd tauri-app
Setup Dependencies
bash
Copy code
# Install with pnpm
pnpm install
Development
To run SimuTrade in development mode:

bash
Copy code
pnpm run tauri dev
This command fires up the Tauri development server and opens the application window. Any modifications to the codebase will trigger an automatic hot reload.

Additional Setup
To ensure full functionality, make sure to have a backend server running alongside the application.

Production Build
To compile a production-ready build of SimuTrade:

bash
Copy code
pnpm run tauri build
This command generates the files needed for distribution on your operating system.

Project Structure
src: Contains the source code of the Tauri application.
dist: Stores the distribution files created during the build process.
tauri.conf.js: Tauri configuration file.
Contributing
We welcome contributions to SimuTrade! Please refer to CONTRIBUTING.md for guidelines on how to contribute effectively.

License
SimuTrade is released under the MIT License.

Acknowledgments
Tauri Team: For the innovative framework that boosts our application's performance and security.
Open Source Community: For ongoing support and contributions.
Thank you for choosing SimuTrade! Should you have any queries or encounter any issues, feel free to open an issue on our GitHub repository.

sql
Copy code

This version only uses `pnpm` for package management and makes sure all the commands and references are consistent with your current setup.





