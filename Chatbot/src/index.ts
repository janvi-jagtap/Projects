import express, { Express } from "express";
import bodyParser from 'body-parser';
import { chat, load, save } from "./routes";


// Configure and start the HTTP server.
const port: number = 8080;
const app: Express = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.get("/chat", chat);
// TODO(6d): add routes for /load (GET) and /save (POST)
app.get("/load", load);
app.post("/save", save);
app.listen(port, () => console.log(`Server listening on ${port}`));
