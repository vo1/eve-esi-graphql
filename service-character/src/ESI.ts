import { ESIDataSource, ESIContext, AuthToken } from "./ESIDataSource";
import { GraphQLResolverMap } from 'apollo-graphql';
import { GraphQLJSON } from 'graphql-type-json';

export interface Character
{
	id: number;
	allianceId: number;
	ancestryId: number;
	birthday: string;
	bloodlineId: number;
	corporationId: number;
	description: string;
	factionId: number;
	gender: string;
	name: string;
	raceId: number;
	securityStatus: number;
	title: string;
}

export const ESIResolvers: GraphQLResolverMap<ESIContext> = {
	JSON: GraphQLJSON,

	Mutation: {
	},

	Query: {
		getAuthorizationToken: async(
			_source,
			{ code },
			{ dataSources }
		): Promise<AuthToken> => (dataSources.source as CharacterESI).getAuthorizationToken(code),

		getLoginUrl: async(
			_source,
			{ callbackUrl },
			{ dataSources }
		): Promise<string> => (dataSources.source as CharacterESI).getLoginUrl(callbackUrl),

		getSelf: async(
			_source,
			{ },
			{ dataSources }
		): Promise<Character> => (dataSources.source as CharacterESI).getSelf(),

		getCharacter: async(
			_source,
			{ characterId },
			{ dataSources }
		): Promise<Character> => (dataSources.source as CharacterESI).getCharacter(characterId),
	},

	MiningObserverEntry: {
        character: async (miningObserver, args, context) => {
            return (context.dataSources.source as CharacterESI)
				.getCharacter(miningObserver.characterId);
        }
    }
}

export class CharacterESI extends ESIDataSource
{
	getLoginUrl(callbackUrl: string): Promise<string>
	{
		return new Promise((r) => r(this.getSSOLoginURL(callbackUrl)));
	}

	async getCharacter(characterId: number): Promise<Character>
	{
		return this.query('characters/:id/', characterId);
	}

	async getSelf(): Promise<Character>
	{
		let characterId: number = await this.verifyToken();
		return this.getCharacter(characterId)
	}
}
