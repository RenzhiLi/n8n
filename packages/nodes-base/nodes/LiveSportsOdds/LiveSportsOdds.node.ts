import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { liveSportsOddsApiRequest } from './GenericFunctions';

export class LiveSportsOdds implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LiveSportsOdds',
		name: 'liveSportsOdds',
		icon: 'file:liveSportsOdds.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Retrieve live sports odds, scores, and more',
		defaults: {
			name: 'LiveSportsOdds',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'liveSportsOddsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Sport',
						value: 'sports',
					},
					{
						name: 'Odd',
						value: 'odds',
					},
				],
				default: 'sports',
			},
			{
				displayName: 'Sport',
				name: 'sport',
				type: 'string',
				default: '',
				required: true,
				description: 'The sport key for which to return games and odds',
				displayOptions: {
					show: {
						resource: ['odds'],
					},
				},
			},
			{
				displayName: 'Regions',
				name: 'regions',
				type: 'string',
				default: 'us',
				description: 'Comma delimited list of regions',
				displayOptions: {
					show: {
						resource: ['odds'],
					},
				},
			},
			{
				displayName: 'Odds Format',
				name: 'oddsFormat',
				type: 'options',
				options: [
					{
						name: 'Decimal',
						value: 'decimal',
					},
					{
						name: 'American',
						value: 'american',
					},
				],
				default: 'decimal',
				description: 'Format of returned odds',
				displayOptions: {
					show: {
						resource: ['odds'],
					},
				},
			},
			{
				displayName: 'Markets',
				name: 'markets',
				type: 'string',
				default: 'h2h',
				description: 'Comma delimited list of odds markets',
				displayOptions: {
					show: {
						resource: ['odds'],
					},
				},
			},
			{
				displayName: 'Date Format',
				name: 'dateFormat',
				type: 'options',
				options: [
					{
						name: 'ISO',
						value: 'iso',
					},
					{
						name: 'Unix',
						value: 'unix',
					},
				],
				default: 'iso',
				description: 'Format of returned timestamps',
				displayOptions: {
					show: {
						resource: ['odds'],
					},
				},
			},
			// ... other properties ...
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('liveSportsOddsApi');

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i);
			let endpoint = '';
			let query: IDataObject = {};

			switch (resource) {
				case 'sports':
					endpoint = '/v4/sports';
					query = { all: true }; // Example query parameters
					break;
				case 'odds':
					const sportForOdds = this.getNodeParameter('sport', i) as string;
					const regions = this.getNodeParameter('regions', i) as string;
					const oddsFormat = this.getNodeParameter('oddsFormat', i, 'decimal') as string;
					const markets = this.getNodeParameter('markets', i, 'h2h') as string;
					const dateFormat = this.getNodeParameter('dateFormat', i, 'iso') as string;
					endpoint = `/v4/sports/${sportForOdds}/odds`;
					query = { regions, oddsFormat, markets, dateFormat };
					break;
				// Add more cases as needed for different resources
			}

			try {
				const responseData = await liveSportsOddsApiRequest.call(
					this,
					'GET',
					endpoint,
					{
						'X-RapidAPI-Key': credentials?.xRapidApiKey,
						'X-RapidAPI-Host': credentials?.xRapidApiHost,
					},
					{},
					query,
				);
				returnData.push(...this.helpers.returnJsonArray(responseData));
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}

		return this.prepareOutputData(returnData);
	}
}
