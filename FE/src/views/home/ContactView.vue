<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
        <div class="mx-auto max-w-full">
            <ContactHeader :success="success" />

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-1 space-y-6">
                    <ContactInfo />
                    <SocialMedia />
                    <ContactMap />
                </div>

                <div class="lg:col-span-2">
                    <ContactForm @success="inFormSuccess" />
                </div>
            </div>
        </div>
    </div>
    <FooterOrganism />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContactHeader from '@/components/contact/ContactHeader.vue'
import ContactInfo from '@/components/contact/ContactInfo.vue'
import SocialMedia from '@/components/contact/SocialMedia.vue'
import ContactForm from '@/components/contact/ContactForm.vue'
import FooterOrganism from '@/components/footer/FooterOrganism.vue'

const success = ref(false)

const inFormSuccess = () => {
    success.value = true
    setTimeout(() => {
        success.value = false
    }, 3000)
}
</script>