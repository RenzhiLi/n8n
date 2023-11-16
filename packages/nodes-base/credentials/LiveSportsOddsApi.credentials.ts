import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LiveSportsOddsApi implements ICredentialType {
	name = 'liveSportsOddsApi';

	displayName = 'Live Sports Odds API';

	documentationUrl = '';

	properties: INodeProperties[] = [
		{
			displayName: 'X-RapidAPI-Key',
			name: 'xRapidApiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'X-RapidAPI-Host',
			name: 'xRapidApiHost',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-RapidAPI-Key': '={{$credentials.xRapidApiKey}}',
				'X-RapidAPI-Host': '={{$credentials.xRapidApiHost}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			url: 'https://odds.p.rapidapi.com/v4/sports',
			method: 'GET',
		},
	};
}
