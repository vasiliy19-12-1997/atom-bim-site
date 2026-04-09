export class WikiApiError extends Error {
    public readonly status: number;

    constructor(message: string, status = 500) {
        super(message);
        this.status = status;
        this.name = 'WikiApiError';
    }
}
