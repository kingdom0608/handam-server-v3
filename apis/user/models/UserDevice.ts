import { AllowNull, AutoIncrement, BelongsTo, Column, Comment, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { User } from './User';

@Table({
	tableName: 'UserDevice',
	defaultScope: {
		attributes: [
			'index',
			'userHrn',
			'id',
			'token',
			'info',
			'status',
			'createdAt',
			'updatedAt'
		]
	}
})
@Table
export class UserDevice extends Model<UserDevice> {
	@BelongsTo(() => User)
	user: User

	@Comment('인덱스')
	@PrimaryKey
	@AutoIncrement
	@Column({
		type: DataType.BIGINT
	})
	index: number;

	@Comment('유저 Hrn')
	@ForeignKey(() => User)
	@AllowNull(false)
	@Column({
		type: DataType.STRING
	})
	userHrn: string;

	@Comment('아이디')
	@AllowNull(true)
	@Column({
		type: DataType.STRING
	})
	id: string;

	@Comment('토큰')
	@AllowNull(true)
	@Column({
		type: DataType.STRING
	})
	token: string;

	@Comment('정보')
	@AllowNull(true)
	@Column({
		type: DataType.TEXT
	})
	info: string;

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
