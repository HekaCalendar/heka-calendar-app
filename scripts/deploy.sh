#!/bin/bash
# HEKA Calendar Deployment Script
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 HEKA Calendar Deployment"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Check for icons
echo "🔍 Checking icons..."
if [ ! -f "public/icon-72.png" ]; then
    echo -e "${YELLOW}⚠️  Missing icon sizes. Generating...${NC}"
    node scripts/generate-icons.js
else
    echo -e "${GREEN}✅ Icons ready${NC}"
fi

# Build the project
echo ""
echo "🔨 Building project..."
npm run build

# Check build output
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed - no dist2 folder found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

# Deploy to Vercel
echo ""
echo "📤 Deploying to Vercel..."
echo ""

if [ "$1" == "--prod" ]; then
    echo -e "${YELLOW}🚀 Production deployment${NC}"
    vercel --prod
else
    echo -e "${YELLOW}🧪 Preview deployment${NC}"
    echo "Use --prod flag for production"
    vercel
fi

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Test the deployed URL"
echo "2. Run Lighthouse audit"
echo "3. Test PWA installation"
echo ""
