<template>
  <div>
    <input type="file" accept="image/*" @change="$emit('change', $event)" class="block" />
  </div>
</template>
