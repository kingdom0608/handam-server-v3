import * as express from 'express';
import { auth } from '../../../packages/utils/auth.util';
import { encrypt } from '../../../packages/utils/encryption.util';
import { sqsUtil } from '../../../packages/utils/sqs.util';
import { infoHansungService } from '../services';

export class InfoHansungRoute {
	public infoHansungRouter: express.Router = express.Router();

	constructor() {
		this.router();
	}

	public router() {
		this.infoHansungRouter.post('/infoHansung', createInfoHansung);
		this.infoHansungRouter.post('/infoHansung/schedule', createInfoHansungSchedule);
		this.infoHansungRouter.post('/infoHansung/grade', createInfoHansungGrade);
		this.infoHansungRouter.post('/infoHansung/nonSubjectPoint', createInfoHansungNonSubjectPoint);
		this.infoHansungRouter.delete('/infoHansung', deleteInfoHansung);
	}
}

/**
 * route: 인포한성 생성
 * @param req
 * @param res
 */
async function createInfoHansung(req, res): Promise<void> {
	try {
		const authUser = auth(req);
		const infoHansungId = req.body.infoHansungId;
		const infoHansungPassword = encrypt.encrypt(req.body.infoHansungPassword);

		/** 인포한성 생성 */
		const result = await infoHansungService.createInfoHansung({
			userHrn: authUser.userHrn,
			infoHansungId: infoHansungId,
			infoHansungPassword: infoHansungPassword
		});

		/** 인포한성 SQS 전송 */
		let params = sqsUtil.sendParams;
		sqsUtil.sendParams.MessageBody = JSON.stringify({
			method: 'createInfoHansung',
			userHrn: result.userHrn,
			infoHansungId: result.infoHansungId,
			infoHansungPassword: result.infoHansungPassword
		});
		await sqsUtil.sendMessage(params);

		res.send({
			success: true,
			statusCode: 200,
			result: result,
			message: 'createInfoHansung: 200'
		});
	} catch (err) {
		switch (err.message) {
			default:
				res.send({
					success: false,
					statusCode: 500,
					message: 'createInfoHansung: 50000'
				});
				break;
		}
	}
}

/**
 * route: 인포한성 시간표 생성
 * @param req
 * @param res
 */
async function createInfoHansungSchedule(req, res): Promise<any> {
	try {
		const authUser = auth(req);
		let result = await infoHansungService.getInfoHansung(authUser.userHrn);

		if (result === null) {
			throw new Error('InfoHansung does not exist');
		}

		if (result && result.status === 'SUCCESS') {
			await infoHansungService.updateInfoHansung(authUser.userHrn, {
				schedule: {}
			});

			/** 인포한성 시간표 SQS 전송 */
			let params = sqsUtil.sendParams;
			sqsUtil.sendParams.MessageBody = JSON.stringify({
				method: 'createInfoHansungSchedule',
				userHrn: result.userHrn,
				infoHansungId: result.infoHansungId,
				infoHansungPassword: result.infoHansungPassword
			});
			await sqsUtil.sendMessage(params);
		}

		result = await infoHansungService.getInfoHansung(authUser.userHrn);

		res.send({
			success: true,
			statusCode: 200,
			result: result,
			message: 'createInfoHansungSchedule: 200'
		});
	} catch (err) {
		switch (err.message) {
			case 'InfoHansung does not exist':
				res.send({
					success: false,
					statusCode: 404,
					message: 'createInfoHansungSchedule: 40401'
				});
				break;
			default:
				res.send({
					success: false,
					statusCode: 500,
					message: 'createInfoHansungSchedule: 50000'
				});
				break;
		}
	}
}

/**
 * route: 인포한성 성적 생성
 * @param req
 * @param res
 */
async function createInfoHansungGrade(req, res): Promise<any> {
	try {
		const authUser = auth(req);
		let result = await infoHansungService.getInfoHansung(authUser.userHrn);

		if (result === null) {
			throw new Error('InfoHansung does not exist');
		}

		if (result && result.status === 'SUCCESS') {
			await infoHansungService.updateInfoHansung(authUser.userHrn, {
				summaryGrade: {},
				detailGrade: []
			});

			/** 인포한성 시간표 SQS 전송 */
			let params = sqsUtil.sendParams;
			sqsUtil.sendParams.MessageBody = JSON.stringify({
				method: 'createInfoHansungGrade',
				userHrn: result.userHrn,
				infoHansungId: result.infoHansungId,
				infoHansungPassword: result.infoHansungPassword
			});
			await sqsUtil.sendMessage(params);
		}

		result = await infoHansungService.getInfoHansung(authUser.userHrn);

		res.send({
			success: true,
			statusCode: 200,
			result: result,
			message: 'createInfoHansungGrade: 200'
		});
	} catch (err) {
		switch (err.message) {
			case 'InfoHansung does not exist':
				res.send({
					success: false,
					statusCode: 404,
					message: 'createInfoHansungGrade: 40401'
				});
				break;
			default:
				res.send({
					success: false,
					statusCode: 500,
					message: 'createInfoHansungGrade: 50000'
				});
				break;
		}
	}
}

/**
 * route: 인포한성 비교과포인트 생성
 * @param req
 * @param res
 */
async function createInfoHansungNonSubjectPoint(req, res): Promise<any> {
	try {
		const authUser = auth(req);
		let result = await infoHansungService.getInfoHansung(authUser.userHrn);

		if (result === null) {
			throw new Error('InfoHansung does not exist');
		}

		if (result && result.status === 'SUCCESS') {
			await infoHansungService.updateInfoHansung(authUser.userHrn, {
				nonSubjectPoint: {}
			});

			/** 인포한성 시간표 SQS 전송 */
			let params = sqsUtil.sendParams;
			sqsUtil.sendParams.MessageBody = JSON.stringify({
				method: 'createInfoHansungNonSubjectPoint',
				userHrn: result.userHrn,
				infoHansungId: result.infoHansungId,
				infoHansungPassword: result.infoHansungPassword
			});
			await sqsUtil.sendMessage(params);
		}

		result = await infoHansungService.getInfoHansung(authUser.userHrn);

		res.send({
			success: true,
			statusCode: 200,
			result: result,
			message: 'createInfoHansungNonSubjectPoint: 200'
		});
	} catch (err) {
		switch (err.message) {
			case 'InfoHansung does not exist':
				res.send({
					success: false,
					statusCode: 404,
					message: 'createInfoHansungNonSubjectPoint: 40401'
				});
				break;
			default:
				res.send({
					success: false,
					statusCode: 500,
					message: 'createInfoHansungNonSubjectPoint: 50000'
				});
				break;
		}
	}
}

/**
 * route: 인포한성 삭제
 * @param req
 * @param res
 */
async function deleteInfoHansung(req, res): Promise<any> {
	try {
		const authUser = auth(req);
		const result = await infoHansungService.deleteInfoHansung(authUser.userHrn);

		res.send({
			success: true,
			statusCode: 200,
			result: result,
			message: 'deleteInfoHansung: 200'
		});
	} catch (err) {
		switch (err.message) {
			default:
				res.send({
					success: false,
					statusCode: 500,
					message: 'deleteInfoHansung: 50000'
				});
				break;
		}
	}
}

export const infoHansungRoute: InfoHansungRoute = new InfoHansungRoute();
