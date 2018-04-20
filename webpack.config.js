/*
 global module,
 require,
 __dirname
 */

module.exports = {
  entry:     [
    './examples/app.js'
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
