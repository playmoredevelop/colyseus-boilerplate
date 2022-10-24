import { Schema, type } from '@colyseus/schema'

// attributes list
export class SkinState extends Schema {
    
    @type('number') body = null
    @type('number') head = null
    @type('number') eyes = null
    @type('number') tint = 0xdfb088
    
}
