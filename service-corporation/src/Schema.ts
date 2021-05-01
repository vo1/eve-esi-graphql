import { gql } from 'apollo-server'

const Schema = gql`
	scalar JSON

    type Query {
        empty: String
    }

    type Mutation {
        empty: String
    }

	input DateRange
	{
		from: String
		to: String
	}

	type MiningObserver @key (fields: "observerId")
	{
		observerId: ID!
		lastUpdated: String
		observerType: String
	}

	type MiningObserverEntry @key (fields: "characterId") @key (fields: "typeId")
	{
		characterId: ID!
		typeId: ID!
		lastUpdated: String
		quantity: Int
		recordedCorporationId: Int
	}

	type Corporation @key (fields: "id")
	{
		id: ID!
		allianceId: Int
		ceoId: Int
		creatorId: Int
		dateFounded: Int
		description: String
		factionId: Int
		homeStationId: Int
		memberCount: Int
		name: String
		shares: Int
		taxRate: Float
		ticker: String
		url: String
		warEligible: Boolean
	}

	type CorporationAsset @key (fields: "itemId")
	{
		itemId: ID!
		typeId: Int
		quantity: Int
		locationType: String
	}

	extend type ActivityMaterialType @key (fields: "typeID")
	{
		typeID: ID! @external
		corporationAssets: [CorporationAsset]  @requires(fields: "typeID")
	}

	extend type Query
	{
		getCorporation(corporationId: ID!): Corporation
		getCorporationMiningObservers(corporationId: ID!): [MiningObserver]
		getCorporationMiningObserverEntries(corporationId: ID!, observerId: ID!, dateRange: DateRange): [MiningObserverEntry]
	}

	extend type Character @key (fields: "corporationId")
	{
		corporationId: String! @external
		corporation: Corporation @requires(fields: "corporationId")
		miningObservers: [MiningObserver] @requires(fields: "corporationId")
	}
`

export default Schema;
