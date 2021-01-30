import { ESIContext, ESIDataSource } from 'apollo-datasource-esi';
import { GraphQLResolverMap } from 'apollo-graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { SDE, MaterialType } from './SDE';

import YAML from 'yaml';
const fs = require('fs');

export const ESIResolvers: GraphQLResolverMap<ESIContext> = {
	JSON: GraphQLJSON,

	Mutation: {
	},

	Query: {
		getMaterials: async(
			_source,
			{ typeId },
			{ dataSources }
		): Promise<MaterialType[]> => (dataSources.source as SdeESI).getMaterials(typeId),
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
}
