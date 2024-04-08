import { Sponsor } from '../sponsors/sponsor.model'

export class Promocode {
  id: string
  code: string
  company: string | Sponsor
  description: string
  edition: string
  expire: Date
  link?: boolean
}
