import { gql } from 'apollo-server'

const Schema = gql`

	extend type ServicedScopesType  @key (fields: "_")
	{
		_: ID! @external
		market: [String] @requires(fields: "_")
	}

	type MarketGroup @key (fields: "id")
	{
		id: ID!
		name: String
		description: String
	}

	extend type Query
	{
		getMarketGroup(groupId: ID!): MarketGroup
	}

	extend type TypeUniversalData @key (fields: "marketGroupId")
	{
		marketGroupId: ID! @external
		marketGroup: MarketGroup @requires(fields: "marketGroupId")
	}
`

export default Schema;
