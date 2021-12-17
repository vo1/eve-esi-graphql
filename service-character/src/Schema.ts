import { gql } from 'apollo-server'

const Schema = gql`
	scalar JSON

	type ServicedScopesType
	{
		_: ID!
	}

	extend type ServicedScopesType  @key (fields: "_")
	{
		character: [String]
	}

	type AuthToken
	{
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

	type Notification {
		notificationId: ID!
		senderId: ID!
		senderType: String
		text: String
		timestamp: String
		type: String
	}
	
	type MiningExtractionResource @key (fields: "typeId")
	{
		typeId: ID!
		quantity: Int
	}

	extend type MiningExtraction @key (fields: "structureId")
	{
		structureId: ID! @external
		resources: [MiningExtractionResource] @requires(fields: "structureId")
	}

	extend type MiningObserverEntry @key (fields: "characterId")
	{
		characterId: ID! @external
		character: Character @requires(fields: "characterId")
	}

	extend type Query {
		scopes: ServicedScopesType
		loginUrl(scopes:[String]!, callbackUrl: String!): String
		getAuthorizationToken(code: String!): AuthToken
		me: Character
		getCharacter(characterId: ID!): Character
		getNotifications(characterId: ID!, type: String): [Notification]
	}
`

export default Schema;
