import * as jwt from 'jsonwebtoken';
import { encryptPassword } from '../../../packages/utils/encryption.util';
import { FilterToQuery, FilterToQueryPageQuery } from '../../../packages/utils/filterToQuery.util';
import { jwtToken } from '../../../packages/utils/jwt.util';
import { User, UserAlarm, UserDevice, UserTerms } from '../models';
import moment = require('moment-timezone');

export interface ICreateUserData {
	hrn?: string,
	id: string,
	password: string,
	email: string,
	phone: string,
	name: string,
	deviceId: string,
	isAgreeMarketingTerms: boolean,
	isAgreePersonalInfoTerms: boolean,
	isAgreeServiceTerms: boolean
}

export interface ISignInUserData {
	id: string,
	password: string
}

export interface IUpdateUserData {
	email?: string,
	name?: string,
	status?: string
}

export class UserService {
	userFilter: FilterToQuery;

	constructor() {
		this.userFilter = new FilterToQuery({
			columns: [
				{
					alias: 'id',
					key: 'id',
				},
				{
					alias: 'status',
					key: 'status',
					publicFilter: {
						name: '상태',
						description: '상태'
					}
				},
				{
					alias: 'createdAt',
					key: 'createdAt',
				},
				{
					alias: 'updatedAt',
					key: 'updatedAt',
				}
			],
			include: []
		});
	}

	/**
	 * service: 유저 생성
	 * @param userData
	 */
	async createUser(userData: ICreateUserData) {
		try {
			let user = null;
			await User.sequelize.transaction(async (t) => {
				/** 유저 생성 */
				user = await User.create({
					id: userData.id,
					password: encryptPassword.getHash(userData.password),
					email: userData.email,
					phone: userData.phone,
					name: userData.name,
					status: 'ACTIVE'
				}, {
					transaction: t
				});

				if (user === null) {
					throw new Error('User does not exist');
				}

				/** 유저 디바이스 생성 */
				await UserDevice.create({
					userHrn: user.hrn,
					id: userData.deviceId,
					status: 'ACTIVE'
				}, {
					transaction: t
				});

				/** 유저 약관 생성 */
				await UserTerms.create({
					userHrn: user.hrn,
					marketingTerms: userData.isAgreeMarketingTerms === true ? moment.tz(new Date(), 'Asia/Seoul') : null,
					personalInfoTerms: userData.isAgreePersonalInfoTerms === true ? moment.tz(new Date(), 'Asia/Seoul') : null,
					serviceTerms: userData.isAgreeServiceTerms === true ? moment.tz(new Date(), 'Asia/Seoul') : null
				}, {
					transaction: t
				});

				/** 유저 알림 생성 */
				await UserAlarm.create({
					userHrn: user.hrn,
					isNoticeAlarm: true,
					isNonSubjectPointAlarm: true,
					isPostAlarm: true
				}, {
					transaction: t
				});
			});

			return user.toJSON();
		} catch (err) {
			throw err;
		}
	}

	/**
	 * service: 유저 로그인
	 * @param userData
	 */
	async signInUser(userData: ISignInUserData) {
		try {
			const user: any = await this.getUserById(userData.id);
			if (user.password === encryptPassword.getHash(userData.password)) {
				const token = await jwt.sign({
					userHrn: user.hrn,
					userId: user.id,
					userName: user.name
				}, jwtToken.secret, {algorithm: jwtToken.algorithm});

				return {
					...user,
					token: token
				}
			} else {
				throw new Error('User password incorrect');
			}
		} catch (err) {
			throw new Error('Token incorrect');
		}
	}

	/**
	 * service: 유저 수
	 * @param authFilter
	 * @param pageQuery
	 */
	async countUser(authFilter: any, pageQuery: FilterToQueryPageQuery = {filter: {}}) {
		try {
			/** 필터 추가 */
			const {
				where,
				include
			} = this.userFilter.parser(pageQuery, authFilter);

			const countUser = await User.count({
				distinct: true,
				where,
				include
			});

			return countUser;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * service: 유저 리스트
	 * @param authFilter
	 * @param pageQuery
	 */
	async listUser(authFilter: any, pageQuery: FilterToQueryPageQuery = {filter: {}}) {
		try {
			/** 필터 추가 */
			const {
				where,
				include,
				order,
				limit,
				offset
			} = this.userFilter.parser(pageQuery, authFilter);

			const users = await User.findAll({
				subQuery: false,
				where,
				include,
				order,
				limit,
				offset
			});

			return users.map(user => user.toJSON());
		} catch (err) {
			throw err;
		}
	}

	/**
	 * service: 유저 조회
	 * @param hrn
	 * @param scope
	 */
	async getUser(hrn: string, scope?: string) {
		try {
			scope = scope === undefined ? 'defaultScope' : scope;
			const user = await User.scope(`${scope}`).findOne({
				where: {
					hrn: hrn
				}
			});

			if (user === null) {
				throw new Error('User does not exist');
			}

			return user.toJSON();
		} catch (err) {
			throw err;
		}
	}

	/**
	 * service: 유저 아이디 조회
	 * @param id
	 */
	async getUserById(id: string) {
		try {
			const user = await User.findOne({
				subQuery: false,
				where: {
					id: id
				}
			});

			if (user === null) {
				throw new Error('User does not exist');
			}

			return user.toJSON();
		} catch (err) {
			throw err;
		}
	}

	/**
	 * service: 유저 아이디 존재 여부
	 * @param id
	 * @constructor
	 */
	async isExistUserById(id: string) {
		try {
			const user = await User.findOne({
				where: {
					id: id
				}
			});

			return user === null ? false : true;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * service: 유저 업데이트
	 * @param hrn
	 * @param userData
	 */
	async updateUser(hrn: string, userData: IUpdateUserData) {
		try {
			await User.update(userData, {
				where: {
					hrn: hrn
				}
			});

			return await this.getUser(hrn);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * service: 유저 비밀번호 업데이트
	 * @param hrn
	 * @param newPassword
	 */
	async updateUserPassword(hrn: string, newPassword: string) {
		try {
			const user: any = await this.getUser(hrn);
			const newEncryptPassword = encryptPassword.getHash(newPassword);

			if (user.password === newEncryptPassword) {
				throw new Error('Password is duplicated');
			}

			await User.update({
				password: encryptPassword.getHash(newPassword)
			}, {
				where: {
					hrn: hrn
				}
			});

			return await this.getUser(hrn);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * service: 유저 삭제
	 * @param hrn
	 */
	async deleteUser(hrn: string) {
		try {
			const user = await this.getUser(hrn);

			await User.destroy({
				where: {
					hrn: hrn
				}
			});

			return user;
		} catch (err) {
			throw err;
		}
	}
}

export const userService = new UserService();
