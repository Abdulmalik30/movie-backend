const allowedOrigins = [
  'http://localhost:5173/*',
  'http://127.0.0.1:5173/*',
  'http://www/yourwebsite.com',
];

module.exports = allowedOrigins;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
