import { type } from '@colyseus/schema'
import { GenAttributes } from '..'
import { BasicStateAttributes } from './basic.state'

export class WeaponStateAttributes extends BasicStateAttributes {

    @type('number') public damage: number = 10
    @type('number') public ammo: number = 100
    @type('number') public range: number = 1
    @type('number') public accuracy: number = 1
    @type('number') public reloadMs: number = 1000

    constructor(props?: GenAttributes<WeaponStateAttributes>){
        super(props)
    }

}