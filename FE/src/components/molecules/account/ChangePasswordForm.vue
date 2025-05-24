<template>
    <form @submit.prevent="$emit('submit')" class="flex flex-col gap-2 max-w-md">
        <input v-model="passwordForm.currentPassword" type="password" class="input" placeholder="Mật khẩu hiện tại"
            required />
        <input v-model="passwordForm.newPassword" type="password" class="input" placeholder="Mật khẩu mới" required />
        <button type="submit" class="btn-primary w-fit">Đổi mật khẩu</button>
    </form>
</template>
<script setup lang="ts">
const props = defineProps({
    passwordForm: {
        type: Object,
        default: () => ({
            currentPassword: '',
            newPassword: '',
        })
    },
});
</script>