import express from './config/express'
import io from './config/socket.io'

let app = express();

app = io(app);
