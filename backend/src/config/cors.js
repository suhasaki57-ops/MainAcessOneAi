const getOrigins = () => {
  const clientUrl = process.env.CLIENT_URL;
  if (!clientUrl) {
    return ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://localhost:5000'];
  }
  if (clientUrl.includes(',')) {
    return clientUrl.split(',').map((url) => url.trim());
  }
  return [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'];
};

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser or same-origin requests (e.g., mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const allowedList = getOrigins();
    if (
      allowedList.includes('*') ||
      allowedList.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.netlify.app') ||
      origin.endsWith('.onrender.com')
    ) {
      return callback(null, true);
    }

    // Default fallback to prevent breaking cross-domain deployments
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

export default corsOptions;

