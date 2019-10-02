
export class Company {
  id: string
  img: string
  name: string
  site: string
  participation: {
    event: number
    // TODO unnecessay, onlyNeed string "Gold"
    package: {
      items: {
        item: string
        quantity: number
      }[]
      name: string
    }
  }[]

  // TODO add these fields
  // description: string
  // Contacts
}
