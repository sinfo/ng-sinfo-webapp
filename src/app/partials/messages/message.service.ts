import { Injectable } from '@angular/core'

export const enum Type {
  warning = 'Warning',
  log = 'Log',
  error = 'Error'
}

export interface Message {
  origin: string,
  text: string,
  type?: Type
}

@Injectable()
export class MessageService {
  messages: Message[] = []

  add (message: Message) {
    console.log(message)
    this.messages.push(message)
  }

  clear () {
    this.messages = []
  }

}
