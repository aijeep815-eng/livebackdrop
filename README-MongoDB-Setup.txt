MongoDB Atlas 快速入门（用于 LiveBackdrop 登录系统）
1) 打开 https://www.mongodb.com/atlas  注册并登录。
2) 新建 Project → Build a Database → 选择免费 Free Shared（M0）。
3) 选择 AWS / 最近地区（美国西部更快）。
4) 创建数据库用户（Database User），记录用户名与密码。
5) 在 Network Access 添加 IP 白名单：先用 0.0.0.0/0（开发期方便）。
6) 进入 Connect → 选择 "Drivers"，复制连接字符串：
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
7) 在本地项目根目录创建 .env.local 文件，粘贴：
   MONGODB_URI=（上面的连接串加上数据库名，如 ...mongodb.net/livebackdrop）
   NEXTAUTH_SECRET=任意随机长字符串（如用 openssl rand -base64 32 生成）
   NEXTAUTH_URL=http://localhost:3000
8) 安装依赖并运行：
   npm install next-auth mongoose bcryptjs
   npm run dev

常见问题：
- 如果登录报错 "Missing MONGODB_URI"，说明 .env.local 没设置或没有重启 dev 服务器。
- 如果注册提示 Email already registered，说明该邮箱已存在于数据库。
