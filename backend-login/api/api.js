import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';


const api = express();
api.use(express.json());

const listCors = ['http://127.0.0.1:5500']

api.get('/status', (_, res) => {
  return res.json({
    msg: 'API funcionando',
  });
});


api.use(cors({origin: listCors }));

api.use(authRoutes);
api.use(userRoutes);

export default api;
