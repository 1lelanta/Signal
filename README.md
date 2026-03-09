# Signal

Signal is a modern full-stack social media application that allows users to connect, share posts, and interact in real time.  
The platform is built using a scalable client–server architecture with modern web technologies.

Live Demo  
https://signal-tau-black.vercel.app/

---

# Features

- User authentication (JWT based)
- Secure password hashing
- Create, edit, and delete posts
- Real-time interactions using WebSockets
- Responsive user interface
- Modular backend architecture
- Environment-based configuration
- Scalable API structure
- Modern frontend with fast build tooling

---

# Tech Stack

## Frontend
- React
- TypeScript
- Vite
- Socket.IO Client
- CSS / Modern UI

## Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Socket.IO
- JWT Authentication
- REST API

---

# Project Structure

```
signal/
│
├── client/        # Frontend application
│   ├── src/
│   └── package.json
│
├── server/        # Backend API
│   ├── src/
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── middleware
│   │   └── utils
│   └── package.json
│
└── README.md
```

---

# Installation

Clone the repository

```
git clone https://github.com/your-username/signal.git
cd signal
```

---

# Backend Setup

```
cd server
npm install
```

Create a `.env` file

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Run the server

```
npm run dev
```

---

# Frontend Setup

```
cd client
npm install
```

Create a `.env` file

```
VITE_API_URL=http://localhost:5000
```

Run the frontend

```
npm run dev
```

---

# Environment Variables

Server variables

```
PORT
MONGO_URI
JWT_SECRET
CLIENT_URL
```

Client variables

```
VITE_API_URL
```

---

# Key Concepts Used

- RESTful API design
- MVC-inspired backend structure
- JWT authentication and authorization
- Real-time communication with Socket.IO
- Modular and maintainable code organization
- Environment-based configuration
- Secure password hashing

---

# Future Improvements

- Notifications system
- Direct messaging
- Media uploads
- Post reactions
- User profiles and follow system
- Improved UI/UX
- Automated tests

---

# License

This project is licensed under the MIT License.
