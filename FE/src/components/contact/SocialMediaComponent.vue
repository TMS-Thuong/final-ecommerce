<template>
    <div class="bg-white shadow-xl border-0">
        <div class="p-6">
            <h2 class="text-2xl font-semibold text-gray-800">{{ $t('contact.social.title') }}</h2>
            <p class="text-gray-600 text-xl">{{ $t('contact.social.description') }}</p>
        </div>
        <div class="p-6">
            <div class="grid grid-cols-2 gap-3">
                <button v-for="(social, index) in socialLinks" :key="index"
                    class="flex items-center gap-2 border border-gray-300 text-lg text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg">
                    <component :is="social.icon" size="8" />
                    {{ $t(social.nameKey) }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Facebook from '@/components/icons/FacebookIcon.vue'
import Instagram from '@/components/icons/InstagramIcon.vue'
import Twitter from '@/components/icons/TwitterIcon.vue'
import Globe from '@/components/icons/GlobeIcon.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const socialLinks = [
    { icon: Facebook, nameKey: 'contact.social.facebook', url: '#' },
    { icon: Instagram, nameKey: 'contact.social.instagram', url: '#' },
    { icon: Twitter, nameKey: 'contact.social.twitter', url: '#' },
    { icon: Globe, nameKey: 'contact.social.website', url: '#' },
]
</script>