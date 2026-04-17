# AtlasAutos - Car Dealership Marketplace

A full-stack car dealership marketplace web application built with React, Node.js, Express, MongoDB, and Socket.io.

## Features

### For Buyers
- Browse and search cars with advanced filters
- Save favorites
- Real-time chat with sellers
- Compare up to 3 cars side by side
- View seller profiles and ratings
- Recently viewed tracking

### For Sellers
- Full dashboard with analytics
- Add/edit car listings (New/Used)
- Upload up to 10 photos per listing
- Real-time messaging with buyers
- Profile management
- View count tracking

### Technical Features
- JWT authentication with role-based access
- Real-time chat using Socket.io
- Image uploads via Cloudinary
- Email notifications via Nodemailer
- Responsive mobile-first design
- MongoDB with Mongoose ODM

## Tech Stack

### Frontend
- React 18 + Vite
- React Router v6
- TailwindCSS
- Axios
- Socket.io-client
- React Hot Toast
- Swiper
- Lucide React

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- JWT Authentication
- Cloudinary
- Nodemailer
- Multer

## Project Structure

```
atlasautos/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context
│   │   ├── utils/          # Utilities & constants
│   │   └── assets/         # Static assets
│   └── public/
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── utils/              # Utilities
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for Nodemailer)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd atlasautos
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Set up environment variables:

Create `.env` file in the server directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
PORT=5000
```

Create `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client (in a new terminal):
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Cars
- `GET /api/cars` - Get all cars (with filters)
- `GET /api/cars/:id` - Get single car
- `POST /api/cars` - Create new listing (seller only)
- `PUT /api/cars/:id` - Update listing (seller only)
- `DELETE /api/cars/:id` - Delete listing (seller only)
- `POST /api/cars/:id/favorite` - Toggle favorite (buyer only)
- `GET /api/cars/user/favorites` - Get user's favorites
- `POST /api/cars/compare` - Compare cars

### Chat
- `GET /api/chat/conversations` - Get user's conversations
- `GET /api/chat/:chatId/messages` - Get messages
- `POST /api/chat` - Create new chat
- `POST /api/chat/:chatId/messages` - Send message
- `GET /api/chat/unread-count` - Get unread count

## Environment Variables

### Server
| Variable | Description |
|----------|-------------|
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret for JWT signing |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |
| EMAIL_HOST | SMTP host (e.g., smtp.gmail.com) |
| EMAIL_PORT | SMTP port (e.g., 587) |
| EMAIL_USER | Email address |
| EMAIL_PASS | Email password/app password |
| CLIENT_URL | Frontend URL |
| PORT | Server port |

### Client
| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API URL |

## Deployment

### Backend Deployment (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables
6. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@atlasautos.com or join our Slack channel.
