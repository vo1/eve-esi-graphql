import { ApolloServer } from 'apollo-server'
import { ApolloGateway, RemoteGraphQLDataSource  } from '@apollo/gateway';

const forwardHeaders = ["authorization"];

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'esi-character', url: 'http://127.0.0.1:4001' },
        { name: 'esi-corporation', url: 'http://127.0.0.1:4002' },
        { name: 'esi-universe', url: 'http://127.0.0.1:4003' },
		{ name: 'esi-market', url: 'http://127.0.0.1:4004' },
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
    introspection: true,
    playground: true,
    subscriptions: false,
    debug: true,
    context: ( { req } ) => ({ headers: req.headers }),
})

server
    .listen(4000)
    .then(({ url }) => console.log(`Server ready at ${url}. `))
