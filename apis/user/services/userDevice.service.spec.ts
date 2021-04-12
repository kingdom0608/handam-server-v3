import { expect } from 'chai';
import { connection } from '../../../rdb/connect';
import { userService } from './user.service';
import { userDeviceService } from './userDevice.service';

let createUser;

before(async () => {
	await connection();
	createUser = await userService.createUser({
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
});

after(async () => {
	await userService.deleteUser(createUser.hrn);
});

describe('UserDeviceService', () => {
	it('getUserDeviceByUserHrnId', async () => {
		const result: any = await userDeviceService.getUserDeviceByUserHrnId(createUser.hrn, 'mochatestuser');
		console.log(result);
		delete result.createdAt;
		delete result.updatedAt;
		expect(result).to.be.eqls({
			index: result.index,
			userHrn: createUser.hrn,
			id: 'mochatestuser',
			token: null,
			info: null,
			status: 'ACTIVE'
		});
	});

	it('upsertUserDevice', async () => {
		const result: any = await userDeviceService.upsertUserDevice({
			userHrn: createUser.hrn,
			id: 'upsertmochatestuser',
			token: null,
			info: null,
			status: 'ACTIVE'
		});
		// console.log(result);
		delete result.createdAt;
		delete result.updatedAt;
		expect(result).to.be.eqls({
			index: result.index,
			userHrn: createUser.hrn,
			id: 'upsertmochatestuser',
			token: null,
			info: null,
			status: 'ACTIVE'
		});
	});
});
