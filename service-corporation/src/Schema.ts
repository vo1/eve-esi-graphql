import { gql } from 'apollo-server'

const Schema = gql`
	scalar JSON

    type Query {
        empty: String
    }

    type Mutation {
        empty: String
    }

	type MiningObserver @key (fields: "observerId")
	{
		observerId: ID!
		lastUpdated: String
		observerType: String
	}

	type MiningObserverEntry
	{
		characterId: Int
		lastUpdated: String
		quantity: Int
		recordedCorporationId: Int
		typeId: Int
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

	extend type Query
	{
		getCorporation(corporationId: ID!): Corporation
		getCorporationMiningObservers(corporationId: ID!): [MiningObserver]
		getCorporationMiningObserverEntries(corporationId: ID!, observerId: ID!): [MiningObserverEntry]
	}

	extend type Character @key (fields: "corporationId")
	{
		corporationId: String! @external
		corporation: Corporation @requires(fields: "corporationId")
	}
`

export default Schema;
