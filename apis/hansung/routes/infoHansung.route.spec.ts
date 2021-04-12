import { expect } from 'chai';
import * as request from 'supertest';
import { uuidV4 } from '../../../packages/utils/uuid.util';
import { connection } from '../../../rdb/connect';
import { userService } from '../../user/services';

describe('InfoHansungRoute', () => {
	const baseUrl = 'http://localhost:80';
	const infoHansungId = '';
	const infoHansungPassword = '';
	let user = null;
	let userId = uuidV4();
	let userToken;

	before(async () => {
		await connection();

		/** user 회원가입 */
		await request(baseUrl)
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

		/** user 토큰 획득 */
		user = await request(baseUrl)
			.post('/signIn')
			.send({
				id: userId,
				password: 'mochatestuser'
			})
			.set('Content-Type', 'application/x-www-form-urlencoded');
		user = user.toJSON();
		user.text = JSON.parse(user.text);
		userToken = user.text.result.token;
	});

	after(async () => {
		await userService.deleteUser(user.text.result.hrn);
	});

	it('createInfoHansung', async () => {
		let result = await request(baseUrl)
			.post('/infoHansung')
			.send({
				infoHansungId: infoHansungId,
				infoHansungPassword: infoHansungPassword
			})
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.set('x-access-token', userToken);
		result = result.toJSON();
		result = JSON.parse(result.text);
		// console.log(result);
		expect(result.statusCode).to.be.eqls(200);
	});

	it('delay', async () => {
		function delay(ms: number) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		await delay(3000);
	}).timeout(99999);

	it('createInfoHansungSchedule', async () => {
		let result = await request(baseUrl)
			.post('/infoHansung/schedule')
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.set('x-access-token', userToken);
		result = result.toJSON();
		result = JSON.parse(result.text);
		// console.log(result);
		expect(result.statusCode).to.be.eqls(200);
	});

	it('createInfoHansungGrade', async () => {
		let result = await request(baseUrl)
			.post('/infoHansung/grade')
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.set('x-access-token', userToken);
		result = result.toJSON();
		result = JSON.parse(result.text);
		// console.log(result);
		expect(result.statusCode).to.be.eqls(200);
	});

	it('createInfoHansungNonSubjectPoint', async () => {
		let result = await request(baseUrl)
			.post('/infoHansung/nonSubjectPoint')
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.set('x-access-token', userToken);
		result = result.toJSON();
		result = JSON.parse(result.text);
		// console.log(result);
		expect(result.statusCode).to.be.eqls(200);
	});

	it('deleteInfoHansung', async () => {
		let result = await request(baseUrl)
			.delete('/infoHansung')
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.set('x-access-token', userToken);
		result = result.toJSON();
		result = JSON.parse(result.text);
		// console.log(result);
		expect(result.statusCode).to.be.eqls(200);
	});
});
