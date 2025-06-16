


// auth-server/index.js
import express from "express";
import bodyParser from "body-parser";
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
 import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());

const SECRET = 'sso-secret';
const PORT = 3000;


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://178.128.43.96:3002",
      "http://178.128.43.96:3000",
      "http://178.128.43.96:3001",
      "http://178.128.43.96:3003",
      "https://b2badmin-portal-stg.voyeglobal.com",
      "http://localhost:3003",
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Fake login page
// 1. Show login form (GET /login)



app.get('/login', (req, res) => {
  const redirectUri = req.query.redirect_uri;
  const token = req.cookies['sso_session'];
  console.log(redirectUri,token
  )
  // If session cookie exists, validate and redirect
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET);
      const newToken = jwt.sign({ email: decoded.email }, SECRET, { expiresIn: '5m' });

      // Auto-redirect to redirect_uri with token
      return res.redirect(`${redirectUri}?token=${newToken}`);
    } catch (e) {
      // If token is invalid/expired, fall through to show login form
    }
  }

  // If no session, show login form
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Login</title>
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        .login-container {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }
        .login-container h2 {
          margin-bottom: 1.5rem;
          text-align: center;
          color: #333;
        }
        .login-container input {
          width: 100%;
          padding: 10px 12px;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .login-container button {
          width: 100%;
          padding: 10px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .login-container button:hover {
          background: #1e40af;
        }
      </style>
    </head>
    <body>
      <div class="login-container">
        <h2>SSO Login</h2>
        <form method="POST" action="/login">
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <input type="hidden" name="redirect_uri" value="${redirectUri}" />
          <button type="submit">Login</button>
        </form>
      </div>
    </body>
    </html>
  `);
});



// Handle login submission
// 2. Handle login form submission (POST /login)

app.post('/login', express.urlencoded({ extended: true }), (req, res) => {
  const { email, password, redirect_uri } = req.body;

  // Dummy login validation
  if (email === 'test@gmail.com' && password === '12345') {
    const token = jwt.sign({ email }, 'sso-secret', { expiresIn: '5m' });

    // Set session cookie
    res.cookie('sso_session', token, {
      httpOnly: true,
      sameSite: 'Lax'
    });

    // Redirect back to client with token
    return res.redirect(`${redirect_uri}?token=${token}`);
  }

  // If login fails
  res.status(401).send('Login failed. Invalid email or password.');
});



app.post('/api/login', express.json(), (req, res) => {
  const { email, password, redirect_uri } = req.body;

  if (email === 'test@gmail.com' && password === '12345') {
    const token = jwt.sign({ email }, SECRET, { expiresIn: '5m' });

    res.cookie('sso_session', token, {
      httpOnly: true,
      sameSite: 'Lax'
    });

    return res.json({
      success: true,
      redirect: `${redirect_uri}?token=${token}`
    });
    //  return res.redirect(`${redirect_uri}?token=${token}`);
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
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

