import { defineStore } from 'pinia'
import axios from "axios"

const port = '8080'
const httpRoute = `http://localhost:${port}`

export const useMessageStore = defineStore('counter', {
  state: () => ({
    messages: [],
  }),
  getters: {
    getMessages(state) {
        return state.messages
    }
  },
  actions: {
    async fetchMessages() {
      try {
        const data = await axios.get(`${httpRoute}/messages`)
        this.messages = data.data
      }
      catch (error) {
        console.log(error)
      }
    }
  }
})
