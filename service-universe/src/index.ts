import typeDefs from './Schema'
import { ApolloServer } from 'apollo-server';
import { ESIResolvers, UniverseESI } from './ESI';
import { buildFederatedSchema } from '@apollo/federation';

const server = new ApolloServer({
	schema: buildFederatedSchema([{
		typeDefs,
		resolvers: ESIResolvers
	}]),

	dataSources: () => ({source: new UniverseESI()}),
	introspection: false,
	playground: false,

	context: ({req}) => ({
        token: req.headers['authorization'],
		ESI: {
			clientId: process.env.ESI_CLIENT_ID,
			clientSecret: process.env.ESI_CLIENT_SECRET,
			scopes: [ 'esi-universe.read_structures.v1' ],
		}
    }),
});
server
    .listen(process.env.PORT)
    .then(({ url }) => console.log(`Server ready at ${url}. `))
