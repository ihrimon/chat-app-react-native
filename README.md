# 📱 Real-Time Chat App Project Plan

## 🎯 Project Goal

**Build a scalable real-time chat application with advanced communication and interactive features:**

### 💬 Messaging Features

- Text & Media messaging (image, video, audio, files)
- Voice messages
- Message reactions (like, emoji)
- Reply & forward messages
- Edit / delete messages (soft delete)
- Message search & filtering

### 📞 Communication Features

- Audio calls
- Video calls

### 📍 Smart & Interactive Features

- Typing indicators
- Online / Offline status
- Last seen tracking
- Read receipts (sent → delivered → seen)
- Live location sharing (real-time tracking)

### 👥 Social Features

- Group chat
- User mentions (@username)
- User profiles with status/bio
- Block / report users

### 🔔 Engagement Features

- Push notifications (real-time)
- In-app notifications
- Message preview
- Notification types (message, call, system)
- Read / unread notification state

---

## 📦 Core Modules List

### 🔐 Auth Module

**Purpose:** User authentication & access control

#### Features:

- User registration
- User login
- JWT authentication
- Logout

### 👤 User Module

**Purpose:** User profile & identity management

#### Features:

- View/update profile (name, bio, image)
- User search
- Block / report user
- User session management (active devices, login sessions)

### 💬 Chat Module (Core)

**Purpose:** Chat system & conversation management

#### Features:

- 1-to-1 chat
- Group chat
- Chat list
- Create/delete conversation
- Chat metadata:
  - lastMessage
  - unreadCount
  - pinned / muted / archived (optional)

### 📨 Message Module

**Purpose:** Message handling & operations

#### Features:

- Send/receive messages
- Message types (text, media, audio, location)
- Reply / forward messages
- Edit messages
- Soft delete messages
- Message search & filtering
- Message reactions (emoji)

#### Message Status Flow:

- sent → delivered → seen

#### Additional Flags:

- isEdited
- isForwarded

### 🔄 Real-time Module

**Purpose:** Live communication (Socket-based)

#### Features:

- Instant message delivery
- Typing indicators
- Online / offline status
- Last seen tracking
- Read receipts

#### Event-Based Structure:

- message events
- typing events
- presence events

### 📁 Media Module

**Purpose:** File & media management

#### Features:

- Image upload
- Video upload
- Audio/file sharing
- Media preview
- Media compression (optimization)

### 🎙️ Voice Module

**Purpose:** Voice message system

#### Features:

- Record voice message
- Send voice message
- Audio playback

### 📞 Call Module

**Purpose:** Real-time communication (calls)

#### Features:

- Audio call
- Video call
- Accept/reject calls
- Call status handling

### 🔔 Notification Module

**Purpose:** User engagement & alerts

#### Features:

- Push notifications (new message)
- In-app notifications
- Message preview alerts
- Notification types (message/call/system)
- Read/unread state

### ⚙️ Settings Module

**Purpose:** User preferences & control

#### Features:

- Profile settings
- Privacy settings
- Notification toggle

---

## 📱 MVP Scope (Version 1)

### 🎯 Goal

Build a **simple but fully working real-time chat app** with core messaging functionality.

### 🟢 Auth Module (MVP) (completed)

#### Features:

- User Registration
- User Login
- JWT Authentication

### 🟢 User Module (MVP) (completed)

#### Features:

- Basic profile (name, email)
- User list (for chat start)

### 🟢 Chat Module (MVP) (completed)

#### Features:

- 1-to-1 chat
- Chat list
- Create conversation

#### Minimal Metadata:

- lastMessage

### 🟢 Message Module (MVP) (completed)

#### Features:

- Send/receive text messages
- Basic message list
- Timestamp

#### Status:

- sent (optional delivered)

### 🟢 Real-time Module (MVP)

#### Features:

- Instant message delivery (Socket)
- Basic online/offline status

### 🟢 Notification Module (MVP - Optional)

#### Features:

- Basic push notification (new message)

### 🟢 UI/UX (MVP)

#### Screens:

- Login Screen
- Register Screen
- Chat List Screen
- Chat Screen

---

## 🗄️ Database Schema (MVP)

## 👤 User Collection

```js
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // hashed
  avatar: String, // optional
  isOnline: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 💬 Chat Collection

```js
{
  _id: ObjectId,
  members: [ObjectId], // [user1, user2]
  lastMessage: {
    text: String,
    senderId: ObjectId,
    createdAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 📨 Message Collection

```js
{
  _id: ObjectId,
  chatId: ObjectId,
  senderId: ObjectId,
  text: String,
  status: "sent" | "delivered", // MVP
  createdAt: Date
}
```

---

## 🔌 API Endpoints (MVP)

### 🔐 Auth Routes

#### Register

POST /api/auth/register

Body:

```json
{
  "name": "Rimon",
  "email": "rimon@gmail.com",
  "password": "123456"
}
```

#### Login

POST /api/auth/login

Response:

```json
{
  "token": "JWT_TOKEN",
  "user": {}
}
```

### 👤 User Routes

#### Get All Users

GET /api/users

### 💬 Chat Routes

#### Create or Get Chat

POST /api/chats

Body:

```json
{
  "receiverId": "USER_ID"
}
```

#### Get User Chats

GET /api/chats

### 📨 Message Routes

#### Send Message

POST /api/messages

Body:

```json
{
  "chatId": "CHAT_ID",
  "text": "Hello!"
}
```

#### Get Messages

GET /api/messages/:chatId

---

## 🔄 Socket Events (MVP)

### 🟢 Connection

#### connect

- User connects to socket

#### setup

Client → Server

```json
{
  "userId": "USER_ID"
}
```

👉 Server stores user socket

### 💬 Chat Events

#### join_chat

Client → Server

```json
{
  "chatId": "CHAT_ID"
}
```

#### send_message

Client → Server

```json
{
  "chatId": "CHAT_ID",
  "text": "Hello",
  "senderId": "USER_ID"
}
```

#### receive_message

Server → Client

```json
{
  "chatId": "CHAT_ID",
  "text": "Hello",
  "senderId": "USER_I
