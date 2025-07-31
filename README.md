# Task Tracker Application

A full-stack task tracking application with time logging capabilities, built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Task Management**: Create, update, and delete tasks with status tracking
- **Time Tracking**: Start/stop timers for individual tasks
- **Daily Summary**: View daily time tracking statistics
- **Responsive Design**: Modern UI that works on all devices

## Tech Stack

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests

### Frontend

- React 19 with Vite
- Redux Toolkit for state management
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd task_tracker
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Install client dependencies

```bash
cd ../client
npm install
```

### 4. Environment Setup

#### Server Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/task_tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

#### Client Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

### 5. Start MongoDB

Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGO_URI` in the server `.env` file.

## Running the Application

### Development Mode

1. **Start the server** (from the `server` directory):

```bash
npm run dev
```

2. **Start the client** (from the `client` directory):

```bash
npm run dev
```

3. **Access the application**:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production Mode

1. **Build the client**:

```bash
cd client
npm run build
```

2. **Start the server**:

```bash
cd server
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Tasks

- `POST /api/tasks/create` - Create a new task
- `GET /api/tasks/getTasks` - Get all tasks for user
- `PUT /api/tasks/update/:id` - Update a task
- `DELETE /api/tasks/delete/:id` - Delete a task

### Time Logs

- `POST /api/timelogs/start` - Start time tracking for a task
- `POST /api/timelogs/stop` - Stop time tracking for a task
- `GET /api/timelogs/daily` - Get daily summary
- `GET /api/timelogs` - Get all time logs

## Project Structure

```
task_tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── app/           # Redux store
│   │   ├── components/    # React components
│   │   ├── features/      # Redux slices
│   │   ├── pages/         # Page components
│   │   └── main.jsx       # App entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Express middlewares
│   ├── routes/            # API routes
│   ├── schemas/           # MongoDB schemas
│   ├── lib/               # Database connection
│   └── app.js            # Server entry point
└── README.md
```

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Tasks**: Add new tasks with title and description
3. **Track Time**: Use the timer buttons to start/stop time tracking for tasks
4. **Update Status**: Change task status using the dropdown
5. **View Summary**: See daily time tracking statistics

## Features in Detail

### Task Management

- Create tasks with title and description
- Update task status (pending, in-progress, completed)
- Delete tasks
- View all tasks in a clean list format

### Time Tracking

- Start timer for any task
- Only one timer can be active at a time
- Stop timer to log time spent
- Real-time timer display

### Daily Summary

- Total time tracked today
- Number of tasks worked on
- Time spent on each task
- Completed tasks count

### Authentication

- Secure JWT-based authentication
- Protected routes
- Automatic token refresh
- Secure password hashing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
