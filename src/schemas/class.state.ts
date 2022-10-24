import { Schema, type } from '@colyseus/schema'

export enum EClasses {
    Fighter = 10,
    Rogue = 20,
    Magician = 30,
    Ranger = 40,
    Cleric = 50,
    Engineer = 60
}

export class ClassState extends Schema {
    
    @type('string') name: string = 'classname'


}
