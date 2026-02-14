# 🚀 Production Deployment Guide

## Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account or local MongoDB
- Domain name (optional)
- SSL certificate (for HTTPS)

## Backend Deployment

### 1. Environment Setup
```bash
# Clone repository
git clone <your-repo-url>
cd smart-campus-system/backend

# Install dependencies
npm install --production

# Create production environment file
cp .env .env.production
```

### 2. Production Environment Variables
```env
NODE_ENV=production
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart_campus_db
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
```

### 3. Database Setup
```bash
# Seed initial data
npm run seed
```

### 4. Start Production Server
```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start server.js --name "smart-campus-api"
pm2 startup
pm2 save

# Or using node directly
npm run prod
```

## Frontend Deployment

### 1. Build for Production
```bash
cd frontend
npm install
npm run build
```

### 2. Serve Static Files
```bash
# Using serve
npm install -g serve
serve -s build -l 3000

# Or using nginx (recommended)
# Copy build folder to /var/www/html/
```

### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /var/www/html/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Checklist
- [ ] Change default JWT secret
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Regular security updates

## Monitoring
- [ ] Set up PM2 monitoring
- [ ] Configure log rotation
- [ ] Monitor database performance
- [ ] Set up error tracking (Sentry)

## Backup Strategy
- [ ] Daily database backups
- [ ] Code repository backups
- [ ] Environment configuration backups