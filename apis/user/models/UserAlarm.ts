import { AllowNull, AutoIncrement, BelongsTo, Column, Comment, CreatedAt, DataType, Default, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { User } from './User';

@Table({
	tableName: 'UserAlarm',
	defaultScope: {
		attributes: [
			'index',
			'userHrn',
			'isNoticeAlarm',
			'isNonSubjectPointAlarm',
			'isPostAlarm',
			'createdAt',
			'updatedAt'
		]
	}
})
@Table
export class UserAlarm extends Model<UserAlarm> {
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

	@Comment('공지사항 알림 여부')
	@Default(true)
	@Column({
		type: DataType.BOOLEAN
	})
	isNoticeAlarm: boolean;

	@Comment('비교과포인트 알림 여부')
	@Default(true)
	@Column({
		type: DataType.BOOLEAN
	})
	isNonSubjectPointAlarm: boolean;

	@Comment('게시글 알림 여부')
	@Default(true)
	@Column({
		type: DataType.BOOLEAN
	})
	isPostAlarm: boolean;

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
