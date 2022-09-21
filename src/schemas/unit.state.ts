import { Schema, type } from '@colyseus/schema'
import { HealthState } from './health.state'
import { MoveState } from './move.state'

export class UnitState extends Schema {
    
    @type(MoveState) public move = new MoveState
    @type(HealthState) public health = new HealthState

    @type('string') public id: string
    @type('string') public name: string
    @type('string') public skin: string
    

}