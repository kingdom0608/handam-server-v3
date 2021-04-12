import { userService } from '../apis/user/services';
import config from '../config';
import { uuidV4 } from '../packages/utils/uuid.util';
import {postService} from "../apis/post/services/post.service";

export class Seed {
	constructor() {
	}
	async post() {
		const posts = [
			{
				hrn: `hrn:${config.get().stage}:post:${uuidV4()}`,
				title:'test title',
				content:'test content',
				userHrn:`hrn:${config.get().stage}:user:${uuidV4()}`,
			}
		]
		for (const row of posts) {
			await postService.createPost(row);
		}

		console.log('Complete posts seed');
	}
	async user() {
		const users = [
			{
				hrn: `hrn:${config.get().stage}:user:${uuidV4()}`,
				id: 'mochatestuser',
				password: 'mochatestuser',
				email: 'mochatestuser@roundoff.co.kr',
				phone: '01012345678',
				name: '모카테스트유저',
				deviceId: 'mochatestuser',
				isAgreeMarketingTerms: false,
				isAgreePersonalInfoTerms: true,
				isAgreeServiceTerms: true
			}
		]

		for (const row of users) {
			await userService.createUser(row);
		}

		console.log('Complete user seed');
	}

	async role() {
		const roles = [
			{
				key: 'ADMIN',
				name: '관리자',
				description: '관리자',
				status: 'ACTIVE'
			},
			{
				key: 'GENERAL',
				name: '일반',
				description: '일반',
				status: 'ACTIVE'
			}
		];

		console.log('Complete role seed');
	}
}

export const seed = new Seed();
