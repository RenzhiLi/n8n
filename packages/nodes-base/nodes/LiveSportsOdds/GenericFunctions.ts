import type {
	IHookFunctions,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function liveSportsOddsApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: 'GET' | 'POST',
	endpoint: string,
	headers: IDataObject = {},
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<any> {
	const options: IHttpRequestOptions = {
		method,
		body,
		qs: query,
		url: `https://odds.p.rapidapi.com${endpoint}`,
		headers,
	};

	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}

// Add other utility functions if needed
