const $glob = require("glob");
const $path = require("path");
const $file = require("fs");

/**
 * C端构建 - 获取多文件入口配置
 * URL路径由文件目录决定
 *
 * eg:  /Users/work/fellow-front-end/src/pages/demo
 * 则:  project=demo
 *      URL为: https://${path}/demo.html
 *      js命名可以为: {project}.js | index.js[推荐]
 *      html命名约束: {project}.html | index.html[推荐]
 */

module.exports = function (targetProject = "*") {
  const ROOT_PATH = $path.resolve(__dirname, "../src/pages");
  const entryDir = $glob.sync(`${ROOT_PATH}/${targetProject}`);

  const pages = {};

  for (const filePath of entryDir) {
    // 不是文件夹
    if (!$file.statSync(filePath).isDirectory()) {
      continue;
    }

    const project = filePath.replace(/.*\//g, "");
    const jsList = [`${filePath}/${project}.js`, `${filePath}/index.js`];
    const htmlList = [`${filePath}/${project}.html`, `${filePath}/index.html`];

    let jsFile = null;
    let htmlFile = null;

    for (const js of jsList) {
      if ($file.existsSync(js)) {
        jsFile = js;
        break;
      }
    }

    for (const html of htmlList) {
      if ($file.existsSync(html)) {
        htmlFile = html;
        break;
      }
    }

    if (!htmlFile || !jsFile) {
      console.warn(`没有触发构建: ${project}`);
      console.warn(`Html File: ${htmlFile}`);
      console.warn(`JS File: ${jsFile}`);
      continue;
    }

    pages[project] = {
      // page 的入口
      entry: jsFile,
      // 模板来源
      template: htmlFile,
      // 在 dist/client/landing.html 的输出
      filename: `${project}.html`,
      // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", project],
    };
  }
  return pages;
};
