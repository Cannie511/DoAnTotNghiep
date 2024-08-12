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

#####
Pagination - hàm phân trang truyền vào 3 tham số pagination(<tên bảng>, <thuộc tính cần lấy dạng MẢNG, VD: ["email","id"]>, <trang hiện tại>)

#####
Hàm lấy kết quả và kiểm soát lỗi handleResult(<trạng thái api: 200|400>, <message trả về>, <data nếu có, được phép null>) và 
handleError(<object error nằm trong vòng catch(->error)>)
Hướng dẫn sử dụng;
return ở phần service
ví dụ: 
    -> return handleResult(200, "get user successfully", data);
    -> return handleError(error);

#####
hashPassword(<password của user>)
checkPassword(<password của user>, <đoạn password đã hash trong database>)

#####
JWT: createKey(<data của người dùng, không bỏ mật khẩu vào nha ní>)
checkKey(<token của user>)
hàm login đã tự động set cookie cho client nên không cần code thêm.

######
Front-end
Nextjs 14.2
Install package: 
1. cd ./client
2.  npm i
3. npm run dev

######
Peerjs Server:
1. cd ./client
2. peerjs --port 1234 path /peerjs-server