import { ESIDataSource, ESIContext, AuthToken, Character } from 'apollo-datasource-eve-esi';
import { GraphQLResolverMap } from 'apollo-graphql';
import { GraphQLJSON } from 'graphql-type-json';

export interface MiningObserver
{
	observerId: number;
	lastUpdated: string;
	observerType: string;
}
export interface DateRange
{
	from: string;
	to: string;
}
export interface MiningObserverEntry
{
	observerId: number;
	lastUpdated: string;
	quantity: number;
	recordedCorporationId: number;
	typeId: number;
}
export interface MiningExtraction
{
	moonId: number;
	structureId: number;
	chunkArrivalTime: string;
	extractionStartTime: string;
	naturalDecayTime: string;
}
export interface AssetType
{
	isBlueprintCopy: boolean;
  	quantity: number;
  	typeId: number;
}
export interface StructureService
{
	name: string;
	state: string;
}
export interface Structure
{
	corporationId: number;
	structureId: number;
	typeId: number;
	name: string;
	fuelExpires: string;
	services: StructureService[];
	state: string;
	stateTimerStart: string;
	stateTimerEnd: string;
	unanchorsAt: string;
	miningExtraction: MiningExtraction;
}
export interface Corporation
{
	allianceId: number;
	ceoId: number;
	creatorId: number;
	dateFounded: number;
	description: string;
	factionId: number;
	homeStationId: number;
	memberCount: number;
	name: string;
	shares: number;
	taxRate: number;
	ticker: string;
	url: string;
	warEligible: boolean;
}

export const ESIResolvers: GraphQLResolverMap<ESIContext> = {
	JSON: GraphQLJSON,

	ServicedScopesType: {
		corporation: async(src, args, context):Promise<string[]> => context.dataSources.source.context.ESI.scopes
	},

	Mutation: {
	},

	Query: {
		getCorporation: async(
			_source,
			{ corporationId },
			{ dataSources }
		): Promise<Corporation> => (dataSources.source as CorporationESI).getCorporation(corporationId),

		getCorporationMiningObservers: async(
			_source,
			{ corporationId },
			{ dataSources }
		): Promise<MiningObserver[]> => (dataSources.source as CorporationESI).getCorporationMiningObservers(corporationId),

		getCorporationMiningObserverEntries: async(
			_source,
			{ corporationId, observerId, dateRange },
			{ dataSources }
		): Promise<MiningObserverEntry[]> => (dataSources.source as CorporationESI).getCorporationMiningObserverEntries(corporationId, observerId, dateRange),

		getCorporationMiningExtractions: async(
			_source,
			{ corporationId, dateRange },
			{ dataSources }
		): Promise<MiningExtraction[]> => (dataSources.source as CorporationESI).getCorporationMiningExtractions(corporationId, dateRange),

		getCorporationStructures: async(
			_source,
			{ corporationId },
			{ dataSources }
		): Promise<Structure[]> => (dataSources.source as CorporationESI).getCorporationStructures(corporationId),
	},
	ActivityMaterialType: {
		corporationAssets: async(activityMaterialType, args, context) => (
			(context.dataSources.source as CorporationESI)
				.getCorporationAssets(activityMaterialType.typeID)
		)
	},
	Character: {
        corporation: async (character, args, context) => {
            return (context.dataSources.source as CorporationESI)
				.getCorporation(character.corporationId);
        },
		structures: async (character, args, context) => {
            return (context.dataSources.source as CorporationESI)
				.getCorporationStructures(character.corporationId);
        },
		miningObservers: async (character, args, context) => {
            return (context.dataSources.source as CorporationESI)
				.getCorporationMiningObservers(character.corporationId);
        },
		miningExtractions:  async (character, args, context) => {
			return (context.dataSources.source as CorporationESI)
				.getCorporationMiningExtractions(character.corporationId);
		}
    }
}

export class CorporationESI extends ESIDataSource
{
	async getCorporation(corporationId: number): Promise<Corporation>
	{
		return this.query<Corporation>('corporations/:id/', corporationId);
	}

	async getCorporationMiningObservers(corporationId: number): Promise<MiningObserver[]>
	{
		let result = await this.query<MiningObserver[]>(`corporation/:id/mining/observers/`, corporationId);
		result.sort((a, b) => {
			let dt1 = Date.parse(a.lastUpdated),
				dt2 = Date.parse(b.lastUpdated);
			if (dt1 > dt2) {
				return -1;
			} else if (dt1 < dt2) {
				return 1;
			} else {
				return 0;
			}
		})
		return result;
	}

	async getCorporationMiningObserverEntries(corporationId: number, observerId: number, dateRange?: DateRange): Promise<MiningObserverEntry[]>
	{
		let response = await this.query<MiningObserverEntry[]>(`corporation/${corporationId}/mining/observers/:id`, observerId),
			result: MiningObserverEntry[] = [];
		if (typeof(dateRange) !== 'undefined' && dateRange.from && dateRange.to) {
			let from = Date.parse(dateRange.from),
				to = Date.parse(dateRange.to) + 24* 60 * 60 * 1000;
			response.forEach( (v) => {
				let dt = Date.parse(v.lastUpdated);
				if (dt >= from && dt <= to) {
					result.push(v);
				}
			})
		}
		return result;
	}

	async getCorporationStructures(corporationId: number): Promise<Structure[]>
	{
		let response = await this.query<Structure[]>(`corporations/:id/structures/`, corporationId);
		let extractors = await this.getCorporationMiningExtractions(corporationId);
		response.forEach((v) => {
			extractors.forEach((e) => {
				if (e.structureId == v.structureId) {
					v.miningExtraction = e;
				}
			});
		});
		response.forEach((v) => {
			if (v.miningExtraction == null) {
				v.miningExtraction = <MiningExtraction>{};
			}
		})
		return response;
	}

	async getCorporationAssets(typeID?: string): Promise<AssetType[]>
	{
		await this.getSelf();
		let result: AssetType[] = [];
		let response = await this.query(`corporations/:id/assets/`, this.me.corporationId);
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
	
	async getCorporationMiningExtractions(corporationId: number, dateRange?: DateRange): Promise<MiningExtraction[]>
	{
		function compare(a: MiningExtraction, b: MiningExtraction) {
			if (a.chunkArrivalTime > b.chunkArrivalTime) {
				return 1;
			} else if (a.chunkArrivalTime < b.chunkArrivalTime) {
				return -1;
			}
			return 0;
		}
		let response = await this.query<MiningExtraction[]>(`corporation/:id/mining/extractions`, corporationId),
			result: MiningExtraction[] = [];
		if ((typeof(dateRange) !== 'undefined') && dateRange.from && dateRange.to) {
			let from = Date.parse(dateRange.from),
				to = Date.parse(dateRange.to) + 24* 60 * 60 * 1000;
			response.forEach( (v) => {
				let dt = Date.parse(v.chunkArrivalTime);
				if (dt >= from && dt <= to) {
					result.push(v);
				}
			})
		} else {
			result = response;
		}
		result.sort(compare);
		return result;
	}
}
