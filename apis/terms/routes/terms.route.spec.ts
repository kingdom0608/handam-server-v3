import { expect } from 'chai';
import * as request from 'supertest';
import { connection } from '../../../rdb/connect';

describe('terms 라우트', () => {
	const baseUrl = 'http://localhost:80';
	let terms;

	before(async () => {
		await connection();
	});

	after(async () => {

	});

	it('getTerms', async () => {
		let result = await request(baseUrl)
			.get('/terms')
			.query({
				termsName: 'marketingTerms',
			})
			.set('Content-Type', 'application/x-www-form-urlencoded');
		result = result.toJSON();
		result = JSON.parse(result.text);
		terms = result;
		//console.log(result);
		expect(result.statusCode).to.be.eqls(200);
	});
});
