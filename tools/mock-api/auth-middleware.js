// Simple authentication middleware for JSON Server
module.exports = (req, res, next) => {
  // Skip authentication for login endpoint and GET /users/:id (for profile)
  if (
    req.method === 'GET' &&
    req.url.startsWith('/users') &&
    req.url.includes('username=')
  ) {
    return next();
  }

  // Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: 'Unauthorized - Missing or invalid token' });
  }

  // In a real app, you would validate the token here
  // For our mock API, we'll just check if it starts with our mock token prefix
  const token = authHeader.split(' ')[1];
  if (!token || !token.startsWith('mock-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }

  // Check permissions for protected routes
  if (req.method !== 'GET' && req.url.startsWith('/users')) {
    // Only allow write operations on users if token contains admin
    // In a real app, you would decode the JWT and check claims
    // This is just a simple simulation
    const isAdmin = true; // Simplified for demo
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: 'Forbidden - Insufficient permissions' });
    }
  }

  // If all checks pass, proceed to the next middleware
  next();
};
