import { ApolloServer } from 'apollo-server'
import { ApolloGateway, RemoteGraphQLDataSource  } from '@apollo/gateway';

const forwardHeaders = ["authorization"];

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'esi-character', url: 'http://127.0.0.1:4001' },
        { name: 'esi-corporation', url: 'http://127.0.0.1:4002' },
        { name: 'esi-universe', url: 'http://127.0.0.1:4003' },
		{ name: 'esi-market', url: 'http://127.0.0.1:4004' },
        { name: 'esi-sde', url: 'http://127.0.0.1:4005' },
    ],
    buildService({ name, url }) {
        return new RemoteGraphQLDataSource({
            url,
            willSendRequest<Context>({ request, context }) {
                if (context.headers) {
                    Object.entries(context.headers).forEach(([k, v]) => {
                        if (forwardHeaders.indexOf(k) >= 0) {
                            request.http.headers.set(k, v);
                        }
                    })
                }
            },
        })
    },
});

const server = new ApolloServer({
    gateway,
    introspection: (process.env.APOLLO_INTROSPECTION == '1'),
    playground: (process.env.APOLLO_PLAYGROUND == '1'),
    subscriptions: false,
    debug: false,
    context: ( { req } ) => ({ headers: req.headers }),
})

server
    .listen(4000)
    .then(({ url }) => console.log(`Server ready at ${url}. `))
