import { Post, PostImage, PostSubscriber, PostReply, PostSubReply, PostTag, PostReplySubscriber } from '../apis/post/models';
import { User, UserAlarm, UserDevice, UserTerms } from '../apis/user/models';
import { Rdb } from './rdb';
import config from '../config';

const modelList = [
	User,
	UserDevice,
	UserTerms,
	UserAlarm,
	Post,
	PostImage,
	PostTag,
	PostSubscriber,
	PostReply,
	PostReplySubscriber,
	PostSubReply,
];

const rdbConfig = {
	stage: config.get().stage,
	database: config.get().mysql
};

export async function connection() {
	return new Rdb('handam', modelList, {
		stage: rdbConfig.stage,
		connection: rdbConfig.database,
		databasePrefixSeparator: '-'
	});
}

export async function sync() {
	const rdb = await this.connection();
	await rdb.sync({force: true});
	return 'sync success';
}

export async function reset(confirmString: string) {
	const rdb = new Rdb('handam', modelList, {
		stage: rdbConfig.stage,
		connection: rdbConfig.database,
		databasePrefixSeparator: '-'
	});

	await rdb.reset(confirmString);
	return 'reset success';
}
