import 'reflect-metadata';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import WorkItemsRoute from './routes/workItems.route';
import ForgeRoute from './routes/forge.route';

import validateEnv from '@utils/validateEnv';


validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new WorkItemsRoute(),
  new ForgeRoute()

]);

app.listen();
