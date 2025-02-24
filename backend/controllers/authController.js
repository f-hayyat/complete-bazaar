const { validationResult } = require("express-validator");
const User = require("../models/User");
const { firstNameValidator, lastNameValidator, emailValidator, passwordValidator, confirmPasswordValidator, userTypeValidator } = require("./validations");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.signup = [
  firstNameValidator,
  lastNameValidator,
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  userTypeValidator,
  
  async (req, res, next) => {
    const {firstName, lastName, email, password, userType} = req.body;

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessages: errors.array().map(err => err.msg),
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({firstName, lastName, email, password: hashedPassword, userType});
      await user.save();
      res.status(201).json({message: "Signup successful"});
    } catch (error) {
      res.status(500).json({errorMessages: [error.message]});
    }
  }
];

exports.login = async (req, res, next) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({errorMessages: ["Invalid email."]});
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({errorMessages: ["Invalid password."]});
    }

    const token = jwt.sign(
      {userId: user._id, userType: user.userType},
      process.env.JWT_SECRET,
      {expiresIn: "24h"}
    );

    // Calculate token expiry time in milliseconds
    const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000; 
   

    res.status(200).json({
      token, 
      userType: user.userType,
      expiryTime // Send expiry time to frontend
    });
  } catch (error) {
    res.status(500).json({errorMessages: [error.message]});
  }
}

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ errorMessages: ["User not found."] });
    }

    // Generate 6 digit reset token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedToken = await bcrypt.hash(resetToken, 12);

    // Save reset token and expiry to user
    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Configure email transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      auth: {
        user: "m.faisal.hayyat@gmail.com",
        pass: "lbmqbrwncxefznxy"
      }
    });

    // Send reset email
    await transporter.sendMail({
      from: "m.faisal.hayyat@gmail.com",
      to: email,
      subject: "Complete Bazaar Reset Password OTP",
      text: `
        Hello,
        
        You have requested to reset your password for Complete Bazaar.
        Here is your 6-digit OTP: ${resetToken}
        
        This OTP will expire in 1 hour.
        
        If you did not request this reset, please ignore this email.
        
        Best regards,
        Complete Bazaar Team
      `,
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>You have requested to reset your password for Complete Bazaar.</p>
        <p>Here is your 6-digit OTP:</p>
        <h3>${resetToken}</h3>
        <p>This OTP will expire in 1 hour.</p>
        <p>If you did not request this reset, please ignore this email.</p>
        <p>Best regards,<br>Complete Bazaar Team</p>
      `
    });

    // Send success response
    res.status(200).json({
      message: "Password reset OTP generated successfully. Please check your email."
    });

  } catch (error) {
    res.status(500).json({ errorMessages: [error.message] });
  }
}

exports.resetPassword = [
  passwordValidator,
  
  async (req, res, next) => {
    const { email, otp, password } = req.body;

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessages: errors.array().map(err => err.msg),
      });
    }


    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ errorMessages: ["User not found."] });
      }
      const isOtpValid = bcrypt.compare(otp, user.resetToken);
      if (!isOtpValid) {
        return res.status(401).json({ errorMessages: ["Invalid OTP."] });
      }
      if (user.resetTokenExpiry < Date.now()) {
        return res.status(401).json({ errorMessages: ["OTP expired."] });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Update user password and clear reset token
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      res.status(200).json({ 
        message: "Password reset successful. You can now login with your new password."
      });

    } catch (error) {
      res.status(500).json({ errorMessages: [error.message] });
    }
  }
]