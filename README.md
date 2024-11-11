# ♻️ Waste Management dApp

Welcome to the **Waste Management dApp** – a decentralized application designed to track and trace the lifecycle of waste, from collection to product creation, using **Hyperledger Fabric** and an intuitive client-server architecture.

This project demonstrates how blockchain can enable transparency, traceability, and efficiency across multiple organizations involved in the waste management cycle.

## 🚀 Project Overview

The **Waste Management dApp** involves **four key organizations**:

- **Waste Collection Company**: Logs collected waste data and transfers waste to the Recycling Center.
- **Recycling Center**: Sorts and categorizes reusable waste and updates its details.
- **Government**: Issues incentive vouchers based on recycling efficiency and manages voucher claims.
- **Manufacturer**: Purchases reusable waste, produces products, and logs product data for traceability.

The workflow enables transparency and incentivization across organizations, promoting sustainable waste management practices.

## 🛠️ Technology Stack

### Client
- **Framework**: Vite, ReactJS
- **Styling**: Tailwind CSS

### Server
- **Backend**: Node.js, Express.js

### Blockchain Network
- **Platform**: Hyperledger Fabric
- **Organizations**: Waste Collection Company, Recycling Center, Government, Manufacturer
- **Private Data Collection**: Used to secure sensitive interactions, such as government-issued vouchers, accessible only by designated parties.

## 🗂️ Workflow

1. **Waste Collection**: Waste Collection Company logs waste details on the network.
2. **Transfer & Sorting**: Waste is handed over to the Recycling Center, where it is sorted and waste details are updated.
3. **Incentive Issuance**: The Government issues vouchers based on reusable waste and marks vouchers as used once claimed.
4. **Manufacturing**: The Manufacturer purchases the waste, logs product details for traceability, and records the products created from specific waste materials.

The use of **Hyperledger Fabric** ensures secure data sharing between organizations, while private data collections protect sensitive details.

## ⚙️ Getting Started

Follow these steps to set up and run the Waste Management dApp:

### 1. Clone the Repository

```bash
git clone https://github.com/akhilkailas017/Waste-Management-dApp.git
cd waste-management-dapp
```

### 2. Start the Hyperledger Fabric Network

1. Navigate to the **network** folder:
   ```bash
   cd network
   ```
2. Make the `startNetwork.sh` file executable (if necessary):
   ```bash
   chmod +x startNetwork.sh
   ```
3. Start the network:
   ```bash
   ./startNetwork.sh
   ```
   This will bring up the Hyperledger Fabric network with the required organizations.

### 3. Start the Server

1. Move to the **server** folder:
   ```bash
   cd ../server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node app.js
   ```
   The server will be live at `http://localhost:5000`.

### 4. Start the Client

1. Move to the **ui** folder:
   ```bash
   cd ../ui
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the client:
   ```bash
   npm run dev
   ```
   Access the client at `http://localhost:3000`.

## 📌 Features

- **Traceability**: Track waste from collection to end-product, providing full lifecycle transparency.
- **Incentive Mechanism**: Government-issued vouchers reward recycling efforts, viewable only by relevant parties due to private data collections.
- **Security**: Data encryption and access controls via Hyperledger Fabric, with private data collections securing sensitive information.
- **Sustainability**: Enables manufacturers to responsibly source waste for production, promoting eco-friendly initiatives.

## 🎥 Project Demo

Watch this quick demo to understand how the Waste Management dApp works in action:

[![Waste Management dApp Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

Click the image to watch on YouTube, or [watch directly here](https://www.youtube.com/watch?v=YOUR_VIDEO_ID).


## 🤝 Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any improvements, bug fixes, or feature enhancements.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
