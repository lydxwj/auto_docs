const fes = require('fs-extra')
const marked = require('marked')
const path = require('path')
const browserSync = require('browser-sync')
const chalk = require('chalk')
const config = require('./config')
const utils = require('./utils')
const isWatch = process.argv.indexOf('-watch') !== -1;
const isOpen = process.argv.indexOf('-open') !== -1;

// 生成entry对应的html文件
const generateItem = function (entry, watch) {
  const fileName = path.basename(entry, '.md')
  if (fileName === 'index') return
  const file = path.resolve(__dirname, config.entry, entry)
  let content
  if (!fes.pathExistsSync(file)) {
    console.log(chalk.red(`[file not exist] ${file}`))
    return
  } else {
    content = marked(fes.readFileSync(file, 'utf8'))
  }
  const htmlFile = path.resolve(__dirname, config.template, config.itemCof.templateName)
  if (!fes.pathExistsSync(htmlFile)) {
    console.log(chalk.red(`[file not exist] ${htmlFile}`))
    return
  }
  const itemHtmlContent = fes.readFileSync(htmlFile, 'utf8')
  content = itemHtmlContent.replace(/{{content}}/g, content)
  content = content.replace(/{{title}}/g, fileName)
  const outFile = path.resolve(__dirname, config.output, config.itemCof.output, fileName + '.html')
  fes.outputFile(outFile, content, 'utf8').then(() => {
    console.log(chalk.green(fileName + '.html'))
    if (watch && isWatch) {
      browserSync.reload()
    }
  }).catch(err => {
    console.log(chalk.red(err))
  })
}

// 生成list对应的html文件
const generatelist = function (items, watch) {
  let content = ''
  items.forEach(entry => {
    content += `- [${entry}](./${config.itemCof.output}/${entry}.html) \r\n`
  })

  const mdFilePath = path.resolve(__dirname, config.entry, config.indexCof.mdNamed)
  if (!fes.pathExistsSync(mdFilePath)) {
    console.log(chalk.red(`[file not exist] ${mdFilePath}`))
    return
  }
  const mdFile = fes.readFileSync(mdFilePath, 'utf8')
  content = mdFile.replace(/\.\.\//g, './').replace(/{{content}}/g, content)
  content = marked(content)
  const htmlFile = path.resolve(__dirname, config.template, config.indexCof.templateName)
  if (!fes.pathExistsSync(htmlFile)) {
    console.log(chalk.red(`[file not exist] ${htmlFile}`))
    return
  }
  const listHtmlContent = fes.readFileSync(htmlFile, 'utf8')
  content = listHtmlContent.replace(/{{content}}/g, content)
  const outFile = path.resolve(__dirname, config.output, 'index.html')
  fes.outputFile(outFile, content, 'utf8').then(() => {
    console.log(chalk.green('index.html'))
    const filename = outFile.replace(path.extname(outFile), '.html')
    if (watch && isWatch) {
      browserSync.reload()
    } else if (isWatch) {
      browserSync({
        open: isOpen,
        server: path.dirname(outFile),
        index: path.basename(filename),
        notify: false
      })
    }
  }).catch(err => {
    console.log(chalk.red(err))
  })
}
// 生成所有的item对应的html文件
const generateItems = function (watch) {
  const items = []
  const files = fes.readdirSync(`${__dirname}/${config.entry}`)
  files.forEach(file => {
    if (file !== '0000') generateItem(file, watch)
    const fileName = path.basename(file, '.md')
    const indexName = path.basename(config.indexCof.mdNamed, '.md')
    if (fileName !== indexName) items.push(fileName)
  })
  generatelist(items, watch)
}

const copyFileList = function (watch) {
  const entry = path.resolve(__dirname, '../assets')
  const out = path.resolve(__dirname, config.output, 'assets')
  fes.emptyDirSync(out)
  fes.copy(entry, out, (err) => {
    if (err) return console.log(chalk.red(err))
    if (watch && isWatch) browserSync.reload()
    return console.log(chalk.green('copy success'))
  })
}


fes.emptyDirSync(path.resolve(__dirname, config.output))
generateItems()
copyFileList()
if (isWatch) {
  const copyFileListFn = function () {
    copyFileList(true)
  }
  fes.watch(path.resolve(__dirname, '../assets'), {recursive: true}, utils.debounce(copyFileListFn, 200))
  const generateItemsFn = function () {
    generateItems(true)
  }
  fes.watch(path.resolve(__dirname, config.entry), utils.debounce(generateItemsFn, 200))
}
