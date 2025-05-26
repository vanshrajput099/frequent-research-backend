export class ApiResponse {
    constructor(message, statusCode, data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}