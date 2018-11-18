const path = require('path')

const glob = require('glob')
const webpack = require('webpack')
const merge = require('webpack-merge')
/* const HtmlPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin') */
const ManifestPlugin = require('webpack-manifest-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const { StatsWriterPlugin } = require('webpack-stats-plugin')

const parts = require('./webpack.parts')

const lintJSOptions = {
  emitWarning: true,
  // Fail only on errors
  failOnWarning: false,
  failOnError: true,

  // Toggle autofix
  fix: true,
  cache: true,

  formatter: require('eslint-friendly-formatter')
}
getPaths({ staticDir: 'some-name' })
/*
  To move all assets to some static folder
  getPaths({ staticDir: 'some-name' })

  To rename asset build folder
  getPaths({ js: 'some-name' })

  To move assets to the root build folder
  getPaths({ css: '' })

  Defaults values:
     sourceDir - 'app',
      buildDir - 'build',
     staticDir - '',

        images - 'images',
         fonts - 'fonts',
           css - 'styles',
            js - 'scripts'
*/
const paths = getPaths()

/* const lintStylesOptions = {
  context: path.resolve(__dirname, `${paths.app}/styles`),
  syntax: 'scss',
  emitErrors: false
  // fix: true,
} */

const cssPreprocessorLoader = { loader: 'fast-sass-loader' }
const opt = {pretty: true, basedir: path.resolve(__dirname, 'app/includes')}
const commonConfig = merge([
  {
    context: paths.app,
    resolve: {
      unsafeCache: true,
      symlinks: false,
      alias: {
        images: path.resolve(__dirname, 'app/images/'),
        scripts: path.resolve(__dirname, 'app/scripts/'),
        styles: path.resolve(__dirname, 'app/styles/'),
        fonts: path.resolve(__dirname, 'app/fonts/')
        // Templates: path.resolve(__dirname, 'src/templates/')
      }
    },
    entry: `${paths.app}/scripts`,
    output: {
      path: paths.build,
      publicPath: parts.publicPath
    },
    stats: {
      warningsFilter: warning => warning.includes('entrypoint size limit'),
      children: false,
      modules: false
    },
    /* plugins: [
      new HtmlPlugin({
        template: './index.pug'
      }),
      new FriendlyErrorsPlugin(),
      new StylelintPlugin(lintStylesOptions)
    ], */
    module: {
      noParse: /\.min\.js/
    }
  },
  parts.loadPug(opt),
  parts.lintJS({ include: paths.app, options: lintJSOptions }),
  parts.loadFonts({
    include: paths.app,
    options: {
      name: `${paths.fonts}/[name].[ext]`
    }
  })
])

const pages = [
  parts.page({
    title: 'Home',
    entry: {
      home: paths.app
    },
    template: path.join(paths.app, 'index.pug'),

    // An array of chunks to include in the page
    chunks: ['home', 'runtime', 'vendors']
  }),
  parts.page({
    title: 'About',
    path: 'about',
    entry: {
      about: path.join(paths.app, 'about')
    },
    template: path.join(paths.app, 'about/about.pug'),

    chunks: ['about', 'runtime', 'vendors']
  }),
  parts.page({
    title: 'catalog',
    path: 'catalog',
    entry: {
      catalog: path.join(paths.app, 'catalog')
    },
    template: path.join(paths.app, 'catalog/catalog.pug'),

    chunks: ['catalog', 'runtime', 'assets', 'vendors']
  }),
  parts.page({
    title: 'pervaporation',
    path: 'pervaporation',
    entry: {
      pervaporation: path.join(paths.app, 'pervaporation')
    },
    template: path.join(paths.app, 'pervaporation/pervaporation.pug'),

    chunks: ['pervaporation', 'runtime', 'assets', 'vendors']
  }),
  parts.page({
    title: 'membrans',
    path: 'membrans',
    entry: {
      membrans: path.join(paths.app, 'membrans')
    },
    template: path.join(paths.app, 'membrans/membrans.pug'),

    chunks: ['membrans', 'runtime', 'assets', 'vendors']
  }),
  parts.page({
    title: 'Modules',
    path: 'membrans/modules',
    entry: {
      modules: path.join(paths.app, 'membrans/modules')
    },
    template: path.join(paths.app, 'membrans/modules/modules.pug'),

    chunks: ['modules', 'runtime', 'vendors']
  }),
  parts.page({
    title: 'Material',
    path: 'membrans/material',
    entry: {
      material: path.join(paths.app, 'membrans/material')
    },
    template: path.join(paths.app, 'membrans/material/material.pug'),

    chunks: ['material', 'runtime', 'vendors']
  }),
  parts.page({
    title: 'Industrial',
    path: 'catalog/industrial',
    entry: {
      industrial: path.join(paths.app, 'catalog/industrial')
    },
    template: path.join(paths.app, 'catalog/industrial/industrial.pug'),

    chunks: ['industrial', 'runtime', 'vendors']
  }),
  parts.page({
    title: 'Modular',
    path: 'catalog/modular',
    entry: {
      modular: path.join(paths.app, 'catalog/modular')
    },
    template: path.join(paths.app, 'catalog/modular/modular.pug'),

    chunks: ['modular', 'runtime', 'vendors']
  }),
  parts.page({
    title: 'Labscale',
    path: 'catalog/labscale',
    entry: {
      labscale: path.join(paths.app, 'catalog/labscale')
    },
    template: path.join(paths.app, 'catalog/labscale/labscale.pug'),

    chunks: ['labscale', 'runtime', 'vendors']
  }),
  parts.page({
    title: 'Filters',
    path: 'catalog/filters',
    entry: {
      filters: path.join(paths.app, 'catalog/filters')
    },
    template: path.join(paths.app, 'catalog/filters/filters.pug'),

    chunks: ['filters', 'runtime', 'vendors']
  }),
  parts.page({
    title: 'Contacts',
    path: 'contacts',
    entry: {
      contacts: path.join(paths.app, 'contacts')
    },
    template: path.join(paths.app, 'contacts/contacts.pug'),

    chunks: ['contacts', 'runtime', 'assets', 'vendors']
  })
]

const productionConfig = merge([
  {
    mode: 'production',
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: 'single'
    },
    output: {
      chunkFilename: `${paths.js}/[name].js`,
      filename: `${paths.js}/[name].js`
    },
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 100000, // in bytes
      maxAssetSize: 450000 // in bytes
    },
    plugins: [
      new StatsWriterPlugin({ fields: null, filename: '../stats.json' }),
      new webpack.HashedModuleIdsPlugin(),
      new ManifestPlugin(),
      new CleanPlugin(paths.build)
    ]
  },
  parts.minifyJS({
    terserOptions: {
      parse: {
        // we want terser to parse ecma 8 code. However, we don't want it
        // to apply any minfication steps that turns valid ecma 5 code
        // into invalid ecma 5 code. This is why the 'compress' and 'output'
        // sections only apply transformations that are ecma 5 safe
        // https://github.com/facebook/create-react-app/pull/4234
        ecma: 8
      },
      compress: {
        ecma: 5,
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebook/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false
      },
      mangle: {
        safari10: true
      },
      output: {
        ecma: 5,
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebook/create-react-app/issues/2488
        ascii_only: true
      }
    },
    // Use multi-process parallel running to improve the build speed
    // Default number of concurrent runs: os.cpus().length - 1
    parallel: true,
    // Enable file caching
    cache: true
  }),
  parts.loadJS({
    include: paths.app,
    options: {
      cacheDirectory: true
    }
  }),
  parts.extractCSS({
    include: paths.app,
    use: [parts.autoprefix(), cssPreprocessorLoader],
    options: {
      filename: `${paths.css}/[name].css`,
      chunkFilename: `${paths.css}/[id].css`
    }
  }),
  parts.purifyCSS({
    paths: glob.sync(`${paths.app}/**/*.+(pug|js)`, { nodir: true }),
    styleExtensions: ['.css', '.scss']
  }),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true
      }
    }
  }),
  parts.loadImages({
    include: paths.app,
    options: {
      limit: 15000,
      name: `${paths.images}/[name].[ext]`
    }
  }),
  // should go after loading images
  parts.optimizeImages()
])

const developmentConfig = merge([
  {
    mode: 'development'
  },
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.loadCSS({ include: paths.app, use: [cssPreprocessorLoader] }),
  parts.loadImages({ include: paths.app }),
  parts.loadJS({ include: paths.app })
])

/* module.exports = env => {
  process.env.NODE_ENV = env

  return merge(
    commonConfig,
    env === 'production' ? productionConfig : developmentConfig
  )
} */

module.exports = env => {
  process.env.NODE_ENV = env

  const config = env === 'production'
    ? productionConfig
    : developmentConfig

  // 3. Merge these pages into the final config
  return merge([commonConfig, config].concat(pages));
}

function getPaths ({
  sourceDir = 'app',
  buildDir = 'build',
  staticDir = '',
  images = 'images',
  fonts = 'fonts',
  js = 'scripts',
  css = 'styles'
} = {}) {
  const assets = { images, fonts, js, css }

  return Object.keys(assets).reduce((obj, assetName) => {
    const assetPath = assets[assetName]

    obj[assetName] = !staticDir ? assetPath : `${staticDir}/${assetPath}`

    return obj
  }, {
    app: path.join(__dirname, sourceDir),
    build: path.join(__dirname, buildDir),
    staticDir
  })
}
