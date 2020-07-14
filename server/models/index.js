import mongoose from 'mongoose';
import WaitlistUser from './waitlistUser';
import User from "./User";
import Disease from "./Disease";
import FAQ from "./FAQ";
import Pest from "./Pest";
import Plant from "./Plant";

const connectDb = () => {
	return mongoose.connect(process.env.DATABASE_URL);
}

const models = { 
	WaitlistUser, 
	User,
	Plant,
	FAQ,
	Disease,
	Pest
};
export { connectDb };
export default models;