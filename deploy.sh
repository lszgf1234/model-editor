#!/usr/bin/env sh

# 发生错误时终止
set -e

# 构建
npm run build

# 进入构建文件夹
cd dist

# 如果你要部署到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果你要部署在 https://<USERNAME>.github.io  git@github.com:lszgf1234/vite1234.github.io.git
#git push -f git@github.com:lszgf1234/vite1234.github.io.git main

# 如果你要部署在 https://<USERNAME>.github.io/<REPO> https://lszgf1234.github.io/blog
# git@github.com:lszgf1234/modelEditor.git https://lszgf1234.github.io/modelEditor
git push -f git@github.com:lszgf1234/modelEditor.git master:gh-pages

cd -
