import * as express from 'express';
import { auth } from '../../../packages/utils/auth.util';
import { userAlarmService } from '../services';

export class UserAlarmRoute {
	public userAlarmRouter: express.Router = express.Router();

	constructor() {
		this.router();
	}

	public router() {
		this.userAlarmRouter.put('/userAlarm', updateUserAlarm);
	}
}

/**
 * router: 유저 알림 업데이트
 * @param req
 * @param res
 */
async function updateUserAlarm(req, res): Promise<void> {
	try {
		const authUser = auth(req);
		const result = await userAlarmService.updateUserAlarm(authUser.userHrn, req.body);

		res.send({
			success: true,
			statusCode: 200,
			result: result,
			message: 'updateUserAlarm: 200'
		});
	} catch (err) {
		switch (err.message) {
			case 'User does not exist':
				res.send({
					success: false,
					statusCode: 404,
					message: 'updateUserAlarm: 40401'
				});
				break;
			default:
				res.send({
					success: false,
					statusCode: 500,
					message: 'updateUserAlarm: 50000'
				});
				break;
		}
	}
}

export const userAlarmRoute: UserAlarmRoute = new UserAlarmRoute();
