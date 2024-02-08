import mongoose, { Schema, Document } from 'mongoose';

export interface User{
  _id?:string
  username:string,
  password:string
  avatar?:string
  pets?:string[]
}

export interface SafeUser{
    _id?:string
  username:string,
  password?:string
  avatar?:string
  pets?:string[]
}


const userSchema = new Schema<User>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    pets: [{ type: String }], 
  }, { versionKey: false }
);



const UserModel = mongoose.model('User', userSchema, 'User');


export default UserModel;
