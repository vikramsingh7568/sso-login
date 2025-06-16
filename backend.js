

// auth-server/index.js
import express from "express";
import bodyParser from "body-parser";
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express();

app.use(express.json());
app.use(cookieParser());

const SECRET = 'sso-secret';
const PORT = 3000;

// Fake login page
// 1. Show login form (GET /login)
app.get('/login', (req, res) => {
  const redirectUri = req.query.redirect_uri;
  // Show login form (in real app, render HTML)
  res.send(`
    <form method="POST" action="/login">
      <input name="email" placeholder="Email"/>
      <input name="password" placeholder="Password"/>
      <input type="hidden" name="redirect_uri" value="${redirectUri}"/>
      <button type="submit">Login</button>
    </form>
  `);
});

// Handle login submission
// 2. Handle login form submission (POST /login)
app.post('/login', express.urlencoded({ extended: true }), (req, res) => {
  const { email, password, redirect_uri } = req.body;
  console.log('redirect token is here',email, password, redirect_uri);

  // Dummy user check
  if (email === 'user@example.com' && password === '1234') {
    const token = jwt.sign({ email }, SECRET, { expiresIn: '5m' });

    // Set cookie for session (only on auth.com)
    res.cookie('sso_session', token, {
      httpOnly: true,
      sameSite: 'Lax'
    });

    // Redirect to original site with token
    return res.redirect(`${redirect_uri}?token=${token}`);
  }

  res.send('Login failed');
});

// Called by other sites to check login status
// 3. Authorize endpoint (GET /authorize)
// Called by client apps to check if user has valid SSO session cookie
app.get('/authorize', (req, res) => {
  const token = req.cookies['sso_session'];
  console.log('authorize token here',token)
  const redirectUri = req.query.redirect_uri;

   // If no valid session cookie, redirect to login page on auth server
  if (!token) return res.redirect(`/login?redirect_uri=${redirectUri}`);

  try {
     // Verify token, issue a fresh token for client redirect
    const decoded = jwt.verify(token, SECRET);
    // If session is valid, redirect with new token
      // Redirect back to client with fresh token
    const newToken = jwt.sign({ email: decoded.email }, SECRET, { expiresIn: '5m' });
    res.redirect(`${redirectUri}?token=${newToken}`);
  } catch (e) {
    // Invalid session
      // If token invalid or expired, redirect to login
    return res.redirect(`/login?redirect_uri=${redirectUri}`);
  }
});



// auth-server/index.js (add logout endpoint)
// 4. Logout endpoint (POST /logout)
// Clears the sso_session cookie to invalidate the session on auth server
app.post('/logout', (req, res) => {
  // Clear cookie
  res.clearCookie('sso_session', { httpOnly: true, sameSite: 'Lax' });
  res.sendStatus(200);
});
// Hardcoded frontend URLs example (not dynamic)
// 5. Logout redirect page (GET /logout)
// When user logs out, this page loads hidden iframes to trigger logout on all registered client apps
app.get('/logout', (req, res) => {
  // If you want to hardcode, replace here:
  const uris = [
    'http://localhost:5173',
    'http://localhost:5174'
  ];

  let html = '<html><body><h2>Logging out from all apps...</h2>';
  uris.forEach((uri) => {
    html += `<iframe src="${uri}?logout=true" style="display:none;"></iframe>`;
  });
  html += `<script>setTimeout(()=>{window.location.href="${uris[0]}";},3000)</script>`;
  html += '</body></html>';

  res.send(html);
});


app.listen(PORT, () => {
  console.log(`Auth Server running at http://localhost:${PORT}`);
});

