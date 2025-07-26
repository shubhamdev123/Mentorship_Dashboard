# Deploy to Render

## Quick Setup

1. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/mentorship-dashboard.git
   git push -u origin master
   ```

2. **Go to Render**: https://render.com
   - Sign up with GitHub
   - Click "New +" → "Web Service"
   - Connect your repository

3. **Render will auto-detect** `render.yaml` and create:
   - Web service (your app)
   - PostgreSQL database

4. **Set Environment Variables** in Render dashboard:
   - `EMAIL`: your-gmail@gmail.com
   - `APP_PASS`: your-gmail-app-password

5. **Deploy**: Click "Create Web Service"

Your app will be live at: `https://your-app-name.onrender.com`

## Database
- PostgreSQL database auto-created
- Tables created automatically on first run
- No manual setup needed