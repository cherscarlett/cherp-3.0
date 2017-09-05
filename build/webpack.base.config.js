const webpack = require('webpack')
const S3 = require('webpack-s3-plugin')
const ExtractText = require("extract-text-webpack-plugin")
const dotenv = require('dotenv')
const SpriteLoader = require('svg-sprite-loader/plugin')

dotenv.config()

const extractSass = new ExtractText({
                      publicPath: `https://${process.env.BUCKETEER_BUCKET_NAME}.s3.amazonaws.com/public/`,
                      filename: "public/[name].css"
                    })

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
          test: /\.(png|jpg|json|gif)$/,
          use: [
            { loader: 'file-loader',
              options: {
                publicPath: `https://${process.env.BUCKETEER_BUCKET_NAME}.s3.amazonaws.com/`,
                name: 'public/[name].[ext]'
              }
            }
          ]
      },
      {
          test: /\.svg$/,
          use: [
            { loader: 'svg-sprite-loader',
              options: {
                extract: true,
                publicPath: `https://${process.env.BUCKETEER_BUCKET_NAME}.s3.amazonaws.com/`,
                spriteFilename: 'public/sprite.svg'
              }
            },
            'svg-fill-loader'
          ]
      },
      {
          test: /\.scss$/,
          use: extractSass.extract({
              use: [
                  "css-loader", "svg-fill-loader/encodeSharp","sass-loader"
              ]
          })
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
},
  plugins: [
      new S3({
          include: /.*\.(css|js|svg|png|jpg)/,
          s3Options: {
            accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
            region: 'us-east-1'
          },
          s3UploadOptions: {
            Bucket: `${process.env.BUCKETEER_BUCKET_NAME}`
          }
      }),
      extractSass,
      new SpriteLoader(),
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
