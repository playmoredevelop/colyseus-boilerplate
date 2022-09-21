import { Room } from "@colyseus/core";
import { Type } from "@colyseus/core/build/types";

export interface IResponseSession {
    session: string,
    iframe: string
}

export interface IResponseError {
    code: number,
    error: string
}

export interface IServiceOptions<T> {
    host: [string, string]
    redis_host?: [string, string]
    frontend?: string
    rooms: Array<[string, Type<Room>]>
}