import mongoose from 'mongoose';
import WaitlistUser from './waitlistUser';

const connectDb = () => {
	return mongoose.connect(process.env.DATABASE_URL);
}

const models = {WaitlistUser};
export { connectDb };
export default models;