const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const postLogin = async (req, res) => {
  try {
    console.log('login event came');
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    console.log(user);

    if (user && (await bcrypt.compare(password, user.password))) {
      // send new token
      const token = jwt.sign(
        {
          userId: user._id,
          email: email,
        },
        // process.env.TOKEN_KEY, commenting this out due to setup issues that may deter new commers
        'binod',
        {
          expiresIn: '24h',
        }
      );

      return res.status(200).json({
        userDetails: {
          _id: user._id,
          email: user.email,
          token: token,
          username: user.username,
          profileImage: user.profileImage
        },
      });
    }

    return res.status(400).send('Invalid credentials. Please try again');
  } catch (err) {
    return res.status(500).send('Something went wrong. Please try again');
  }
};

module.exports = postLogin;
