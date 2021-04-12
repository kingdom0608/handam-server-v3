import { AllowNull, AutoIncrement, BelongsTo, Column, Comment, CreatedAt, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { Post, PostSubReply } from '../models';
import { PostReplySubscriber } from './PostReplySubscriber';

@Table({
	tableName: 'PostReply',
	defaultScope: {
		attributes: [
			'index',
			'postHrn',
			'userHrn',
			'content',
			'createdAt',
			'updatedAt'
		]
	}
})
@Table
export class PostReply extends Model<PostReply> {
	@BelongsTo(() => Post)
	post: Post;

	@HasMany(() => PostSubReply)
	postSubReplies: PostSubReply[];

	@HasMany(() => PostReplySubscriber)
	postSubReplySubscribers: PostReplySubscriber[];

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

	@Comment('댓글 내용')
	@AllowNull(false)
	@Column({
		type: DataType.TEXT
	})
	content: string;

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

