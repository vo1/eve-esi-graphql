import { ESIContext, ESIDataSource } from 'apollo-datasource-eve-esi';
import { GraphQLResolverMap } from 'apollo-graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { SDE, MaterialType, BlueprintType } from './SDE';

import YAML from 'yaml';
const fs = require('fs');

export const ESIResolvers: GraphQLResolverMap<ESIContext> = {
	JSON: GraphQLJSON,

	ServicedScopesType: {
		sde: async(src, args, context):Promise<string[]> => context.dataSources.source.context.ESI.scopes
	},

	Mutation: {
	},

	Query: {
		getMaterials: async(
			_source,
			{ typeId },
			{ dataSources }
		): Promise<MaterialType[]> => (dataSources.source as SdeESI).getMaterials(typeId),
		blueprints: async(
			_source,
			{ name },
			{ dataSources }
		): Promise<BlueprintType[]> => (dataSources.source as SdeESI).findBlueprints(name),
		blueprint: async(
			_source,
			{ typeId },
			{ dataSources }
		): Promise<BlueprintType> => (dataSources.source as SdeESI).getBlueprint(typeId),
	},
	MiningObserverEntry: {
		refine: async (entry, args, context) => ( (context.dataSources.source as SdeESI).getMaterials(entry.typeId) )
	}
}

export class SdeESI extends ESIDataSource
{
	private sde: SDE = new SDE();

	async getMaterials(typeId: string): Promise<MaterialType[]>
	{
		return this.sde.getMaterials(typeId);
	}
	async findBlueprints(name: string): Promise<BlueprintType[]>
	{
		return this.sde.findBlueprints(name);
	}
	async getBlueprint(typeId: string): Promise<BlueprintType>
	{
		return this.sde.getBlueprint(typeId);
	}
}
