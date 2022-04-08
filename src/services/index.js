const db = require('./database');
const helper = require('../helpers')

const DEFAULT_LIMIT = 1;
const DEFAULT_LIST_PER_PAGE = 10;
const DEFAULT_PAGE_NUMBER = 1;

const createPost = async (data) => {
    try {

        const validation = helper.validateCreatePost(data);

        if (!validation.success) return validation;

        await db.query(
            'INSERT INTO posts(title, content, name) VALUES ($1, $2, $3) RETURNING *',
            [data.title, data.content, data.name]
        );

        return {
            success: true,
            message: 'post created successfully'
        }
    } catch (err) {
        return {
            success: false,
            message: err.message
        }
    }
}

const fetchSinglePost = async (postId) => {
    try {
        const rows = await db.query(
            'SELECT id from posts WHERE id = $1 LIMIT $2', 
            [postId, DEFAULT_LIMIT]
        );

        return rows;
    } catch(err) {
        console.log(err);
        return [];
    }
}

const getSinglePostData = async (data) => {
    try {
        const [posts, comments] = await Promise.all([
            db.query(
                'SELECT * from posts WHERE id = $1 LIMIT $2', 
                [data.postId, DEFAULT_LIMIT]
            ),
            db.query(
                'SELECT * from comments WHERE "postId" = $1 ORDER BY "createdAt" DESC', 
                [data.postId]
            )
        ]);

        if (posts.length === 0) {
            return {
                success: false,
                message: 'Post not found'
            }
        }

        posts[0].comments = formatComments(comments);
        return {
            success: true,
            data: posts[0]
        }
    } catch (err) {
        console.log(err)
        return {
            success: false,
            message: err.message
        }
    }
}

const addCommentRoots = (comment, comments) => {
    children = comments.filter((c) => c.commentId === comment.id);

    if (children.length == 0) return;
    comment.replies = children;

    children.forEach((child) => {
        addCommentRoots(child, comments)
    })
}

const formatComments = (comments) => {
    const  topLevelComments = [];
    const childComments = [];

    comments.forEach((comment) => {
        if (comment.commentId) {
            childComments.push(comment)
        } else {
            topLevelComments.push(comment)
        }
    });

    if (topLevelComments.length === comments.length) {
        return topLevelComments;
    }

    topLevelComments.forEach((comment) => {
        addCommentRoots(comment, childComments);
    });

    return topLevelComments;
}
 
const addComment = async (data) => {
    try {
        const validation = helper.validateAddComment(data);

        if (!validation.success) return validation;
        const rows = await fetchSinglePost(data.postId);
        if (rows.length === 0) {
            return {
                success: false,
                message: 'Post not found'
            }
        }

        await db.query(
            'INSERT INTO comments(content, "postId", name, "commentId") VALUES ($1, $2, $3, $4) RETURNING *',
            [data.content, data.postId, data.name, data.commentId]
        );

        return {
            success: true,
            message: 'Comment added successfully'
        }
    } catch (err) {
        return {
            success: false,
            message: err.message
        }
    }
}

const fetchPosts = async (data) => {
    try {
        const limit = data.limit ? Number.parseInt(data.limit) : DEFAULT_LIMIT;
        const pageNumnber = data.pageNumber ? Number.parseInt(data.pageNumber) : DEFAULT_PAGE_NUMBER;
        const offset = (pageNumnber - 1) * limit

        const [rows, countRows]  = await Promise.all([db.query(
            'SELECT * from posts OFFSET $1 LIMIT $2', 
            [offset, limit]
        ), db.query(
            'SELECT count(*) from posts', 
            []
        )]);

        return {
            success: true,
            data: rows,
            total: countRows[0].count
        }
    } catch (err) {
        return {
            success: false,
            data: err.message
        }
    }
} 

const fetchComments = async (postId) => {
    try {
        const postRows = fetchSinglePost(data.postId);
        if (postRows.length === 0) {
            return {
                success: false,
                message: 'Post not found'
            }
        }
        const rows = await db.query(
            'SELECT * from comments WHERE "postId" = $1', 
            [postId]
        );

        return {
            success: true,
            data: rows
        }
    } catch(err) {
        return {
            success: false,
            data: err.message
        }
    }
}

module.exports = {
    createPost,
    fetchSinglePost,
    addComment,
    fetchComments,
    fetchPosts,
    getSinglePostData
}
