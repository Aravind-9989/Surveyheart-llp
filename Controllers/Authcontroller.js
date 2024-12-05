const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Signup = require("../models/Signupschema");

const secretKey = "HelloUser"; 

const Signupdetails = async (req, res) => {
  try {
    const { Name, email, password,role } = req.body;

    if (!(Name && email && password)) {
      return res.status(400).send({ message: "All fields are required to signup." });
    }

    if (Name.length < 3) {
      return res.status(400).json({ message: "Name should be atleast 3 characters" });
    }

    const validemail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    // in these three ways user can signup 
    // test123@gmail.com,
    // virat_abc+123@gmail.com,
    // name.virat@gmail.com
    if (!validemail.test(email)) {
      return res.status(400).json({ message: "please signup the details with valid email address" });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: "Password should be atleast 6 characters" });
    }

    const Existingperson = await Signup.findOne({ email });
    if (Existingperson) {
      return res.status(400).json({ message: "Candidate already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
      
    const Userdetails = new Signup({
      Name,
      email,
      password: hashedPassword,
      role
    });
    
    await Userdetails.save();

    return res.status(201).json({ message: "User signup successful",Userdetails});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error during signup." });
  }
};




// Login API
const Logins = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required for login." });
    }

    const user = await Signup.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password." });
    }
  
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role:user.role
      },
      secretKey,
      { expiresIn: "1h" }
    );

    console.log(token);

    return res.status(200).json({ message: "User login successful.", token,email});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error during login." });
  }
};

module.exports = { Signupdetails, Logins };
