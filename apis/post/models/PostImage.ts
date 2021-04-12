import { AllowNull, AutoIncrement, BelongsTo, Column, Comment, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { Post } from './Post';

@Table({
	tableName: 'PostImage',
	defaultScope: {
		attributes: [
			'hrn',
			'postHrn',
			'url',
			'referenceTable',
			'createdAt',
			'updatedAt'
		]
	}
})
@Table
export class PostImage extends Model<PostImage> {
	@BelongsTo(() => Post)
	post: Post;

	@Comment('이미지 인덱스')
	@PrimaryKey
	@AutoIncrement
	@Column({
		type: DataType.BIGINT
	})
	index: number;

	@Comment('postHrn')
	@AllowNull(false)
	@ForeignKey(() => Post)
	@Column({
		type: DataType.STRING
	})
	postHrn: string;

	@Comment('이미지 s3 url')
	@AllowNull(false)
	@Column({
		type: DataType.STRING
	})
	url: string;

	@Comment('이미지를 사용하는 테이블 이름')
	@AllowNull(false)
	@Column({
		type: DataType.STRING
	})
	referenceTable: string;

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

