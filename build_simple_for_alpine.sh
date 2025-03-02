#!/bin/bash

# 设置输出目录
OUTPUT_DIR="$(pwd)/lib"
TEMP_BUILD_DIR="/tmp/simple-build"
GITHUB_REPO="https://github.com/wangfenjin/simple.git"
BRANCH="master"  # 或者指定其他分支或标签

# 确保输出目录存在
mkdir -p "$OUTPUT_DIR"

echo "=== 开始在Alpine容器中编译libsimple.so ==="
echo "输出目录: $OUTPUT_DIR"

# 运行Alpine容器并在其中编译libsimple
docker run --rm -v "$OUTPUT_DIR:/output" alpine:latest sh -c "
    # 安装必要的构建工具和依赖
    apk update && 
    apk add --no-cache git cmake make gcc g++ libc-dev sqlite-dev curl

    # 创建临时构建目录
    mkdir -p $TEMP_BUILD_DIR
    cd $TEMP_BUILD_DIR
    
    echo '正在克隆simple项目...'
    git clone --depth 1 -b $BRANCH $GITHUB_REPO .
    
    echo '创建build目录...'
    mkdir -p build
    cd build
    
    echo '配置CMake...'
    cmake .. -DCMAKE_BUILD_TYPE=Release
    
    echo '编译项目...'
    make
    
    echo '复制编译结果到输出目录...'
    cp src/libsimple.so /output/
    
    echo '清理临时文件...'
    cd /
    rm -rf $TEMP_BUILD_DIR
"

# 检查编译结果
if [ -f "$OUTPUT_DIR/libsimple.so" ]; then
    echo "=== 编译成功! ==="
    echo "libsimple.so 已保存到: $OUTPUT_DIR/libsimple.so"
    chmod +x "$OUTPUT_DIR/libsimple.so"
else
    echo "=== 编译失败! ==="
    echo "未找到编译后的 libsimple.so 文件"
    exit 1
fi
