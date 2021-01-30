import { gql } from 'apollo-server'

const Schema = gql`
	type TypeUniversalData @key (fields: "id") @key (fields: "marketGroupId")
	{
		id: ID!
		groupId: Int
		marketGroupId: ID!
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
		getUniverseType(typeId: ID!): TypeUniversalData
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

	extend type MaterialType @key (fields: "materialTypeID")
	{
		materialTypeID: ID! @external
		type: TypeUniversalData @requires(fields: "materialTypeID")
	}
`

export default Schema;
