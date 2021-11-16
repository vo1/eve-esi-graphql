import { ESIDataSource, ESIContext, AuthToken, Character, ScopesType } from 'apollo-datasource-eve-esi';
import { GraphQLResolverMap } from 'apollo-graphql';
import { GraphQLJSON } from 'graphql-type-json';

export interface AssetType
{
	isBlueprintCopy: boolean;
  	quantity: number;
  	typeId: number;
}

export interface Notification
{
	notificationId: number;
	senderId: number;
	senderType: string;
	text: string;
	timestamp: string;
	type: string;
}

export interface ChunkInfo
{
	typeId: number;
	quantity: number;
}

export const ESIResolvers: GraphQLResolverMap<ESIContext> = {
	JSON: GraphQLJSON,

	ServicedScopesType: {
		character: async(src, args, context):Promise<string[]> => context.dataSources.source.context.ESI.scopes
	},

	Mutation: {
	},

	Query: {
		scopes: async(
				_source,
				{ },
				{ dataSources }
			): Promise<ScopesType> => (dataSources.source as CharacterESI).getScopes(),

		getAuthorizationToken: async(
			_source,
			{ code },
			{ dataSources }
		): Promise<AuthToken> => (dataSources.source as CharacterESI).getAuthorizationToken(code),

		loginUrl: async(
			_source,
			{ scopes, callbackUrl },
			{ dataSources }
		): Promise<string> => (dataSources.source as CharacterESI).getLoginUrl(scopes, callbackUrl),

		me: async(
			_source,
			{ },
			{ dataSources }
		): Promise<Character> => (dataSources.source as CharacterESI).getSelf(),

		getCharacter: async(
			_source,
			{ characterId },
			{ dataSources }
		): Promise<Character> => (dataSources.source as CharacterESI).getCharacter(characterId),
		
		getNotifications: async(
			_source,
			{ characterId, type },
			{ dataSources }		
		): Promise<Notification[]> => (dataSources.source as CharacterESI).getNotifications(characterId, type),
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
	/*parseChunkNotification(info: string): [ChunkInfo]
	{
		let [, oreVolumes] = info.split('oreVolumeByType:');
		oreVolumes = oreVolumes.split("structureName:"
	}*/
	
	getLoginUrl(scopes: string[], callbackUrl: string): Promise<string>
	{
		return new Promise((r) => r(this.getSSOLoginURL(callbackUrl, undefined , scopes)));
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
			response.forEach( (asset: AssetType) => {
				if (asset.typeId.toString() == typeID) {
					result.push(asset);
				}
			});
		} else {

		}
		return result;
	}

	async getNotifications(characterId: number, type?: string): Promise<Notification[]>
	{
		let response: Notification[] = await this.query('characters/:id/notifications/', characterId);
		let result: Notification[] = [];
		if (typeof(type) !== 'undefined') {
			response.forEach( (n: Notification) => {
				if (n.type.toLowerCase() == type.toLowerCase()) {
					result.push(n);
				}
			});
		} else {
			return response;
		}
		return result;
	}
}
