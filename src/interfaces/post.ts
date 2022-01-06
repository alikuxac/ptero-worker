export interface SendCommandBody {
    serverID: string;
    command: string;
}

export interface SendPowerStateBody {
    serverID: string;
    power: 'start' | 'stop' | 'restart' | 'kill'
}

export interface RenameServerBody {
    serverID: string;
    name: string;
}

export interface ReinstallServerBody {
    serverID: string;
}