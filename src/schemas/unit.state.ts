import { Schema, type } from '@colyseus/schema'
import { ClassState } from './class.state'
import { HealthState } from './health.state'
import { MoveState } from './move.state'
import { SkinState } from './skin.state'

export class UnitState extends Schema {
    
    @type(HealthState) public health = new HealthState
    @type(ClassState) public class = new ClassState
    @type(MoveState) public move = new MoveState
    @type(SkinState) public skin = new SkinState

    @type('string') public id: string
    @type('string') public name: string
    @type('number') public accuracy: number = 100

}