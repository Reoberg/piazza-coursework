const express = require('express')
const router = express.Router()

const Post = require("../models/Post")

const  verifyToken = require("../verifyToken")
const {postValidation} = require("../validations/validation");
const User = require("../models/User");

async function updateAllPostsLiveStatus() {
    try {
        // Find all posts in the database
        const allPosts = await Post.find();

        // Iterate through each post and update isLive status
        for (const post of allPosts) {
            post.checkAndUpdateIsLive();
            await post.save();
        }

        console.log("All posts updated successfully.");
    } catch (error) {
        console.error("Error updating posts:", error.message);
    }
}

router.post('/post',verifyToken, async (req, res) =>{
    const user = req.user.username
    await updateAllPostsLiveStatus()
    //Validation 1 to check post inputs
    const {error} =  (postValidation(req.body))
    if (error){
        res.status(400).send(error['details'][0].message)
    }
    //Validation 2 to check if post exist!
    const userExists = await Post.findOne({title:req.body.title})
    if(userExists){
        return res.status(400).send({message:"User already exist"})
    }
   // Create New Post
    const post = new Post({
        username:user,
        title:req.body.title,
        categories:req.body.categories,
        message_body:req.body.message_body,
        //expirationTime: new Date (Date.now() + (req.body.expirationTime * 60000)) //60000 milisecond is 1 minute

    })
    try {
        const savedPost = await post.save()
        res.send(savedPost)
    }
    catch (err){
        res.status(400).send({message:err})
    }

})
router.patch('/comment', verifyToken,async (req, res) =>{
    await updateAllPostsLiveStatus()
    const comment_owner = req.user.username;
    const comment_body = req.body.comment_body;
    const postID = req.body._id;

    const updatedPost = await Post.findById(postID)

    if(updatedPost.username === comment_owner){
        return res.status(404).send({ message: "Owner can't comment on own post!" });
    }
    if(updatedPost.isLive === false){
        return res.status(404).send({ message: "Post is not live!" });
    }
    if (!updatedPost) {
        return res.status(404).send({ message: "Post not found" });
    }
    updatedPost.comments.push({
        comment_owner: comment_owner,
        comment_body: comment_body
    })
    console.log(`${comment_owner} made comment on ${updatedPost.username}'s post.`);
    await updatedPost.save();
    res.send(updatedPost)
})
router.patch('/like',verifyToken, async (req, res) => {
    const user = req.user.username
    await updateAllPostsLiveStatus()

    // Like the post
    try {
        const post = req.body._id; // Assuming the client sends the postId in the request body

        if (!post) {
            return res.status(400).send({ message: "Post ID is missing" });
        }

        // Find the post by ID and update the 'like' field
        const updatedPost = await Post.findById(post, );
        if(updatedPost.username === user){
            return res.status(404).send({ message: "Owner can't like own post!" });
        }
        if(updatedPost.isLive === false){
            return res.status(404).send({ message: "Post is not live!" });
        }
        if (!updatedPost) {
            return res.status(404).send({ message: "Post not found" });
        }
        updatedPost.like += 1;
        const increasedPost = await updatedPost.save();
        console.log(`${user} liked this post in ${increasedPost.categories} category named ${increasedPost.title}.`);
        res.send(increasedPost);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});
router.patch('/dislike',verifyToken, async (req, res) =>{
    const user = req.user.username
    await updateAllPostsLiveStatus()
    try {
        const post = req.body._id; // Assuming the client sends the postId in the request body

        if (!post) {
            return res.status(400).send({ message: "Post ID is missing" });
        }

        // Find the post by ID and update the 'dislike' field
        const updatedPost = await Post.findById(post);

        if(updatedPost.username === user){
            return res.status(404).send({ message: "Owner can't like own post!" });
        }
        if(updatedPost.isLive === false){
            return res.status(404).send({ message: "Post is not live!" });
        }
        if (!updatedPost) {
            return res.status(404).send({ message: "Post not found" });
        }
        updatedPost.dislike += 1;
        const increasedPost = await updatedPost.save();
        console.log(`${user} disliked this post in ${increasedPost.categories} category named ${increasedPost.title}.`);
        res.send(increasedPost);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
})
router.get('/all', verifyToken , async (req, res) =>{
    await  updateAllPostsLiveStatus()
    try{
    const posts = await Post.find()
    res.send(posts)
}
   catch(err){
    res.status(400).send({message:err})
}

})
router.get('/category-live',verifyToken, async (req, res) => {
    const user = req.user.username;
    await updateAllPostsLiveStatus()
    try {
        const category = req.body.categories;

        if (!category) {
            return res.status(400).send({ message: "Category parameter is missing" });
        }
        const posts = await Post.find({ categories: category, isLive: true });
        console.log(`${user} searched the all live posts in ${category} category.`);
        res.send(posts);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});
router.get('/category-all',verifyToken, async (req, res) => {
    const user = req.user.username;
    await updateAllPostsLiveStatus()
    try {
        const category = req.body.categories;

        if (!category) {
            return res.status(400).send({ message: "Category parameter is missing" });
        }
        const posts = await Post.find({ categories: category});
        console.log(`${user} searched the all posts in ${category} category.`);
        res.send(posts);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});
router.get('/category-expired',verifyToken, async (req, res) => {
    const user = req.user.username;
    await updateAllPostsLiveStatus()
    try {
        const category = req.body.categories;

        if (!category) {
            return res.status(400).send({ message: "Category parameter is missing" });
        }
        const posts = await Post.find({ categories: category, isLive: false });
        console.log(`${user} searched the all expired posts in ${category} category.`);
        res.send(posts);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});
router.get('/category-mostInteresting',verifyToken, async (req, res) => {
    const user = req.user.username;
    await updateAllPostsLiveStatus()
    try {
        const category = req.body.categories;

        if (!category) {
            return res.status(400).send({ message: "Category parameter is missing" });
        }
        const posts = await Post.find({ categories: category, isLive: true })
            .sort({ like: -1, dislike: -1 }) // Sort in descending order based on like and dislike
            .exec();

        console.log(`${user} searched the most interesting post in ${category} category.`);
        res.send(posts);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});
module.exports = router