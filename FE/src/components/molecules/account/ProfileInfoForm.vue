<template>
    <form @submit.prevent="$emit('submit')" class="space-y-8">
        <div class="flex flex-col items-center space-y-4 p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
            <img :src="avatarPreview || (profile && profile.avatarUrl) || '/placeholder.svg?height=120&width=120'"
                class="w-32 h-32 rounded-full border-4 border-gray-200 object-cover" alt="avatar" />
            <div class="text-center">
                <div v-if="isEditing" class="mt-2 flex flex-col items-center gap-2">
                    <label
                        class="bg-gray-800 text-white hover:bg-gray-900 border-gray-800 px-4 py-2 rounded cursor-pointer inline-flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5-5 5 5M12 5v12" />
                        </svg>
                        {{ $t('account.chooseFile') }}
                        <input type="file" class="hidden" @change="onAvatarChange" />
                    </label>
                    <button v-if="avatarPreview" type="button"
                        class="bg-gray-800 text-white hover:bg-gray-900 border-gray-800 text-white px-4 py-2 rounded shadow transition"
                        @click="emitUpdateAvatar">
                        {{ $t('account.updateAvatar') }}
                    </button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xl">
            <div class="space-y-3">
                <label class="text-xl font-normal text-gray-600 uppercase tracking-wide flex items-center gap-2">
                    {{ $t('account.firstName') }}
                </label>
                <input v-model="form.firstName" :readonly="!isEditing"
                    class="p-2.5 text-xl border-2 border-gray-300 focus:border-gray-600 rounded-lg bg-white text-gray-900 font-medium w-full block"
                    :placeholder="$t('account.firstName')" />
            </div>
            <div class="space-y-3">
                <label class="text-xl font-normal text-gray-600 uppercase tracking-wide flex items-center gap-2">
                    <span></span>{{ $t('account.lastName') }}
                </label>
                <input v-model="form.lastName" :readonly="!isEditing"
                    class="p-2.5 border-2 border-gray-300 focus:border-gray-600 rounded-lg bg-white text-gray-900 font-medium w-full block"
                    :placeholder="$t('account.lastName')" />
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xl">
            <div class="space-y-3">
                <label class="text-xl font-normal text-gray-600 uppercase tracking-wide flex items-center gap-2">
                    <CalendarDotsIcon size="6" />
                    {{ $t('account.birthDate') }}
                </label>
                <input v-model="form.birthDate" :readonly="!isEditing" type="date"
                    class="p-2.5 text-xl border-2 border-gray-300 focus:border-gray-600 rounded-lg bg-white text-gray-900 font-medium w-full block" />
            </div>
            <div class="space-y-3">
                <label class="text-xl font-normal text-gray-600 uppercase tracking-wide flex items-center gap-2">
                    <TelephoneIcon size="6" />
                    {{ $t('account.phoneNumber') }}
                </label>
                <input v-model="form.phone" type="tel" :readonly="!isEditing"
                    class="p-2.5 text-xl border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium w-full block"
                    :placeholder="$t('account.phoneNumber')" />
            </div>
            <div class="space-y-3 text-xl">
                <label class="text-xl font-normal text-gray-600 uppercase tracking-wide flex items-center gap-2">
                    <UserCircleIcon size="6" />
                    {{ $t('account.gender') }}
                </label>
                <select v-model="form.gender" :disabled="!isEditing"
                    class="p-2.5 pl-3 pr-8 border-2 border-gray-300 focus:border-gray-600 rounded-lg bg-white text-xl text-gray-900 font-medium w-full block">
                    <option value="">{{ $t('account.select') }}</option>
                    <option value="male">{{ $t('account.male') }}</option>
                    <option value="female">{{ $t('account.female') }}</option>
                    <option value="other">{{ $t('account.other') }}</option>
                </select>
            </div>
        </div>

        <div v-if="isEditing" class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button type="submit"
                class="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-6 py-4 text-left text-xl font-medium shadow-lg rounded">
                {{ $t('account.save') }}
            </button>
            <button type="button"
                class="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-4 text-left text-xl font-medium rounded"
                @click="$emit('cancel-edit')">
                {{ $t('account.cancel') }}
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import CalendarDotsIcon from '@/components/icons/CalendarDotsIcon.vue';
import UserCircleIcon from '@/components/icons/UserCircleIcon.vue';
import TelephoneIcon from '@/components/icons/TelephoneIcon.vue';
import { ref, defineExpose } from 'vue';
const props = defineProps({
    profile: Object,
    isEditing: Boolean,
    form: {
        type: Object,
        default: () => ({
            firstName: '',
            lastName: '',
            phone: '',
            birthDate: '',
            gender: '',
            avatarUrl: '',
        })
    },
});
const emit = defineEmits(['update-avatar', 'submit', 'cancel-edit']);
const avatarPreview = ref<string | null>(null);
const avatarFile = ref<File | null>(null);
function onAvatarChange(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files && files[0]) {
        avatarFile.value = files[0];
        avatarPreview.value = URL.createObjectURL(files[0]);
    }
}
function emitUpdateAvatar() {
    if (avatarFile.value) emit('update-avatar', avatarFile.value);
}
function resetAvatarPreview() {
    avatarPreview.value = null;
    avatarFile.value = null;
}
defineExpose({ resetAvatarPreview });
</script>
