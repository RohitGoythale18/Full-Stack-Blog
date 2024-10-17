const appErr = require("../utils/AppErr");

const protected = (req, res, next) => {
    if(req.session.userAuth){
        next();
    }
    else{
        next(appErr('Not authorized! Please login first...!'));
    }
};

module.exports = protected;