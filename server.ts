import * as express from 'express';
import chalk from 'chalk';
import config from './config';
import { Server } from './app';
import { connection } from './rdb/connect';

const port: number = 80;
const app: express.Application = new Server().app;

app.set('port', port);
app.listen(app.get('port'), async () => {
	console.log(chalk.rgb(0, 153, 255)`STAGE:`, config.get().stage);
	console.log(chalk.rgb(0, 153, 255)`MYSQL_HOST:`, config.get().mysql.host);
	console.log(chalk.rgb(0, 153, 255)`MYSQL_USER:`, config.get().mysql.user);
	console.log(chalk.rgb(0, 153, 255)`MYSQL_PASSWORD:`, config.get().mysql.password);
	console.log('handam server listening on port', port);

	await connection();

	/** 스테이지 분기 처리 */
	if (config.get().stage === 'dv' || config.get().stage === 'prod') {
		// TODO(@jade): 슬랙 메시지 추가  date: 2020/06/30 9:39 오후
	}
}).on('error', err => {
	console.error(err);
});
