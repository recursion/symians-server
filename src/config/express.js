import express from 'express'
import path from 'path'

/* configure and return an express instance */
export default function (){

  let app = express();

  app.use(express.static(path.join(__dirname, '../../', 'public')));

  return app;

}
