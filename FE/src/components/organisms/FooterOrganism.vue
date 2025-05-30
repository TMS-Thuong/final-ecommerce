<template>
    <footer class="bg-white border-t border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('footer.companyDescription') }}</h3>
                </div>

                <div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('footer.information.title') }}</h3>
                    <ul class="space-y-2">
                        <li>
                            <router-link to="/about" class="text-gray-600 hover:text-gray-900">{{
                                $t('footer.information.aboutUs') }}</router-link>
                        </li>
                        <li>
                            <router-link to="/privacy" class="text-gray-600 hover:text-gray-900">{{
                                $t('footer.information.privacyPolicy') }}</router-link>
                        </li>
                        <li>
                            <router-link to="/terms" class="text-gray-600 hover:text-gray-900">{{
                                $t('footer.information.termsOfUse') }}</router-link>
                        </li>
                        <li>
                            <router-link to="/return-policy" class="text-gray-600 hover:text-gray-900">{{
                                $t('footer.information.returnPolicy') }}</router-link>
                        </li>
                        <li>
                            <router-link to="/shipping-policy" class="text-gray-600 hover:text-gray-900">{{
                                $t('footer.information.shippingPolicy') }}</router-link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('footer.account.title') }}</h3>
                    <ul class="space-y-2">
                        <li>
                            <router-link to="/login" class="text-gray-600 hover:text-gray-900">{{
                                $t('footer.account.signIn') }}</router-link>
                        </li>
                        <li>
                            <router-link to="/register" class="text-gray-600 hover:text-gray-900">{{
                                $t('footer.account.register') }}</router-link>
                        </li>
                        <li>
                            <router-link to="/cart" class="text-gray-600 hover:text-gray-900">{{
                                $t('footer.account.shoppingCart') }}</router-link>
                        </li>
                        <li>
                            <router-link to="/wishlist" class="text-gray-600 hover:text-gray-900">{{
                                $t('footer.account.wishlist') }}</router-link>
                        </li>
                        <li>
                            <router-link to="/track-order" class="text-gray-600 hover:text-gray-900">{{
                                $t('footer.account.orderTracking') }}</router-link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('footer.contact.title') }}</h3>
                    <div class="space-y-4">
                        <div class="flex items-center space-x-2">
                            <Mail class="w-5 h-5" />
                            <a :href="'mailto:' + $t('contact.info.email.content')"
                                class="text-gray-600 hover:text-gray-900">{{ $t('contact.info.email.content') }}</a>
                        </div>
                        <div class="flex items-center space-x-2">
                            <Phone class="w-5 h-5" />
                            <span class="text-gray-600">{{ $t('contact.info.phone.content') }}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <MapPin class="w-5 h-5" />
                            <span class="text-gray-600">{{ $t('contact.info.address.content') }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-12 pt-8 border-t border-gray-200">
                <p class="text-center text-gray-600">
                    {{ $t('footer.copyright', { companyName: 'H!TMDT' }) }}
                </p>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { Mail, Phone, MapPin } from 'lucide-vue-next';
</script>