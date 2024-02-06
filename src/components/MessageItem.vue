<script setup>
import { computed, nextTick, ref } from 'vue'
import CustomIcon from './CustomIcon.vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
    mine: true
  }
})

const emits = defineEmits(["delete", "edit"]);
var currentMessage = computed(() => props.message)

const editInputRef = ref(null)
const hasHover = ref(false)
const editMode = ref(false)

async function moveCaretAndfocus() {
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

  await nextTick()
  input.focus()
}

function onEdit() {
  editMode.value = true
  moveCaretAndfocus()
}

function updateMessage(id, updatedValue) {
  editMode.value = false
  emits('edit', { id, updatedValue })
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

    <div class="context-buttons">
      <button class="context-button" @click="$emit('delete', this.$.vnode.key)">
        <CustomIcon iconName="delete" />
      </button>
      <button class="context-button" @click="onEdit">
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
  margin: 4px;
  min-width: 50px;
  padding: 4px 8px;
  gap: 4px;
  overflow-wrap: anywhere;
  border: var(--item-border);
  border-radius: var(--border-rd-sm);
  background-color: white;

  &:hover {
    transform: scale(1.1, 1.1);
  }

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
    // opacity: 0.2;

    .context-button {
      opacity: 0.2;

      &:hover {
        opacity: 1;
      }
    }
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
