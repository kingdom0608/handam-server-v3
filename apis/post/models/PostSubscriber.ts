import { AllowNull, AutoIncrement, BelongsTo, Column, Comment, CreatedAt, DataType, Default, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { Post } from './Post';

@Table({
	tableName: 'PostSubscriber',
	defaultScope: {
		attributes: [
			'index',
			'postHrn',
			'userHrn',
			'isAlarm',
			'isBookmark',
			'isLike',
			'isHate',
			'createdAt',
			'updatedAt'
		]
	}
})
@Table
export class PostSubscriber extends Model<PostSubscriber> {
	@BelongsTo(() => Post)
	post: Post;

	@PrimaryKey
	@AutoIncrement
	@Column({
		type: DataType.BIGINT
	})
	index: number;

	@Comment('postHrn')
	@ForeignKey(() => Post)
	@AllowNull(false)
	@Column({
		type: DataType.STRING
	})
	postHrn: string;

	@Comment('userHrn')
	@AllowNull(false)
	@Column({
		type: DataType.STRING
	})
	userHrn: string;

	@Comment('알림 여부')
	@Default(true)
	@Column({
		type: DataType.BOOLEAN
	})
	isAlarm: boolean;

	@Comment('찜하기 여부')
	@Default(false)
	@Column({
		type: DataType.BOOLEAN
	})
	isBookmark: boolean;

	@Comment('좋아요 여부')
	@Default(false)
	@Column({
		type: DataType.BOOLEAN
	})
	isLike: boolean;

	@Comment('싫어요 여부')
	@Default(false)
	@Column({
		type: DataType.BOOLEAN
	})
	isHate: boolean;

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

