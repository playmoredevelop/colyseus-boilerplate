import { Schema, ArraySchema, type } from '@colyseus/schema'
import { BasicStateAttributes } from './attributes/basic.state'

export type GenAttributes<T> = Partial<Omit<T, keyof Schema>>

/** :: @pattern State/Context */
export class ItemStateInventory<B extends BasicStateAttributes> extends Schema {

    @type('string') public id: string
    @type('number') public stack = 1
    @type('boolean') public stacked = true
    @type('boolean') public isactive = true // do item attributes apply to the player?
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

export class GroupStateInventory extends Schema {

    public name: string = 'InventoryGroup'
    public limiter: number = 10
    
    @type({array: ItemStateInventory}) public slots = new ArraySchema<ItemStateInventory<unknown>>()

    public add<B extends BasicStateAttributes>(item: ItemStateInventory<B>, index: number = -1): boolean {
        if (this.limiter <= this.slots.length) return false
        index >= 0 ? this.slots.setAt(index, item) : this.slots.push(item)
        return true
    }

    public count(): number {
        return this.slots.slice().filter(slot => slot).length
    }

    /** inventory.getByType(ArmorState) */
    public getByType<B extends BasicStateAttributes>(strategy: new () => B): Array<ItemStateInventory<B>> {
        return this.slots.filter(item => item.attributes instanceof strategy)
    }

    public getActive<State extends BasicStateAttributes>(): Array<State> {
        return this.slots.filter(item => item.isactive === true)
    }

}