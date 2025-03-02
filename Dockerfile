FROM node:20-alpine

# 安装 pnpm（改用 npm 直接安装，避免 corepack 签名验证问题）
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 package.json
COPY package.json ./

# 安装依赖
RUN pnpm install

# 复制项目文件
COPY . .

# 构建应用
RUN pnpm build

# 暴露端口（默认为 3000，可通过环境变量覆盖）
EXPOSE 3000

# 设置数据库存储卷
VOLUME /app

# 设置环境变量
ENV PORT=3000
ENV DB_PATH=/app/sqlite.db

# 启动命令
CMD ["sh", "-c", "PORT=$PORT pnpm start"]
