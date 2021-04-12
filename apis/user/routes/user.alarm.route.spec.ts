import { expect } from 'chai';
import * as request from 'supertest';
import { uuidV4 } from '../../../packages/utils/uuid.util';
import { connection } from '../../../rdb/connect';
import { userService } from '../services';

describe('UserAlarmRoute', () => {
	const baseUrl = 'http://localhost:80';
	let user;
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

	describe('userAlarmRoute', () => {
		it('updateUserAlarm', async () => {
			let result = await request(baseUrl)
				.put('/userAlarm')
				.send({
					isNonSubjectPointAlarm: false
				})
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('x-access-token', userToken);
			result = result.toJSON();
			result = JSON.parse(result.text);
			// console.log(result);
			expect(result.statusCode).to.be.eqls(200);
		});
	});
});
