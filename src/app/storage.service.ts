import { Injectable } from '@angular/core'

@Injectable()
export class StorageService {
  private internalStorage = {}

  constructor () { }

  setItem (key: string, value: object): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error(err)
      this.internalStorage[key] = value
    }
  }

  getItem (key: string): object {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch (err) {
      console.error(err)
      return this.internalStorage[key]
    }
  }

  removeItem (key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (err) {
      console.error(err)
      delete this.internalStorage[key]
    }
  }

  clear (): void {
    try {
      localStorage.clear()
    } catch (err) {
      console.error(err)
      this.internalStorage = {}
    }
  }
}
