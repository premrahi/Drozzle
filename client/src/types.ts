export interface PortInfo {
    private : number ; 
    public? : number ;
    type : string ;
}

export interface Container {
    id: string ; 
    name : string ;
    image : string ;
    status : string ;
    // "running" || "exited" || "paused"
    state : string ;
    ports :PortInfo;
}

export interface Stats {
    cpuPercent : number ;
    memUsage : number ;
    memLimitMB : number ;
    memPercent : number ;
}

export interface StatePoint extends Stats{
    time : number ;
}

export interface ActionResponse {
    ok :boolean ;
}

