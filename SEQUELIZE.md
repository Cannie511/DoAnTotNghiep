###
1. Lệnh cài sequelize-cli: npm i --save sequelize-cli
2. Lệnh tạo Model & Migration: -> npx sequelize-cli model:generate --name <tên bảng> --attributes <tên các thuộc tính VD: name:string,  age:integer>
3. Lệnh chạy file migration: -> npx sequelize-cli db:migrate
4. Lệnh tạo Seeder: -> npx sequelize-cli seed:generate --name <tên file seeder VD: userSeeder>
5. Lệnh chạy Seeder: -> npx sequelize-cli db:seed:all (chạy tất cả seeder)
                    -> npx sequelize-cli db:seed --seed <tên file seeder>