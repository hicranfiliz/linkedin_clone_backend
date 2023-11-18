
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Post  =require('../models/Post');

const {S3Client, PutObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3');
const { v4: uuidv4} = require('uuid');

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const { getSignedUrl} = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
    credentials:{
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
});

const getAllPosts  =async (req,res) =>{
    try {
        const posts = await Post.find();
        if(!posts) return res.status(204).json({'message':'No posts found'});

        for( const post of posts){
            const getObjectParams = {
                Bucket : bucketName,
                Key: post.postNameUrl
            }

            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3,command,{expiresIn: 360000});
            post.awsUrl  =url;

            const uid = post.ownerId
            const user = await User.findOne({_id: uid}).exec();
            post.name = user.name
            post.lastName = user.lastName
        }
        
        res.json(posts)
    } catch (err) {
        console.log(err);
    }
}

const CreatePost = async (req,res) => {
    console.log(req.file.buffer);
    if(!req.body?.description || !req.body?.ownerId){
        return res.status(400).json({'message':'All fields required'})
    }
    try {
        const imageString = uuidv4();
        const params = {
            Bucket : bucketName,
            Key : imageString,
            Body : req.file.buffer,
            ContentType: req.file.mimeType
        }
        const command = new PutObjectCommand(params);
        await s3.send(command)
        
        const newPost = await Post.create({
            description: req.body.description,
            name: 'default',
            lastName:'default',
            ownerId: req.body.ownerId,
            postNameUrl: imageString
        
        });

        res.send(201).json(newPost);
            
    } catch (err) {
        console.error(err);
    }
}

const handleLogin = async (req,res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email:email});
        if(!user) return res.status(400).json({msg: 'user does not exist'});

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({msg: 'invalid credentials '});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        delete user.password;
        res.status(200).json({token,user})
        console.log(res)
        
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

const handleRegister = async (req,res) =>{
    try {
        const {email, password, name, lastName} = req.body;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            lastName
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    } catch (err) {
        res.status(500).json({error:err.message})
    }
}
module.exports = {handleLogin,handleRegister,CreatePost,getAllPosts}