# United Minds – Online Forum & Discussion Board

**United Minds** is a full-stack community-driven platform inspired by Reddit and Stack Overflow.
It allows users to create threads, reply with nested comments, vote on content, follow users, and build a community around shared interests.

The goal of the project is to provide a **secure, interactive, and structured environment** for students and tech enthusiasts to share knowledge, solve problems, and collaborate.

---

## 🚀 Features

- **User Authentication & Security**

  - Secure registration and login with JWT-based authentication.
  - Passwords are securely hashed using bcrypt.
  - Protected routes for authenticated users.

- **Content Management**

  - Create and manage threads with a title, content, category, and tags.
  - Organize threads into predefined categories.
  - Assign multiple tags to threads for easy discovery and filtering.

- **Interactive Discussions**

  - Reply directly to a thread or to another reply, creating nested comment chains.
  - A robust voting system to upvote and downvote both threads and replies.
  - Voting is toggle-based, ensuring one vote per user per item.

- **Social & Engagement**
  - **User Profiles**: View user activity, posts, and reposts.
  - **Follow System**: Follow and unfollow other users.
  - **Reposts**: Share interesting threads with your own followers.

---

## 🛠️ Tech Stack

### Frontend (`client/`)

- **React.js**: A JavaScript library for building user interfaces.
- **Vite**: A modern frontend build tool for fast development.
- **React Router**: For client-side routing and navigation.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Axios**: For making promise-based HTTP requests to the backend API.
- **Lucide React**: For beautiful and consistent icons.

### Backend (`server/`)

- **Node.js & Express.js**: For building the RESTful API.
- **Prisma ORM**: A next-generation ORM for Node.js and TypeScript.
- **PostgreSQL**: The world's most advanced open source relational database.
- **Passport.js**: Authentication middleware for Node.js, using a JWT strategy.
- **bcrypt.js**: For hashing passwords.

### Tools & Utilities

- **Postman**: For API testing and development.
- **Git & GitHub**: For version control.
- **dotenv**: For managing environment variables.
- **CORS**: Middleware for handling Cross-Origin Resource Sharing.

---

## 🗂️ Database Schema

The database is structured to support all application features with clear relations between models.

- **User**: Stores user profiles and authentication data.
- **Thread**: The main discussion posts.
- **Reply**: Comments linked to threads and other replies (nested structure).
- **Category**: High-level topics to group threads.
- **Tag**: Keywords for content discovery, linked via `ThreadTag`.
- **ThreadVote** & **ReplyVote**: Tracks user votes on threads and replies.
- **Repost**: Allows users to share threads.
- **Follower**: Manages the user-follower relationships.

### ER Diagram

Below is the ER diagram for the project, generated from the Prisma schema:

```mermaid
erDiagram
    User {
        Int id PK
        String name
        String email UK
        String passwordHash
        String avatarUrl
        DateTime createdAt
    }
    Category {
        Int id PK
        String name UK
        DateTime createdAt
        DateTime updatedAt
    }
    Tag {
        Int id PK
        String name UK
        DateTime createdAt
        DateTime updatedAt
    }
    Thread {
        Int id PK
        String title
        String content
        Int categoryId FK
        Int authorId FK
        DateTime createdAt
        DateTime updatedAt
    }
    ThreadTag {
        Int id PK "UK on (threadId, tagId)"
        Int threadId FK
        Int tagId FK
    }
    Reply {
        Int id PK
        String content
        Int threadId FK
        Int authorId FK
        Int parentId FK "nullable"
        DateTime createdAt
        DateTime updatedAt
    }
    ThreadVote {
        Int id PK "UK on (userId, threadId)"
        Int value
        Int userId FK
        Int threadId FK
        DateTime createdAt
        DateTime updatedAt
    }
    ReplyVote {
        Int id PK "UK on (userId, replyId)"
        Int value
        Int userId FK
        Int replyId FK
        DateTime createdAt
        DateTime updatedAt
    }
    Repost {
        Int id PK "UK on (userId, threadId)"
        Int userId FK
        Int threadId FK
        String comment "nullable"
        DateTime createdAt
        DateTime updatedAt
    }
    Follower {
        Int id PK "UK on (followerId, followingId)"
        Int followerId FK
        Int followingId FK
        DateTime createdAt
    }

    User ||--o{ Thread : "authors"
    User ||--o{ Reply : "authors"
    User ||--o{ ThreadVote : "casts"
    User ||--o{ ReplyVote : "casts"
    User ||--o{ Repost : "creates"
    User ||--o{ Follower : "follows (as followerId)"
    User ||--o{ Follower : "is followed by (as followingId)"

    Category ||--o{ Thread : "has"

    Thread ||--|{ ThreadTag : "has"
    Tag ||--|{ ThreadTag : "is assigned to"

    Thread ||--o{ Reply : "has"
    Thread ||--o{ ThreadVote : "receives"
    Thread ||--o{ Repost : "is about"

    Reply }o--o{ Reply : "is a reply to (parentId)"
    Reply ||--o{ ReplyVote : "receives"
```

---

## 📊 Architecture & Flow Diagrams

Here are a few diagrams to visualize the project's structure and key user flows.

### 1. High-Level System Architecture

This diagram shows the main components of the application and how they interact.

```mermaid
graph TD
    A[User's Browser] -- HTTP/S --> B(React Frontend - Vite);
    B -- API Calls --> C{Node.js/Express Backend};
    C -- Prisma ORM --> D[(PostgreSQL Database)];

    subgraph "Client-Side"
        B;
    end

    subgraph "Server-Side"
        C;
        D;
    end
```

### 2. User Authentication Flow

This sequence diagram illustrates the process of user registration and login.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    %% Registration Flow %%
    User->>Frontend: Fills out registration form
    Frontend->>Backend: POST /api/auth/register (name, email, password)
    Backend->>Backend: Hash password with bcrypt
    Backend->>Database: Create User record
    Database-->>Backend: Return new User object
    Backend->>Backend: Generate JWT
    Backend-->>Frontend: 201 Created { user, token }
    Frontend->>User: Store token, redirect to feed

    %% Login Flow %%
    User->>Frontend: Fills out login form
    Frontend->>Backend: POST /api/auth/login (email, password)
    Backend->>Database: Find User by email
    Database-->>Backend: Return User record (with hash)
    alt User found
        Backend->>Backend: Compare password with hash
        alt Password matches
            Backend->>Backend: Generate JWT
            Backend-->>Frontend: 200 OK { user, token }
            Frontend->>User: Store token, redirect to feed
        else Password does not match
            Backend-->>Frontend: 400 Bad Request (Invalid credentials)
            Frontend->>User: Show error message
        end
    else User not found
        Backend-->>Frontend: 400 Bad Request (Invalid credentials)
        Frontend->>User: Show error message
    end
```

### 3. Creating a New Thread Flow

This diagram shows the steps involved when an authenticated user creates a new discussion thread.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Clicks "Create Thread" and fills form
    Frontend->>Backend: POST /api/threads (title, content, categoryId, tagIds)
    Note over Backend: Middleware verifies JWT from Authorization header
    Backend->>Database: Create Thread record
    Backend->>Database: Create associated ThreadTag records
    Database-->>Backend: Return new Thread object
    Backend-->>Frontend: 201 Created { thread }
    Frontend->>User: Redirect to the new thread's page
```

---

## ⚙️ Full Project Setup

Follow these instructions to get the entire project up and running on your local machine.

### Prerequisites

- Node.js (v16 or higher)
- npm
- A PostgreSQL database (e.g., using Neon DB or a local instance).

### 1. Clone Repository

```bash
git clone https://github.com/itsrudra143/United-Minds.git
cd United-Minds
```

### 2. Backend Setup (`server/`)

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file and add your environment variables
# (see .env.example or the section below)
cp .env.example .env

# Run database migrations
npx prisma migrate dev
```

Your `.env` file in the `server/` directory should look like this:

```env
# Your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:port/database"

# A strong secret for signing JWTs
JWT_SECRET="your_jwt_secret"

# The port for the backend server
PORT=5000

# The URL of your running frontend application
FRONTEND_URL="http://localhost:5173"
```

### 3. Frontend Setup (`client/`)

```bash
# Navigate to the client directory from the root
cd client

# Install dependencies
npm install
```

The frontend does not require a `.env` file as it uses a proxy to communicate with the backend in development.

### 4. Running the Application

You need to run both the backend and frontend servers in separate terminals.

### Terminal 1: Start the Backend

```bash
# From the server/ directory
npm run dev
```

The backend will be available at `http://localhost:5000`.

### Terminal 2: Start the Frontend

```bash
# From the client/ directory
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## 📬 API Endpoints

The API is documented below. Use a tool like Postman to test the endpoints.

### Auth

| Method | Endpoint             | Description              | Auth Required |
| ------ | -------------------- | ------------------------ | ------------- |
| `POST` | `/api/auth/register` | Register a new user      | ❌ No         |
| `POST` | `/api/auth/login`    | Log in a user            | ❌ No         |
| `GET`  | `/api/auth/me`       | Get current user profile | ✅ Yes        |

### Threads

| Method | Endpoint           | Description               | Auth Required |
| ------ | ------------------ | ------------------------- | ------------- |
| `GET`  | `/api/threads`     | Get all threads           | ❌ No         |
| `GET`  | `/api/threads/:id` | Get a single thread by ID | ❌ No         |
| `POST` | `/api/threads`     | Create a new thread       | ✅ Yes        |

### Replies

| Method | Endpoint                  | Description                  | Auth Required |
| ------ | ------------------------- | ---------------------------- | ------------- |
| `GET`  | `/api/replies/thread/:id` | Get all replies for a thread | ❌ No         |
| `GET`  | `/api/replies/:id`        | Get a single reply by ID     | ❌ No         |
| `POST` | `/api/replies`            | Create a new reply           | ✅ Yes        |

### Categories

| Method | Endpoint          | Description           | Auth Required |
| ------ | ----------------- | --------------------- | ------------- |
| `GET`  | `/api/categories` | Get all categories    | ❌ No         |
| `POST` | `/api/categories` | Create a new category | ❌ No         |

### Tags

| Method | Endpoint    | Description      | Auth Required |
| ------ | ----------- | ---------------- | ------------- |
| `GET`  | `/api/tags` | Get all tags     | ❌ No         |
| `POST` | `/api/tags` | Create a new tag | ❌ No         |

### Votes

| Method | Endpoint                         | Description       | Auth Required |
| ------ | -------------------------------- | ----------------- | ------------- |
| `POST` | `/api/votes/thread/:id/upvote`   | Upvote a thread   | ✅ Yes        |
| `POST` | `/api/votes/thread/:id/downvote` | Downvote a thread | ✅ Yes        |
| `POST` | `/api/votes/reply/:id/upvote`    | Upvote a reply    | ✅ Yes        |
| `POST` | `/api/votes/reply/:id/downvote`  | Downvote a reply  | ✅ Yes        |

### Reposts

| Method   | Endpoint                  | Description              | Auth Required |
| -------- | ------------------------- | ------------------------ | ------------- |
| `GET`    | `/api/reposts/user/:id`   | Get reposts by user ID   | ❌ No         |
| `GET`    | `/api/reposts/thread/:id` | Get reposts for a thread | ❌ No         |
| `POST`   | `/api/reposts`            | Create a new repost      | ✅ Yes        |
| `DELETE` | `/api/reposts/:id`        | Delete a repost          | ✅ Yes        |

### Follows

| Method   | Endpoint                     | Description                   | Auth Required |
| -------- | ---------------------------- | ----------------------------- | ------------- |
| `GET`    | `/api/follows/:id/followers` | Get a user's followers        | ❌ No         |
| `GET`    | `/api/follows/:id/following` | Get users a user is following | ❌ No         |
| `GET`    | `/api/follows/:id/check`     | Check if you follow a user    | ✅ Yes        |
| `POST`   | `/api/follows`               | Follow a user                 | ✅ Yes        |
| `DELETE` | `/api/follows/:id`           | Unfollow a user               | ✅ Yes        |

---

## 🤝 Contribution

Contributions are welcome!

1. Fork the repository
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Push and create a Pull Request
