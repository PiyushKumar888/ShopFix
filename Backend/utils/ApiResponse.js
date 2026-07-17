export class ApiResponse {
    constructor(message,statusCode,data){
        this.message = message;
        this.statusCode = statusCode;
        this.success = statusCode<400;
        this.data = data;
    }
}