import { Injectable } from '@angular/core'

export const enum Type {
  warning = 'Warning',
  log = 'Info',
  error = 'Error',
  success = 'Success'
}

export interface Message {
  origin: string,
  showAlert: boolean,
  text: string,
  type: Type,
  errorObject?: object
  timeout?: number
}

@Injectable()
export class MessageService {
  messages: Message[] = []

  add (message: Message) {
    switch (message.type) {
      case Type.error:
        // message.errorObject ? console.error(message.errorObject) : console.error(message)
        if (message.showAlert) {
          message['messageClass'] = this.changeClass('danger')
          this.messages.push(message)
        }
        break
      case Type.log:
        console.log(message)
        if (message.showAlert) {
          message['messageClass'] = this.changeClass('info')
          this.messages.push(message)
        }
        break
      case Type.warning:
        console.log(message)
        if (message.showAlert) {
          message['messageClass'] = this.changeClass('warning')
          this.messages.push(message)
        }
        break
      case Type.success:
        if (message.showAlert) {
          message['messageClass'] = this.changeClass('success')
          this.messages.push(message)
        }
        break
      default:
        console.log(message)
        break
    }
    if (message.timeout) {
      this.clearTimeout(message.timeout, message)
    }
  }

  clear () {
    this.messages = []
  }

  clearTimeout (timeout: number, message: Message) {
    setTimeout((() => {
      const messageIndex = this.messages.indexOf(message)
      if (messageIndex > -1) {
        this.messages.splice(messageIndex, 1)
      }
    }), timeout)
  }

  /**
   * Change class according to bootstrap Alert component
   * https://getbootstrap.com/docs/3.3/components/#alerts
   * @param alertType default: `success`, `info`, `warning`, `danger`
   */
  changeClass (alertType: string = 'info'): string {
    return `alert alert-${alertType} alert-dismissible`
  }

}
