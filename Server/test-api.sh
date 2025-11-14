#!/bin/bash

# Test script for Lessons API endpoints
# Run this after starting the server with `npm run dev`

echo "🧪 Testing Lessons API Endpoints"
echo "================================="
echo ""

BASE_URL="http://localhost:3000/api/lessons"

echo "1️⃣ Testing GET /api/lessons (All lessons)"
echo "-------------------------------------------"
curl -s "$BASE_URL" | jq '.success, .data.name, (.data.units | length)' || curl -s "$BASE_URL"
echo ""
echo ""

echo "2️⃣ Testing GET /api/lessons with level filter"
echo "-----------------------------------------------"
curl -s "${BASE_URL}?level=Absolute%20Beginner" | jq '.success, (.data.units | length)' || curl -s "${BASE_URL}?level=Absolute%20Beginner"
echo ""
echo ""

echo "3️⃣ Testing GET /api/lessons/:lessonId (Specific lesson)"
echo "---------------------------------------------------------"
curl -s "$BASE_URL/lesson-alphabet" | jq '.success, .data.phrase' || curl -s "$BASE_URL/lesson-alphabet"
echo ""
echo ""

echo "4️⃣ Testing GET /api/lessons/unit/:unitId (Lessons by unit)"
echo "------------------------------------------------------------"
curl -s "$BASE_URL/unit/unit-1" | jq '.success, .data.title, (.data.lessons | length)' || curl -s "$BASE_URL/unit/unit-1"
echo ""
echo ""

echo "✅ Tests complete!"
echo ""
echo "💡 Tips:"
echo "  - If you see 'Connection refused', make sure the server is running"
echo "  - Start server with: cd Server && npm run dev"
echo "  - Ensure database is seeded: cd Server && npm run db:seed"
