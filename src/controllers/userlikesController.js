const jwt = require('jsonwebtoken');
const likes = require("../models/likeSchemas");
const { ErrorHandler } = require("../utils/errorhandler");
var ObjectId = require('mongodb').ObjectID;
const { success } = require("../utils/success");
const User = require("../models/userSchema");
const likeSchemas = require('../models/likeSchemas');
const user = require('../models/userSchema');
const dotenv = require('dotenv');
dotenv.config({path:'../config.env'})
const mongojs = require('mongojs');

exports.postliikes = async (req, res) => {
    try {
        const like =  new likes(req.body);
        const likeRes = await like.save();
        const pipeline = await likes.find({ from_userid: req.body.to_userid, to_userid: req.body.from_userid })
        let from_userid = pipeline.length > 0 ? pipeline[0].from_userid : likeRes.from_userid;
        let to_userid = pipeline.length > 0 ? pipeline[0].from_userid : likeRes.to_userid
        const fromUserRes = await User.findById({_id:req.body.from_userid})
        const toUserRes = await User.findById({_id:req.body.to_userid})
        console.log(pipeline);
        if (fromUserRes === null)
            res.status(404).json(ErrorHandler(`User not found with ${from_userid}`, 404));
        if (toUserRes === null)
            res.status(404).json(ErrorHandler(`User not found with ${to_userid}`, 404));

        let result = {
            from_user: {
                id: from_userid,
                name: `${fromUserRes.firstname} ${fromUserRes.lastname}`,
                profile: fromUserRes.image
            },
            to_user: {
                id: to_userid,
                name: `${toUserRes.firstname} ${toUserRes.lastname}`,
                profile: toUserRes.image
            },
            isMatched: pipeline.length > 0 ? true : false,
        }
        if (pipeline.length > 0) {
            const db=new mongojs(process.env.DATABASE);
            db.likeschemas.updateMany(
                {
                    from_userid: ObjectId(req.body.from_userid),
                    to_userid: ObjectId(req.body.to_userid),
                    liked:true
                },
                { $set: { isMatched : true } },
                {multi: true}
             );

             db.likeschemas.updateMany(
                {
                    from_userid: ObjectId(req.body.to_userid),
                    to_userid: ObjectId(req.body.from_userid),
                    liked:true
                },
                { $set: { isMatched : true } },
                {multi: true}
             );
            res.status(200).json(success('user have a match', { ...result }, res.statusCode));
        } else {
            res.status(201).json(success('user likes', { ...result }, res.statusCode));
        }
    }
    catch (e) {
        return res.status(500).json(ErrorHandler(e.message, 500));
    }
};

exports.getlikesbyusers = async (req, res) => {
    try {
        let pipeline = [
            {
                $match: { to_userid: ObjectId(req.params.id),isMatched: false }
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "from_userid",
                    foreignField: "_id",
                    as: "likeduser"
                }
            }
        ];

        const users = await likes.aggregate(pipeline);
        res.status(200).json(success('user likes', { users }, res.statusCode));
    }
    catch (e) {
        return res.status(500).json(ErrorHandler(e.message, 500));
    }
}

exports.rejectUser = async (req, res) => {
    try{
        let user = await likes.findByIdAndDelete(req.params.id,{new:true});
        res.status(200).json(success('user deleted successfully', { user }, res.statusCode));
    }
    catch(err){
        return res.status(500).json(ErrorHandler(e.message, 500));

    }
}

exports.getamatchbyusers = async (req, res) => {
    try {
        const pipeline = await likes.find({ from_userid: req.body.to_userid, to_userid: req.body.from_userid })
        console.log("pipeline", pipeline.length > 0);
        if (pipeline.length > 0) {
            res.status(200).json(success('user have a match', { pipeline }, res.statusCode));
        }
        else {
            res.status(204).send("user do not  have a match")
        }
    } catch (error) {
        return res.status(500).json(ErrorHandler(error.message, 500));
    }
}


exports.updateLikeViewStatus = async (req, res) => {
    const decodedData = jwt.verify(req.headers.token, 'test');
    try {
        const likeResponse = await likeSchemas.findOne({
            from_userid: req.params.id,
            to_userid: decodedData.id
        })
        const result = await likeSchemas.findByIdAndUpdate(likeResponse._id, { isViewed: true }, { new: true })
        return res.status(200).json({ result, message: "Updated successfully" })
    } catch (error) {
        return res.status(500).json(ErrorHandler(error.message, 500));
    }
}

exports.getNotLikedUsers = async (req, res) => {
    try {
        const allUsers = await user.aggregate([
            {
                $lookup: {
                    from: "likeschemas",
                    let: { to_userid: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$$to_userid", "$to_userid"] },
                                from_userid: ObjectId(req.params.id),
                            }
                        },
                    ],
                    as: "users"
                }
            },
            { $match: { users: [] } },
            { $unset: "users" },
        ])
        
        let liked = [{from_userid: ObjectId(req.params.id)}]
        const itemsToRemove = liked.map(a => a.from_userid.toString());
        let result = allUsers.filter(a => !itemsToRemove.includes(a._id.toString()));

        res.status(200).json(success('Data having not liked user', { message: result.length, result }, res.statusCode));
    } catch (error) {
        return res.status(500).json(ErrorHandler(error.message, 500));
    }
}

exports.getAllmatches= async (req, res) => {
    try {
        let pipeline = [
            {
                $match:{
                    $and:[
                         { 
                             from_userid: ObjectId(req.params.id) 
                         },
                         {
                            isMatched : true
                         }
                    ]
                }

            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "to_userid",
                    foreignField: "_id",
                    as: "matchedUsers"
                }
            }
        ];
        const matches = await likes.aggregate(pipeline);
        res.status(200).json(success('All matches', { matches }, res.statusCode));
    } catch (error) {
        return res.status(500).json(ErrorHandler(error.message, 500))
    }
}
