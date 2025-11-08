# AfroLingo Server

Backend API server for AfroLingo - African Languages and Cultures Learning App.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or remote)

### Installation

1. **Navigate to the Server directory:**

   ```bash
   cd Server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your actual configuration values.

### Running the Server

#### Development Mode (with auto-reload)

```bash
npm run dev
```

#### Production Mode

```bash
# Build the TypeScript code
npm run build

# Start the server
npm start
```

### Available Scripts

- `npm run dev` - Run the server in development mode with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled production server
- `npm run lint` - Run ESLint on the codebase
- `npm test` - Run tests

## 📁 Project Structure

```
Server/
├── src/
│   ├── config/          # Configuration files (database, etc.)
│   ├── middleware/      # Express middleware (auth, error handling)
│   ├── routes/          # API route handlers
│   ├── models/          # Database models (to be added)
│   ├── controllers/     # Route controllers (to be added)
│   ├── services/        # Business logic services (to be added)
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript (generated)
├── .env.example         # Example environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🛣️ API Endpoints

### Health Check

- `GET /health` - Server health status

### Custom Routes

Add your custom routes in the `src/routes/` directory and import them in `src/index.ts`.

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🗄️ Database

The server uses MongoDB for data persistence. Make sure to:

1. Install MongoDB locally or use a cloud service (MongoDB Atlas)
2. Update the `MONGODB_URI` in your `.env` file
3. The server will attempt to connect on startup

## 🛠️ Development

### Adding New Routes

1. Create a new route file in `src/routes/` (e.g., `lessons.ts`)
2. Import and register it in `src/index.ts`

Example:

```typescript
// src/routes/lessons.ts
import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Get all lessons" });
});

export default router;

// Then in src/index.ts, add:
// import lessonsRouter from './routes/lessons';
// app.use('/api/lessons', lessonsRouter);
```

### Adding Database Models

1. Create model files in `src/models/`
2. Use Mongoose schemas for data validation

### Environment Variables

Key environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `ALLOWED_ORIGINS` - CORS allowed origins

## 📝 TODO

- [ ] Implement database models for Users, Lessons, Progress
- [ ] Add more comprehensive error handling
- [ ] Implement rate limiting
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Set up unit and integration tests
- [ ] Add logging service
- [ ] Implement caching strategy
- [ ] Add audio file upload/storage endpoints
- [ ] Implement lesson content management

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC
