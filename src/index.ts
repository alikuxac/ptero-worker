import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { bearerAuth } from 'hono/bearer-auth';
import Client from './lib/client';

import { accountRoute } from './routes/account';

const client = new Client();
const app = new Hono();

app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', bearerAuth({ token: PTERO_KEY }));

app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})

app.get('/ids', async (c) => {
  const ids = await client.listIDs();
  return c.json(ids);
})

app.get('/servers', async (c) => {
  const { option } = c.req.query();
  if (!option) {
    return c.json({
      error: 'No option specified'
    });
  }
  if ([0, 1, 2, 3].indexOf(+option) === -1) {
    return c.json({
      error: 'Invalid option specified'
    });
  }
  const servers = await client.listServers(+option);
  return c.json(servers);
})

app.get('/permissions', async (c) =>{
  const permissions = await client.showPermission();
  return c.json(permissions);
})

app.route('/account', accountRoute);

app.fire();