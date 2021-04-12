import { UserAlarm } from '../models';

export interface IUpdateUserAlarmData {
	isNoticeAlarm?: boolean,
	isNonSubjectPointAlarm?: boolean,
	isPostAlarm?: boolean,
}

export class UserAlarmService {
	constructor() {
	}

	/**
	 * service: 유저 알림 userHrn 조회
	 * @param userHrn
	 */
	async getUserAlarmByUserHrn(userHrn: string) {
		try {
			const userAlarm = await UserAlarm.findOne({
				where: {
					userHrn: userHrn
				}
			});

			if (userAlarm === null) {
				throw new Error('UserAlarm does not exist');
			}

			return userAlarm.toJSON();
		} catch (err) {
			throw err;
		}
	}

	/**
	 * service: 유저 알림 업데이트
	 * @param userHrn
	 * @param userAlarmData
	 */
	async updateUserAlarm(userHrn: string, userAlarmData: IUpdateUserAlarmData) {
		try {
			await UserAlarm.update(userAlarmData, {
				where: {
					userHrn: userHrn
				}
			});

			return await this.getUserAlarmByUserHrn(userHrn);
		} catch (err) {
			throw err;
		}
	}
}

export const userAlarmService = new UserAlarmService();
