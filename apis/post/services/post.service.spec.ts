import { expect } from 'chai';
import { connection } from '../../../rdb/connect';
import { postService } from './post.service'

const MOCK_POST = {
    title: '테스트게시글',
    content: "테스트 게시글 내용",
    userHrn: 'userHrn'
}

before(async () => {
    await connection();
})

describe('postService', () => {

    let post;

    beforeEach(async ()=>{
        post = await  postService.createPost(MOCK_POST);
    })
    afterEach(async()=>{
        await postService.deletePost(post.hrn)
    })

    describe('createPost', () => {
        const CREATE_MOCK_POST= {
            ...MOCK_POST,
            title: 'new post'
        }
        it('should be ready', async () => {
            expect(postService).to.exist;
        });

        it('should create expected', async () => {
            const result: any = await postService.createPost({
                ...CREATE_MOCK_POST
            })

            // console.log(result);
            delete result.createdAt;
            delete result.updatedAt;
            expect(result).to.be.equal({
                hrn: result.hrn,
                status:'ACTIVE',
                ...CREATE_MOCK_POST,
            });
        });
    });

    describe('listPost', async () => {
        it('should get list expected', async () => {
            const result: any = await postService.listPost({
                title: MOCK_POST.title
            },{
                filter: {
                    status: 'ACTIVE'
                }
            });

            delete result[0].createdAt;
            delete result[0].updatedAt;

            console.log(result[0]);
            console.log({
                hrn: post.hrn,
                ...MOCK_POST,
                status: 'ACTIVE',
            });

            expect(result[0]).to.be.equal({
                hrn: post.hrn,
                ...MOCK_POST,
                status: 'ACTIVE',
            });
        });
    });

    describe('get post service', async () => {
        it('should get expected', async () => {
            const result: any = await postService.getPost(post.hrn)
            delete result.createdAt;
            delete result.updatedAt;

            expect(result).to.be.eqls({
                hrn: post.hrn,
                ...post,
                status:'ACTIVE',
            })
        });
    });

    describe('update post service', async () => {
        const UPDATE_MOCK_POST = {
            hrn: post.hrn,
            ...MOCK_POST,
            title: 'update post'
        }

        it('should update expected', async () => {
            const result: any = await postService.updatePost(post.hrn,{
                    ...UPDATE_MOCK_POST})
            delete result.createdAt;
            delete result.updatedAt;

            expect(result).to.be.eqls({
                hrn: post.hrn,
                ...UPDATE_MOCK_POST,
                status:'ACTIVE',
            })
        });

    });

    describe('delete post service', async () => {
        it('should delete expected', async () => {
            const result: any = await postService.deletePost(post.hrn);
            delete result.createdAt;
            delete result.updatedAt;

            expect(result).to.be.eqls({
                ...post,
                status:'ACTIVE',
            })
        });
    });
})