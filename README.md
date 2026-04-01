# GPU List
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Node](https://img.shields.io/badge/node-18+-green)
![NPM](https://img.shields.io/badge/npm-%3E=10.8.2-blue)
![React](https://img.shields.io/badge/react-18-blue)
![Docker](https://img.shields.io/badge/docker-supported-blue)
![License](https://img.shields.io/badge/license-%20%20GNU%20GPLv3%20-green?style=plastic)
[![Render Status](https://img.shields.io/badge/Live-Demo-brightgreen)](https://gpulist.onrender.com)
[![Render Status](https://img.shields.io/badge/Alternative-UI-blue)](https://gpulist.onrender.com/alt)

Full-stack React + Express + MongoDB application for managing GPU specifications and calculating theoretical graphics performance.

## Table of contents
  - [License](#license)
  - [About](#about)
  - [Tech Stack](#tech-stack)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
  - [Database](#database)
  - [Environment variables](#environment-variables)
  - [Starting the web app](#starting-the-web-app)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Navigating the UI](#navigating-the-ui)
    - [Main UI](#main-ui)
    - [Alternative UI](#alternative-ui)
  - [Performing CRUD operations via Backend](#performing-crud-operations-via-backend)
  - [Running with Docker](#running-with-docker)
  - [End-to-End (E2E) testing](#end-to-end-e2e-testing)
    - [Manual testing](#manual-testing)
    - [Testing via Docker](#testing-via-docker)
  - [Integration tests (Backend)](#integration-tests-backend)
  - [Backend server structure](#backend-server-structure)
  - [Troubleshooting](#troubleshooting)
  - [Author](#author)


## License
This project is licensed under the GNU GPLv3 License.
See the LICENSE file for details.


## About
GPU List is a full-stack Single Page Application for storing graphics card specifications and calculating their theoretical performance.

This project was built as a portfolio project to practice and demonstrate modern web development concepts, including:

- Full-stack architecture (React + Express + MongoDB)
- REST API design
- Database modeling with Mongoose
- Frontend state management and data fetching
- End-to-end and integration testing
- Containerization with Docker
- Production deployment

Built with:
- Database: MongoDB + Mongoose
- Backend: Express
- Frontend: React + Axios
- The entire project was written with TypeScript

App available on Render: https://gpulist.onrender.com and https://gpulist.onrender.com/alt


## Tech Stack
Frontend
- React
- Axios
- Vite

Backend
- Node.js
- Express
- TypeScript

Database
- MongoDB Atlas
- Mongoose

Testing
- Cypress (E2E)
- node:test + supertest (integration)

DevOps
- Docker
- Docker Compose


## Features
The application allows users to add, delete, search, and list GPUs through a simple frontend UI.

The Web UI automatically displays performance metrics such as:
- FP32 throughput
- Texture Rate
- Pixel Rate
- Memory Bandwidth

### Screenshots
Main UI

<img src="../github/screenshots/gpulist_main-ui.png" alt="GPU List app main UI" width="420"/>
<img src="../github/screenshots/gpulist_main-ui_table-view.png" alt="GPU List app main UI data table" width="400"/>

Alternative UI

<img src="../github/screenshots/gpulist_alt-ui.png" alt="GPU List app alternative UI" width="500"/>
<img src="../github/screenshots/gpulist_alt-ui_card-view.png" alt="GPU List app alternative UI card info" width="500"/>


## Prerequisites
- [Node.js](https://nodejs.org)↗ v18.20.5 or higher
- [npm](https://www.npmjs.com)↗ v10.8.2 or higher
- Internet connection to access the remote MongoDB database
- Optional: [Docker](https://www.docker.com)↗ v28.2.1


## Quick Start
```bash
$ git clone https://github.com/rafaeltorok/WebApps.git
$ cd gpulist/server && npm install && npm run start
```

- Access the Web UI on http://localhost:3001


## Database
- The backend server utilizes a remote MongoDB database stored on Atlas.

- Example GPU object:
  ```js
  {
    "manufacturer": string,
    "gpuline": string,      // Optional field
    "model": string,
    "cores": number,
    "tmus": number,
    "rops": number,
    "vram": number,         // in GB
    "bus": number,
    "memtype": string,
    "baseclock": number,    // in MHz
    "boostclock": number,   // in MHz
    "memclock": number,     // in Gbps
    "_id": ObjectId            // The MongoDB object id
  },
  ```

  - All fields except for `gpuline` are mandatory.

  - The model field should contain only the GPU series and model name. Examples: 
    - RTX 3060
    - RTX 3060 Gaming X Trio
    - RX 7800 XT


## Environment variables
- The `.env` file should have the following **three** fields (examples)
  ```conf
  MONGODB_URI=mongodb+srv://myDatabaseUser:myPassword@cluster0.example.mongodb.net/?retryWrites=true&w=majority
  TEST_MONGODB_URI=mongodb+srv://myTestDatabaseUser:myPassword@cluster0.example.mongodb.net/?retryWrites=true&w=majority
  PORT=3001
  ```

- The `.env` file is **not included** on the repository for security purposes (it contains username and password data).

- The frontend uses a **dev proxy** on `vite.config.ts` currently configured to fetch data from port **3001** on the backend server.

- The backend server will always use the main database as default. For the test one, you must pass the correct flag when starting the server: `NODE_ENV=test`, or add this variable to the `.env` file.


## Starting the web app
### Frontend
Main UI
  ```bash
  cd ./gpulist/client && npm install && npm run dev
  ```

Alternative UI (Optional)
  ```bash
  cd ./gpulist/alternate-client && npm install && npm run dev
  ```

Vite auto-selects ports: 
  - Main UI → http://localhost:5173
  - Alternative UI → http://localhost:5174/alt/

### Backend
#### Development mode (watch mode with tsx)
```bash
cd ./gpulist/server && npm install && npm run dev
```

#### Production mode
  - Build frontend
    ```bash
    cd ./gpulist/client && npm run build && cp -r ./dist/* ../server/dist/man-client
    ```

  - Or Alternative UI
    ```bash
    cd ./gpulist/alternate-client && npm run build && cp -r ./dist/* ../server/dist/alt-client
    ```

  - Compile the backend server into JavaScript code
    ```bash
    cd ./gpulist/server && npm install && npm run tsc
    ```

  - Start the backend server
    ```bash
    npm run start
    ```

  - Access the frontend via the backend URL → http://localhost:3001 or http://localhost:3001/alt/


## Navigating the UI
### Main UI
#### Displaying a graphics card data
Click the `Show` button for a single card or `Show all data` for all cards.

#### Adding a new graphics card
Click the `Add Graphics Card` button → Fill all the required fields, none can be left empty.

#### Using the search button
Click the `Search` button, search by manufacturer, GPU line or model (e.g., `rtx 40`).

#### Using the index
- Click the `Show index` button → a scrollable card list will be displayed.
- Clicking on a card → the page will scroll to the data table and expand it.
- Click on `Back to Index` button → The table collapses and returns you to the index.

#### Removing a graphics card
Expand the card table → on the bottom, click on the `Delete` → when prompted, click on confirm.

### Alternative UI
- Displaying a graphics card data → click the `View details` button.
- Adding a new graphics card → click on the `Add GPU` button, follow the same steps as the Main UI.
- Using the search button → on the `Search GPUs` bar, type the desired keywords.
- Removing a graphics card → same steps as the Main UI.


## Performing CRUD operations via Backend
Create
  ```
  POST http://localhost:3001/api/gpus
  ```


Body example
  ```json
  {
    "manufacturer": "NVIDIA",
    "gpuline": "GeForce",
    "model": "RTX 5090",
    "cores": 21760,
    "tmus": 680,
    "rops": 176,
    "vram": 32,
    "bus": 512,
    "memtype": "GDDR7",
    "baseclock": 2017,
    "boostclock": 2407,
    "memclock": 28
  }
  ```

Read
  - Fetch all
    ```
    GET http://localhost:3001/api/gpus
    ```

  - Fetch one
    ```
    GET http://localhost:3001/api/gpus/:id
    ```

Update
  - You can update any number of fields
    ```
    PUT http://localhost:3001/api/gpus/:id
    ```

Delete
  ```
  DELETE http://localhost:3001/api/gpus/:id
  ```

## Running with Docker
### Docker Compose (recommended)
  ```bash
  cd ./gpulist && docker compose up -d
  ```

App access
- API → http://localhost:3001/api/gpus
- Main UI → http://localhost:5173
- Alternative UI → http://localhost:5174/alt/

### Manual Docker setup (advanced)
1. Create a custom network
    ```bash
    docker network create gpulist_webapp-network
    ```

2. Build the images
    - Main UI
      ```bash
      docker build -t gpulist-webapp-client ./client
      ```

    - Alternative UI
      ```bash
      docker build -t gpulist-webapp-alt-client ./alternative-client
      ```

    - Backend
      ```bash
      docker build -t gpulist-webapp-server ./server
      ```

3. Run the containers
    - Main UI
      ```bash
      docker run -d --name gpulist-webapp-client --network gpulist_webapp-network -p 5173:80 gpulist-webapp-client
      ```
      
    - Alternative UI
      ```bash
      docker run -d --name gpulist-webapp-alt-client --network gpulist_webapp-network -p 5174:80 gpulist-webapp-alt-client
      ```

    - Backend Server
      ```bash
      cd ./server && docker run -d --env-file .env --name gpulist-webapp-server --network gpulist_webapp-network -p 3001:3001 -ti gpulist-webapp-server
      ```

4. Access the app
    - API → http://localhost:3001/api/gpus
    - Main UI → http://localhost:5173
    - Alternative UI → http://localhost:5174/alt/

### Backend server (Serving both clients production builds)
1. Build the backend server image only
    ```bash
    cd ./server && docker build -f ./Dockerfile.prod -t gpulist-app .
    ```

2. Run the server image
    ```bash
    cd ./server && docker run --name gpulist -p 3001:3001 --env-file ./.env gpulist-app
    ```

3. Access the app
    - API → http://localhost:3001/api/gpus
    - Main UI → http://localhost:3001
    - Alternative UI → http://localhost:3001/alt/



## End-to-End (E2E) Testing
### Manual testing
Enter the `tests` folder and install the dependencies
  ```bash
  cd ./tests && npm install
  ```

Start the Main UI
  ```bash
  cd ./client && npm run dev
  ```

Start the Backend Server in testing mode 
- This uses a test database from MongoDB to prevent data loss from the main one.

- Compile the TypeScript code to JavaScript
  ```bash
  cd ./gpulist/server && npm install && npm run tsc
  ```

- Running the compiled JavaScript code
  ```bash
  npm run start:test
  ```

- Running the TypeScript code with tsx (uses the `watch` flag for hot reloading)
  ```bash
  npm run dev:test
  ```

Run Cypress
  - UI mode
    ```bash
    npm run cypress:open
    ```

  - CLI mode
    ```bash
    npm run cypress:cli
    ``` 
  
### Testing via Docker
  ```bash
  docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
  ```

Note: ⚠️ E2E tests were designed for the Main UI only


## Integration tests (Backend server)
Running the tests (uses the test database instead of the main one)
```bash
cd ./gpulist/server && npm install && npm run test
```


## Backend server structure
### Folder overview
  ```
  gpuList/server/
  ├── index.ts             # Entry point of the application
  ├── app.ts               # Main Express app setup
  ├── types.ts             # File containing the TypeScript types and interfaces
  ├── dist/                # Production-ready builds for the backend to serve
  │   ├── main-client      # The main client production build
  │       └── ...
  │   └── alt-client       # Alternative client production build
  │       └── ...
  ├── controllers/         # Handles request logic (Controllers)
  │   ├── gpus.ts          # GPUs controller: handles API requests related to the GPUs
  │   └── testing.ts       # Controller to handle the reset database request, used in E2E and integration tests
  ├── models/              # Data models/schema definitions (Models)
  │   └── gpu.ts           # Defines the GPU schema/model
  ├── middlewares/         # Custom middleware (e.g., authentication, error handling)
  │   └── errorHandler.ts  # Handles server errors
  ├── utils/               # Utility/helper functions
  │   ├── config.ts        # Handles environment configurations
  │   └── logger.ts        # Logger setup (for logging requests/errors)
  ├── tests/               # Database integration tests
  │   ├── data.ts          # Mock data
  │   └── gpu_api.test.ts  # Integration tests, using the node:test module with supertest
  ├── package-lock.json    # Manages exact dependency versions
  └── package.json         # Project dependencies and scripts
  ```


## Troubleshooting
### Frontend won’t start
Check the versions of Node.js ≥18 & npm ≥10.

---

### Backend cannot connect to DB
Ensure .env file has the correct MongoDB URI.

---

### Port already in use
Kill the process using the port or change the Vite/Express port in config.

---

### Docker containers can’t communicate with each other
Verify the network `gpulist_webapp-network` exists.

---

### E2E tests fail
Confirm the Main UI is running on http://localhost:5173.


## Author
Rafael G. Torok
GitHub: https://github.com/rafaeltorok