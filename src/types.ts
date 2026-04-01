export interface User {
  id: string
  username: string
}

export interface Message {
  id: string
  userId: string
  username: string
  text: string
  createdAt: string
}

export interface Chat {
  id: string
  name: string
  messages: Message[]
}
