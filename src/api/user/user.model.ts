import mongoose, { Schema, Document } from 'mongoose';



const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    pets: [{ type: String }], 
    avatar: { type: String },
  },

);



const UserModel = mongoose.model('User', userSchema);


export default UserModel;
