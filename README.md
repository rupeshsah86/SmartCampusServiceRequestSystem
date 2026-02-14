# 🏫 Smart Campus Service Request System

A comprehensive digital solution for managing campus maintenance and support services, built with the MEARN stack (MongoDB, Express.js, React.js, Node.js).

## 🌟 Features

### 🔐 **Authentication & Authorization**
- Role-based access control (Student, Faculty, Admin, Technician)
- Secure JWT authentication
- Password encryption with bcrypt
- Session management

### 📋 **Service Request Management**
- Create, track, and manage service requests
- Multiple service categories (IT Support, Maintenance, Facilities, Security)
- Priority levels (Low, Medium, High, Urgent)
- Request lifecycle (Pending → In Progress → Resolved → Closed)
- File attachment support
- Real-time status updates

### 👥 **Role-Specific Dashboards**
- **Student/Faculty**: Submit requests, track progress, provide feedback
- **Technician**: View assigned requests, update status, add resolution notes
- **Admin**: Complete system overview, user management, analytics dashboard

### 📊 **Admin Features**
- Comprehensive dashboard with statistics
- User management and role assignment
- Request analytics and reporting
- Bulk operations support
- System performance monitoring

### 🎨 **Modern UI/UX**
- Responsive design (Mobile, Tablet, Desktop)
- Professional campus-themed color scheme
- Intuitive navigation and user experience
- Loading states and error handling
- Accessibility compliant

## 🛠️ Technology Stack

### Frontend
- **React.js** - User interface library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling and animations
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Security & Performance
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Input Sanitization** - XSS protection
- **Compression** - Response optimization

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://localhost:27017/smart_campus_db
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=Smart Campus System
```

## 📱 Application Flow

1. **Landing Page** - Professional introduction with features overview
2. **Authentication** - Secure login/registration with role selection
3. **Dashboard** - Role-specific interface with relevant features
4. **Request Management** - Create, track, and manage service requests
5. **Admin Panel** - System administration and analytics

## 🏗️ Project Structure

```
smart-campus-system/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # React context
│       ├── pages/       # Page components
│       ├── services/    # API services
│       ├── styles/      # CSS files
│       └── utils/       # Utility functions
└── docs/                # Documentation
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with salt
- Input validation and sanitization
- Rate limiting for API endpoints
- CORS configuration
- Security headers with Helmet
- XSS protection
- MongoDB injection prevention

## 📈 Performance Optimizations

- Response compression
- Database indexing
- Lazy loading components
- Debounced search functionality
- Optimized API calls
- Caching strategies

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

### Environment Setup
- Configure production MongoDB URI
- Set secure JWT secret
- Update CORS origins
- Enable HTTPS
- Set up process manager (PM2)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Campus administration for requirements gathering
- Faculty advisors for guidance
- Open source community for tools and libraries

---

**Built with ❤️ for Smart Campus Management**