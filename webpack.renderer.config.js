const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");
const path = require("path");

rules.push({
    test: /\.css$/,
    use: [
        { loader: "style-loader" },
        {
            loader: "css-loader",
            options: {
                modules: {
                    localIdentName: "[local]-[hash:base64:8]",
                    exportLocalsConvention: "camelCase",
                },
            },
        },
    ],
});

module.exports = {
    target: "electron-renderer",
    module: {
        rules,
    },
    plugins: plugins,
    resolve: {
        extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
        alias: {
            ["@"]: path.resolve(__dirname, "src"),
        }
    },
    node: {
        global: true,
        __dirname: true,
        __filename: true,
    },
};
