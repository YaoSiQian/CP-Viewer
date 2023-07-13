# CoreProtect Viewer

用于整理 [CoreProtect](https://spigotmc.org/resources/8631/) 收集的信息。
---
# 使用
1. 下载 CoreProtect，并使用 MySQL 存储数据
2. 将`.env.example`重命名为`.env`并修改其中的 MySQL 信息
3. “三大金刚”
```bash
yarn install
yarn build
yarn prod
```
## 使用 Docker
1. 克隆该项目
2. 修改`docker-compose.yml`中的 MySQL 信息
3. 运行`docker-compose up -d`
