import { Router } from 'express';
import multer from 'multer';
import multerConfig from "./config/multer"

import auth from "./app/middlewares/auth";

import users from './app/controllers/UsersController';
import sessions from './app/controllers/SessionsController';
import files from './app/controllers/FilesController';

const routes = new Router();
const upload = multer(multerConfig);

// session routes
routes.post('/sessions', sessions.create);

// user routes
routes.post('/users', users.create);
// routes.use(auth)
routes.get('/users', users.index);
routes.put("/users/:id", users.update);
routes.delete("/users/:id", users.delete);


// file routes
routes.post('/users/:userId/files', upload.single("file"), files.create);
routes.get('/files', files.read);



export default routes;
