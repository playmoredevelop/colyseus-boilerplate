import e from 'express'
import http from 'http'
import terminus from '@godaddy/terminus'

import { config } from 'dotenv'
import { createHmac, randomUUID } from 'crypto'
import { Presence, RegisteredHandler, Server } from '@colyseus/core'
import { WebSocketTransport } from '@colyseus/ws-transport'
import { RedisPresence } from '@colyseus/redis-presence'
import { monitor } from '@colyseus/monitor'
import { logger } from './logger'
import { IResponseError, IResponseSession, IServiceOptions } from './interfaces'

config()

export class Service<T> extends Server {

    private $options: IServiceOptions<T> = {
        host: ['0.0.0.0', '8080'],
        redis_host: null,
        frontend: 'https://mygame.io',
        rooms: []
    }

    protected rooms: Map<string, RegisteredHandler>
    protected application: e.Express = e()
    protected http: http.Server = http.createServer(this.application)
    protected terminus = terminus.createTerminus(this.http, {
        signal: 'SIGINT',
        healthChecks: { '/health': this.onHealth },
        logger: (message, error) => logger.info('SIGINT', message, error)
    })

    constructor(options: IServiceOptions<T>) {

        super()

        for (const opt in options) options[opt] === null && delete options[opt]

        this.$options = Object.assign(options, this.$options)

        this.attach({
            gracefullyShutdown: false,
            transport: new WebSocketTransport({ server: this.http }),
            presence: Array.isArray(this.$options.redis_host) ? (new RedisPresence({
                host: this.$options.redis_host[0],
                port: Number(this.$options.redis_host[1])
            }) as Presence) : null
        })

        // basic routes
        this.application.use(e.json())
        this.application.get('/session', this.getIndex.bind(this))
        this.application.post('/session', this.postIndex.bind(this))
        this.application.use('/monitor', monitor())

        // define rooms
        this.rooms = new Map(this.$options.rooms.map(([name, symclass]) => {
            return [name, this.define(name, symclass)]
        }))

    }

    public start(): void {

        const [ host, port ] = this.$options.host

        this.http.on('listening', () => logger.info('Server is running. On the air', { host, port }))
        this.http.on('error', e => logger.error(e))
        this.http.listen(Number(port), host)

        process.on('SIGTERM', () => {
            this.gracefullyShutdown(true)
            this.http.close(() => logger.warn('Server closed', { host, port }))
        })

    }

    async getIndex(req: e.Request, res: e.Response) {

        res.status(404)
        res.send('404')
    }

    async postIndex(req: e.Request, res: e.Response): Promise<e.Response<IResponseSession | IResponseError>> {

        const signature = req.headers.signature as string
        const headers = { signature }

        try {

            if (String(signature).length < 100) throw 1001

            const uuid = randomUUID()
            const hash = createHmac('sha256', signature).update(uuid).digest('hex')

            logger.info({ hash }, 'New session')

            return res.json({
                session: hash,
                iframe: `${this.$options.frontend}/?session=${hash}&uuid=${uuid}`
            })

        } catch (code) {

            switch (code) {
                case 1001: logger.warn({ code, signature }, 'Invalid signature')
            }

            switch (code) {
                case 1001: return res.json({ code, error: 'Invalid signature' })
            }

            return res.json({ code: 0, error: 'Server error' })
        }
    }

    async onHealth() {
        return true
    }

}

