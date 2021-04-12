import * as bodyParser from 'body-parser';
import * as express from 'express';
import { infoHansungRoute } from './apis/hansung/routes';
import { termsRoute } from './apis/terms/routes';
import { signRoute, userAlarmRoute, userRoute } from './apis/user/routes';
import { notFoundError, serverError } from './middlewares/error.middleware';

export class Server {
	/** app 에 대한 타입 설정 */
	public app: express.Application;

	constructor() {
		/** express 설정을 위한 express 선언 */
		this.app = express();
		/** 서버 헬스체크 */
		this.app.get('/console', function(req, res) {
			res.send('handam-server is Running');
		});
		/** bodyParser 선언 */
		this.app.use(bodyParser.urlencoded({extended: false}));
		this.app.use(bodyParser.json());
		/** 라우터 추가 */
		this.app.use(signRoute.signRouter);
		this.app.use(userRoute.userRouter);
		this.app.use(userAlarmRoute.userAlarmRouter);
		this.app.use(termsRoute.termsRouter);
		this.app.use(infoHansungRoute.infoHansungRouter);
		/** 라우터 오류 처리 */
		this.app.use(notFoundError);
		this.app.use(serverError);
	}
}
