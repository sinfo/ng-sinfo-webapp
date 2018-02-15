import { Injectable } from '@angular/core'

export const enum Type {
  warning = 'Warning',
  log = 'Log',
  error = 'Error'
}

export interface Message {
  origin: string,
  text: string,
  type: Type
}

@Injectable()
export class MessageService {
  messages: Message[] = []

  add (message: Message) {
    switch (message.type) {
      case Type.error:
        console.error(message)
        this.messages.push(message)
        break
      case Type.log:
        console.log(message)
        break
      case Type.warning:
        console.log(message)
        this.messages.push(message)
        break
      default:
        console.log(message)
        break
    }
  }

  clear () {
    this.messages = []
  }

}
