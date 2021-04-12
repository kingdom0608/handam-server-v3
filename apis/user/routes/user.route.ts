import * as express from 'express';
import { checkUserAuth } from '../../../middlewares/tokenVerify.middleware';
import { auth } from '../../../packages/utils/auth.util';
import { userService } from '../services';

export class UserRoute {
	public userRouter: express.Router = express.Router();

	constructor() {
		this.router();
	}

	public router() {
		this.userRouter.get('/users', checkUserAuth, listUser);
		this.userRouter.get('/users/userId/:userId', checkUserAuth, getUserById);
		this.userRouter.put('/user', updateUser);
		this.userRouter.put('/userPassword', updateUserPassword);
	}
}

/**
 * route: 유저 리스트 조회
 * @param req
 * @param res
 */
async function listUser(req, res): Promise<void> {
	try {
		const authFilter = {};
		if (req.query && req.query.queryFilter) {
			req.query.queryFilter = JSON.parse(req.query.queryFilter);
		}

		const userCount = await userService.countUser(authFilter, req.query.queryFilter);
		const users = await userService.listUser(authFilter, req.query.queryFilter);

		res.send({
			success: true,
			statusCode: 200,
			totalCount: userCount,
			result: users,
			message: 'listUser: 200'
		})
	} catch (err) {
		switch (err.message) {
			default:
				res.send({
					success: false,
					statusCode: 500,
					message: 'listUser: 50000'
				});
				break;
		}
	}
}

/**
 * route: 유저 조회
 * @param req
 * @param res
 */
async function getUserById(req, res): Promise<void> {
	try {
		const result = await userService.getUserById(req.params.userId);

		res.send({
			success: true,
			statusCode: 200,
			result: result,
			message: 'getUserById: 200'
		});
	} catch (err) {
		switch (err.message) {
			case 'User does not exist':
				res.send({
					success: false,
					statusCode: 404,
					message: 'getUserById: 40401'
				});
				break;
			default:
				res.send({
					success: false,
					statusCode: 500,
					message: 'getUserById: 50000'
				});
				break;
		}
	}
}

/**
 * router: 유저 업데이트
 * @param req
 * @param res
 */
async function updateUser(req, res): Promise<void> {
	try {
		const authUser = auth(req);
		const result = await userService.updateUser(authUser.userHrn, req.body);

		res.send({
			success: true,
			statusCode: 200,
			result: result,
			message: 'updateUser: 200'
		});
	} catch (err) {
		switch (err.message) {
			case 'User does not exist':
				res.send({
					success: false,
					statusCode: 404,
					message: 'updateUser: 40401'
				});
				break;
			default:
				res.send({
					success: false,
					statusCode: 500,
					message: 'updateUser: 50000'
				});
				break;
		}
	}
}

/**
 * router: 유저 비밀번호 업데이트
 * @param req
 * @param res
 */
async function updateUserPassword(req, res): Promise<void> {
	try {
		const authUser = auth(req);
		const newPassword = req.body.newPassword;
		const result = await userService.updateUserPassword(authUser.userHrn, newPassword);

		res.send({
			success: true,
			statusCode: 200,
			result: result,
			message: 'updateUserPassword: 200'
		});
	} catch (err) {
		switch (err.message) {
			case 'User does not exist':
				res.send({
					success: false,
					statusCode: 404,
					message: 'updateUserPassword: 40401'
				});
				break;
			case 'Password is duplicated':
				res.send({
					success: false,
					statusCode: 409,
					message: 'updateUserPassword: 40901'
				});
				break;
			default:
				res.send({
					success: false,
					statusCode: 500,
					message: 'updateUserPassword: 50000'
				});
				break;
		}
	}
}

export const userRoute: UserRoute = new UserRoute();
