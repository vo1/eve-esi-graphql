import { gql } from 'apollo-server'

const Schema = gql`

	type MaterialType @key (fields: "materialTypeID")
	{
		materialTypeID: ID!
		quantity: Float
	}

	extend type Query
	{
		getMaterials(typeId: ID!): [MaterialType]
	}

	extend type MiningObserverEntry @key (fields: "typeId")
	{
		typeId: ID! @external
		refine: [MaterialType] @requires(fields: "typeId")
	}
`

export default Schema;
