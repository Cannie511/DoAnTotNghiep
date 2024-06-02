###
INSTALLATION:
npm install

ROUTING:
Domain: localhost
Port: 8888 or 5000
Protocol: http:
Default Route: http://localhost:8888/ (có xác thực, yêu cầu đăng nhập)

Xác thực (Authentication Middleware)
B1: truy cập route /auth/login truyền 2 tham số vào body gồm {username, password}
B2: server set cookie (client không cần làm) sau đó gọi các api khác như bình thường