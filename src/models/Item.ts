import type User from './User'

export default interface Item {
  id: number
  name: string
  recurrent: boolean
  priority: number
  assignedTo: User
  done: boolean
  status: string
  created: string
  updated: string
}
