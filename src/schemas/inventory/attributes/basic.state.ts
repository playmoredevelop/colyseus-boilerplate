import { Schema, type } from '@colyseus/schema'
import { GenAttributes } from '..'

export abstract class BasicStateAttributes extends Schema {

    @type('number') public weight: number = 0
    @type('number') public price: number = 0
    @type('number') public quality: number = 1

    constructor(props?: GenAttributes<BasicStateAttributes>){
        super()
        Object.assign(this, props)
    }

}