<template>
  <footer class="bg-gray-900 text-gray-300 pt-10 pb-4">
    <div class="px-8 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-screen-2xl">
      <div v-if="companyName">
        <div class="font-bold text-4xl text-white mb-2">{{ companyName }}</div>
        <p class="mb-4 text-xl">
          {{ $t('footer.companyDescription') }}
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
        <h4 class="font-bold text-2xl mb-2 text-white">{{ $t('footer.information.title') }}</h4>
        <ul class="space-y-2 text-xl">
          <li><router-link :to="{ name: RouterEnum.About }" class="text-gray-300 hover:text-white">{{
            $t('footer.information.aboutUs') }}</router-link></li>
          <li><a href="#" class="text-gray-300 hover:text-white">{{ $t('footer.information.privacyPolicy') }}</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">{{ $t('footer.information.termsOfUse') }}</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">{{ $t('footer.information.returnPolicy') }}</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">{{ $t('footer.information.shippingPolicy') }}</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold text-2xl mb-2 text-white">{{ $t('footer.account.title') }}</h4>
        <ul class="space-y-2 text-xl">
          <li><router-link :to="{ name: AuthRouterEnum.Login }" class="text-gray-300 hover:text-white">{{
            $t('auth.login.submitButton') }}</router-link></li>
          <li><router-link :to="{ name: AuthRouterEnum.Register }" class="text-gray-300 hover:text-white">{{
            $t('auth.register.submitButton') }}</router-link></li>
          <li><router-link :to="{ name: RouterEnum.Cart }" class="text-gray-300 hover:text-white">{{
            $t('footer.account.shoppingCart') }}</router-link></li>
          <li><router-link :to="{ name: RouterEnum.Wishlist }" class="text-gray-300 hover:text-white">{{
            $t('footer.account.wishlist') }}</router-link></li>
          <li><router-link :to="{ name: RouterEnum.MyOrders }" class="text-gray-300 hover:text-white">{{
            $t('footer.account.orderTracking') }}</router-link></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold text-2xl mb-2 text-white">{{ $t('footer.contact.title') }}</h4>
        <ul class="space-y-2 text-xl">
          <li class="flex items-center gap-2">
            <LocationIcon size="8" class="text-gray-300" />
            {{ $t('contact.info.address.content') }}
          </li>
          <li class="flex items-center gap-2">
            <TelephoneIcon size="8" class="text-gray-300" />
            {{ $t('contact.info.phone.content') }}
          </li>
          <li class="flex items-center gap-2">
            <MailIcon size="8" class="text-gray-300" />
            {{ $t('contact.info.email.content') }}
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-xl">
      {{ $t('footer.copyright', { companyName }) }}
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterEnum, AuthRouterEnum } from '@/enums/router';
const { t } = useI18n();

const companyName = ref('H!TMDT');

import FacebookIcon from '@/components/icons/FacebookIcon.vue'
import InstagramIcon from '@/components/icons/InstagramIcon.vue'
import TwitterIcon from '@/components/icons/TwitterIcon.vue'
import LocationIcon from '@/components/icons/LocationIcon.vue'
import TelephoneIcon from '@/components/icons/TelephoneIcon.vue'
import MailIcon from '@/components/icons/MailIcon.vue'
</script>
