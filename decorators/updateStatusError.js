const {HttpError} =require("../helpers");

const updateStatusError = (req, res, next) => {
const data = req.body;
if(Object.keys(data).length === 0){
    throw HttpError (400, `missing field favorite`)
}
next()
}

module.exports = updateStatusError;