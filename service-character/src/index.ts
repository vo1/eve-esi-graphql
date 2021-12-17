import typeDefs from './Schema'
import { ApolloServer } from 'apollo-server';
import { ESIResolvers, CharacterESI } from './ESI';
import { buildFederatedSchema } from '@apollo/federation';

const server = new ApolloServer({
	schema: buildFederatedSchema([{
			typeDefs,
			resolvers: ESIResolvers
	}]),

	dataSources: () => ({source: new CharacterESI()}),
	introspection: false,
	playground: false,

	context: ({req}) => ({
        token: req.headers['authorization'],
		ESI: {
			clientId: process.env.ESI_CLIENT_ID,
			clientSecret: process.env.ESI_CLIENT_SECRET,
			scopes: [
				'esi-contracts.read_character_contracts.v1',
				'esi-characters.read_notifications.v1'
			],
		}
    }),
});
server
    .listen(process.env.PORT)
    .then(({ url }) => console.log(`Server ready at ${url}. `))
