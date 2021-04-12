import { AllowNull, AutoIncrement, BelongsTo, Column, Comment, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { PostReply } from '../models';

@Table({
	tableName: 'PostSubReply',
	defaultScope: {
		attributes: [
			'index',
			'postReply',
			'userHrn',
			'content',
			'createdAt',
			'updatedAt'
		]
	}
})
@Table
export class PostSubReply extends Model<PostSubReply> {
	@BelongsTo(() => PostReply)
	postReply: PostReply

	@PrimaryKey
	@AutoIncrement
	@Column({
		type: DataType.BIGINT
	})
	index: number;

	@Comment('postReplyIndex')
	@ForeignKey(() => PostReply)
	@Column({
		type: DataType.BIGINT
	})
	postReplyIndex: number;

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

