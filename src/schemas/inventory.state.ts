import { Schema, ArraySchema, type } from '@colyseus/schema'

export abstract class ItemState extends Schema {
    
    @type('string') public id: string
    @type('string') public title: string
    @type('string') public description: string
    @type('string') public group: string = 'default'
    @type('string') public icon: string
    @type('number') public stack: number = 1

    abstract onAdd<T extends this>(slots: ArraySchema<T>): void
    abstract onDelete<T extends this>(slots: ArraySchema<T>): void
}

export class InventoryState<T extends ItemState> extends Schema {

    public name: string = 'InventoryGroup'
    public limiter: number = 10
    
    @type({array: ItemState}) public slots = new ArraySchema<T>()

    constructor(){
        super()
        this.slots.onAdd = item => item.onAdd(this.slots)
        this.slots.onRemove = item => item.onDelete(this.slots)
    }

    public count(): number {
        return this.slots.slice().filter(slot => slot).length
    }

}
