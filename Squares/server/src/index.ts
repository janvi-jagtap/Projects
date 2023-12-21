import express, { Express } from "express";
import { dummy, load, names, save } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/dummy", dummy);
app.get("/api/load", load);
app.get("/api/names", names);
app.post("/api/save", save);
app.listen(port, () => console.log(`Server listening on ${port}`));
