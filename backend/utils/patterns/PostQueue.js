const BaseQueue = require("./BaseQueue");
const Document = require("../../models/model");
const {BadRequestError} = require("../ApiError");

class PostQueue extends BaseQueue {
    constructor(name, connection, options = {}) {
        super(name, connection);
        const { workers = 1, workerOptions = {} } = options;

        console.log("[PostQueue] starting workers…");
        this.createWorkers(async (job) => {
            const { _id, title, pasteValue, expiryTime } = job.data;

            await Document.findByIdAndUpdate(
                _id,
                {
                    _id: _id,
                    title: title,
                    pasteValue: pasteValue,
                    uploadTime: new Date(),
                    expiryTime: calculateExpiryTime(expiryTime),
                },
                { upsert: true, new: true }
            );
            return { id: _id };
        }, workers, workerOptions);

    }
}

function calculateExpiryTime(expiryOption) {
    if (expiryOption === "never") {
        return null;
    } else if (expiryOption === "1minute") {
        return new Date(Date.now() + 60 * 1000);
    }
    else if (expiryOption === "10minutes") {
        return new Date(Date.now() + 10 * 60 * 1000);
    }
    else if (expiryOption === "1day") {
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
    else if (expiryOption === "2days") {
        return new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    }
    else if (expiryOption === "1week") {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    throw new BadRequestError("Invalid Expiry Option");
}

module.exports = PostQueue;