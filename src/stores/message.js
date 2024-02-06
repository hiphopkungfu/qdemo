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

// export const useMessageStore = defineStore('messageStore', () => {
  // const messages = ref([])

  // function addMessage(message) {
  //   messages.value.push(message)
  // }

  // function deleteMessage(key) {
  //   messages.value = messages.value.filter((message, index) => key !== index)
  // }

  // function updateMessage(key, value) {
  //   if (key < 0) return
  //   if (messages.value[key] === undefined) return

  //   messages.value[key] = value
  // }

  // return { addMessage, deleteMessage, updateMessage, messages }
// })
