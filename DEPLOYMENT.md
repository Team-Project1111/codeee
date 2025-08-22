# 🚀 Kala Heritage - Deployment Guide

This guide covers different deployment options for the Kala Heritage platform.

## 📋 Pre-deployment Checklist

- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] MongoDB connection tested
- [ ] Database seeded with sample data
- [ ] Application tested locally
- [ ] Production environment variables set
- [ ] Security configurations reviewed

## 🌐 Deployment Options

### Option 1: Local Development

```bash
# Install dependencies
npm install

# Start MongoDB (if not running)
sudo systemctl start mongod  # Linux
# OR
brew services start mongodb-community  # macOS

# Seed database
node seedData.js

# Start development server
npm run dev

# Access at http://localhost:3000
```

### Option 2: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/kala-heritage
      - JWT_SECRET=your-production-jwt-secret
      - NODE_ENV=production
    depends_on:
      - mongo
  
  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Deploy with Docker:
```bash
docker-compose up -d
```

### Option 3: Cloud Deployment (Heroku)

1. **Install Heroku CLI**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   ```

2. **Prepare for Heroku**
   ```bash
   # Login to Heroku
   heroku login

   # Create Heroku app
   heroku create kala-heritage-app

   # Add MongoDB Atlas add-on
   heroku addons:create mongolab:sandbox
   ```

3. **Configure Environment Variables**
   ```bash
   heroku config:set JWT_SECRET="your-super-secure-jwt-secret"
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy Kala Heritage platform"
   git push heroku main
   ```

### Option 4: Cloud Deployment (DigitalOcean/AWS/GCP)

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org

   # Start MongoDB
   sudo systemctl start mongod
   sudo systemctl enable mongod

   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd kala-heritage

   # Install dependencies
   npm install --production

   # Set up environment
   cp .env.example .env
   # Edit .env with production values

   # Seed database
   node seedData.js

   # Start with PM2
   pm2 start server.js --name "kala-heritage"
   pm2 startup
   pm2 save
   ```

3. **Configure Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔒 Security Considerations

### Production Environment Variables
```bash
# Strong JWT secret (32+ characters)
JWT_SECRET=your-super-secure-random-string-here

# Production MongoDB URI
MONGODB_URI=mongodb://username:password@host:port/database

# Production mode
NODE_ENV=production

# Optional: Database authentication
DB_USER=your-db-username
DB_PASS=your-db-password
```

### Security Best Practices
- Use HTTPS in production
- Set strong JWT secrets
- Enable MongoDB authentication
- Configure proper CORS origins
- Set up rate limiting
- Use environment variables for sensitive data
- Regular security updates

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check application status
curl http://localhost:3000/health

# Check MongoDB status
mongo --eval "db.adminCommand('ismaster')"

# Check PM2 processes
pm2 status
```

### Log Management
```bash
# View application logs
pm2 logs kala-heritage

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Backup Strategy
```bash
# MongoDB backup
mongodump --db kala-heritage --out /backup/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backup/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR
mongodump --db kala-heritage --out $BACKUP_DIR
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR
```

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Check if MongoDB is running
   sudo systemctl status mongod
   
   # Start MongoDB
   sudo systemctl start mongod
   
   # Check connection string in .env
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill process
   kill -9 <PID>
   
   # Or use different port in .env
   PORT=3001
   ```

3. **Dependencies Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Permission Issues**
   ```bash
   # Fix file permissions
   chmod -R 755 public/
   chmod -R 755 uploads/
   ```

## 📈 Performance Optimization

### Production Optimizations
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Optimize database queries
- Use connection pooling
- Monitor application performance

### Database Optimization
```javascript
// Add indexes for better query performance
db.artists.createIndex({ "artform": 1, "rating": -1 })
db.artworks.createIndex({ "artform": 1, "featured": -1, "createdAt": -1 })
db.artworks.createIndex({ "title": "text", "description": "text" })
```

## 🌟 Scaling Considerations

### Horizontal Scaling
- Use load balancers (Nginx, HAProxy)
- Deploy multiple application instances
- Database sharding for large datasets
- CDN for static content delivery

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database configuration
- Use Redis for caching
- Implement session stores

## 📱 Mobile Deployment

The platform is fully responsive and works on mobile devices. For native mobile apps:

### React Native (Future)
```bash
# Initialize React Native project
npx react-native init KalaHeritageApp

# Use existing API endpoints
# Implement native UI components
```

### PWA Features
The platform includes PWA capabilities:
- Service worker for offline functionality
- Responsive design for mobile
- Touch-friendly interactions
- Fast loading performance

## 🔍 Monitoring Setup

### Application Monitoring
```javascript
// Add to server.js for basic monitoring
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

### Log Aggregation
- Use Winston for structured logging
- Implement log rotation
- Set up centralized logging (ELK stack)
- Monitor error rates and performance

---

## 🎯 Deployment Checklist

### Before Deployment
- [ ] Code review completed
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Backup strategy in place

### After Deployment
- [ ] Health checks passing
- [ ] Monitoring setup verified
- [ ] SSL certificate installed
- [ ] Domain configuration complete
- [ ] CDN configured (if applicable)
- [ ] Performance metrics baseline established
- [ ] Error tracking enabled
- [ ] User feedback collection setup

---

**Need help with deployment? Contact our support team or check the main README.md for additional resources.**