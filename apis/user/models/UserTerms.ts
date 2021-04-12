import { AllowNull, AutoIncrement, BelongsTo, Column, Comment, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { User } from './User';

@Table({
	tableName: 'UserTerms',
	defaultScope: {
		attributes: [
			'index',
			'userHrn',
			'marketingTerms',
			'personalInfoTerms',
			'serviceTerms',
			'createdAt',
			'updatedAt'
		]
	}
})
@Table
export class UserTerms extends Model<UserTerms> {
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

	@Comment('마케팅 정보')
	@AllowNull(true)
	@Column({
		type: DataType.DATE
	})
	marketingTerms: Date;

	@Comment('개인 정보')
	@AllowNull(true)
	@Column({
		type: DataType.DATE
	})
	personalInfoTerms: Date;

	@Comment('서비스 정보')
	@AllowNull(true)
	@Column({
		type: DataType.DATE
	})
	serviceTerms: Date;

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
