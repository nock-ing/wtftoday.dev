# WTF Today Auth Server

A minimal web server that handles GitHub OAuth callbacks for the WTF Today desktop app.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
- `PORT`: The port to run the server on (default: 3000)
- `DEEP_LINK_SCHEME`: Your app's deep link scheme (default: wtftodaydev)
- `NODE_ENV`: Environment (development/production)

## Development

Run the server in development mode:
```bash
npm run dev
```

## Production

1. Build and start the server:
```bash
npm start
```

2. For production deployment, it's recommended to use a process manager like PM2:
```bash
npm install -g pm2
pm2 start src/index.js --name wtftoday-auth
```

## GitHub OAuth Setup

1. Go to GitHub Developer Settings
2. Create a new OAuth App
3. Set the following:
   - Homepage URL: Your server's URL (e.g., https://your-domain.com)
   - Authorization callback URL: https://your-domain.com/auth/callback

## Deployment

You can deploy this server to any hosting service that supports Node.js, such as:
- Coolify
- DigitalOcean
- Heroku
- AWS
- Google Cloud Platform

Make sure to:
1. Set up SSL/TLS for your domain
2. Configure your domain's DNS to point to your server
3. Set up environment variables in your hosting platform
4. Use a process manager like PM2 for production 