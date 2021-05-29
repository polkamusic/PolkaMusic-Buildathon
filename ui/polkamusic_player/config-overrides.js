
module.exports = function override(config, env) {
    //do stuff with the webpack config...
    config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
    });

    return config;
}