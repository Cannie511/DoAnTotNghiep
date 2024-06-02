###
Cách đặt tên BIẾN và HÀM: yêu cầu ENGLISH
File .env đặt các biến nên có ý nghĩa
Biến và hàm theo quy tắc con lạc đà: getListUser() hoặc getAllUser()
Database nên tạo giống tên trong folder ./src/Database/db.connect.js
YÊU CẦU:
 -> arrow function theo type ES6
 -> đi theo flow đã chia source, từ route api -> controller -> service
 -> folder utils là nơi chứa các function dùng để gọi trong toàn bộ src code

KHÔNG: 
    -> Chỉnh sửa các config đã cài đặt -> lỗi = cook.
    -> File .env không đổi luôn (thêm mới thì được)
    -> File db.connect.js không được chỉnh sửa