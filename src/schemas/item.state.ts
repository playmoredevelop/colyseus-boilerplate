import { Schema, type } from '@colyseus/schema'

export class ItemState extends Schema {
    
    @type('string') public id: string
    @type('string') public title: string
    @type('string') public description: string
    @type('string') public icon: string
    @type('number') public price: number = 0
    @type('number') public weight: number = 0
    @type('number') public quality: number = 1
    @type('number') public stack: number = 1
}
