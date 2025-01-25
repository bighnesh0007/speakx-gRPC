
```markdown
# gRPC Search Questions Application

This project includes a gRPC service and client that allows searching for questions based on a title, type, and pagination. The client interacts with the server to fetch search results.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the Server](#running-the-server)
4. [Running the Client](#running-the-client)
5. [API](#api)
6. [License](#license)

## Prerequisites

Before running the server and client, make sure you have the following installed on your machine:

- **Node.js** (v14 or above) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) - [Learn more about npm](https://www.npmjs.com/)
- **gRPC** and **MongoDB** (Ensure the gRPC server and MongoDB database are accessible)

## Installation

### 1. Clone the repository

Clone the repository using the following command:

```bash
git clone https://github.com/your-username/your-repo-name.git
```

### 2. Install Server Dependencies

Navigate to the server directory:

```bash
cd server
```

Install the necessary dependencies by running:

```bash
npm install
```

This will install all required dependencies for the server (such as `@grpc/grpc-js`, `@grpc/proto-loader`, `mongodb`, etc.).

### 3. Install Client Dependencies

Navigate to the client directory:

```bash
cd ../client
```

Install the necessary dependencies by running:

```bash
npm install
```

This will install all required dependencies for the client (such as `@grpc/grpc-js`, `@grpc/proto-loader`, etc.).

## Running the Server

To run the server, follow these steps:

1. Navigate to the server directory (if you're not already there):

   ```bash
   cd server
   ```

2. Start the server by running:

   ```bash
   npm start
   ```

   The server will start running on port `50051` by default. You should see output similar to this:

   ```bash
   Server running at http://0.0.0.0:50051
   ```

   This confirms that the gRPC server is running and ready to accept requests.

## Running the Client

To run the client, follow these steps:

1. Navigate to the client directory (if you're not already there):

   ```bash
   cd client
   ```

2. Start the client by running:

   ```bash
   npm start
   ```

   This will start the client, and it will make requests to the gRPC server to fetch questions based on the search parameters.

   The client will use query parameters such as:
   - `title` (string) - The title of the question to search for.
   - `type` (optional) - The type of question (e.g., "easy", "medium", "hard").
   - `page` (optional) - The page number for pagination (defaults to 1).
   - `pageSize` (optional) - The number of results per page (defaults to 10).

   Example request:
   ```
   /api/search?title=math&type=easy&page=1&pageSize=10
   ```

## API

### `GET /api/search`

**Parameters:**
- `title`: The title of the question to search for (required).
- `type`: The type of the question (optional).
- `page`: The page number for pagination (optional, default is 1).
- `pageSize`: The number of questions per page (optional, default is 10).

**Response:**
- Returns a list of questions matching the title (with optional filters like `type` and pagination).
- If an error occurs, a 500 status code will be returned with the error details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Visualized Workflow

Here’s a brief overview of the system:

1. **Client**: Sends HTTP `GET` requests with query parameters to the Next.js API route (`/api/search`).
2. **Next.js API Route**: The API route sends a gRPC request to the server with the search parameters.
3. **gRPC Server**: The gRPC server processes the search query, fetches results from MongoDB, and returns the data.
4. **Client**: Displays the results (or errors) to the user.

### Example Flow:

1. **User inputs search query**:
   - `/api/search?title=math&type=easy&page=1&pageSize=10`

2. **Client**:
   - Sends a `GET` request with the query parameters.
   
3. **Next.js API Route**:
   - Processes the request and forwards it to the gRPC server.
   
4. **gRPC Server**:
   - Queries MongoDB with the search parameters and returns the search results.
   
5. **Client**:
   - Displays the search results to the user.

---

If you encounter any issues or have any questions, feel free to open an issue in the [GitHub repository](https://github.com/your-username/your-repo-name/issues).

---

**Enjoy using the app!**
```

### Explanation:
- **Table of Contents**: Provides an overview of the sections for easy navigation.
- **Prerequisites**: Lists what needs to be installed (Node.js, npm, gRPC, MongoDB).
- **Installation**: Explains how to clone the repo and install dependencies for both the server and client.
- **Running the Server and Client**: Walks the user through how to start both the gRPC server and client.
- **API Section**: Provides a description of the `GET /api/search` endpoint, including parameters and expected responses.
- **Visualized Workflow**: Gives an overview of how the system works, from the client making requests to the gRPC server handling them.

Let me know if you need further modifications!
