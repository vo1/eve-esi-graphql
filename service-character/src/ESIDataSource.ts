import { Request, Response, ValueOrPromise } from 'apollo-server-env'
import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import humps from 'humps';
const base64 = require('base-64');

export interface AuthToken
{
	accessToken?: string;
	tokenType?: string;
	expiresIn?: number;
	refreshToken?: string;
	expires?: string;
}

export interface ESIContext
{
    dataSources: {
        source: ESIDataSource
    },
    ESI: {
        clientId: string,
        secretKey: string,
        scopes: string[],
    },
    token: string,
}

export class ESIDataSource extends RESTDataSource<ESIContext>
{
	protected token:AuthToken = {};
	private authorizationToken: string = '';
	private API:string = 'https://esi.evetech.net/latest/';
	private ESILoginUrl = 'https://login.eveonline.com/v2/oauth/authorize?response_type=code&redirect_uri={{redirect_uri}}&client_id={{client_id}}&scope={{scopes}}&state={{state}}';
	private ESITokenUrl = 'https://login.eveonline.com/v2/oauth/token';
	private ESIVerifyUrl = 'https://login.eveonline.com/oauth/verify';
	constructor()
	{
		super();
    }

	getSSOLoginURL(callbackUri: string, state?: string): string
	{
		let _state: string = state || 'esi-gql-data-source';
		return encodeURI(
			this.ESILoginUrl
				.replace('{{client_id}}', this.context.ESI.clientId)
				.replace('{{scopes}}', this.context.ESI.scopes.join(' '))
				.replace('{{redirect_uri}}', callbackUri)
				.replace('{{state}}', _state)
		);
	}

	async verifyToken(): Promise<number>
	{
		this.authorizationToken = this.context.token;
		return (await this.get(this.ESIVerifyUrl)).characterID;
	}
	async getAuthorizationToken(code: string): Promise<AuthToken>
	{
		this.authorizationToken = 'Basic ' + base64.encode(this.context.ESI.clientId + ':' + this.context.ESI.secretKey);
		return this.post<AuthToken>(this.ESITokenUrl, JSON.stringify({grant_type: "authorization_code", code: code}));
	}

	willSendRequest(request: RequestOptions): ValueOrPromise<void>
	{
		request.headers.set('accept', 'application/json');
		request.headers.set('content-type', 'application/json');
		if (this.authorizationToken.length > 0) {
			request.headers.set('Authorization', this.authorizationToken);
		};
		request.body = humps.decamelizeKeys(request.body as Record<string, any>) as any;

/*		if (this.context.sessionId) {
			const cookie = request.headers.get('cookie') ?? '';
			const cookieWithPhpSession = cookie
				.split(';')
				.filter(c => !c.includes('PHPSESSID'))
				.join(';')
				.concat(`;PHPSESSID=${this.context.sessionId}`);
			request.headers.set('cookie', cookieWithPhpSession);
		} */
	}

	async parseBody(response: Response): Promise<object | string>
	{
		const parsedResponse = await super.parseBody(response);
		if (typeof parsedResponse === 'string') {
			return parsedResponse;
		}
		return humps.camelizeKeys(parsedResponse);
	}

	protected async query<TResult = any>(path: string, id?: number): Promise<TResult>
	{
		let url:string = this.API + path;
		if (typeof(id) !== 'undefined') {
			url = url.replace(':id', id.toString());
		}
		let response = await this.get(url);
		if (typeof(id) !== 'undefined') {
			response.id = id;
		}
		return response;
	}
}
