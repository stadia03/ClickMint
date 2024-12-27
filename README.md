# ClickMint

ClickMint is an innovative decentralized platform where users can post options, pay using Solana, and engage workers to identify the most clickable option. The platform facilitates micropayments to workers for their selections, which can be withdrawn after reaching a significant amount.

## Features

- **Post Clickable Options**: Users can create tasks by posting clickable options (e.g., images, thumbnails) for analysis.
- **Worker Engagement**: Workers, especially from developing nations, can earn micropayments by selecting the most clickable option.
- **Solana Integration**: Payments are handled via the Solana blockchain, ensuring transparency and efficiency.
- **Decentralized Payments**: Workers can withdraw their earnings directly to their wallets after reaching a certain threshold.
- **Task and Submission Management**: Tasks are linked to submissions that record the votes for each option.
- **Secure Authentication**: Secure user authentication implemented using JWT.

## Tech Stack

### Frontend
- **ReactJS**: For building a responsive and interactive user interface.
- **Vite**: As the build tool for a fast development environment.
- **TailwindCSS**: For utility-first CSS and consistent styling.

### Backend
- **Node.js with Express**: For handling API requests and business logic.
- **MongoDB**: As the database for storing users, tasks, submissions, and other data.

### Blockchain Integration
- **Solana Wallet Adapter**: For wallet interactions.
- **Web3.js**: For blockchain operations and transaction handling.

### Storage & CDN
- **AWS S3 Bucket**: For secure file storage.
- **AWS CloudFront**: As the content delivery network for faster access to stored files.

## Setup and Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/clickmint.git
   cd clickmint
   ```

2. **Install Dependencies**
   For the frontend and backend:
   ```bash
   cd client
   npm install

   cd ../server
   npm install
   ```

3. **Environment Variables**
   Create `.env` files in the respective directories with the following details:

   **Backend (`server/.env`):**
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SOLANA_NETWORK=your_solana_network
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_S3_BUCKET=your_bucket_name
   ```

   **Frontend (`client/.env`):**
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_SOLANA_NETWORK=your_solana_network
   ```

4. **Run the Application**
   - Start the backend server:
     ```bash
     cd server
     npm start
     ```
   - Start the frontend development server:
     ```bash
     cd client
     npm run dev
     ```

5. **Access the Application**
   Open your browser and navigate to `http://localhost:3000` to access the frontend.

## Folder Structure
```
ClickMint/
├── client/             # Frontend (ReactJS)
├── server/             # Backend (Node.js + Express)
├── shared/             # Shared utilities or constants
├── README.md           # Project documentation
└── .gitignore          # Git ignore rules
```

## Contribution Guidelines
We welcome contributions to ClickMint! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature/bug fix.
3. Commit your changes and push them to your fork.
4. Create a pull request to the `main` branch of this repository.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For any queries or support, please reach out to the ClickMint team at [support@clickmint.com](mailto:support@clickmint.com).
