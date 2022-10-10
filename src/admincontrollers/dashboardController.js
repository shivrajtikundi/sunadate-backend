const user = require("../models/userSchema")

exports.totalUsers = async (req, res) => {
    try {
        const Allusers = await user.find().countDocuments();
        res.status(200).json(Allusers)
    } catch {
        res.status(404).send("An error occured")
    }
}

exports.registeredToday = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        let searchField = req.query.firstname;
        var getUsers;
        var getAll;

        if(searchField){

            let searchField = req.query.firstname;
            getUsers = await user.find({ "Date": { $lt: new Date(), $gt: new Date(new Date().getTime() - (24 * 60 * 60 * 1000)) } ,firstname: { $regex: searchField, $options: '$i' }})
            .limit(limit * 1)
            .skip((page - 1) * limit);
        }
        else{
            getUsers = await user.find({ "Date": { $lt: new Date(), $gt: new Date(new Date().getTime() - (24 * 60 * 60 * 1000)) } })
        }
        
        getAll =await user.find({ "Date": { $lt: new Date(), $gt: new Date(new Date().getTime() - (24 * 60 * 60 * 1000)) }})
        if (getUsers.length) {
            res.status(200).send({ "count": getUsers.length, "total" :getAll.length,getUsers})
        }
        else {
            res.send("no users found")
        }
    }
    catch {
        res.status(406).send("an error occured")
    }

}

exports.onlineUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        let searchField = req.query.firstname;
        var getUsers;
        var getAll;

        if(searchField){

            let searchField = req.query.firstname;
            getUsers = await user.find({"online":true, firstname: { $regex: searchField, $options: '$i' }})
            .limit(limit * 1)
            .skip((page - 1) * limit);
        }
        else{
            getUsers = await user.find({"online":true})
        }
        
        getAll =await user.find({"online":true})
        if (getUsers.length) {
            res.status(200).send({ "count": getUsers.length, "total" :getAll.length,getUsers})
        }
        else {
            res.send("no users found")
        }
    }
    catch {
        res.status(406).send("an error occured")
    }

}

