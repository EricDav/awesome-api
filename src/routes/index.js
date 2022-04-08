const express = require('express');
const router = express.Router();
const service = require('../services');

router.post('/posts', async (req, res) => {
    const result = await service.createPost(req.body)
    return res.json(result);
});

router.get('/posts', async (req, res) => {
    const result = await service.fetchPosts(req.query)
    return res.json(result);
});

router.get('/posts/:postId', async (req, res) => {
    const result = await service.getSinglePostData(req.params)
    return res.json(result);
});

router.post('/comments', async (req, res) => {
    const result = await service.addComment(req.body)
    return res.json(result);
});

router.get('/comments', async (req, res) => {
    const result = await service.fetchComments(req.query)
    return res.json(result);
});

module.exports = router;
