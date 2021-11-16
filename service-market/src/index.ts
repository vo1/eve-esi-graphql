import typeDefs from './Schema'
import { ApolloServer } from 'apollo-server';
import { ESIResolvers, MarketESI } from './ESI';
import { buildFederatedSchema } from '@apollo/federation';

const server = new ApolloServer({
	schema: buildFederatedSchema([{
		typeDefs,
		resolvers: ESIResolvers
	}]),

	dataSources: () => ({source: new MarketESI()}),
	introspection: false,
	playground: false,

	context: ({req}) => ({
        token: req.headers['authorization'],
		ESI: {
			clientId: process.env.ESI_CLIENT_ID,
			clientSecret: process.env.ESI_CLIENT_SECRET,
			scopes: [ ],
		}
    }),
});
server
    .listen(process.env.PORT)
    .then(({ url }) => console.log(`Server ready at ${url}. `))
