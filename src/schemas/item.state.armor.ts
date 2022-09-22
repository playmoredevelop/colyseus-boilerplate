import { ArraySchema, type } from '@colyseus/schema'
import { ItemState } from './inventory.state'

export class ItemStateArmor extends ItemState {

    public qualityDrop: number = 0.001

    @type('number') public quality: number = 1
    @type('number') public range: number = 1
    @type('number') public price: number = 0
    @type('number') public weight: number = 0
    @type('number') public takeDamage: number = 2

    public onAdd<T extends this>(slots: ArraySchema<T>): void {}
    public onDelete<T extends this>(slots: ArraySchema<T>): void {}
}