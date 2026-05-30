# ⚡ DevFlow AI Enterprise

> A Full Stack AI-powered Developer Productivity Platform built with the MERN stack and Google Gemini AI.

![DevFlow AI](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-orange?style=for-the-badge)
![JWT](https://img.shields.io/badge/Auth-JWT-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

---

## 🚀 Features

- 🤖 **AI Chat Assistant** — Powered by Google Gemini API for intelligent coding help
- 📁 **Project Management** — Full CRUD: create, update, track, and delete projects
- 📊 **Analytics Dashboard** — Visual stats with charts and progress tracking
- 🔐 **JWT Authentication** — Secure register/login with token-based auth
- 💾 **MongoDB Atlas** — Cloud database for users, projects, and chat history
- 📱 **Responsive UI** — Works on desktop and mobile
- 🎨 **Dark Theme** — Modern enterprise-grade interface

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, Recharts, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| AI | Google Gemini API (`@google/generative-ai`) |
| Auth | JWT (JSON Web Tokens), bcryptjs |
| Styling | CSS3, CSS Variables |

---

## 📁 Project Structure

```
devflow-ai/
├── client/                     # React Frontend
│   └── src/
│       ├── components/
│       │   └── Layout/         # Sidebar navigation
│       ├── context/
│       │   └── AuthContext.js  # Global auth state
│       ├── pages/
│       │   ├── LoginPage.js
│       │   ├── RegisterPage.js
│       │   ├── DashboardPage.js
│       │   ├── ProjectsPage.js
│       │   └── ChatPage.js
│       └── utils/
│           └── api.js          # Axios API calls
│
├── server/                     # Node.js Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── chatController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   └── auth.js             # JWT middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Chat.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── chat.js
│   │   └── dashboard.js
│   └── index.js                # Express entry point
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key ([Get here](https://makersuite.google.com/app/apikey))

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/devflow-ai.git
cd devflow-ai
```

### 2. Install Dependencies
```bash
# Install root (server) dependencies
npm install

# Install client dependencies
npm install --prefix client
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```
Edit `.env` with your values:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/devflow_ai
JWT_SECRET=your_strong_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 4. Run the Application
```bash
# Run both frontend and backend concurrently
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Projects (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### AI Chat (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/send` | Send message to Gemini AI |
| GET | `/api/chat/history` | Get chat sessions |
| DELETE | `/api/chat/:chatId` | Delete chat |

### Dashboard (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get analytics data |

---

## 👨‍💻 Author

**Sagar** — MCA Student | Full Stack Developer  
GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)

---

## 📄 License

This project is licensed under the MIT License.
