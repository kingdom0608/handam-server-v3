import { AllowNull, AutoIncrement, BelongsTo, Column, Comment, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { Post } from './Post';

@Table({
	tableName: 'PostTag',
	defaultScope: {
		attributes: [
			'index',
			'postHrn',
			'name',
			'createdAt',
			'updatedAt'
		]
	}
})
@Table
export class PostTag extends Model<PostTag> {
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

	@Comment('이름')
	@AllowNull(true)
	@Column({
		type: DataType.STRING
	})
	name: string;

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

