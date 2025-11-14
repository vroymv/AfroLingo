#!/bin/bash

# AfroLingo Server Setup Script
# This script helps set up and start the AfroLingo backend server

set -e  # Exit on error

echo "🚀 AfroLingo Server Setup"
echo "========================="
echo ""

# Check if we're in the Server directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the Server directory."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file. Please update it with your database credentials."
        echo "   Edit .env before continuing!"
        echo ""
        read -p "Press Enter after updating .env to continue..."
    else
        echo "❌ Error: .env.example not found. Please create a .env file manually."
        exit 1
    fi
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Setting up Prisma..."
npm run db:generate

echo ""
echo "📊 Running database migrations..."
echo "⚠️  Make sure your PostgreSQL database is running!"
echo ""

# Check if user wants to run migrations
read -p "Run database migrations now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:migrate
    echo "✅ Database migrations completed"
else
    echo "⏭️  Skipped migrations. Run 'npm run db:migrate' manually when ready."
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Make sure your .env file has correct database credentials"
echo "   2. Start the development server: npm run dev"
echo "   3. Test the health endpoint: curl http://localhost:3000/health"
echo ""
echo "📚 Documentation:"
echo "   - API Docs: docs/USER_API.md"
echo "   - Setup Guide: docs/SERVER_SETUP.md"
echo ""

# Ask if user wants to start the server
read -p "Start the development server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting server on http://localhost:3000"
    echo "   Press Ctrl+C to stop"
    echo ""
    npm run dev
fi
