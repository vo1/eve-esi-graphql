import { gql } from 'apollo-server'

const Schema = gql`
	type TypeUniversalData @key (fields: "id")
	{
		id: ID!
		groupId: Int
		marketGroupId: Int
		name: String
		volume: Float
		portionSize: Float
	}

	type StructureUniversalData @key (fields: "id")
	{
		id: ID!
		name: String
		ownerId: Int
		solarSystemId: Int
		typeId: Int
	}

	extend type Query
	{
		getUniverseStructure(structureId: ID!): [StructureUniversalData]
	}

	extend type MiningObserver @key (fields: "observerId")
	{
		observerId: ID! @external
		structure: StructureUniversalData @requires(fields: "observerId")
	}

	extend type MiningObserverEntry @key (fields: "typeId")
	{
		typeId: ID! @external
		type: TypeUniversalData @requires(fields: "typeId")
	}
`

export default Schema;
