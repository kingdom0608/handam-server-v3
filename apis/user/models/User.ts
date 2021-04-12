import { AllowNull, Column, Comment, CreatedAt, DataType, Default, HasMany, HasOne, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import config from '../../../config';
import { uuidV4 } from '../../../packages/utils/uuid.util';
import { UserAlarm } from './UserAlarm';
import { UserDevice } from './UserDevice';
import { UserTerms } from './UserTerms';

@Table({
	tableName: 'User',
	defaultScope: {
		attributes: [
			'hrn',
			'id',
			'password',
			'email',
			'phone',
			'name',
			'status',
			'createdAt',
			'updatedAt'
		]
	},
	scopes: {
		devices: {
			include: [
				{
					model: UserDevice,
					as: 'devices'
				}
			]
		}
	},
	indexes: [
		{
			fields: ['id'],
			using: 'BTREE',
			unique: true
		},
		{
			fields: ['status'],
			using: 'BTREE',
			unique: false
		}
	]
})
@Table
export class User extends Model<User> {
	@HasMany(() => UserDevice)
	devices: UserDevice[]

	@HasOne(() => UserTerms)
	terms: UserTerms

	@HasOne(() => UserAlarm)
	userAlarm: UserTerms

	@PrimaryKey
	@Default(() => `hrn:${config.get().stage}:user:${uuidV4()}`)
	@Column({
		type: DataType.STRING
	})
	readonly hrn: string;

	@Comment('아이디')
	@AllowNull(false)
	@Column({
		type: DataType.STRING
	})
	id: string;

	@Comment('비밀번호')
	@AllowNull(false)
	@Column({
		type: DataType.STRING
	})
	password: string;

	@Comment('이메일')
	@AllowNull(false)
	@Column({
		type: DataType.STRING
	})
	email: string;

	@Comment('핸드폰')
	@AllowNull(false)
	@Column({
		type: DataType.STRING
	})
	phone: string;

	@Comment('이름')
	@AllowNull(false)
	@Column({
		type: DataType.STRING
	})
	name: string;

	@Comment('상태')
	@AllowNull(false)
	@Column({
		type: DataType.STRING
	})
	status: string;

	@Comment('생성 일자')
	@AllowNull(false)
	@CreatedAt
	@Column
	createdAt: Date;

	@Comment('갱신 일자')
	@AllowNull(false)
	@UpdatedAt
	@Column
	updatedAt: Date;
}
