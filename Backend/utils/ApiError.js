
export class ApiError extends Error {
    constructor(message, statusCode,errors=[],) {
        super(message);
        this.statusCode = statusCode;
        this.data=null;
        this.errors=errors;
        this.success=false;
    }
}