const db = require('./db');
var mongoose = require('mongoose')

const Query = {
    user: (root, args) => db.users.findOne(args._id),
    feed: async (roots, args) => db.feeds.findOne({ _id: args.id }),
    feeds: () => feedAggQuery(),
    users: () => userAggQuery(),
}

// const User = {
//     feeds: (user) => db.feeds.find({ userId: mongoose.Types.ObjectId(user._id) })
// }

const Mutation = {
    createFeed: async (root, { input }, { user }) => {
        console.log("usersssss", user);

        if (!user) {
            throw new Error("Aunthorized")
        }
        const id = await db.feeds.create({ ...input, userId: user._id })
        return await db.feeds.findOne(id)
    },
    createUser: async (root, { input }, { user }) => {
        const id = await db.users.create({ ...input })
        return await db.users.findOne(id)
    },

    updateUser: async (root, { input }, { user }) => {
        if (!input.id) {
            throw new Error("id can't be empty")
        }
        return await db.users.findOneAndUpdate({ _id: mongoose.Types.ObjectId(input.id) }, { $set: { ...input } })
    },

    updateFeed: async (root, { input }, { user }) => {
        if (!user) {
            throw new Error("Aunthorized")
        }
        if (!input.id) {
            throw new Error("id can't be empty")
        }
        return await db.feeds.findOneAndUpdate({ _id: mongoose.Types.ObjectId(input.id) }, { $set: { ...input } })
    }
}

// const Feed = {
//     userId: (job) => db.users.findOne(job.userId)
// }


const feedAggQuery = (params) => {
    let pipeline = [];
    let lookup1 =
    {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userId"
    }
    pipeline.push({ $lookup: lookup1 });
    pipeline.push({ '$unwind': { path: "$userId", preserveNullAndEmptyArrays: true } })

    return db.feeds.aggregate(pipeline)
}

const userAggQuery = (params) => {
    let pipeline = [];
    let lookup1 =
    {
        from: "feeds",
        localField: "_id",
        foreignField: "userId",
        as: "feeds"
    }
    pipeline.push({ $lookup: lookup1 });

    return db.users.aggregate(pipeline)
}



module.exports = { Query, Mutation }