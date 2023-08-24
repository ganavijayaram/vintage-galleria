import {scrypt, randomBytes} from 'crypto'
//convert callbasck to Promise
import {promisify} from 'util'

const scryptAsync = promisify(scrypt)

export class Password {
  //static methods are methods, where you can call them without creating objects
  static async toHash(password: string) {
    //random string
    const salt = randomBytes(8).toString('hex')
    //hashedpassword
    const buf = (await scryptAsync(password, salt, 64)) as Buffer //telling the type
    //sending hashedpassword and randomstring combined
    return `${buf.toString('hex')}.${salt}`
  }
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedpassword, salt] = storedPassword.split('.')
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer //telling the type
    return (buf.toString('hex') === hashedpassword)
  }
}