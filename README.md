![image](https://github.com/user-attachments/assets/0f971ef9-8694-46cf-8aba-0c005b21e11f)
![image](https://github.com/user-attachments/assets/50106e3b-27b1-4dc7-81f7-e7c1eb489098)
![image](https://github.com/user-attachments/assets/251c6c65-0f8d-4822-addc-4c82149d36b3)
![image](https://github.com/user-attachments/assets/391265ec-dd5f-448f-91c7-acab03d8a6ff)
![image](https://github.com/user-attachments/assets/d24dfa21-1803-48a4-bdf9-d2e33d2b9bfe)

# gRPC Search Questions Application

## Prerequisites

- Node.js (v14+)
- npm
- gRPC
- MongoDB

## Installation

### Clone Repository

```bash
git clone https://github.com/bighnesh0007/speakx-gRPC.git
cd speakx-gRPC
```

### Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Running the Server

```bash
cd server
npm start
# Server runs on port 50051
```

## Running the Client

```bash
cd client
npm run dev
```

## API Endpoint: `/api/search`

### Parameters
- `title`: Question title (required)
- `type`: Question type (optional)
- `page`: Page number (optional, default: 1)
- `pageSize`: Results per page (optional, default: 10)

### Example Request
```
/api/search?title=math&type=easy&page=1&pageSize=10
```

## Workflow

1. User inputs search query
2. Client sends GET request to Next.js API route
3. Next.js API route forwards request to gRPC server
4. gRPC server queries MongoDB
5. Results returned to client

## Troubleshooting

- Ensure MongoDB is running
- Check gRPC server connection
- Verify network configurations

## License

MIT License

---

**Repository**: [GitHub](https://github.com/bighnesh0007/speakx-gRPC)
