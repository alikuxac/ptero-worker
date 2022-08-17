import { Hono } from 'hono';
import Client from '../lib/client';

const client = new Client();
export const accountRoute = new Hono();

accountRoute.get('/', async (c) => {
    const accountDetails = await client.accountDetails();
    return c.json(accountDetails);
})