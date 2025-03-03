# 构建阶段
FROM node:20-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package.json pnpm-lock.yaml* ./

# 首先安装所有依赖（Remix 构建需要开发依赖）
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 安装生产依赖（清理开发依赖）
RUN rm -rf node_modules
RUN pnpm install --frozen-lockfile --prod

# 运行阶段
FROM node:20-alpine

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PORT=3000
ENV DB_PATH=/app/sqlite.db
ENV NODE_ENV=production

# 复制 package.json（启动需要）
COPY --from=builder /app/package.json ./

# 复制生产依赖
COPY --from=builder /app/node_modules ./node_modules

# 复制lib目录
COPY --from=builder /app/lib ./lib

# 复制 Remix 构建输出
COPY --from=builder /app/build ./build

# 设置数据库存储卷
VOLUME /app

# 暴露端口
EXPOSE 3000

# 启动命令（使用 Remix 的启动方式）
CMD ["sh", "-c", "PORT=$PORT pnpm start"]