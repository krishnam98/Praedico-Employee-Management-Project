# Praedico Employee Management Project

A full-stack employee management system built with Next.js (frontend) and Node.js/Express (backend).

## 📁 Project Structure

```
Praedico-Employee-Management-Project/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (admin)/       # Admin routes
│   │   │   ├── (employee)/    # Employee routes
│   │   │   └── page.tsx       # Login page
│   │   └── lib/
│   ├── public/
│   ├── package.json
│   └── next.config.ts
│
└── backend/           # Node.js/Express API
    ├── Config/        # Database configuration
    ├── Controllers/   # Business logic
    ├── Middlewares/   # Auth, validation, error handling
    ├── Models/        # Database models
    ├── Routes/        # API routes
    ├── Utils/         # Helper functions
    ├── index.js       # Server entry point
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (for backend)

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Frontend will run on http://localhost:3000
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with required variables
# (See backend/.env.example for reference)

# Run development server
npm start

# Backend will run on http://localhost:5001 (or configured port)
```

## 🔐 Demo Credentials

**Employee Login:**
- Email: `admin@praedico.com`
- Password: `admin123`

## 🛠️ Technologies Used

### Frontend
- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, Lucide React
- **Form Handling:** React Hook Form, Zod
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (assumed based on structure)
- **Authentication:** JWT (assumed)

## 📝 Features

- Employee authentication and authorization
- Admin dashboard
- Employee dashboard
- User management
- Role-based access control
- Responsive design

## 🔧 Development

### Running Both Servers Concurrently

You can run both frontend and backend servers in separate terminal windows:

**Terminal 1 (Frontend):**
```bash
cd frontend
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd backend
npm start
```

## 📦 Building for Production

### Frontend
```bash
cd frontend
npm run build
npm start
```

### Backend
```bash
cd backend
# Configure production environment variables
npm start
```

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Push to your branch
5. Create a pull request

## 📄 License

This project is private and proprietary.

## 👥 Team

- **Developer:** Praedico Team
- **Repository:** https://github.com/krishnam98/Praedico-Employee-Management-Project
