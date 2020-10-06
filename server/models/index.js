import mongoose from 'mongoose';

import Address from "./Address";
import Bundle from "./Bundle";
import Disease from "./Disease";
import FAQ from "./FAQ";
import NavigationItem from "./NavigationItem";
import NavigationMenu from "./NavigationMenu";
import Order from "./Order";
import OrderFulfillmentItem from "./OrderFulfillmentItem";
import OrderInvoice from "./OrderInvoice";
import Pest from "./Pest";
import Plant from "./Plant";
import PlantPestAssoc from "./PlantPestAssoc";
import PlantUserAssoc from "./PlantUserAssoc";
import Product from "./Product";
import ProductCollection from "./ProductCollection";
import ProductTag from "./ProductTag";
import Store from "./Store";
import State from "./State";
import SellerProfile from "./SellerProfile";
import User from "./User";
import WaitlistUser from './waitlistUser';


const connectDb = () => {
	return mongoose.connect(process.env.DATABASE_URL);
}

const models = { 
	WaitlistUser, 
	User,
	Plant,
	FAQ,
	Disease,
	Pest,
	PlantPestAssoc,
	PlantUserAssoc,
	Product,
	ProductTag,
	ProductCollection,
	Store,
	Order,
	OrderInvoice,
	Bundle,
	Address,
	NavigationItem,
	NavigationMenu,
	State,
	SellerProfile
};

export { connectDb };
export default models;