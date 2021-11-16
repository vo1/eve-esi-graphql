import { ESIDataSource, ESIContext, AuthToken } from 'apollo-datasource-eve-esi';
import { GraphQLResolverMap } from 'apollo-graphql';
import { GraphQLJSON } from 'graphql-type-json';

export interface MarketGroup
{
	id: number;
	parent_group_id: number;
	name: string;
	description: string;
}

export const ESIResolvers: GraphQLResolverMap<ESIContext> = {
	JSON: GraphQLJSON,

	ServicedScopesType: {
		market: async(src, args, context):Promise<string[]> => context.dataSources.source.context.ESI.scopes
	},

	Mutation: {
	},

	Query: {
		getMarketGroup: async(
			_source,
			{ groupId },
			{ dataSources }
		): Promise<MarketGroup> => (dataSources.source as MarketESI).getMarketGroup(groupId),
	},

	TypeUniversalData: {
		marketGroup: async (type, args, context) => {
			return (context.dataSources.source as MarketESI)
				.getMarketGroup(type.marketGroupId);
		}
	}
}

export class MarketESI extends ESIDataSource
{
	async getMarketGroup(groupId: number): Promise<MarketGroup>
	{
		return this.query('markets/groups/:id', groupId);
	}
}
