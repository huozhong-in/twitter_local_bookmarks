#!/bin/bash

# 显示帮助信息的函数
show_help() {
    echo "用法: $0 [选项]"
    echo "选项:"
    echo "  -d, --db-path PATH    指定 SQLite 数据库文件路径 (默认: ./sqlite.db)"
    echo "  -p, --port PORT       指定监听端口 (默认: 3000)"
    echo "  -h, --help            显示帮助信息"
    exit 1
}

# 默认参数
DB_PATH="$(pwd)/sqlite.db"
PORT=3315
IMAGE_NAME="candozhou/twitter-local-bookmarks"
IMAGE_TAG="0.0.1"
CONTAINER_NAME="twitter-local-bookmarks"

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -d|--db-path)
            DB_PATH="$2"
            shift 2
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            ;;
        *)
            echo "未知选项: $1"
            show_help
            ;;
    esac
done

# 检查数据库文件目录是否存在，不存在则创建
DB_DIR=$(dirname "$DB_PATH")
if [ ! -d "$DB_DIR" ]; then
    echo "创建数据库目录: $DB_DIR"
    mkdir -p "$DB_DIR"
fi

# 确保数据库文件存在
if [ ! -f "$DB_PATH" ]; then
    echo "数据库文件不存在，将在首次运行时自动创建"
    touch "$DB_PATH"
fi

# 如果容器已存在，先移除
docker rm -f $CONTAINER_NAME 2>/dev/null

echo "正在启动 Twitter Local Bookmarks..."
echo "数据库路径: $DB_PATH"
echo "监听端口: $PORT"

# 运行 Docker 容器
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:$PORT \
    -v "$DB_PATH:/app/sqlite.db" \
    -e PORT=$PORT \
    -e DB_PATH=/app/sqlite.db \
    $IMAGE_NAME:$IMAGE_TAG

if [ $? -eq 0 ]; then
    echo "容器启动成功！"
    echo "应用现在可通过 http://localhost:$PORT 访问"
else
    echo "容器启动失败！"
    exit 1
fi
