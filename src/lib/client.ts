
import { Servers, Server } from '../interfaces/Server';
import { Permissions } from '../interfaces/Permissions';
import { ServerResources } from '../interfaces/ServerResource';
import { User } from '../interfaces/User';

const options = {
    0: '',
    1: '?include=egg,subusers',
    2: '?include=egg',
    3: '?include=subusers',
}

export default class Client {
    host: string;
    key?: string;

    constructor() {
        this.host = PTERO_URL;
        this.key = PTERO_KEY;
    }

    private getHeaders() {
        return {
            'User-Agent': 'DBH',
            'Authorization': 'Bearer ' + this.key,
            'Content-Type': 'application/json',
            'Accept': 'Application/vnd.pterodactyl.v1+json',
        };
    }

    private trimUrl() {
        return this.host.endsWith('/') ? this.host : this.host + '/';
    }

    public async request(
        method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH',
        route: string,
        data?: object | string,
    ) {
        const URL = this.trimUrl() + route;
        console.log(URL);
        return fetch(URL, {
            headers: this.getHeaders(),
            method,
            body: data ? JSON.stringify(data) : undefined,
        });
    }


    // Get Method
    public listServers(option: number) {

        return this
            .request('GET', 'api/client' + options[option])
            .then(async res => {
                const response = await res.json() as Servers;
                return response.data;
            }).catch(e => {
                return e;
            });
    }

    public listIDs() {
        return this
            .request('GET', 'api/client')
            .then(async res => {
                const response = await res.json() as Servers;
                const ids: string[] = [];
                response.data.forEach(server => {
                    ids.push(server.attributes.identifier);
                });
                return ids;
            }).catch(e => {
                return e;
            });
    }

    public showPermission() {
        return this
            .request('GET', 'api/client/permissions')
            .then(async res => {
                const response = await res.json() as Permissions;
                return response;
            }).catch(e => {
                return e;
            })
    }

    public serverDetails(serverID: string, option: number) {
        return this
            .request('GET', `api/client/servers/${serverID}` + options[option])
            .then(async res => {
                const response = await res.json() as Server;
                return response.attributes;
            }).catch(e => {
                return e;
            });
    }

    public resourceUsage(serverID: string) {
        return this
            .request('GET', `api/client/servers/${serverID}/resources`)
            .then(async res => {
                const response = await res.json() as ServerResources;
                return response.attributes;
            }).catch(e => {
                return e;
            });
    }

    public accountDetails() {
        return this
            .request('GET', 'api/client/account')
            .then(async res => {
                const response = await res.json() as User;
                return response;
            }).catch(e => {
                return e;
            });
    }

    // Post Method
    public sendCommand(serverID: string, command: string) {
        const data = { command };
        return this
            .request('POST', `api/client/servers/${serverID}/command`, data)
            .then(async res => {
                const response = await res.json();
                return response;
            }).catch(e => {
                return e;
            })
    }

    public sendPowerState(
        serverID: string,
        powerState: 'start' | 'stop' | 'restart' | 'kill'
    ) {
        const data = { signal: powerState };
        return this
            .request('POST', `api/client/servers/${serverID}/power`, data)
            .then(async res => {
                const response = await res.json();
                return response;
            }).catch(e => {
                return e;
            })
    }

    public renameServer(
        serverID: string,
        name: string,
    ) {
        const data = { name };
        return this
            .request('POST', `api/client/servers/${serverID}/settings/rename`, data)
            .then(async res => {
                const response = await res.json();
                return response;
            }).catch(e => {
                return e;
            });
    }

    public reinstallServer(
        serverID: string,
    ) {
        return this
            .request('POST', `api/client/servers/${serverID}/settings/reinstall`)
            .then(async res => {
                const response = await res.json();
                return response;
            }).catch(e => {
                return e;
            });
    }
}