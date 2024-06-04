const cors = require('cors')

const cors_config = cors({
  origin: "*", // hoặc đặt địa chỉ frontend cụ thể nếu bạn muốn bảo mật hơn
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
  

module.exports = cors_config;
