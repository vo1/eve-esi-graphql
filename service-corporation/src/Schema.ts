import { gql } from 'apollo-server'

const Schema = gql`
	scalar JSON

	extend type ServicedScopesType  @key (fields: "_")
	{
		_: ID! @external
		corporation: [String] @requires(fields: "_")
	}

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

	type StructureService
	{
		name: String
		state: String
	}

	type Structure
	{
		corporationId: ID!
		structureId: ID!
		typeId: ID!
		name: String
		fuelExpires: String
		services: [StructureService]
		state: String
		stateTimerStart: String
		stateTimerEnd: String
		unanchorsAt: String
		miningExtraction: MiningExtraction
	}

	type MiningExtraction @key (fields: "structureId")
	{
		chunkArrivalTime: String
		extractionStartTime: String
		moonId: ID!
		naturalDecayTime: String
		structureId: ID!
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
		getCorporationStructures(corporationId: ID!): [Structure]
		getCorporationMiningExtractions(corporationId: ID!, dateRange: DateRange): [MiningExtraction]
		getCorporationMiningObservers(corporationId: ID!): [MiningObserver]
		getCorporationMiningObserverEntries(corporationId: ID!, observerId: ID!, dateRange: DateRange): [MiningObserverEntry]
	}

	extend type Character @key (fields: "corporationId")
	{
		corporationId: String! @external
		corporation: Corporation @requires(fields: "corporationId")
		structures: [Structure] @requires(fields: "corporationId")
		miningObservers: [MiningObserver] @requires(fields: "corporationId")
		miningExtractions: [MiningExtraction] @requires(fields: "corporationId")
	}
`

export default Schema;
