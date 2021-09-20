import jwt from 'jsonwebtoken';

export default user = (req, res, next) => {
	try {
		const token = req.headers.authorization;
		if(!token) return res.status(401).send("No token provided");

		const decode = jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret);
		if(decode.user_type !== ("USER" || "MANAGER" || "SUDO")) return res.status(401).send("Failed to authenticate token.");

		req.user = decode;
		next();
	} catch(err) {

	}
}