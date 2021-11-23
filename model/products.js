import mongoose from 'mongoose';

// schema with validation
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    name: {
        type: String, required: [true, 'product name must be provided'],
        max: [50, 'cannot be more than 20 characters'], trim: true,
    },
    price: {
        type: Number,
        required: [true, 'product price must be provided'],
    },
    featured: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    company: {
        type: String,
        enum: {
            values: ['ikea', 'liddy', 'caressa', 'marcos'],
            message: '{VALUE} is not supported',
        }
    }
});

export default mongoose.model('Products', ProductSchema);