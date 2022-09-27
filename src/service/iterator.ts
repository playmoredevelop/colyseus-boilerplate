export class InfinityIterator<T> {

    protected items: Array<T>
    protected pos: number = 0

    constructor(items: IterableIterator<T>) {
        this[Symbol.iterator] = () => {
            return items
        }
        this.items = Array.from(items)
    }

    get length(): number {
        return this.items.length
    }

    public next(): T {
        this.pos++
        if (this.items.length <= this.pos) this.reset()
        return this.value()
    }

    public value(): T {
        return this.items[this.pos]
    }

    public reset(): this {
        this.pos = 0
        return this
    }

}