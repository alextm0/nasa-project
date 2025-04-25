# 🚀 NASA Mission Control Project

A full-stack mission-control dashboard for NASA data. Built with a React frontend and a Node.js/Express backend, this project uses MongoDB for data persistence and integrates external APIs like SpaceX for live launch data.

---

## 📋 Table of Contents

- [🚀 NASA Mission Control Project](#-nasa-mission-control-project)
  - [📋 Table of Contents](#-table-of-contents)
  - [⚙️ Features](#️-features)
  - [🧰 Tech Stack](#-tech-stack)
  - [🔧 Prerequisites](#-prerequisites)
  - [⚙️ Setup \& Scripts](#️-setup--scripts)
  - [🔑 Environment Variables](#-environment-variables)
  - [📁 Folder Structure](#-folder-structure)
  - [🌐 External API Integration](#-external-api-integration)
  - [📊 Data Ingestion](#-data-ingestion)
  - [🚀 Development \& Usage](#-development--usage)
  - [🏗️ Build \& Deployment](#️-build--deployment)
  - [🎓 Learning Outcomes](#-learning-outcomes)
  - [🤝 Contributing](#-contributing)
  - [📜 License](#-license)

---

## ⚙️ Features

- **Launch management**: Create, list, and abort missions with persistent storage  
- **Planet catalog**: Import habitable planet data from CSV into MongoDB  
- **Live launch data**: Fetch and store SpaceX launch details via REST API  
- **Middleware & logging**: Structured error handling and HTTP request logging with Morgan  
- **Environment-driven configuration**: Flexible setup via `.env`  

---

## 🧰 Tech Stack

- **Frontend**: React 17, React Router, React Scripts  
- **Backend**: Node.js, Express 5, Axios  
- **Database**: MongoDB & Mongoose  
- **Dev & CI**: GitHub Actions, concurrently, cross-env  
- **Testing**: Jest & Supertest  

---

## 🔧 Prerequisites

- Node.js v16 or newer  
- npm v8 or newer  
- MongoDB server (local or Atlas cluster)  

---

## ⚙️ Setup & Scripts

Clone the repository and install all dependencies:

```bash
git clone https://github.com/alextm0/nasa-project.git
cd nasa-project
npm run bootstrap
```

Available scripts (defined in root `package.json`):

- `npm run install-client` → install frontend deps  
- `npm run install-server` → install backend deps  
- `npm run bootstrap` → both install steps  
- `npm run client` → start React app  
- `npm run server` → run backend in dev mode (`nodemon`)  
- `npm run dev` → run both client and server concurrently  
- `npm run deploy` → build frontend and serve via backend  
- `npm run test` → run tests in both client and server  

---

## 🔑 Environment Variables

Create a `.env` file inside the `server/` folder:

```ini
PORT=5000
MONGO_URL=<your_mongodb_connection_string>
SPACEX_API_URL=https://api.spacexdata.com/v4/launches/query
```

- **PORT**: server listening port  
- **MONGO_URL**: MongoDB connection URI  
- **SPACEX_API_URL**: endpoint for querying SpaceX launches  

---

## 📁 Folder Structure

```
nasa-project/
├── client/                    # React frontend
│   ├── public/
│   └── src/
│       └── ...                # components, styles, utils
├── server/                    # Express backend
│   ├── src/
│   │   ├── data/              # CSV files (kepler_data.csv)
│   │   ├── models/            # Mongoose schemas & connectors
│   │   ├── routes/            # API routes (launches, planets)
│   │   ├── services/          # DB connection & external API clients
│   │   ├── app.js             # Express app configuration
│   │   └── server.js          # HTTP server bootstrap
│   ├── .env                   # environment variables
│   └── package.json
├── .github/                   # CI workflows
│   └── workflows/
│       └── node.yml
├── package.json               # root scripts & dependencies
└── README.md
```

---

## 🌐 External API Integration

- **SpaceX Launches**  
  The backend uses Axios to POST a query to the SpaceX API (configured via `SPACEX_API_URL`) and stores results in MongoDB.  
  Example snippet from `services/query.js`:
  ```js
  import axios from 'axios';
  const response = await axios.post(process.env.SPACEX_API_URL, { query: {}, options: {} });
  const launches = response.data.docs;
  ```
- All external endpoints are driven by environment variables for flexibility.

---

## 📊 Data Ingestion

- **Kepler Planet Data**  
  On server startup, `services/mongo.js` reads `kepler_data.csv` and upserts all confirmed habitable planets into the `planets` collection.

- **Launch Records**  
  The `launches` route exposes CRUD operations backed by the `launches` collection in MongoDB.

---

## 🚀 Development & Usage

Run both frontend and backend with hot reload:

```bash
npm run dev
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000/v1  

---

## 🏗️ Build & Deployment

Build the React app and start the backend:

```bash
npm run deploy
```

- Client is built into `server/public` thanks to `cross-env BUILD_PATH`  
- Backend serves both API routes and static assets in production

---

## 🎓 Learning Outcomes

This project deepened my skills in:

- Designing a **RESTful API** with Express and Mongoose  
- Consuming and integrating a **public API** (SpaceX) in a production workflow  
- Managing **monorepo-style** scripts and build pipelines  
- Automating **CI/CD** with GitHub Actions matrix builds  
- Implementing **data ingestion** from both CSV and external sources  
- Structuring code for **scalability**, readability, and testability

---

## 🤝 Contributing

Contributions are welcome! Open an issue or submit a pull request. Please follow the existing code style and add tests for new features.

---

## 📜 License

ISC © 2025. See [LICENSE](LICENSE) for details.
