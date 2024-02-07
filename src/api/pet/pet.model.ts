import mongoose, { Schema, Document } from 'mongoose';

export interface Pet{
  _id?:string
  ownerId:string,
  type:string
  name?:string
  age?:string
  description?:string
  imgs?:string[]
  race?:string
}

export const petSchema = new Schema<Pet>(
  {
    ownerId: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String },
    age: { type: String },
    description: { type: String },
    imgs: [{ type: String }], 
    race: { type: String },
  }, { versionKey: false }

);



const PetModel = mongoose.model('Pet', petSchema, 'Pet');


export default PetModel;
