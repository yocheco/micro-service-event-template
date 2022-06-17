// import { HttpStatusCode } from '../types/http.model'

// export class BaseError extends Error {
//   public readonly log: string;
//   public readonly method: string | undefined;
//   public readonly httpCode: HttpStatusCode;
//   public readonly isOperational: boolean;

//   constructor (
//     log: string,
//     message: string | unknown = log,
//     method?: string| null,
//     httpCode = HttpStatusCode.INTERNAL_SERVER,
//     isOperational = true
//   ) {
//     super(<string>message)
//     Object.setPrototypeOf(this, new.target.prototype)

//     this.log = log
//     if (method) this.method = method
//     this.httpCode = httpCode
//     this.isOperational = isOperational

//     Error.captureStackTrace(this)
//   }
// }
