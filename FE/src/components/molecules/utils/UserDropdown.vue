<template>
  <div class="relative" @click="toggleDropdown">
    <ChevronDownIcon
      size="8"
      class="text-gray-700 hover:text-black transition cursor-pointer"
    />
    <div v-if="dropdownVisible" class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md">
      <ul class="py-1">
        <li @click="signIn" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign In</li>
        <li @click="signUp" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign Up</li>
        <li @click="logout" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'

const dropdownVisible = ref(false)

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
}

const signIn = () => {
}

const signUp = () => {
}

const logout = () => {
}
</script>
