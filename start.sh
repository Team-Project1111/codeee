#!/bin/bash

echo "🎨 Starting Kala Heritage Platform..."
echo "===================================="

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if MongoDB is running
if ! pgrep mongod > /dev/null; then
    echo "🚀 Starting MongoDB..."
    # Try different ways to start MongoDB
    if command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
    elif command -v brew &> /dev/null; then
        brew services start mongodb-community
    else
        echo "⚠️  Please start MongoDB manually"
        echo "   Linux: sudo systemctl start mongod"
        echo "   macOS: brew services start mongodb-community"
        echo "   Windows: net start MongoDB"
    fi
fi

echo "🌱 Checking database..."
# Run seed script only if database is empty
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/kala-heritage')
  .then(() => mongoose.connection.db.collection('artists').countDocuments())
  .then(count => {
    if (count === 0) {
      console.log('Database empty, seeding...');
      process.exit(1);
    } else {
      console.log('Database already seeded');
      process.exit(0);
    }
  })
  .catch(() => process.exit(1));
" 2>/dev/null

if [ $? -eq 1 ]; then
    echo "🌱 Seeding database with sample data..."
    node seedData.js
fi

echo ""
echo "🚀 Starting Kala Heritage server..."
echo ""
echo "🌐 Open your browser and visit:"
echo "   http://localhost:3000"
echo ""
echo "🔐 Sample login credentials:"
echo "   Artist: meera.devi@example.com / password123"
echo "   User: arjun.sharma@example.com / password123"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm start