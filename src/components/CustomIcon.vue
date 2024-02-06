<script setup>
defineProps({
  iconName: {
    type: String,
    required: true,
    default: 'close'
  }
})
</script>

<template>
  <img :src="`./src/assets/icons/${iconName}.svg`" alt="custom-icon" />
</template>
