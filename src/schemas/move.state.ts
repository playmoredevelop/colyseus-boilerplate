import { Schema, type } from '@colyseus/schema'
import { PositionState, PositionStatePacket } from './position.state'

export type MoveStatePacket = {
    walk: number
    jump: number
    aim: number
    angle: number
}

export class MoveState extends Schema {

    @type(PositionState) public position = new PositionState

    @type('number') public walk: number = 0 // [-1,1,0] -> [left, right, stop]
    @type('number') public jump: number = 0 // [-1,1,0] -> [backflip, jump, stop]
    @type('number') public aim: number = 0 // [-1,1,0] => [up, down, stop]
    @type('number') public angle: number = 0
    @type('number') public direction: number = 1

    public reset(): void {

        this.walk = 0
        this.jump = 0
        this.aim = 0
    }

    public setWalk(message: Partial<MoveStatePacket & PositionStatePacket>): boolean {

        const { x, y, vx, vy, walk } = message
        
        if (walk === this.walk) return false
        if (walk !== 0) this.direction = walk

        this.walk = walk
        this.position.x = x
        this.position.y = y
        this.position.vx = vx
        this.position.vy = vy

        return true
    }

    public setJump(message: Partial<MoveStatePacket & PositionStatePacket>): boolean {

        const { x, y, jump } = message

        if (jump === this.jump) return false

        this.jump = jump // direction
        this.position.x = x // from x
        this.position.y = y // from y

        return true
    }

    public setAim(message: Partial<MoveStatePacket>): boolean {

        const { aim, angle } = message

        this.aim = aim
        this.angle = angle // angle correction

        return true

    }

}