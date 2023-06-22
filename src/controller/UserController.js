const User = require("../models/user");
const jwt = require("jsonwebtoken");
exports.signup = async (req, res) => {
  //email,password,name validation
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).send({
      status: "400",
      message: "All fields are required",
    });
  }
  //email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send({
      status: "400",
      message: "Enter a valid email address",
    });
  }
  //more validation
  if (password.length < 6) {
    return res.status(400).send({
      status: "400",
      message: "Password must be atleast 6 characters long",
    });
  }

  try {
    // const { email } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      // console.log(err);
      return res
        .status(400)
        .send({ status: "400", message: "Email already exists" });
    }

    const user = new User(req.body);
    let data = await user.save();
    if (!data) {
      return res.status(400).send({
        status: "400",
        message: "Unable to signup. Try again later",
        err,
      });
    }

    return res.status(201).send({
      status: "201",
      message: "Successfully added user",
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      status: "500",
      message: "Unable to signup. Try again later",
      err,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        status: "400",
        message: "All fields are required",
      });
    }
    //email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({
        status: "400",
        message: "Enter a valid email address",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ status: "400", message: "Email does not exists" });
    }

    if (!user.authenticate(password)) {
      return res.status(400).send({
        status: "400",
        message: "Email and password does not match",
      });
    }

    // create a token
    const token = jwt.sign(
      { _id: user._id, role: user.role, email: user.email },
      process.env.SECRET,
      { expiresIn: "100m" }
    );

    return res.status(200).send({
      status: "200",
      user: {
        _id: user._id,

        name: user.name,
        email: user.email,

        token: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      status: "500",
      message: "Unable to signup. Try again later",
      err,
    });
  }
};
