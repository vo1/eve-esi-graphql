import { ESIDataSource, ESIContext, AuthToken } from "./ESIDataSource";
import { GraphQLResolverMap } from 'apollo-graphql';
import { GraphQLJSON } from 'graphql-type-json';

export interface TypeUniversalData
{
	id: number
	groupId: number
	marketGroupId: number
	name: string
	volume: number
	portionSize: number
}

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

		getUniverseType: async(
			_source,
			{ typeId },
			{ dataSources }
		): Promise<TypeUniversalData> => (dataSources.source as UniverseESI).getUniverseType(typeId),

	},

	MiningObserver: {
        structure: async (miningObserver, args, context) => {
            return (context.dataSources.source as UniverseESI)
				.getUniverseStructure(miningObserver.observerId);
        }
    },
	MiningObserverEntry: {
        type: async (miningObserverEntry, args, context) => {
            return (context.dataSources.source as UniverseESI)
				.getUniverseType(miningObserverEntry.typeId);
        }
    }
}

export class UniverseESI extends ESIDataSource
{
	async getUniverseStructure(observerId: number): Promise<StructureUniversalData>
	{
		return this.query('universe/structures/:id', observerId);
	}

	async getUniverseType(typeId: number): Promise<TypeUniversalData>
	{
		return this.query('universe/types/:id', typeId);
	}
}