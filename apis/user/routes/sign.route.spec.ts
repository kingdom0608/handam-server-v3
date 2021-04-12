import { expect } from 'chai';
import * as request from 'supertest';
import { uuidV4 } from '../../../packages/utils/uuid.util';
import { connection } from '../../../rdb/connect';
import { userService } from '../services';

describe('SignRoute', () => {
	const baseUrl = 'http://localhost:80';
	let user;
	let userId = uuidV4();

	before(async () => {
		await connection();
	});

	after(async () => {
		await userService.deleteUser(user.result.hrn);
	});

	it('signUp', async () => {
		let result = await request(baseUrl)
			.post('/signUp')
			.send({
				id: userId,
				password: 'mochatestuser',
				email: 'mochatestuser@roundoff.co.kr',
				phone: '01012345678',
				name: '모카테스트유저',
				deviceId: 'mochatestuser',
				isAgreeMarketingTerms: false,
				isAgreePersonalInfoTerms: true,
				isAgreeServiceTerms: true
			})
			.set('Content-Type', 'application/x-www-form-urlencoded');
		result = result.toJSON();
		result = JSON.parse(result.text);
		user = result;
		// console.log(result);
		expect(result.statusCode).to.be.eqls(200);
	});

	it('signIn', async () => {
		let result = await request(baseUrl)
			.post('/signIn')
			.send({
				id: userId,
				password: 'mochatestuser'
			})
			.set('Content-Type', 'application/x-www-form-urlencoded');
		result = result.toJSON();
		result = JSON.parse(result.text);
		// console.log(result);
		expect(result.statusCode).to.be.eqls(200);
	});
});
