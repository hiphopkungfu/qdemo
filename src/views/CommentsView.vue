<script setup>
import { computed, onMounted, ref } from 'vue'
import { useMessageStore } from '../stores/message'
import MessageItem from '../components/MessageItem.vue'
import CustomIcon from '../components/CustomIcon.vue' 
import { uuid } from 'vue-uuid'; 

const messageStore = useMessageStore()
const currentMessages = computed(() => messageStore.messages)
const myMessage = ref('')

// @Todo: move to config
const port = '8080'
const wsRoute = `ws://localhost:${port}/ws-stuff/msg`
const ws = new WebSocket(wsRoute)

async function fetchMessages () { 
  await messageStore.fetchMessages()
}

// ws.onopen = function () {
//   alert("Connection established")
// };
// ws.onclose = function () {
//   alert("Connection closed")
// };

ws.onmessage = function (msg) {
  const parsed = JSON.parse(msg.data)
  if (parsed.message === 'ready') {
    fetchMessages()
  }
};

function onSubmit(e) {
  e.preventDefault()
  ws.send(JSON.stringify({ value: myMessage.value, action: 'add', id: uuid.v4() }))
  myMessage.value = ''
}

function onEdit({ id, updatedValue }) {
  ws.send(JSON.stringify({ value: updatedValue, action: 'edit', id }))
  myMessage.value = ''
}

function onDelete(id) {
  ws.send(JSON.stringify({ action: 'delete', id }))
}

onMounted(() => {
  fetchMessages()
})
</script>

<template>
  <main>
    <div class="comments-wrapper">
      <div class="comments-display">
        <MessageItem
          v-for="({value, id}, index) in currentMessages"
          :key="id"
          :message="value"
          @delete="onDelete"
          @edit="onEdit"
        />
      </div>
      <div class="comments-input-panel">
        <form @submit="onSubmit">
          <input v-model="myMessage" placeholder="Your message" />
          <button class="submit-button" type="submit">
            <CustomIcon iconName="send" />
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
  padding: 60px;
}

form,
input {
  width: 100%;
}

.comments-wrapper {
  min-width: 300px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 14px;
  border-radius: var(--border-rd-lg);
  padding: 40px;
  padding-right: 16px;
  background-color: var(--q-green);
}
.comments-display {
  max-height: 500px;
  overflow-y: auto;
  scrollbar-gutter: stable;
  padding-right: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  height: 500px;
  gap: 6px;
}
.comments-input-panel {
  justify-content: flex-end;
  display: flex;
  height: 32px;
  padding-right: 24px;
}

form {
  display: flex;
  gap: 12px;
}

.submit-button {
  width: 32px;
  background: white;
  border-radius: 100%;
  border-width: 0;

  &:hover {
    transform: scale(1.3, 1.3);
  }
}
</style>
