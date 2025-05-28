<template>
    <div class="bg-white shadow-2xl border-0">
        <div class="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-t-lg p-6">
            <h2 class="text-2xl font-bold">{{ $t('contact.info.companyName') }}</h2>
            <p class="text-xl text-gray-300 text-xl">
                {{ $t('contact.info.description') }}
            </p>
        </div>
        <div class="p-6 space-y-6">
            <div v-for="(info, index) in contactInfo" :key="index" class="flex items-start gap-4">
                <div class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <component :is="info.icon" size="8" />
                </div>
                <div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-1">{{ $t(info.titleKey) }}</h3>
                    <p class="text-gray-700 text-xl">{{ $t(info.contentKey) }}</p>
                    <p v-if="info.subContentKey" class="text-gray-600 text-xl mt-1">{{ $t(info.subContentKey) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import MapPin from '@/components/icons/LocationIcon.vue'
import Phone from '@/components/icons/TelephoneIcon.vue'
import Mail from '@/components/icons/MailIcon.vue'
import Clock from '@/components/icons/ClockIcon.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const contactInfo = [
    {
        icon: MapPin,
        titleKey: 'contact.info.address.title',
        contentKey: 'contact.info.address.content',
        subContentKey: 'contact.info.address.subContent',
    },
    {
        icon: Phone,
        titleKey: 'contact.info.phone.title',
        contentKey: 'contact.info.phone.content',
        subContentKey: 'contact.info.phone.subContent',
    },
    {
        icon: Mail,
        titleKey: 'contact.info.email.title',
        contentKey: 'contact.info.email.content',
        subContentKey: 'contact.info.email.subContent',
    },
    {
        icon: Clock,
        titleKey: 'contact.info.businessHours.title',
        contentKey: 'contact.info.businessHours.content',
        subContentKey: 'contact.info.businessHours.subContent',
    },
]
</script>