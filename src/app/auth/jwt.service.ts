import { Injectable } from '@angular/core'

/**
 * This code was taken from: https://github.com/auth0/angular2-jwt
 * We only need the basic functionality to decode and check if token is expired
 */
@Injectable()
export class JwtService {

  constructor () {}

  public urlBase64Decode (str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/')
    switch (output.length % 4) {
      case 0: {
        break
      }
      case 2: {
        output += '=='
        break
      }
      case 3: {
        output += '='
        break
      }
      default: {
        throw new Error('Illegal base64url string!')
      }
    }
    return this.b64DecodeUnicode(output)
  }

  // credits for decoder goes to https://github.com/atk
  private b64decode (str: string): string {
    let chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    let output = ''

    str = String(str).replace(/=+$/, '')

    if (str.length % 4 === 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded."
      )
    }

    for (
      // initialize result and counters
      // tslint:disable-next-line:one-variable-per-declaration
      let bc = 0, bs: any, buffer: any, idx = 0;
      // get next character
      // tslint:disable-next-line:no-conditional-assignment
      (buffer = str.charAt(idx++));
      // character found in table? initialize bit storage and add its ascii value;
      // tslint:disable-next-line:no-bitwise
      ~buffer &&
      (
        // tslint:disable-next-line:no-conditional-assignment
        (bs = bc % 4 ? bs * 64 + buffer : buffer),
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4
      )
        // tslint:disable-next-line:no-bitwise
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer)
    }
    return output
  }

  private b64DecodeUnicode (str: any) {
    return decodeURIComponent(
      Array.prototype.map
        .call(this.b64decode(str), (c: any) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
  }

  public decodeToken (token: string): any {
    let parts = token.split('.')

    if (parts.length !== 3) {
      throw new Error('The inspected token doesn\'t appear to be a JWT.')
    }

    let decoded = this.urlBase64Decode(parts[1])
    if (!decoded) {
      throw new Error('Cannot decode the token.')
    }

    return JSON.parse(decoded)
  }

  public getTokenExpirationDate (token: string): Date {
    let decoded: any
    decoded = this.decodeToken(token)

    if (!decoded.hasOwnProperty('exp')) {
      return null
    }

    const date = new Date(0)
    date.setUTCSeconds(decoded.exp)

    return date
  }

  public isTokenExpired (token: string, offsetSeconds?: number): boolean {
    let date = this.getTokenExpirationDate(token)
    offsetSeconds = offsetSeconds || 0

    if (date === null) {
      return false
    }

    return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000)
  }
}
