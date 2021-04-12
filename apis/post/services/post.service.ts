import {FilterToQuery, FilterToQueryPageQuery} from '../../../packages/utils/filterToQuery.util';
import {Post} from '../models';

interface ICreatePostData {
    title: string,
    content: string,
    userHrn: string,
}

interface IUpdatePostData {
    title?: string,
    content?: string,
    status?: string,
}

export class PostService {
    postFilter: FilterToQuery;

    constructor() {
        this.postFilter = new FilterToQuery({
            columns: [
                {
                    alias: 'hrn',
                    key: 'hrn'
                },
                {
                    alias: 'title',
                    key: 'title'
                },
                {
                    alias: 'content',
                    key: 'content'
                },
                {
                    alias: 'status',
                    key: 'status',
                    publicFilter: {
                        name: '상태',
                        description: '상태'
                    }
                },
                {
                    alias: 'userHrn',
                    key: 'usrHrn',
                    publicFilter: {
                        name: '작성자 유저 Hrn',
                        description: '작성자 유저 Hrn'
                    }
                },
                {
                    alias: 'createdAt',
                    key: 'createdAt'
                },
                {
                    alias: 'updatedAt',
                    key: 'updatedAt'
                }
            ],
            include: []
        })
    }

    /**
     * service: 게시글 생성
     * @param postData
     */
    async createPost(postData: ICreatePostData) {
        try {
            let post: Post = null;
            await Post.sequelize.transaction(async (t) => {
                post = await Post.create({
                    title: postData.title,
                    content: postData.content,
                    userHrn: postData.userHrn,
                    status: 'ACTIVE'
                })
            })

            return post.toJSON();
        } catch (err) {
            throw err;
        }
    }

    async listPost(authFilter: any, pageQuery: FilterToQueryPageQuery) {
        try {
            /** 필터 추가 */
            const {
                where,
                include,
                order,
                limit,
                offset
            } = this.postFilter.parser(pageQuery, authFilter);
            const posts = await Post.findAll({
                where,
                include,
                order,
                limit,
                offset
            })

            return posts.map(post => post.toJSON())
        } catch (err) {

        }
    }

    /**
     *  service: 게시글 조회
     * @param hrn
     * @param scope
     */
    async getPost(hrn: string, scope?: string) {
        try {
            scope = scope === undefined ? 'defaultScope' : scope;
            const post = await Post.scope(`${scope}`).findOne({
                where: {
                    hrn: hrn
                }
            });

            if (post === null) {
                throw new Error('Post does not exist');
            }

            return post.toJSON();

        } catch (err) {
            throw err;
        }
    }

    async updatePost(hrn: string, postData: IUpdatePostData) {
        try {
            await Post.update(postData, {
                where: {
                    hrn: hrn
                }
            })

            return await this.getPost(hrn);
        } catch (err) {
            throw err;
        }
    }

    async deletePost(hrn: string) {
        try {
            const post: any = await this.getPost(hrn);
            await Post.destroy({
                where: {
                    hrn: hrn
                }
            })

            return post;

        } catch (err) {
            throw err;
        }
    }
}

export const postService = new PostService();
