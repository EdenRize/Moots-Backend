import mongoose, { Schema, Document } from 'mongoose';



const petSchema = new Schema(
  {
    ownerId: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String },
    age: { type: String },
    description: { type: String },
    imgs: [{ type: String }], 
    race: { type: String },
  },

);



const PetModel = mongoose.model('Pet', petSchema);


export default PetModel;