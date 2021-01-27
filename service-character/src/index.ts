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
	debug: true,

	context: ({req}) => ({
        token: req.headers['authorization'],
		ESI: {
			clientId: '6eefdfc0e00f4fbebe3435eedb570098',
			secretKey: '6WtAbyrcTwGzv78Hp9YPTZVh8ZVxUOsRg0CzzOuD',
			callbackUri: 'http://localhost:1337/login/callback',
			scopes: [ 'esi-industry.read_corporation_mining.v1', 'esi-universe.read_structures.v1', 'esi-contracts.read_character_contracts.v1' ],
		}
    }),
});
server
    .listen(4001)
    .then(({ url }) => console.log(`Server ready at ${url}. `))
