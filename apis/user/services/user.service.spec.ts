import { expect } from 'chai';
import { connection } from '../../../rdb/connect';
import { userService } from './user.service';

before(async () => {
	await connection();
});

describe('UserService', () => {
	let createUser;

	it('createUser', async () => {
		const result = await userService.createUser({
			id: 'mochatestuser',
			password: 'mochatestuser',
			email: 'mochatestuser@roundoff.co.kr',
			phone: '01012345678',
			name: '모카테스트유저',
			deviceId: 'mochatestuser',
			isAgreeMarketingTerms: false,
			isAgreePersonalInfoTerms: true,
			isAgreeServiceTerms: true
		});
		createUser = result;
		// console.log(result);
		delete result.createdAt;
		delete result.updatedAt;
		expect(result).to.be.eqls({
			hrn: result.hrn,
			id: 'mochatestuser',
			password: result.password,
			email: 'mochatestuser@roundoff.co.kr',
			phone: '01012345678',
			name: '모카테스트유저',
			status: 'ACTIVE'
		});
	});

	it('signInUser', async () => {
		const result = await userService.signInUser({
			id: createUser.id,
			password: 'mochatestuser'
		});
		// console.log(result);
		delete result.createdAt;
		delete result.updatedAt;
		expect(result).to.be.eqls({
			hrn: result.hrn,
			id: 'mochatestuser',
			password: result.password,
			email: 'mochatestuser@roundoff.co.kr',
			phone: '01012345678',
			name: '모카테스트유저',
			status: 'ACTIVE',
			token: result.token
		});
	});

	it('countUser', async () => {
		const result = await userService.countUser({}, {
			filter: {
				status: 'ACTIVE',
			}
		});
		// console.log(result);
		expect(result > 0).to.be.eqls(true);
	});

	it('listUser', async () => {
		const result: any = await userService.listUser({}, {
			filter: {
				status: 'ACTIVE'
			},
			orderBy: [{
				direction: 'DESC',
				field: 'createdAt'
			}]
		});
		// console.log(result);
		delete result[0].createdAt;
		delete result[0].updatedAt;
		expect(result[0]).to.be.eqls({
			hrn: result[0].hrn,
			id: 'mochatestuser',
			password: result[0].password,
			email: 'mochatestuser@roundoff.co.kr',
			phone: '01012345678',
			name: '모카테스트유저',
			status: 'ACTIVE'
		});
	});

	it('getUser', async () => {
		const result: any = await userService.getUser(createUser.hrn);
		// console.log(result);
		delete result.createdAt;
		delete result.updatedAt;
		expect(result).to.be.eqls({
			hrn: result.hrn,
			id: 'mochatestuser',
			password: result.password,
			email: 'mochatestuser@roundoff.co.kr',
			phone: '01012345678',
			name: '모카테스트유저',
			status: 'ACTIVE'
		});
	});

	it('getUser - devices scope', async () => {
		const result: any = await userService.getUser(createUser.hrn, 'devices');
		// console.log(result);
		delete result.createdAt;
		delete result.updatedAt;
		delete result.devices[0].createdAt;
		delete result.devices[0].updatedAt;
		expect(result).to.be.eqls({
			hrn: result.hrn,
			id: 'mochatestuser',
			password: result.password,
			email: 'mochatestuser@roundoff.co.kr',
			phone: '01012345678',
			name: '모카테스트유저',
			status: 'ACTIVE',
			devices: [{
				index: result.devices[0].index,
				userHrn: result.hrn,
				id: 'mochatestuser',
				token: null,
				info: null,
				status: 'ACTIVE'
			}]
		});
	});

	it('getUserById', async () => {
		const result: any = await userService.getUserById(createUser.id);
		// console.log(result);
		delete result.createdAt;
		delete result.updatedAt;
		expect(result).to.be.eqls({
			hrn: result.hrn,
			id: 'mochatestuser',
			password: result.password,
			email: 'mochatestuser@roundoff.co.kr',
			phone: '01012345678',
			name: '모카테스트유저',
			status: 'ACTIVE'
		});
	});

	it('isExistUserById', async () => {
		const result = await userService.isExistUserById(createUser.id);
		// console.log(result);
		expect(result).to.be.eqls(true);
	});

	it('updateUser', async () => {
		const result: any = await userService.updateUser(createUser.hrn, {
			name: '모카테스트유저업데이트'
		});
		// console.log(result);
		delete result.createdAt;
		delete result.updatedAt;
		expect(result).to.be.eqls({
			hrn: result.hrn,
			id: 'mochatestuser',
			password: result.password,
			email: 'mochatestuser@roundoff.co.kr',
			phone: '01012345678',
			name: '모카테스트유저업데이트',
			status: 'ACTIVE'
		});
	});

	it('updateUserPassword', async () => {
		const result: any = await userService.updateUserPassword(createUser.hrn, 'mochatestuserupdate');
		// console.log(result);
		delete result.createdAt;
		delete result.updatedAt;
		expect(result).to.be.eqls({
			hrn: result.hrn,
			id: 'mochatestuser',
			password: result.password,
			email: 'mochatestuser@roundoff.co.kr',
			phone: '01012345678',
			name: '모카테스트유저업데이트',
			status: 'ACTIVE'
		});
	});

	it('deleteUser', async () => {
		const result: any = await userService.deleteUser(createUser.hrn);
		// console.log(result);
		delete result.createdAt;
		delete result.updatedAt;
		expect(result).to.be.eqls({
			hrn: result.hrn,
			id: 'mochatestuser',
			password: result.password,
			email: 'mochatestuser@roundoff.co.kr',
			phone: '01012345678',
			name: '모카테스트유저업데이트',
			status: 'ACTIVE'
		});
	});
});
