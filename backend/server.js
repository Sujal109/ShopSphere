import cors from 'cors';
import path from 'path';
import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

const port = process.env.PORT || 5000 ; 

connectDB(); 
const app = express();
const corsOptions = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors());

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//cookie parser middleware
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);


app.get('/api/config/paypal', (req, res) => res.send({
    clientId : process.env.PAYPAL_CLIENT_ID
}))

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.get('/', (req, res) => {
res.send(`API is running...`);

});

app.use(notFound);
app.use(errorHandler);


app.listen(port, () => console.log(`Server running on port ${port}`));
