import * as http from 'http';
import Server from './server';
import { config } from 'dotenv';

config();

const port = process.env.PORT || 5000;

Server.set('port', port);

http.createServer(Server).listen(port, () => console.log(`Listening: http://localhost:${port}`));
