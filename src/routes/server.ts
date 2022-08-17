import { Hono } from 'hono';
import Client from '../lib/client';

interface PowerBody {
    signal: 'start' | 'stop' | 'restart' | 'kill';
}

const client = new Client();
export const serverRoute = new Hono();

serverRoute.get('/:id', async (c) => {
    const { id } = c.req.param();
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
    const servers = await client.serverDetails(id, +option);
    return c.json(servers);
})

serverRoute.get(':id/resources', async (c) => {
    const { id } = c.req.param();
    const resources = await client.resourceUsage(id);
    return c.json(resources);
})

serverRoute.post(':id/command', async (c) => {
    const { id } = c.req.param();
    const { command } = await c.req.json<{ command: string }>();
    const response = await client.sendCommand(id, command);
    return c.json(response);
})

serverRoute.post(':id/power', async (c) => {
    const { id } = c.req.param();
    const { signal } = await c.req.json<PowerBody>();
    if (!['start', 'stop', 'restart', 'kill'].includes(signal)) {
        return c.json({
            error: 'Invalid signal'
        });
    }
    const response = await client.sendPowerState(id, signal);
    return c.json(response);
})

serverRoute.post(':id/rename', async (c) => {
    const { id } = c.req.param();
    const { name } = await c.req.json<{ name: string }>();
    const response = await client.renameServer(id, name);
    return c.json(response);
})

serverRoute.post(':id/reinstall', async (c) => {
    const { id } = c.req.param();
    const response = await client.reinstallServer(id);
    return c.json(response);
})