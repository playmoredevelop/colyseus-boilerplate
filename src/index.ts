import { AlternateRoom } from "./rooms/AlternateRoom"
import { Service } from "./service"

new Service({
    host: process.env.SERVER_HOST?.split(':') as [string, string] ?? null, 
    redis_host: process.env.REDIS_HOST?.split(':') as [string, string] ?? null,
    rooms: [
        ['alternate-1vs1', AlternateRoom]
    ]
}).start()