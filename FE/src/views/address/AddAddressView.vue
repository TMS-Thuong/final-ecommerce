<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center mb-6">
      <button @click="goBack" class="flex items-center text-neutral-600 hover:text-neutral-800 mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('address.addAddress') }}</h1>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <form @submit.prevent="saveAddress">
        <div class="space-y-4">
          <div>
            <label for="recipientName" class="block text-sm font-medium text-gray-700">{{ $t('address.fullName') }}
              *</label>
            <input type="text" id="recipientName" v-model="form.recipientName"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-neutral-800 focus:border-neutral-800"
              :class="{ 'border-red-500': errors.recipientName }" required>
            <p v-if="errors.recipientName" class="mt-1 text-sm text-red-600">{{ errors.recipientName }}</p>
          </div>

          <div>
            <label for="phoneNumber" class="block text-sm font-medium text-gray-700">{{ $t('address.phone') }} *</label>
            <input type="tel" id="phoneNumber" v-model="form.phoneNumber"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-neutral-800 focus:border-neutral-800"
              :class="{ 'border-red-500': errors.phoneNumber }" required>
            <p v-if="errors.phoneNumber" class="mt-1 text-sm text-red-600">{{ errors.phoneNumber }}</p>
          </div>

          <div>
            <label for="province" class="block text-sm font-medium text-gray-700">{{ $t('address.province') }} *</label>
            <select id="province" v-model="form.province"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-neutral-800 focus:border-neutral-800"
              :class="{ 'border-red-500': errors.province }" required>
              <option value="" disabled>{{ $t('address.selectProvince') }}</option>
              <option v-for="province in provinces" :key="province.code" :value="province.name">
                {{ province.name }}
              </option>
            </select>
            <p v-if="errors.province" class="mt-1 text-sm text-red-600">{{ errors.province }}</p>
          </div>

          <div>
            <label for="district" class="block text-sm font-medium text-gray-700">{{ $t('address.district') }} *</label>
            <select id="district" v-model="form.district"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-neutral-800 focus:border-neutral-800"
              :class="{ 'border-red-500': errors.district }" required>
              <option value="" disabled>{{ $t('address.selectDistrict') }}</option>
              <option v-for="district in districts" :key="district.code" :value="district.name">
                {{ district.name }}
              </option>
            </select>
            <p v-if="errors.district" class="mt-1 text-sm text-red-600">{{ errors.district }}</p>
          </div>

          <div>
            <label for="ward" class="block text-sm font-medium text-gray-700">{{ $t('address.ward') }} *</label>
            <select id="ward" v-model="form.ward"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-neutral-800 focus:border-neutral-800"
              :class="{ 'border-red-500': errors.ward }" required>
              <option value="" disabled>{{ $t('address.selectWard') }}</option>
              <option v-for="ward in wards" :key="ward.code" :value="ward.name">
                {{ ward.name }}
              </option>
            </select>
            <p v-if="errors.ward" class="mt-1 text-sm text-red-600">{{ errors.ward }}</p>
          </div>

          <div>
            <label for="streetAddress" class="block text-sm font-medium text-gray-700">{{ $t('address.streetAddress') }}
              *</label>
            <textarea id="streetAddress" v-model="form.streetAddress" rows="2"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-neutral-800 focus:border-neutral-800"
              :class="{ 'border-red-500': errors.streetAddress }" required></textarea>
            <p v-if="errors.streetAddress" class="mt-1 text-sm text-red-600">{{ errors.streetAddress }}</p>
          </div>

          <div class="flex items-center">
            <input id="isDefaultShipping" type="checkbox" v-model="form.isDefaultShipping"
              class="h-4 w-4 text-neutral-800 focus:ring-neutral-800 border-gray-300 rounded">
            <label for="isDefaultShipping" class="ml-2 block text-sm text-gray-900">{{ $t('address.setAsDefault')
              }}</label>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button type="button"
            class="mr-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm"
            @click="goBack">
            {{ $t('address.cancel') }}
          </button>
          <button type="submit"
            class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-neutral-800 text-base font-medium text-white hover:bg-neutral-700 focus:outline-none sm:w-auto sm:text-sm"
            :disabled="isSubmitting">
            <span v-if="isSubmitting" class="mr-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </span>
            {{ $t('address.save') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from '@/hooks/useToast';
import { ToastEnum } from '@/enums/toast';
import addressApi from '@/api/address';
import {
  validateAddressForm,
  hasAddressFormErrors
} from '@/validations/address';
import type {
  AddressFormData,
  AddressFormErrors
} from '@/validations/address';
import { useRouter } from 'vue-router';
import { RouterEnum } from '@/enums/router';
import provinceApi from '@/api/province';
import type { Province, District, Ward } from '@/api/province';

const { t } = useI18n();
const { showToast } = useToast();
const router = useRouter();

const provinces = ref<Province[]>([]);
const districts = ref<District[]>([]);
const wards = ref<Ward[]>([]);
const selectedProvinceCode = ref<number | null>(null);
const selectedDistrictCode = ref<number | null>(null);

const form = reactive<AddressFormData>({
  recipientName: '',
  phoneNumber: '',
  province: '',
  district: '',
  ward: '',
  streetAddress: '',
  isDefaultShipping: false,
  isDefaultBilling: false
});

const errors = reactive<AddressFormErrors>({
  recipientName: '',
  phoneNumber: '',
  province: '',
  district: '',
  ward: '',
  streetAddress: ''
});

const isSubmitting = ref(false);

const validateForm = () => {
  const validationErrors = validateAddressForm(form, t);

  Object.keys(validationErrors).forEach((key) => {
    (errors as any)[key] = validationErrors[key as keyof AddressFormErrors];
  });

  return !hasAddressFormErrors(validationErrors);
};

const saveAddress = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const addressData = {
      recipientName: form.recipientName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      province: form.province,
      district: form.district.trim(),
      ward: form.ward.trim(),
      streetAddress: form.streetAddress.trim(),
      isDefaultShipping: form.isDefaultShipping,
      isDefaultBilling: form.isDefaultBilling
    };

    const response = await addressApi.addAddress(addressData);

    if (response?.data) {
      showToast(ToastEnum.Success, t('address.saveSuccess'));
      router.push({ name: RouterEnum.AddressList });
    } else {
      throw new Error('No data returned from server');
    }
  } catch (error: any) {
    let msg = t('address.saveError');
    if (error?.response?.data?.code === 'INVALID_USER_DATA') {
      try {
        const details = JSON.parse(error.response.data.message);
        if (Array.isArray(details)) {
          msg = details.map(e => e.message).join(', ');
        }
      } catch (e) { }
    }
    showToast(ToastEnum.Error, msg);
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.push({ name: RouterEnum.AddressList });
};

watch(() => form.province, async (newProvince) => {
  if (newProvince) {
    const province = provinces.value.find(p => p.name === newProvince);
    if (province) {
      selectedProvinceCode.value = province.code;
      districts.value = await provinceApi.getDistrictsByProvinceCode(province.code);
      wards.value = [];
      form.district = '';
      form.ward = '';
      selectedDistrictCode.value = null;
    }
  }
});

watch(() => form.district, async (newDistrict) => {
  if (newDistrict) {
    const district = districts.value.find(d => d.name === newDistrict);
    if (district) {
      selectedDistrictCode.value = district.code;
      wards.value = await provinceApi.getWardsByDistrictCode(district.code);
      form.ward = '';
    }
  }
});

const fetchProvinces = async () => {
  try {
    provinces.value = await provinceApi.getProvinces();
  } catch (error) {
    console.error('Error fetching provinces:', error);
  }
};

onMounted(async () => {
  await fetchProvinces();
});
</script>