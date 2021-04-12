import { expect } from 'chai';
import * as request from 'supertest';
import { uuidV4 } from '../../../packages/utils/uuid.util';
import { connection } from '../../../rdb/connect';
import { userService } from '../services';

describe('UserRoute', () => {
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

	describe('userRoute', () => {
		it('listUser', async () => {
			let result = await request(baseUrl)
				.get('/users')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('x-access-token', userToken);
			result = result.toJSON();
			result = JSON.parse(result.text);
			// console.log(result);
			expect(result.statusCode).to.be.eqls(200);
		});

		it('getUserById', async () => {
			let result = await request(baseUrl)
				.get(`/users/userId/${userId}`)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('x-access-token', userToken);
			result = result.toJSON();
			result = JSON.parse(result.text);
			// console.log(result);
			expect(result.statusCode).to.be.eqls(200);
		});

		it('getUserById - User does not exist', async () => {
			let result = await request(baseUrl)
				.get('/users/userId/mochatest01doesnotexist')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('x-access-token', userToken);
			result = result.toJSON();
			result = JSON.parse(result.text);
			// console.log(result);
			expect(result.statusCode).to.be.eqls(404);
		});

		it('updateUser', async () => {
			let result = await request(baseUrl)
				.put('/user')
				.send({
					name: '업데이트 모카테스트유저'
				})
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('x-access-token', userToken);
			result = result.toJSON();
			result = JSON.parse(result.text);
			// console.log(result);
			expect(result.statusCode).to.be.eqls(200);
		});

		it('updateUserPassword', async () => {
			let result = await request(baseUrl)
				.put('/userPassword')
				.send({
					newPassword: 'updatemochatestuser'
				})
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('x-access-token', userToken);
			result = result.toJSON();
			result = JSON.parse(result.text);
			// console.log(result);
			expect(result.statusCode).to.be.eqls(200);
		});

		it('updateUserPassword - Password is duplicated', async () => {
			let result = await request(baseUrl)
				.put('/userPassword')
				.send({
					newPassword: 'updatemochatestuser'
				})
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('x-access-token', userToken);
			result = result.toJSON();
			result = JSON.parse(result.text);
			// console.log(result);
			expect(result.statusCode).to.be.eqls(409);
		});
	});
});
