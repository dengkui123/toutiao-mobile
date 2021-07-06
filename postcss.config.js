module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // rootValue: 37.5,
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*'],

      exclude: 'github-markdown'
      // 忽略文件的内容尺寸转化,依旧返回px
    },
  }
}
