import * as express from 'express';
import { userDeviceService, userService } from '../services';

export class SignRoute {
	public signRouter: express.Router = express.Router();

	constructor() {
		this.router();
	}

	public router() {
		this.signRouter.post('/signUp', signUpUser);
		this.signRouter.post('/signIn', signInUser);
	}
}

/**
 * route: 회원가입
 * @param req
 * @param res
 */
async function signUpUser(req, res): Promise<void> {
	try {
		req.body.id = req.body.id.toLowerCase();

		/** 이미 존재하는 유저 확인 */
		const isExistIUser = await userService.isExistUserById(req.body.id);
		if (isExistIUser) {
			throw new Error('User already exist');
		}

		const result = await userService.createUser(req.body);

		res.send({
			success: true,
			statusCode: 200,
			result: result,
			message: 'createUser: 200'
		});
	} catch (err) {
		switch (err.message) {
			case 'User already exist':
				res.send({
					success: false,
					statusCode: 409,
					message: 'createUser: 40901'
				});
				break;
			default :
				res.send({
					success: false,
					statusCode: 500,
					message: 'createUser: 50000'
				});
				break;
		}
	}
}

/**
 * route: 로그인
 * @param req
 * @param res
 */
async function signInUser(req, res): Promise<void> {
	try {
		const result = await userService.signInUser({
			id: req.body.id,
			password: req.body.password
		});

		/** 유저 디바이스 업서트 */
		await userDeviceService.upsertUserDevice({
			userHrn: result.hrn,
			id: req.body.deviceId || null,
			token: req.body.token || null,
			info: req.body.info || null,
			status: req.body.info || 'ACTIVE'
		});

		res.send({
			success: true,
			statusCode: 200,
			result: result,
			message: 'signInUser: 200'
		});
	} catch (err) {
		switch (err.message) {
			case 'Token incorrect':
				res.send({
					success: true,
					statusCode: 400,
					message: 'signInUser: 40001'
				});
				break;
			case 'User password incorrect':
				res.send({
					success: true,
					statusCode: 400,
					message: 'signInUser: 40002'
				});
				break;
			case 'User does not exist':
				res.send({
					success: true,
					statusCode: 404,
					message: 'signInUser: 40401'
				});
				break;
			default :
				res.send({
					success: true,
					statusCode: 500,
					message: 'signInUser: 50000'
				});
				break;
		}
	}
}

export const signRoute: SignRoute = new SignRoute();
