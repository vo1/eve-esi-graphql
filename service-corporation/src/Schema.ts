import { gql } from 'apollo-server'

const Schema = gql`
	scalar JSON

    type Query {
        empty: String
    }

    type Mutation {
        empty: String
    }

	type Corporation @key (fields: "id") {
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

	extend type Query {
		getCorporation(corporationId: ID!): Corporation
	}

	extend type Character {
		corporationId: String @external
		corporation: Corporation @requires(fields: "corporationId")
	}
`

export default Schema;
