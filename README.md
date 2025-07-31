# Task Tracker Application

A full-stack task tracking application with time logging capabilities, built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Task Management**: Create, update, and delete tasks with status tracking
- **Time Tracking**: Start/stop timers for individual tasks
- **Daily Summary**: View daily time tracking statistics
- **Responsive Design**: Modern UI that works on all devices
- **AI Integration**: Google GenAI integration for enhanced functionality

## Tech Stack

### Backend

- Node.js with Express 5.1.0
- MongoDB with Mongoose 8.16.5
- JWT (jsonwebtoken 9.0.2) for authentication
- bcrypt 6.0.0 for password hashing
- CORS 2.8.5 for cross-origin requests
- Cookie Parser for handling cookies
- Google GenAI integration
- Nodemon for development

### Frontend

- React 19.1.0 with Vite 4.5.1
- Redux Toolkit 2.8.2 for state management
- React Router DOM 7.7.1 for navigation
- Axios 1.11.0 for API calls
- Tailwind CSS 4.1.11 for styling
- ESLint for code linting

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager
- Git (for cloning the repository)

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
│   │   │   ├── AddTaskForm.jsx
│   │   │   ├── DailySummary.jsx
│   │   │   ├── EditTaskForm.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── Timer.jsx
│   │   ├── features/      # Redux slices
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── Signup.jsx
│   │   ├── App.jsx        # Main App component
│   │   ├── main.jsx       # App entry point
│   │   └── index.css      # Global styles
│   ├── public/            # Static assets
│   ├── dist/              # Build output
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── timeLogController.js
│   ├── middlewares/       # Express middlewares
│   │   └── isAuth.js
│   ├── routes/            # API routes
│   │   ├── authRoute.js
│   │   ├── taskRoute.js
│   │   └── timeLogRoute.js
│   ├── schemas/           # MongoDB schemas
│   │   ├── task.js
│   │   ├── timeLog.js
│   │   └── user.js
│   ├── lib/               # Database connection
│   │   └── lib.js
│   ├── utils/             # Utility functions
│   │   └── utility.js
│   ├── app.js            # Server entry point
│   └── package.json
└── README.md
```

## Key Components

### Frontend Components

- **ProtectedRoute**: Handles authentication-based route protection
- **AddTaskForm**: Form component for creating new tasks
- **EditTaskForm**: Form component for updating existing tasks
- **TaskList**: Displays all tasks with status and actions
- **Timer**: Real-time timer component for time tracking
- **DailySummary**: Shows daily productivity statistics

### Backend Components

- **Authentication Controller**: Handles user registration, login, and JWT management
- **Task Controller**: Manages CRUD operations for tasks
- **Time Log Controller**: Handles time tracking functionality
- **Auth Middleware**: Protects routes requiring authentication

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

## Development Scripts

### Server Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Client Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check the MONGO_URI in server/.env
   - Verify network connectivity for MongoDB Atlas

2. **CORS Issues**

   - Verify CLIENT_URL in server/.env matches your frontend URL
   - Check that both servers are running on correct ports

3. **Authentication Issues**

   - Clear browser cookies and localStorage
   - Verify JWT_SECRET is set in server/.env
   - Check token expiration

4. **Build Issues**
   - Delete node_modules and package-lock.json
   - Run `npm install` again
   - Check Node.js version compatibility

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the ISC License - see the package.json files for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
