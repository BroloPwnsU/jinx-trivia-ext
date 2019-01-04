export class Notification {
    message: string = '';
    isError: boolean = false;

    constructor (
        message: string
        , isError: boolean
        ) {
        this.message = message;
        this.isError = isError;
    }
}