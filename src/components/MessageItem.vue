<script setup>
import { computed, ref } from 'vue'
import { useMessageStore } from '../stores/message'
import CustomIcon from './CustomIcon.vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
    mine: true
  }
})

const messageStore = useMessageStore()
var currentMessage = computed(() => props.message)

const editInputRef = ref(null)
const hasHover = ref(false)
const editMode = ref(false)

function moveCaretAndfocus() {
  const input = editInputRef.value
  const textNode = input.firstChild
  const range = document.createRange()
  const selection = window.getSelection()

  if (textNode) {
    range.setStart(textNode, textNode.length)
    range.setEnd(input, 1)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  }
  setTimeout(() => {
    input.focus()
  })
}

function onEdit() {
  editMode.value = true
  moveCaretAndfocus()
}

function updateMessage(key, value) {
  editMode.value = false
  messageStore.updateMessage(key, value)
}
</script>

<template>
  <span
    class="message-item"
    :class="{ 'edit-mode': editMode }"
    @mouseover="hasHover = true"
    @mouseleave="hasHover = false"
  >
    <span v-if="!editMode" @dblclick="$emit('edit')" class="message-text">
      {{ message }}
    </span>
    <span v-if="!message && !editMode" class="empty"></span>
    <span
      v-show="editMode"
      @blur="(e) => updateMessage(this.$.vnode.key, e.target.textContent)"
      class="edit-message-input message-text"
      ref="editInputRef"
      role="textbox"
      contenteditable
    >
      {{ currentMessage }}
    </span>

    <div class="context-buttons" :class="{ active: hasHover && !editMode }">
      <button @click="$emit('delete', this.$.vnode.key)">
        <CustomIcon iconName="delete" />
      </button>
      <button @click="onEdit">
        <CustomIcon iconName="edit" />
      </button>
    </div>
  </span>
</template>

<style lang="scss" scoped>
.message-item {
  align-items: center;
  display: flex;
  flex-direction: column;
  width: auto;
  height: auto;
  min-width: 50px;
  padding: 4px 8px;
  gap: 4px;
  overflow-wrap: anywhere;
  border: var(--item-border);
  border-radius: var(--border-rd-sm);
  background-color: white;

  &.edit-mode {
    box-shadow:
      rgba(0, 0, 0, 0.19) 0px 10px 20px,
      rgba(0, 0, 0, 0.23) 0px 6px 6px;
  }

  button {
    display: flex;
    width: 12px;
    border: 0;
    background-color: unset;

    img {
      height: 14px;
      width: auto;
    }

    &:hover {
      cursor: pointer;
      color: white;
    }
  }

  .message-text {
    line-height: 30px;
  }

  .context-buttons {
    display: flex;
    gap: 4px;
    align-self: flex-end;
    opacity: 0.2;
  }
  .active {
    opacity: 1;
  }

  .edit-message-input {
    width: 100%;
    overflow-wrap: anywhere;
    overflow: hidden;
  }
}

.empty {
  height: 30px;
}
</style>
