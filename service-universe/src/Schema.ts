import { gql } from 'apollo-server'

const Schema = gql`

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
`

export default Schema;
