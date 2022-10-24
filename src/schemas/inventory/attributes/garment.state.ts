import { type } from '@colyseus/schema'
import { GenAttributes } from '..'
import { BasicStateAttributes } from './basic.state'

export class GarmentAttributes extends BasicStateAttributes {

    @type('boolean') public isArmor: boolean = false
    
    @type('number') public points: number = 100
    @type('number') public takeDamage: number = 0

    constructor(props?: GenAttributes<GarmentAttributes>){
        super(props)
    }

}