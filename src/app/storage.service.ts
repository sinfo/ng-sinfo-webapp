import { Injectable } from '@angular/core'

@Injectable()
export class StorageService {
  private internalStorage = {}

  constructor () { }

  setItem (key: string, value: object): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      this.internalStorage[key] = value
    }
  }

  getItem (key: string): object {
    try {
      if (localStorage.getItem(key) === 'undefined') {
        this.removeItem(key)
        return undefined
      }
      return JSON.parse(localStorage.getItem(key))
    } catch (err) {
      return this.internalStorage[key]
    }
  }

  removeItem (key: string): void {
    try {
      localStorage.removeItem(key)
      delete this.internalStorage[key]
    } catch (err) {
      console.error(err)
    }
  }

  clear (): void {
    try {
      localStorage.clear()
      this.internalStorage = {}
    } catch (err) {
      console.error(err)
    }
  }
}
