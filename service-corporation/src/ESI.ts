import { ESIDataSource, ESIContext, AuthToken } from 'apollo-datasource-esi';
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

	},

	Character: {
        corporation: async (character, args, context) => {
            return (context.dataSources.source as CorporationESI)
				.getCorporation(character.corporationId);
        },
		miningObservers: async (character, args, context) => {
            return (context.dataSources.source as CorporationESI)
				.getCorporationMiningObservers(character.corporationId);
        },
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

}
