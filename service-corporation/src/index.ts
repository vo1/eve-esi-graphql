import typeDefs from './Schema'
import { ApolloServer } from 'apollo-server';
import { ESIResolvers, CorporationESI } from './ESI';
import { buildFederatedSchema } from '@apollo/federation';

const server = new ApolloServer({
	schema: buildFederatedSchema([{
		typeDefs,
		resolvers: ESIResolvers
	}]),

	dataSources: () => ({source: new CorporationESI()}),
	introspection: false,
	playground: false,
	debug: true,

	context: ({req}) => ({
        token: req.headers['authorization'],
		ESI: {
			clientId: process.env.ESI_CLIENT_ID,
			clientSecret: process.env.ESI_CLIENT_SECRET,
			scopes: [ 'esi-industry.read_corporation_mining.v1', 'esi-universe.read_structures.v1', 'esi-contracts.read_character_contracts.v1' ],
		}
    }),
});
server
    .listen(process.env.PORT)
    .then(({ url }) => console.log(`Server ready at ${url}. `))
