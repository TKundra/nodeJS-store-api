require('dotenv').config();
import express from 'express';
import connectDB from './db/connect';
import notFound from './middlewares/not-found';
import errorHandler from './middlewares/error-handler';
import router from './routers/products';
import 'express-async-errors';

const app = express();
const port = process.env.PORT || 5000;

// build-in middleware
app.use(express.json());

// routes
app.get('/', (req, res) => {
    res.send('<h1>Store API</h1> <a href="/api/v1/products">product routes</a>')
});
app.use('/api/v1/products', router);

// application middlewares
app.use(notFound);
app.use(errorHandler);

// db
const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Example app listening on port ${port}!`));
    }catch(err){
        console.log(err);
    }
}
start();