#!/bin/bash

# Kala Heritage Platform Setup Script
echo "🎨 Setting up Kala Heritage Platform..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v14 or higher) first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version 14 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if MongoDB is installed and running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH."
    echo "   Please install MongoDB and ensure it's running."
    echo "   Visit: https://docs.mongodb.com/manual/installation/"
    echo ""
    echo "   For Ubuntu/Debian: sudo apt install mongodb"
    echo "   For macOS: brew install mongodb-community"
    echo "   For Windows: Download from MongoDB website"
    echo ""
    read -p "   Press Enter after installing and starting MongoDB..."
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create uploads directory if it doesn't exist
mkdir -p uploads

# Check if .env file exists
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Creating environment configuration..."
    cat > .env << EOL
PORT=3000
MONGODB_URI=mongodb://localhost:27017/kala-heritage
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=development
EOL
    echo "✅ Environment file created"
else
    echo "✅ Environment file already exists"
fi

# Seed the database
echo ""
echo "🌱 Seeding database with sample data..."
node seedData.js

if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database. Make sure MongoDB is running."
    echo "   Try: sudo systemctl start mongod (Linux)"
    echo "   Or: brew services start mongodb-community (macOS)"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "🌐 Then open your browser and visit:"
echo "   http://localhost:3000"
echo ""
echo "🔐 Sample login credentials:"
echo "   Artists:"
echo "     meera.devi@example.com / password123 (Madhubani)"
echo "     ravi.bhil@example.com / password123 (Warli)"
echo "     kiran.patel@example.com / password123 (Pithora)"
echo ""
echo "   Users:"
echo "     arjun.sharma@example.com / password123"
echo "     priya.menon@example.com / password123"
echo ""
echo "📚 For more information, check the README.md file"
echo ""
echo "🎨 Welcome to Kala Heritage - Where Tradition Meets Technology!"