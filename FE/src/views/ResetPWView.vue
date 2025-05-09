<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <ResetPW :token="token" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import ResetPW from '@/components/organisms/ResetPWComponent.vue'
import router from '@/router'
import { RouterEnum } from '@/enums/router'

const route = useRoute()
const token = (route.query.token as string | undefined) ?? ''
if (!token) {
  router.push({ name: RouterEnum.Login })
}
</script>
