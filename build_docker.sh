#!/bin/bash

# 设置镜像名称和标签
IMAGE_NAME="twitter-local-bookmarks"
IMAGE_TAG="latest"

echo "构建 Docker 镜像: ${IMAGE_NAME}:${IMAGE_TAG}"

# 构建 Docker 镜像
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

if [ $? -eq 0 ]; then
    echo "镜像构建成功！"
    echo "可以使用以下命令运行: ./run_docker.sh"
else
    echo "镜像构建失败！"
    exit 1
fi
