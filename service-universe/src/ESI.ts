import { ESIDataSource, ESIContext, AuthToken } from "./ESIDataSource";
import { GraphQLResolverMap } from 'apollo-graphql';
import { GraphQLJSON } from 'graphql-type-json';

export interface StructureUniversalData
{
	id: number
	name: string
	ownerId: number
	solarSystemId: number
	typeId: number
}

export const ESIResolvers: GraphQLResolverMap<ESIContext> = {
	JSON: GraphQLJSON,

	Mutation: {
	},

	Query: {
		getUniverseStructure: async(
			_source,
			{ observerId },
			{ dataSources }
		): Promise<StructureUniversalData> => (dataSources.source as UniverseESI).getUniverseStructure(observerId),
	},

	MiningObserver: {
        structure: async (observer, args, context) => {
            return (context.dataSources.source as UniverseESI)
				.getUniverseStructure(observer.observerId);
        }
    }
}

export class UniverseESI extends ESIDataSource
{
	async getUniverseStructure(observerId: number): Promise<StructureUniversalData>
	{
		return this.query('universe/structures/:id', observerId);
	}
}
