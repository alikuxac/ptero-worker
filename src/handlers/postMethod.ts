/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Client from "../lib/client";
const client = new Client(PTERO_URL, PTERO_API);
import {
    SendCommandBody,
    SendPowerStateBody,
    RenameServerBody,
    ReinstallServerBody
} from "../interfaces/post";

export default async function postMethod(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path) {

        switch (path) {

            case '/':
                return new Response('Ok', { status: 200 });

            case '/command':
                const bodyCommand = await request.json() as SendCommandBody;
                const { serverID, command } = bodyCommand;
                if (!serverID || !command) {
                    return new Response('Server ID and Command are required', { status: 400 });
                }
                await client.sendCommand(serverID, command);
                return new Response("Send command successull", { status: 200 });

            case '/power':
                const bodyPowerState = await request.json() as SendPowerStateBody;

                const { serverID: serverID2, power } = bodyPowerState;
                if (!serverID2 || !power) {
                    return new Response('Server ID and Power State are required', { status: 400 });
                }
                if (['start', 'stop', 'restart', 'kill'].indexOf(power) === -1) {
                    return new Response(`Power State is invalid. Available: start, stop, restart, kill.`, { status: 400 });
                }
                await client.sendPowerState(serverID2, power);
                return new Response(`Change power status to ${power} successful`, { status: 200 });

            case '/rename':
                const bodyRename = await request.json() as RenameServerBody;
                const { serverID: serverID3, name } = bodyRename;
                if (!serverID3 || !name) {
                    return new Response('Server ID and Name are required', { status: 400 });
                }
                await client.renameServer(serverID3, name);
                return new Response(`Rename server ${serverID3} to ${name} successful`, { status: 200 });

            case '/reinstall':
                const bodyReinstall = await request.json() as ReinstallServerBody;
                const { serverID: serverID4 } = bodyReinstall;
                if (!serverID4) {
                    return new Response('Server ID is required', { status: 400 });
                }
                await client.reinstallServer(serverID4);
                return new Response(`Reinstall server ${serverID4} successful`, { status: 200 });

            default:
                return new Response('Not Found', { status: 404 });
        }
    }

    return new Response('Ok', { status: 200 });
}

//phân tích