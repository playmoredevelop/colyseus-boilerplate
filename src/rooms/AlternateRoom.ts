import { Client, Delayed, Room } from "@colyseus/core";
import { Schema, type, MapSchema } from '@colyseus/schema'

import { logger } from "../service/logger";
import { randomFrom } from "../service/utils";

import { PlayerState } from "../schemas/player.state";
import { MoveStatePacket } from "../schemas/move.state";
import { InfinityIterator } from "../service/iterator";

export type AlternateRoomOptions = { session: string }

export class AlternateState extends Schema {
    
    @type('number') public levelItem: number
    
    @type({ map: PlayerState }) public players = new MapSchema<PlayerState>()
    public playersIterator: InfinityIterator<string>

    public prepare(): this {
        this.players.forEach(p => p.prepare())
        this.playersIterator = new InfinityIterator(this.players.keys())
        this.levelItem = randomFrom([0, 1])
        return this
    }

    public isActive(session: string): boolean {
        return this.players.has(session) && this.playersIterator.value() === session
    }

    public active(): PlayerState {
        return this.players.get(this.playersIterator.value())
    }

}

export class AlternateRoom extends Room<AlternateState> {

    protected roundIndex = 1
    protected roundTimer: Delayed
    protected roundTimeInterval = 20 * 1000
    protected roundTimeStart = 10 * 1000

    public roomName = 'alternate'
    public maxClients = 2
    public autoDispose = true
    public patchRate = parseFloat(process.env.SERVER_TICKRATE_MS) | 50

    async onCreate() {

        this.setState(new AlternateState)

        this.onMessage('move', this.onMove.bind(this))
        this.onMessage('ready.next', this.onReadyNext.bind(this))

        logger.info({ room: this.roomId, state: this.state }, 'ROOM CREATED')
    }

    async lock(): Promise<void> {
        this.state.prepare()
        this.roundTimer = this.clock.setInterval(this.turnNextRound.bind(this), this.roundTimeInterval)
        this.roundTimer.pause()
        await super.lock()
    }

    async onAuth(client: Client, options?: AlternateRoomOptions, req?) {
        return true
    }

    async onJoin?(client: Client, options?: AlternateRoomOptions, auth?: any): Promise<boolean> {

        if (this.locked) return false

        if (options.session) {

            // init player code here

            return true
        }

        return false
    }

    async onLeave(client: Client): Promise<void> {

        logger.info({ room: this.roomId, socket: client.sessionId }, 'LEAVE')

        client.leave()
        
        this.state.players.delete(client.sessionId)
        this.broadcast('room.leave', client.sessionId)

        if (!this.locked) return

        // if an active player left, then we move to next round
        if (this.state.isActive(client.sessionId)) {
            this.roundTimer.reset()
            this.turnNextRound()
        }

    }

    async onDispose(): Promise<void> {

        logger.info({ room: this.roomId, active: this.state.players.size }, 'DISPOSE')

        this.clock.clear()
        this.state.players.forEach(player => player.dispose())
        this.state.players.clear()

        this.broadcast('room.dispose')
    }

    /**
     * walk left, right, stay
     * jump forward, backflip
     * aim up, down
     */
    protected onMove(client: Client, message: MoveStatePacket) {

        logger.debug({ room: this.roomId, socket: client.sessionId, message }, 'BIRD MESSAGE')

        if (!this.state.isActive(client.sessionId)) return

        const unit = this.state.active().activeUnit()
        const changed = unit && [
            unit.move.setWalk(message),
            unit.move.setJump(message),
            unit.move.setAim(message)
        ].some(v => v === true)

        changed && this.broadcastPatch()
    }

    protected onReadyNext(client: Client, message: { [key: string]: Array<MoveStatePacket> }) {

        if (!this.state.players.has(client.sessionId)) return

        const player = this.state.players.get(client.sessionId)
        const all = Array.from(this.state.players.values())
        player.readynext = true

        if (all.every(t => t.readynext)) {

            all.map(teamstate => teamstate.readynext = false)
            this.roundTimer.reset()

            logger.debug(message, client.sessionId)

            this.broadcastPatch()
            this.clock.setTimeout(() => this.turnNextRound(), 2000)

        }
    }

    protected onReady(): void {

        logger.info({ room: this.roomId }, 'READY TO PLAY')

        this.lock()

        this.clock.setTimeout(() => {
            this.roundTimer.resume()
        }, this.roundTimeStart)

        this.clock.start()

    }

    protected turnNextRound(): void {

        if (this.state.playersIterator.length <= 0) return

        logger.info({ room: this.roomId, active: this.state.playersIterator.value() }, 'NEXT TURN')

        this.roundIndex++

        this.state.playersIterator.next()
        this.state.active().unitsIterator.next()
        this.state.players.forEach(player => {
            player.allowed = true
            player.readynext = false
            player.weapons.deactivate()
            player.units.forEach(b => b.move.reset())
        })

        // this.broadcast('next.turn', {
        //     ap: this.state.orderItem,
        //     ab: this.state.active().activeBird
        // })
    }

}
