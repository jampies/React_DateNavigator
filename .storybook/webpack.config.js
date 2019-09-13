module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          { loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true
            }
          },
          {
            loader: 'sass-loader?outputStyle=expanded&sourceMap',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          { loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          }
        ]
      }
    ]
  }
};
