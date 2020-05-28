import Koa from 'koa';
import Router from 'koa-router';

import history from './routes/history';
import latest from './routes/latest';
import front from './routes/front';
import assets from './routes/assets';

import helmet from './handlers/helmet';
import errors from './handlers/errors';
import headers from './handlers/headers';
import rates from './handlers/rates';
import logger from './handlers/logger';
import statics from './handlers/statics';
import filename from './handlers/filename';
import favicon from './handlers/favicon';

const app = new Koa();
const router = new Router();

app.use(helmet);
app.use(errors);
app.use(headers);
app.use(rates);
app.use(logger);
app.use(statics);
app.use(favicon);
app.use(filename);

router
  .get('/history', history)
  .get('/latest', latest)
  .get('/assets', assets)
  .get('*', front)

app.use(router.routes());

export default app;
