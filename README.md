# Identity Reconciliation

## Link to Hosted Project
- [Identity Reconciliation - Hosted Project](https://identity-reconciliation-yx7m.onrender.com/)

## Link to Github Repository
- [Identity Reconciliation  - GitHub Repository](https://github.com/pranavnaikp/Identity-Reconciliation)

## Endpoints 
- /api/identify - (post method)
- /api/contact/:id - (get method to get user details by id)
- /api/contactByEmail/:email - (get method to get user details by email)
- /api/contactByPhoneNumber/:phoneNumber - (get method to get user details by phone number)


## Installation

### Prerequisites
Ensure you have the following installed:
- Postgresql
- Node.js

### Steps to Install

#### Server Setup
1. Git clone the project
2. Run the following command to install server-side dependencies:
    ```bash
    npm install
    ```
#### Database Setup
1. Install Postgresql
2. Setup new database and note down username passwords port and other required variables in a .env file

## Run Project

### Running the Server
1. Execute the following command to start the server:
    ```bash
    npm start
    ```

## Usage

### Features
- Install Postman or Insomnia or any other api testing app
- api end point for local setup is "localhost:8080/api/identify"
- Other api endpoint to fetch the details are "localhost:8080/contact/:id", "localhost:8080/api/contactByEmail/:email", "localhost:8080/contactByPhoneNumber/:phoneNumber"

## Implementation Details

### Technologies Used
- Backend: Node.js
- Database: Postgesql

