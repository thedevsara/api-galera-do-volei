
import express from 'express';
import 'reflect-metadata';
import routes from './routes'; 
import { errorHandler } from './middlewares/errorHandler'; 
import cors from 'cors';


const app = express();
app.use(express.json());

app.use(cors()); 

app.use('/api', routes); // Usa as rotas

app.use(errorHandler); 

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
