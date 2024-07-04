const cors = require('cors')

const cors_config = cors({
  origin: ["http://localhost:3000", "http://192.168.1.172"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
  

module.exports = cors_config;
