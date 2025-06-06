import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const deepLinkScheme = process.env.DEEP_LINK_SCHEME || 'wtftodaydev';

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// OAuth callback endpoint
app.get('/auth-success', (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error('OAuth error:', error);
    return res.redirect(`${deepLinkScheme}://auth-error?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    console.error('No code received');
    return res.redirect(`${deepLinkScheme}://auth-error?error=no_code`);
  }

  // Redirect to the deep link with the auth code
  res.redirect(`${deepLinkScheme}://auth-success?code=${code}`);
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Auth server running on port ${port}`);
  console.log(`Deep link scheme: ${deepLinkScheme}`);
});