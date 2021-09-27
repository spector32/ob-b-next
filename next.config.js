module.exports = {
    publicRuntimeConfig: {
        apiUrl: process.env.API_URL,
    },
    serverRuntimeConfig: {
        // Will only be available on the server side
        apiSessionSecret: process.env.API_SESSION_SECRET,
        sessionExpirationDuration: process.env.API_SESSION_EXPIRATION_DURATION,
    },
    webpack(config, options) {
        const { isServer } = options;
        // Webpack configuration to resolve audio file import
        config.module.rules.push({
            test: /\.(ogg|mp3|wav|mpe?g)$/i,
            exclude: config.exclude,
            use: [
                {
                    loader: require.resolve("file-loader"),
                    options: {
                        limit: config.inlineImageLimit,
                        fallback: require.resolve("file-loader"),
                        publicPath: `/_next/static/audio/`,
                        outputPath: `${isServer ? "../" : ""}static/audio/`,
                        name: "[name]-[hash].[ext]",
                        esModule: config.esModule || false,
                    },
                },
            ],
        });

        return config;
    },
};
