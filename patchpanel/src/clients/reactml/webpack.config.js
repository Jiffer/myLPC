var path = require("path");     //allows to resolve path of application

var DIST_DIR = path.resolve(__dirname, "dist");  
//directory from which app is served
//copy everything which has been prepared for serving into the dist folder (created automatically)

const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

var SRC_DIR = path.resolve(__dirname, "./src/");
var WAV_DIR = path.resolve(__dirname, "./src/app/pages/AudioComponents/");
//tells where to find the untranspiled source code

var config = {
    devtool: 'inline-source-map',
    entry: SRC_DIR + "/app/index.jsx",   //this is the root file (file which starts app)
    output: {
        path: DIST_DIR + "/app",
        filename: "./bundle.js",
        publicPath: "/app/"
        //important for webpack development server -> our public folder
        //in this case, have to tell the webpack folder what would be the place to look (where app lives)
    },

    
    
    devServer: {
        //contentBase: "http://localhost:4000"
        
        proxy: {
            '/api/': {
                target: 'http://localhost:4000',
                /*
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                },
                */
                secure: false
            },

            /*
            '/socket.io': {
                target: 'http://localhost:4000',
                ws: true
            }
            */
            
        }
    },
    
    resolve: {
        extensions: [
        '.webpack.js',
        '.web.js',
        '.tsx',
        '.ts',
        '.js',
        '.jsx',
        '.json',
        '.wav',
        '*',
        ],
    }, 
    node: {
        fs: 'empty'
    },
    // https://github.com/webpack-contrib/css-loader/issues/447

    /*
    resolve: {
        extensions: ['.js', '.jsx', '.tsx', '.ts', '*'],
        
    },
    */
    module: {
        loaders: [
            //only one loader, babel
            {
                test: /\.js?/,  //which files should webpack have a look at regarding this loader
                include: SRC_DIR,  //which folders should you scan for such files
                exclude: [
                    /node_modules/,
                    '/app/server.js',
                ],
                loader: "babel-loader",
                query: {
                    plugins: ['transform-decorators-legacy' ],
                    presets: ["react", "es2015", "stage-2"]
                }
            }, {
                test: /\.(wav)$/,
                include: WAV_DIR, 
                loader: "file-loader",
                
            }, {
                test: /\.css$/,
                loaders: ["style-loader", "css-loader"]
            }, {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            }, {
                test: /\.ts$/,
                exclude: '/app/server.ts'
            }
        ]
    },

    plugins: [
        new TsConfigPathsPlugin(/* { tsconfig, compiler } */),
    ],
};
//holds webpack configuration


module.exports = config;
// webpack will pull in the config object and configure itself accordingly