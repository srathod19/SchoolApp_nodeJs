const isAuthorize = async (req, res, next) => {
    try {
        if (!req.headers.apikey || req.headers.apikey != process.env.API_KEY) {
            return res.status(422).json({
                message: "Please provide Api key"
            })
        }
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
            return res.status(422).json({
                message: "Please provide token"
            })
        }
        next();
    } catch (error) {
        console.log(error.message);
    }


}
module.exports = {
    isAuthorize
};