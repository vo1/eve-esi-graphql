import { ApolloServer } from 'apollo-server'
import { ApolloGateway } from '@apollo/gateway'

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'esi-character', url: 'http://127.0.0.1:4001' },
        { name: 'esi-corporation', url: 'http://127.0.0.1:4002' },
    ],
})

const server = new ApolloServer({
    gateway,
    introspection: true,
    playground: true,
    subscriptions: false,
    debug: true,
})

server
    .listen(4000)
    .then(({ url }) => console.log(`Server ready at ${url}. `))
