import { ArraySchema, type } from '@colyseus/schema'
import { ItemState } from './inventory.state'

export class ItemStateWeapon extends ItemState {

    public bonus: number = 0
    public qualityDrop: number = 0.001

    @type('number') public quality: number = 1
    @type('number') public damage: number = 10
    @type('number') public ammo: number = 100
    @type('number') public range: number = 1
    @type('number') public reloadMs: number = 1000
    @type('number') public price: number = 0
    @type('number') public weight: number = 0

    public onAdd<T extends this>(slots: ArraySchema<T>): void {}
    public onDelete<T extends this>(slots: ArraySchema<T>): void {}
}