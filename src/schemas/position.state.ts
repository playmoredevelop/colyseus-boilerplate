import { Schema, type } from '@colyseus/schema'

export type PositionStatePacket = {
    x: number
    y: number
    vx: number
    vy: number
}

export class PositionState extends Schema {

    @type('number') public x: number
    @type('number') public y: number
    @type('number') public vx: number
    @type('number') public vy: number

}
