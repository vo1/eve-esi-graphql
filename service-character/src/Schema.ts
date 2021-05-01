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

	type CharacterAsset @key (fields: "itemId")
	{
		itemId: ID!
		typeId: Int
		quantity: Int
		locationType: String
	}

	extend type ActivityMaterialType @key (fields: "typeID")
	{
		typeID: ID! @external
		characterAssets: [CharacterAsset]  @requires(fields: "typeID")
	}

	type Character @key (fields: "id") @key (fields: "corporationId")
	 {
		id: ID!
		allianceId: Int
		ancestryId: Int
		birthday: String
		bloodlineId: Int
		corporationId: String!
		description: String
		factionId: Int
		gender: String
		name: String
		raceId: Int
		securityStatus: Int
		title: String
	}

	extend type MiningObserverEntry @key (fields: "characterId")
	{
		characterId: ID! @external
		character: Character @requires(fields: "characterId")
	}

	extend type Query {
		getLoginUrl(callbackUrl: String): String
		getAuthorizationToken(code: String!): AuthToken
		getSelf: Character
		getCharacter(characterId: ID!): Character
	}
`

export default Schema;
