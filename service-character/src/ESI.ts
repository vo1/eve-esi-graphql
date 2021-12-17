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

export interface MiningExtractionResource
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

	MiningExtraction: {
		resources: async(miningExtraction, args, context) =>(
			(context.dataSources.source as CharacterESI)
				.parseMiningExtractionNotifications(miningExtraction.structureId)
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
	async parseMiningExtractionNotifications(structureId: number): Promise<MiningExtractionResource[]>
	{
		let result: MiningExtractionResource[] = [];
		let me: Character = await this.getSelf();
		let notifications: Notification[] = await this.getNotifications(me.id, "MoonminingExtractionStarted");
		let lastTimestamp = new Date(0);

		notifications.forEach((n) => {
			let str = n.text.replace(/(?:\r\n|\r|\n)/g, ' ');
			let matches = str.match(/oreVolumeByType:[\s]*(?<ores>.*)?readyTime.*?structureID:[\s]*(?<structureId>[0-9]*).*/);
			let dt = new Date(n.timestamp);
			if (matches && matches.groups) {
				let _structureId = parseInt(matches.groups['structureId'].trim()),
					_ores = matches.groups['ores'];
				if (lastTimestamp < dt) {
					result = [];
					lastTimestamp = dt;
					if (structureId == _structureId) {
						let oresSplit = _ores.match(/([0-9]*?: [0-9]*)/g);
						if (oresSplit && oresSplit.length > 0) {
							oresSplit.forEach((ore) => {
								let [typeId, quantity] = ore.split(':');
								let r: MiningExtractionResource = {
									typeId: parseInt(typeId.trim()),
									quantity: parseInt(quantity.trim())
								};
								result.push(r);
							})
						}
					}
				}
			}
		});
		return result;
	}
	
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
