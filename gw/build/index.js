"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const gateway_1 = require("@apollo/gateway");
const gateway = new gateway_1.ApolloGateway({
    serviceList: [
        { name: 'esi-character', url: 'http://127.0.0.1:4001' },
        { name: 'esi-corporation', url: 'http://127.0.0.1:4002' },
    ],
});
const server = new apollo_server_1.ApolloServer({
    gateway,
    introspection: true,
    playground: true,
    subscriptions: false,
    debug: true,
});
server
    .listen(4000)
    .then(({ url }) => console.log(`Server ready at ${url}. `));
