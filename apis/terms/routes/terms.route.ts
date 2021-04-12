import * as express from 'express';
import { loadTermsHtml } from '../service/terms.service';

export class TermsRoute {
	public termsRouter: express.Router = express.Router();

	constructor() {
		this.router();
	}

	public router() {
		this.termsRouter.get('/terms', getTerms);
	}
}

/**
 * route : 약관 조회
 */
async function getTerms(req, res) {
	const termsName = req.query.termsName;
	try {
		const result = await loadTermsHtml(termsName);
		res.send({
			success: true,
			statusCode: 200,
			result: result,
			message: 'getTerms: 200'
		});
	} catch (err) {
		switch (err) {
			case 'Terms does not exist':
				res.send({
					success: false,
					statusCode: 404,
					message: 'getTerms: 40401'
				});
				break;
			default:
				res.send({
					success: false,
					statusCode: 500,
					message: 'getTerms: 50000'
				});
				break;
		}
	}
}

export const termsRoute: TermsRoute = new TermsRoute();
