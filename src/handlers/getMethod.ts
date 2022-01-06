/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Client from "../lib/client";
const client = new Client(PTERO_URL, PTERO_API);

export default async function getMethod(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path) {
        switch (path) {

            case '/':
                return new Response('Ok', { status: 200 });

            case '/servers':
                const option = url.searchParams.get('option');
                if (!option) {
                    return new Response('Option is required', { status: 400 });
                }
                if ([0, 1, 2, 3].indexOf(parseInt(option)) === -1) {
                    return new Response('Option is invalid', { status: 400 });
                }
                const servers = await client.listServers(Number(option));
                return new Response(JSON.stringify(servers), { status: 200 });

            case '/ids':
                const ids = await client.listIDs();
                return new Response(JSON.stringify(ids), { status: 200 });

            case '/permissions':
                const permissions = await client.showPermission();
                return new Response(JSON.stringify(permissions), { status: 200 });

            case '/resource':
                const ruserverID = url.searchParams.get('serverID');
                if (!ruserverID) {
                    return new Response('Server ID is required', { status: 400 });
                }
                const resources = await client.resourceUsage(ruserverID);
                return new Response(JSON.stringify(resources), { status: 200 });

            case '/server-details':
                const serverID = url.searchParams.get('serverID');
                const option2 = url.searchParams.get('option');
                if (!serverID || !option2) {
                    return new Response('Server ID and Option are required', { status: 400 });
                }
                if ([0, 1, 2, 3].indexOf(parseInt(option2)) === -1) {
                    return new Response('Option is invalid', { status: 400 });
                }
                const serverDetails = await client.serverDetails(serverID, Number(option2));
                return new Response(JSON.stringify(serverDetails), { status: 200 });
            
            case '/account-details':
                const accountDetails = await client.accountDetails();
                return new Response(JSON.stringify(accountDetails), { status: 200 });

            default:
                return new Response('Not Found', { status: 404 });
        }
    }

    return new Response('Ok', { status: 200 });
} 