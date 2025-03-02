# 在本地搜索从推特导出的书签
书签是用[twitter-web-exporter](https://github.com/prinsss/twitter-web-exporter) 导出的JSON格式的文件，本项目将它导入到本地的SQLite数据库文件中，以便支持中文全文检索。


## 运行推荐用docker

```bash
./build_docker.sh
./run_docker.sh
```

## 推荐用pnpm开发和直接运行

安装依赖: `pnpm i`
启动开发服务器: `pnpm dev`
构建release文件: `pnpm build`
生产环境中运行: `pnpm start`


## 备忘
支持sqlite3的full_text_search 扩展
https://github.com/wangfenjin/simple