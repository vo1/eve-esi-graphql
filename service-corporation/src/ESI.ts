import { ESIDataSource, ESIContext, AuthToken } from "./ESIDataSource";
import { GraphQLResolverMap } from 'apollo-graphql';
import { GraphQLJSON } from 'graphql-type-json';

export interface MiningObserver
{
	observerId: number;
	lastUpdated: string;
	observerType: string;
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
	},

	Character: {
        corporation: async (character, args, context) => {
            return (context.dataSources.source as CorporationESI)
				.getCorporation(character.corporationId);
        }
    }
}

export class CorporationESI extends ESIDataSource
{
	async getCorporation(corporationId: number): Promise<Corporation>
	{
		return this.query<Corporation>('corporations/:id/', corporationId);
	}
}
