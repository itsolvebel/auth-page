class FetchingError extends Error {
    statusCode: number
    body: any

    constructor(statusCode: number, message: string, body: any) {
        super(message)
        this.statusCode = statusCode
        this.body = body
    }

    toString() {
        const s = this.statusCode
        const m = this.message
        const b = this.body

        return JSON.stringify({
            statusCode: s,
            message: m,
            body: b,
        })
    }
}


export { FetchingError }
