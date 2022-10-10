const User = require("../models/userSchema");
const profileVisits = require("../models/profileVisitsSchema");
const { ErrorHandler } = require('../utils/errorhandler')
const { success } = require("../utils/success")

exports.profileVisitsCount = async (req, res) => {
    try {
        let userAlreadyVisited = await profileVisits.find({ from_userid: req.body.from_userid, to_userid: req.body.to_userid });

        if (userAlreadyVisited.length==0) {
            let profileVisited = new profileVisits(req.body);
            await profileVisited.save();
            const count = await profileVisits.find({to_userid: req.body.to_userid}).count();
            const users = await User.find();
            let percentage= Math.round((count/100)*users.length);
            await User.findByIdAndUpdate({_id: req.body.to_userid},{profileVisits:percentage,profileVisitCount:count});
            res.status(201).json(success('all users', { profileVisited }, res.statusCode));
        }
        else {
            res.status(200).send({ message: "user already visited" });
        }
    }
    catch (error) {
        return res.status(404).json(ErrorHandler("users not found", 404));
    }
};