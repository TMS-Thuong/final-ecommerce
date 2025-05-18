<template>
  <footer class="bg-gray-900 text-gray-300 pt-10 pb-4">
    <div class="px-8 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-screen-2xl">
      <div v-if="companyName">
        <div class="font-bold text-4xl text-white mb-2">{{ companyName }}</div>
        <p class="mb-4 text-xl">
          Bringing you an exceptional shopping experience with quality products and dedicated service.
        </p>
        <div class="flex space-x-3">
          <a href="#" class="text-gray-300 hover:text-white">
            <FacebookIcon size="8" />
          </a>
          <a href="#" class="text-gray-300 hover:text-white">
            <InstagramIcon size="8" />
          </a>
          <a href="#" class="text-gray-300 hover:text-white">
            <TwitterIcon size="8" />
          </a>
        </div>
      </div>

      <div>
        <h4 class="font-bold text-2xl mb-2 text-white">Information</h4>
        <ul class="space-y-2 text-xl">
          <li><a href="#" class="text-gray-300 hover:text-white">About Us</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">Privacy Policy</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">Terms of Use</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">Return Policy</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">Shipping Policy</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold text-2xl mb-2 text-white">Account</h4>
        <ul class="space-y-2 text-xl">
          <li><a href="#" class="text-gray-300 hover:text-white">Sign In</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">Register</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">Shopping Cart</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">Wishlist</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">Order Tracking</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold text-2xl mb-2 text-white">Contact</h4>
        <ul class="space-y-2 text-xl">
          <li class="flex items-center gap-2">
            <LocationIcon size="8" class="text-gray-300" />
            192 Xo Viet Nghe Tinh, Hoa Cuong Nam, Hai Chau, Da Nang
          </li>
          <li class="flex items-center gap-2">
            <TelephoneIcon size="8" class="text-gray-300" />
            1900 1234
          </li>
          <li class="flex items-center gap-2">
            <MailIcon size="8" class="text-gray-300" />
            support@hitmdt.com
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-xl">
      ©2025 {{ companyName }}. All rights reserved.
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
const companyName = ref('H!TMDT');

import FacebookIcon from '@/components/icons/FacebookIcon.vue'
import InstagramIcon from '@/components/icons/InstagramIcon.vue'
import TwitterIcon from '@/components/icons/TwitterIcon.vue'
import LocationIcon from '@/components/icons/LocationIcon.vue'
import TelephoneIcon from '@/components/icons/TelephoneIcon.vue'
import MailIcon from '@/components/icons/MailIcon.vue'
</script>
