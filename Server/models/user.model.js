import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "name is required"],
      lowercase: true,
    },
    lastname: {
      type: String,
      required: [true, "name is required"],
      lowercase: true,
    },
    mobile:{
      type: String,
      required: [true, "mobile is required"],
      unique: true,
    },
    username:{
      type: String,
      required: [true, "username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["Producer", "Freelancer"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function(next){
  if(!this.isModified('password')) returnnext()
  this.password = await bcrypt.hash(this.password, 10);
  next();
})

userSchema.method({
  isPasswordCorrect: async function(password){
    return (await bcrypt.compare(password, this.password));
  },
  generatAccessToken: async function(){
    return jwt.sign({
      _id: this._id,
      email: this._email,
    },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
    )
  },
  generatRefreshToken: async function(){
    return jwt.sign({
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
    )
  }
})

export const User = mongoose.model('User', userSchema);
