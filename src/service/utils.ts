
export function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFrom<T>(values: Array <T>) {
    return values[randomBetween(0, values.length - 1)]
}

export function randomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const uniqmap: Map<string, Array<unknown>> = new Map
export function randomUniq<T>(values: Array <T>, key: string): T {

    if (uniqmap.has(key)) {

        const cached = uniqmap.get(key) as Array <T>
        const randomId = randomBetween(0, cached.length - 1)
        const value = cached[randomId]
        cached.splice(randomId, 1)
        cached.length === 0 && uniqmap.delete(key)
        return value
    }

    uniqmap.set(key, values.slice())
    return randomUniq(values, key)
}

export function randomId(): number {
    return Number('0x' + Math.random().toString(16).slice(2))
}

export function isBetweenRange(value: number, rangeMax: number, rangeMin: number) {
    return value >= rangeMin && value <= rangeMax;
}
