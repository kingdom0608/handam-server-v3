import { expect } from 'chai';
import { connection } from '../../../rdb/connect';
import { userService } from './user.service';
import { userAlarmService } from './userAlarm.service';

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

describe('UserAlarmService', () => {
	it('getUserAlarmByUserHrn', async () => {
		const result: any = await userAlarmService.getUserAlarmByUserHrn(createUser.hrn);
		// console.log(result);
		delete result.createdAt;
		delete result.updatedAt;
		expect(result).to.be.eqls({
			index: result.index,
			userHrn: createUser.hrn,
			isNoticeAlarm: true,
			isNonSubjectPointAlarm: true,
			isPostAlarm: true,
		});
	});

	it('updateUserAlarm', async () => {
		const result: any = await userAlarmService.updateUserAlarm(createUser.hrn, {
			isNonSubjectPointAlarm: false
		});
		// console.log(result);
		delete result.createdAt;
		delete result.updatedAt;
		expect(result).to.be.eqls({
			index: result.index,
			userHrn: createUser.hrn,
			isNoticeAlarm: true,
			isNonSubjectPointAlarm: false,
			isPostAlarm: true,
		});
	});
});
