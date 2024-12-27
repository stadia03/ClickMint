# ClickMint

ClickMint is a decentralized platform designed to connect users and workers in an innovative way. Users can post tasks consisting of clickable options (like images or thumbnails) and pay using Solana. Workers participate by selecting the most clickable option, earning micropayments for each task. The system ensures transparency and fairness through blockchain integration. Workers can withdraw their accumulated earnings directly to their wallets after reaching a withdrawal threshold.

---

## Features

- **Create Tasks**: Users can post tasks by uploading clickable options for analysis.
- **Worker Participation**: Workers earn micropayments by voting on the most clickable option in tasks.
- **Blockchain-Powered Payments**: Payments are processed securely using Solana.
- **Earnings Withdrawal**: Workers can withdraw their earnings to their wallets after reaching a specified amount.
- **Task Management**: Tracks total submissions and votes, updating task status automatically.
- **Secure Authentication**: JWT-based authentication for both users and workers.

---

## Tech Stack

### Frontend

- **ReactJS**: Responsive and interactive user interface.
- **Vite**: Fast and efficient build tool.
- **TailwindCSS**: Consistent and utility-first styling.

### Backend

- **Node.js with Express**: Handles API requests and backend logic.
- **MongoDB**: Database for users, tasks, submissions, and more.

### Blockchain Integration

- **Solana Wallet Adapter**: Wallet interaction for seamless blockchain transactions.
- **Web3.js**: For blockchain operations and Solana transaction handling.

### Storage & CDN

- **AWS S3 Bucket**: Secure storage for files.
- **AWS CloudFront**: Content delivery network for optimized performance.

---

## Setup and Installation

### Clone the Repository

```bash
 git clone https://github.com/yourusername/clickmint.git
 cd clickmint
```

### Install Dependencies

```bash
cd server
npm install

cd ../client_user
npm install

cd ../client_worker
npm install
```

### Configure Environment Variables

Create `.env` files in the appropriate directories and fill in the required values as described below.

#### Backend (`server/.env`):

```env
mongo_URL= ''                # MongoDB connection string
PORT = ''                   # Port number for the backend server
JWT_SECRET_USER=''          # JWT secret for user authentication
JWT_SECRET_WORKER=''        # JWT secret for worker authentication

RPC_URL = ''                # Solana RPC URL for blockchain transactions
ADMIN_WALLET_PUBLICKEY = '' # Public key of the admin Solana wallet
ADMIN_WALLET_PRIVATEKEY = ''# Private key of the admin Solana wallet
CHARGE_PER_CLICK = ''       # Charge per click in Lamports

# AWS Credentials
AWS_ACCESS_KEY_ID = ''      # Your AWS access key
AWS_SECRET_ACCESS_KEY = ''  # Your AWS secret access key
BUCKET_NAME=''              # AWS S3 bucket name
AWS_REGION= ''              # AWS region
```

#### Frontend (`client_worker/.env`):

```env
VITE_BACKEND_URL = ''       # Backend server URL (e.g., https://serverclickmint.vercel.app)
VITE_VERSION = ''           # Frontend version
```

#### Frontend (`client_user/.env`):

```env
VITE_BACKEND_URL = ''       # Backend server URL (e.g., https://serverclickmint.vercel.app)
VITE_CLOUDFRONT_URL = ''    # AWS CloudFront URL (e.g., https://d5gdh9ena2c57.cloudfront.net)
VITE_CHARGE_PER_CLICK = ''  # Charge per click in Lamports
VITE_ADMIN_WALLET_PUBLICKEY = '' # Admin wallet public key
VITE_RPC_URL = ''           # Solana RPC URL for blockchain transactions
VITE_VERSION = ''           # Frontend version
```

### Run the Application

1. Start the backend server:

   ```bash
   cd server
   npm start
   ```

2. Start the user frontend:

   ```bash
   cd client_user
   npm run dev
   ```

3. Start the worker frontend:

   ```bash
   cd client_worker
   npm run dev
   ```

### Access the Application

- **Backend**: Hosted on `http://localhost:<PORT>`
- **Frontend (User/Worker)**: URLs provided by Vite during development.

---

## Folder Structure

```plaintext
ClickMint/
├── client_user/        # User frontend (ReactJS)
├── client_worker/      # Worker frontend (ReactJS)
├── server/             # Backend (Node.js + Express)
├── README.md           # Project documentation
└── .gitignore          # Git ignore rules
```

---

## Screenshots

(Add screenshots in the spaces below):

1. **Task Upload Page**

*(Insert image here)*

2. **Task Voting Page**

*(Insert image here)*

3. **User Voting Interface**

*(Insert image here)*

4. **User Withdrawal Page**

*(Insert image here)*

5. **Login Page**

*(Insert image here)*

---

## Contribution Guidelines

We welcome contributions to ClickMint! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature/bug fix.
3. Commit your changes and push them to your fork.
4. Create a pull request to the `main` branch of this repository.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact

For any queries or support, please reach out to me at \
gaurab.working\@gmail.com 

