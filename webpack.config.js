/*
 global module,
 require,
 __dirname
 */

module.exports = {
  entry:     [
    './examples/main.js'
  ],
  output:    {
    path:       __dirname + '/examples/build',
    publicPath: '/build/',
    filename:   'app.js'
  },
  devServer: {
    contentBase: './examples'
  },
  module:    {
    rules: [
      /*
       {
       test:    /\.js$/,
       exclude: /node_modules/,
       use:     [ 'babel-loader' ]
       },
       */
      {
        test:    /\.vue$/,
        exclude: /node_modules/,
        use:     [ 'vue-loader' ]
      },
      {
        test: /\.css$/,
        use:  [ 'css-loader' ]
      },
      {
        exclude: [ /\.js$/, /\.html$/, /\.css$/, /\.vue$/ ],
        use:     [ 'file-loader' ]
      }
    ]
  },
  resolve:   {
    extensions: [ '*', '.js', '.vue' ],
    alias:      {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
};
