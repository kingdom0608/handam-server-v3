import { AllowNull, Column, Comment, CreatedAt, DataType, Default, HasMany, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import config from '../../../config';
import { uuidV4 } from '../../../packages/utils/uuid.util';
import { PostImage } from './PostImage';
import { PostSubscriber } from './PostSubscriber';
import { PostReply } from './PostReply';
import { PostTag } from './PostTag';

@Table({
	tableName: 'Post',
	defaultScope: {
		attributes: [
			'hrn',
			'title',
			'content',
			'userHrn',
			'status',
			'createdAt',
			'updatedAt'
		]
	}
})
@Table
export class Post extends Model<Post> {
	@HasMany(() => PostReply)
	postReplies: PostReply[];

	@HasMany(() => PostSubscriber)
	postSubscribers: PostSubscriber[];

	@HasMany(() => PostTag)
	postTags: PostTag[];

	@HasMany(() => PostImage)
	postImages: PostImage[];

	@Comment('Post Hrn')
	@PrimaryKey
	@Default(() => `hrn:${config.get().stage}:user:${uuidV4()}`)
	@Column({
		type: DataType.STRING
	})
	readonly hrn: string;

	@Comment('글 제목')
	@AllowNull(false)
	@Column({
		type: DataType.STRING
	})
	title: string;

	@Comment('글 내용')
	@AllowNull(false)
	@Column({
		type: DataType.TEXT
	})
	content: string;

	@Comment('글 내용')
	@AllowNull(false)
	@Column({
		type: DataType.TEXT
	})
	status: string;

	@Comment('작성자 유저 hrn')
	@AllowNull(false)
	@Column({
		type: DataType.STRING
	})
	userHrn: string;

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

