# TODO: Deploy Eris-AI Project

## Setup Accounts and Services
- [ ] Create MongoDB Atlas account and cluster
- [ ] Create Render account for backend deployment
- [ ] Create Netlify account for frontend deployment

## Backend Deployment (Render)
- [ ] Push code to GitHub repository
- [ ] Connect GitHub repo to Render
- [ ] Set environment variables: MONGO_URI, JWT_SECRET, PORT=5000
- [ ] Deploy backend and note the URL (e.g., https://eris-ai-backend.onrender.com)

## Frontend Deployment (Netlify)
- [x] Update client code to use environment variable for API base URL
- [ ] Build and deploy frontend to Netlify
- [ ] Set build command: npm run build
- [ ] Set publish directory: dist
- [ ] Set environment variable: VITE_API_BASE_URL to Render backend URL
- [ ] Deploy and note the frontend URL

## Testing
- [ ] Test login functionality
- [ ] Test chat saving and retrieval
- [ ] Test chat deletion
- [ ] Verify database connections
