window.__PULSAR_CONFIG__ = {
    wispUrl: "wss://probuildingsupplies.com/w/",
    wispUrls: [
        "wss://probuildingsupplies.com/w/",
        "wss://stalbansepiscopal.com/wisp/"
    ],

    torUrls: [],
    defaultTransport: "libcurl",
    transports: {
        libcurl: {
            name: "Libcurl [Streaming, Experimental]",
            path: "./libcurl/index.mjs",
            options: "websocket",
            transportOptions: {
                connections: [96, 80, 12],
            },
        },
    },
};
