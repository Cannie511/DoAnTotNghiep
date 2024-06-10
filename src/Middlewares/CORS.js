const cors = require('cors')

const cors_config = cors({
  origin: "http://localhost:3000", // hoặc đặt địa chỉ frontend cụ thể nếu bạn muốn bảo mật hơn
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
  

module.exports = cors_config;
