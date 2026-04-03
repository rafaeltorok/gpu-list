// Dependencies
import { before, after } from 'node:test';
import mongoose from 'mongoose';
import connectToDatabase from "../../src/db/mongo";

before(async () => {
  await connectToDatabase();
});

after(async () => {
  await mongoose.connection.close();
});