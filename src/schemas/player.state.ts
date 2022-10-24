import { Schema, type, ArraySchema } from '@colyseus/schema'
import { InfinityIterator } from '../service/iterator'
import { GroupStateInventory } from './inventory'
import { UnitState } from './unit.state'

export class PlayerState extends Schema {

    public allowed: boolean = true
    public unitsIterator: InfinityIterator<number>
    
    @type(GroupStateInventory) public inventory = new GroupStateInventory()
    @type({ array: UnitState }) public units = new ArraySchema<UnitState>()

    @type('string') public name: string = 'Player'
    @type('number') public color = 0xffffff
    @type('boolean') public readynext = false

    public prepare(): this {
        this.unitsIterator = new InfinityIterator(this.units.keys())
        this.inventory.name = 'Player 1 Inventory'
        this.inventory.limiter = 5
        return this
    }

    public activeUnit(): UnitState {
        return this.getUnit(this.unitsIterator.value())
    }

    public getUnit(index: number): UnitState {
        const unit = this.units[index]
        if (unit.health.isDead) return null
        return unit
    }

    public hasUnits(): boolean {
        for (const v of this.units.values()) {
            if (!v.health.isDead) return true
        }
        return false
    }

    public health(): number {
        return this.units.map(u => u.health.value).reduce((a, b) => a + b)
    }

    public dispose(): void {
        this.units.clear()
        this.units = null
    }

}