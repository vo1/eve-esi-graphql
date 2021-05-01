import { gql } from 'apollo-server'

const Schema = gql`

	type MaterialType @key (fields: "materialTypeID")
	{
		materialTypeID: ID!
		quantity: Float
	}

	type ActivityMaterialType @key (fields: "typeID")
	{
		typeID: ID!
		name: String
		quantity: Float
	}

	type BlueprintType @key (fields: "typeID")
	{
		typeID: ID!
		input: [ActivityMaterialType]
		output: ActivityMaterialType
	}

	extend type Query
	{
		getMaterials(typeId: ID!): [MaterialType]
		blueprints(name: String): [BlueprintType]
		blueprint(typeId: ID!): BlueprintType
	}

	extend type MiningObserverEntry @key (fields: "typeId")
	{
		typeId: ID! @external
		refine: [MaterialType] @requires(fields: "typeId")
	}
`

export default Schema;
