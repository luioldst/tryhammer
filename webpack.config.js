/**
 * Webpack configuration.
 */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano'); // https://cssnano.co/
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

// JS Directory path.
const JS_DIR = path.resolve(__dirname, 'src/js');
const SCSS_DIR = path.resolve(__dirname, 'src/scss');
const BUILD_DIR = path.resolve(__dirname, 'build');
const entry = {
    main: JS_DIR + '/main.js',
    scss: SCSS_DIR + '/style.scss',
};

// const entry = [
//     JS_DIR + '/main.js',
//     JS_DIR + '/home-navigation.js',
//     SCSS_DIR + '/style.scss',
// ];

const output = {
    path: BUILD_DIR,
    filename: 'js/[name].js'
};
/**
 * Note: argv.mode will return 'development' or 'production'.
 */
const plugins = (argv) => [
    new CleanWebpackPlugin({
        cleanStaleWebpackAssets: (argv.mode === 'production') // Automatically remove all unused webpack assets on rebuild, when set to true in production. ( https://www.npmjs.com/package/clean-webpack-plugin#options-and-defaults-optional )
    }),
    new VueLoaderPlugin(),
    // new MiniCssExtractPlugin({
    //     filename: 'style.css'
    // }),
];
const rules = [
    {
        test: /\.js$/,
        include: [JS_DIR],
        exclude: /node_modules/,
        use: 'babel-loader'
    },
    {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'file-loader',
                options: { outputPath: '/', name: '[name].css' }
            },
            'sass-loader'
        ]
    },
    { test: /\.vue$/, use: 'vue-loader' },
    { test: /\.css$/, use: ['vue-style-loader'] },
    {
        // Match woff2 and patterns like .woff?v=1.1.1.
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        use: {
            loader: "file-loader",
            options: {
                limit: 50000,
                mimetype: "application/font-woff",
                name: "./fonts/[name].[ext]", // Output below ./fonts
                publicPath: "../", // Take the directory into account
            },
        },
    },
];
/**
 * Since you may have to disambiguate in your webpack.config.js between development and production builds,
 * you can export a function from your webpack configuration instead of exporting an object
 *
 * @param {string} env environment ( See the environment options CLI documentation for syntax examples. https://webpack.js.org/api/cli/#environment-options )
 * @param argv options map ( This describes the options passed to webpack, with keys such as output-filename and optimize-minimize )
 * @return {{output: *, devtool: string, entry: *, optimization: {minimizer: [*, *]}, plugins: *, module: {rules: *}, externals: {jquery: string}}}
 *
 * @see https://webpack.js.org/configuration/configuration-types/#exporting-a-function
 */
module.exports = (env, argv) => ({
    entry: entry,
    output: output,
    /**
     * A full SourceMap is emitted as a separate file ( e.g.  main.js.map )
     * It adds a reference comment to the bundle so development tools know where to find it.
     * set this to false if you don't need it
     */
    devtool: 'source-map',
    module: {
        rules: rules,
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: false,
                parallel: true,
                sourceMap: false
            }),
            // new CssMinimizerPlugin(),
        ]
    },
    plugins: plugins(argv),
    externals: {
        // jquery: 'jQuery'
    },

});