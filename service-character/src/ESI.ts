import { ESIDataSource, ESIContext, AuthToken, Character } from 'apollo-datasource-eve-esi';
import { GraphQLResolverMap } from 'apollo-graphql';
import { GraphQLJSON } from 'graphql-type-json';

export interface AssetType
{
	isBlueprintCopy: boolean;
  	quantity: number;
  	typeId: number;
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

	ActivityMaterialType: {
		characterAssets: async(activityMaterialType, args, context) => (
			(context.dataSources.source as CharacterESI)
				.getCharacterAssets(activityMaterialType.typeID)
		)
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

	async getCharacterAssets(typeID?: string): Promise<AssetType[]>
	{
		await this.getSelf();
		let result: AssetType[] = [];
		let response = await this.query(`characters/:id/assets/`, this.me.id);
		if (typeof(typeID) !== 'undefined') {
			response.forEach( (asset:AssetType) => {
				if (asset.typeId.toString() == typeID) {
					result.push(asset);
				}
			});
		} else {

		}
		return result;
	}
}
