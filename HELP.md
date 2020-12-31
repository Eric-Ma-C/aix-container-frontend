# Getting Started

## 部署步骤
### 1.本地编译
在本地编译出dist文件夹，上传至github

### 2.部署
##### 207 beta测试
进入`/nfs2/aix-container/web_vue_frontend/aix-container-frontend/`目录,从git拉取最新编译好的文件,运行
```shell script
dock run -p 8080:80 -d --name aix-vue-frontend-beta --restart=always \
-v /nfs2/aix-container/web_vue_frontend/aix-container-frontend/dist/:/usr/share/nginx/html/ \
-v /nfs2/aix-container/web_vue_frontend/aix-container-frontend/nginx-beta.conf:/etc/nginx/nginx.conf  \
nginx:latest
```

##### 205 alpha测试
进入`/nfs/aix-container/web_vue_frontend/aix-container-frontend/`目录,从git拉取最新编译好的文件,运行
```shell script
dock run -p 8090:80 -d --name aix-vue-frontend-alpha --restart=always \
-v /nfs/aix-container/web_vue_frontend/aix-container-frontend/dist/:/usr/share/nginx/html/ \
-v /nfs/aix-container/web_vue_frontend/aix-container-frontend/nginx-alpha.conf:/etc/nginx/nginx.conf  \
nginx:latest
```
