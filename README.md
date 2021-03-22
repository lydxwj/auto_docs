# 自动生成文档

批量把Markdown文件转化成HTML，并且支持浏览器预览，实时更新同步修改

### 开发

```shell
npm start
```

- 自动打开浏览器
- 监听文件变化
- 出现谷歌打开开发者工具之后操作页面卡死时，建议升级浏览器

### 生产

```shell
npm run build
```

### 介绍

#### 目录结构

- asserts：存放静态文件
  - style：本文件夹中的`github-markdown.css`文件是样式必需文件
- build：打包执行的相关代码
- dist：生成文档目录
- src：Markdown文件目录
- template：HTML模板文件目录

**注：**

- 样式文件`github-markdown.css`[下载地址](https://github.com/sindresorhus/github-markdown-css)

- [`generate-github-markdown-css@4.0.0`](https://github.com/sindresorhus/generate-github-markdown-css)不要使用

  ```shell
  # 连接超时
  connect ETIMEDOUT 13.250.177.223:443
  
  # 样式编译报错
  Error: undefined:43:70: missing '{'
  ```

  出现上面两种错误，没有成功过

#### 编译介绍

- 拷贝assets目录以及其下所有文件到dist目录下面
- 把src目录下面的所有Markdown文件转换成HTML
  - index.md编译成主页，自动生成列表（模板html为template/index.html）
  - 除了index.md，编译成列表详情页（模板html为template/detail.html）
- 监听src和assets目录，当文件更新变化后，重新编译，刷新浏览器
  - node@10.13.0
  - 不推荐使用 fs.watchFile效率低，实际使用发现不好用
  - 推荐使用  fs.watch高效，但是listener的 eventType不一定准确（vscode修改文件，返回 change ；Typora修改文件返回的是 rename ）
  - 一次修改会触发多次listener，本项目使用防抖来处理

#### 依赖包介绍

- browser-sync：建立本地服务，浏览器刷新
- chalk：美化打印
- fs-extra：封装node的fs，有方便的api
- marked：Markdown文件转化成HTML

#### [项目地址](https://github.com/lydxwj/auto_docs)

### 结语

本项目提供了Markdown文件转化成HTML解决方案，如有问题欢迎交流！欢迎关注`前端da`公众号！

