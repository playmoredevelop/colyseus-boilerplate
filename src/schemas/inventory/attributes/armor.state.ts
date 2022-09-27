import { type } from '@colyseus/schema'
import { GenAttributes } from '..'
import { BasicStateAttributes } from './basic.state'

export class ArmorAttributes extends BasicStateAttributes {

    @type('number') public takeDamage: number = 2

    constructor(props?: GenAttributes<ArmorAttributes>){
        super(props)
    }

}