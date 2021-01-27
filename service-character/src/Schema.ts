import { gql } from 'apollo-server'

const Schema = gql`
	scalar JSON

	type AuthToken {
		accessToken: String
		tokenType: String
		expiresIn: Int
		refreshToken: String
		expires: String
	}

	type Character @key (fields: "id") {
		id: ID!
		allianceId: Int
		ancestryId: Int
		birthday: String
		bloodlineId: Int
		corporationId: String
		description: String
		factionId: Int
		gender: String
		name: String
		raceId: Int
		securityStatus: Int
		title: String
	}

	extend type Query {
		getLoginUrl(callbackUrl: String): String
		getAuthorizationToken(code: String!): AuthToken
		getSelf: Character
		getCharacter(characterId: ID!): Character
	}
`

export default Schema;
