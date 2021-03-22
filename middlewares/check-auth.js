const jwt = require('../helpers/jwt');

function checkAuth(req, res, next) {
    let token = req.query.token;
    let decodedToken = jwt.decodeJWT(token);
    if(decodedToken.user) {
        req.user = decodedToken.user;
    }
    next();
}

module.exports = checkAuth;