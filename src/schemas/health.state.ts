import { Schema, type } from '@colyseus/schema'

export class HealthState extends Schema {

    @type('uint16') public value: number = 100
    @type('uint16') public damage: number = 0
    @type('boolean') public dead = false

    public available(): boolean {

        if (this.dead) return false
        if (this.value <= 0) return false
        if (this.damage >= this.value) return false

        return true
    }

    public hit(value: number): boolean {

        if (! this.available()) return false

        this.damage = value

        if (value < this.value) {
            this.value -= value
        } else {
            this.value = 0
            this.dead = true
        }

        return true
    }
}