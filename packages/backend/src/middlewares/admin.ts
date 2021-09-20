import jwt from 'jsonwebtoken';

export default admin = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send('No token provided.');

    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
		if(decode.user_type !== ("ADMIN" || "SUDO")) return res.status(401).send("Failed to authenticate token.");

    req.user = decode;
    next();
  } catch (err) {}
};
