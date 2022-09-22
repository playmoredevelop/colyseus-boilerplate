import { Schema, ArraySchema, type } from '@colyseus/schema'
import { ItemState } from './item.state'

export class InventoryState extends Schema {

    public name: string = 'InventoryGroup'
    public limiter: number = 10
    
    @type({array: ItemState}) public slots = new ArraySchema<ItemState>()

    public count(): number {
        return this.slots.slice().filter(slot => slot).length
    }

}
