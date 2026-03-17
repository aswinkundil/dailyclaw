/**
 * Basic HTTP Authentication middleware.
 * Reads credentials from environment variables AUTH_USER and AUTH_PASS.
 */
function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="DailyClaw"');
    return res.status(401).json({ error: 'Authentication required' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  const validUser = process.env.AUTH_USER || 'admin';
  const validPass = process.env.AUTH_PASS || 'planner123';

  if (username === validUser && password === validPass) {
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="DailyClaw"');
  return res.status(401).json({ error: 'Invalid credentials' });
}

module.exports = basicAuth;
