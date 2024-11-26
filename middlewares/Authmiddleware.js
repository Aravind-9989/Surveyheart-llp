const jwt = require("jsonwebtoken");
const secretKey = "HelloUser";
const Signup = require("../models/Signupschema");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ message: "Authentication token is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);

    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const authorizerole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }
    next();
  };
};


const VerifyAdmin = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    console.log(userEmail);

    const verify = await Signup.findOne({ email: userEmail });
    console.log(verify);

    if (!verify) {
      return res
        .status(404)
        .json({ message: "User not found in the database" });
    }

    if (verify.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }

    next();
  } catch (err) {
    console.error("Error in VerifyAdmin middleware:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { authenticate, authorizerole, VerifyAdmin };
