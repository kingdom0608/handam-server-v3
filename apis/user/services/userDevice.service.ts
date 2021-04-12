import { UserDevice } from '../models';

export interface IUpsertUserDeviceData {
	userHrn: string,
	id: string,
	token?: string,
	info?: string,
	status?: string
}

export class UserDeviceService {
	constructor() {
	}

	/**
	 * service: 유저 디바이스 userHrn & id 조회
	 * @param userHrn
	 * @param id
	 */
	async getUserDeviceByUserHrnId(userHrn: string, id: string) {
		try {
			const result = await UserDevice.findOne({
				where: {
					userHrn: userHrn,
					id: id
				}
			});

			if (result === null) {
				throw new Error('UserDevice does not exist');
			}

			return result.toJSON();
		} catch (err) {
			throw err;
		}
	}

	/**
	 * service: 유저 디바이스 업서트
	 * @param userDeviceData
	 */
	async upsertUserDevice(userDeviceData: IUpsertUserDeviceData) {
		try {
			await UserDevice.upsert(userDeviceData);

			return this.getUserDeviceByUserHrnId(userDeviceData.userHrn, userDeviceData.id);
		} catch (err) {
			throw err;
		}
	}
}

export const userDeviceService = new UserDeviceService();
