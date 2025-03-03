# 在本地搜索从推特导出的书签
书签是用[twitter-web-exporter](https://github.com/prinsss/twitter-web-exporter) 导出的JSON格式的文件，本项目将它导入到本地的SQLite数据库文件中，以便支持中文全文检索。


## 运行推荐用docker

### 方式一：本地构建镜像

```bash
./build_docker.sh
./run_docker.sh
```

### 方式二：直接拉取镜像

查看[Docker Hub](https://hub.docker.com/r/candozhou/twitter-local-bookmarks)上的说明


## 用pnpm启动开发环境

安装依赖: `pnpm i`

开发环境: `pnpm dev`

编译构建: `pnpm build`

生产环境: `pnpm start`
