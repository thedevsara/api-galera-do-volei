export class ApiException extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ApiException.prototype);
    }
}

export class NotFoundException extends ApiException {
    constructor(message: string = "Recurso não encontrado.") {
        super(404, message);
    }
}

export class BadRequestException extends ApiException {
    constructor(message: string = "Requisição inválida.") {
        super(400, message);
    }
}

export class UnauthorizedException extends ApiException {
    constructor(message: string = "Acesso negado. Credenciais inválidas.") {
        super(401, message);
    }
}