import { Schema, ArraySchema, type } from '@colyseus/schema'
import { BasicStateAttributes } from './attributes/basic.state'

export type GenAttributes<T> = Partial<Omit<T, keyof Schema>>

/** :: @pattern State/Context */
export class ItemStateInventory<B> extends Schema {

    @type('string') public id: string
    @type('number') public stack = 1
    @type('boolean') public stacked = true
    @type('string') public title: string
    @type('string') public description: string
    @type('string') public altas: string
    @type('string') public icon: string
    @type('string') public background: string

    /** :: @pattern State */
    @type(BasicStateAttributes) public attributes: B

    constructor(props?: GenAttributes<ItemStateInventory<B>>){
        super()
        Object.assign(this, props)
    }

}

export class GroupStateInventory<B> extends Schema {

    public name: string = 'InventoryGroup'
    public limiter: number = 10
    
    @type({array: ItemStateInventory}) public slots = new ArraySchema<ItemStateInventory<unknown>>()

    public add<B>(item: ItemStateInventory<B>, index: number = -1): boolean {
        if (this.limiter <= this.slots.length) return false
        index >= 0 ? this.slots.setAt(index, item) : this.slots.push(item)
        return true
    }

    public count(): number {
        return this.slots.slice().filter(slot => slot).length
    }

    public getByType(strategy: new () => B): Array<ItemStateInventory<B>> {
        return this.slots.filter(item => item.attributes instanceof strategy)
    }

}