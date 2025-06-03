<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="saveAddress">
          <div class="bg-neutral-800 px-4 py-4 sm:px-6 flex justify-between items-center">
            <h3 class="text-lg leading-6 font-medium text-white" id="modal-title">
              {{ isEditing ? $t('address.edit') : $t('address.addNew') }}
            </h3>
            <button type="button" class="text-white hover:text-gray-200" @click="closeModal">
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="space-y-4">
              <div>
                <label for="recipientName" class="block text-sm font-medium text-gray-700">{{ $t('address.fullName') }} *</label>
                <input type="text" id="recipientName" v-model="form.recipientName"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-neutral-800 focus:border-neutral-800"
                      :class="{'border-red-500': errors.recipientName}" required>
                <p v-if="errors.recipientName" class="mt-1 text-sm text-red-600">{{ errors.recipientName }}</p>
              </div>

              <div>
                <label for="phoneNumber" class="block text-sm font-medium text-gray-700">{{ $t('address.phone') }} *</label>
                <input type="tel" id="phoneNumber" v-model="form.phoneNumber"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-neutral-800 focus:border-neutral-800"
                      :class="{'border-red-500': errors.phoneNumber}" required>
                <p v-if="errors.phoneNumber" class="mt-1 text-sm text-red-600">{{ errors.phoneNumber }}</p>
              </div>

              <div>
                <label for="province" class="block text-sm font-medium text-gray-700">{{ $t('address.province') }} *</label>
                <select id="province" v-model="selectedProvinceCode"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-neutral-800 focus:border-neutral-800"
                        :class="{'border-red-500': errors.province}" required @change="onProvinceChange">
                  <option value="" disabled>{{ $t('address.selectProvince') }}</option>
                  <option v-for="province in provinces" :key="province.code" :value="province.code">
                    {{ province.name }}
                  </option>
                </select>
                <p v-if="errors.province" class="mt-1 text-sm text-red-600">{{ errors.province }}</p>
              </div>

              <div>
                <label for="district" class="block text-sm font-medium text-gray-700">{{ $t('address.district') }} *</label>
                <select id="district" v-model="selectedDistrictCode"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-neutral-800 focus:border-neutral-800"
                        :class="{'border-red-500': errors.district}" required @change="onDistrictChange"
                        :disabled="!selectedProvinceCode">
                  <option value="" disabled>{{ $t('address.selectDistrict') }}</option>
                  <option v-for="district in districts" :key="district.code" :value="district.code">
                    {{ district.name }}
                  </option>
                </select>
                <p v-if="errors.district" class="mt-1 text-sm text-red-600">{{ errors.district }}</p>
              </div>

              <div>
                <label for="ward" class="block text-sm font-medium text-gray-700">{{ $t('address.ward') }} *</label>
                <select id="ward" v-model="selectedWardCode"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-neutral-800 focus:border-neutral-800"
                        :class="{'border-red-500': errors.ward}" required @change="onWardChange"
                        :disabled="!selectedDistrictCode">
                  <option value="" disabled>{{ $t('address.selectWard') }}</option>
                  <option v-for="ward in wards" :key="ward.code" :value="ward.code">
                    {{ ward.name }}
                  </option>
                </select>
                <p v-if="errors.ward" class="mt-1 text-sm text-red-600">{{ errors.ward }}</p>
              </div>

              <div>
                <label for="streetAddress" class="block text-sm font-medium text-gray-700">{{ $t('address.streetAddress') }} *</label>
                <textarea id="streetAddress" v-model="form.streetAddress" rows="2"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-neutral-800 focus:border-neutral-800"
                          :class="{'border-red-500': errors.streetAddress}" required></textarea>
                <p v-if="errors.streetAddress" class="mt-1 text-sm text-red-600">{{ errors.streetAddress }}</p>
              </div>

              <div class="flex items-center">
                <input id="isDefaultShipping" type="checkbox" v-model="form.isDefaultShipping"
                       class="h-4 w-4 text-neutral-800 focus:ring-neutral-800 border-gray-300 rounded">
                <label for="isDefaultShipping" class="ml-2 block text-sm text-gray-900">{{ $t('address.setAsDefault') }}</label>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="submit"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-neutral-800 text-base font-medium text-white hover:bg-neutral-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    :disabled="isSubmitting">
              <span v-if="isSubmitting" class="mr-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ $t('address.save') }}
            </button>
            <button type="button"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    @click="closeModal">
              {{ $t('address.cancel') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from '@/hooks/useToast';
import { ToastEnum } from '@/enums/toast';
import addressApi from '@/api/address';
import provinceApi from '@/api/province';
import type { Province, District, Ward } from '@/api/province';
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

const { t } = useI18n();
const { showToast } = useToast();
const router = useRouter();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  addressToEdit: {
    type: Object,
    default: null
  },
  redirectToList: {
    type: Boolean,
    default: false
  }
});

const isEditing = computed(() => !!props.addressToEdit);

const emit = defineEmits(['close', 'saved']);

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
const provinces = ref<Province[]>([]);
const districts = ref<District[]>([]);
const wards = ref<Ward[]>([]);
const selectedProvinceCode = ref<number | string>('');
const selectedDistrictCode = ref<number | string>('');
const selectedWardCode = ref<number | string>('');
const isLoadingProvinces = ref(false);
const isLoadingDistricts = ref(false);
const isLoadingWards = ref(false);

onMounted(async () => {
  await fetchProvinces();
});

const fetchProvinces = async () => {
  try {
    isLoadingProvinces.value = true;
    provinces.value = await provinceApi.getProvinces();
  } catch (error) {
    console.error('Error fetching provinces:', error);
    showToast(ToastEnum.Error, t('address.errorFetchingProvinces'));
  } finally {
    isLoadingProvinces.value = false;
  }
};

const fetchDistricts = async (provinceCode: number) => {
  try {
    isLoadingDistricts.value = true;
    districts.value = await provinceApi.getDistrictsByProvinceCode(provinceCode);
  } catch (error) {
    console.error(`Error fetching districts for province ${provinceCode}:`, error);
    showToast(ToastEnum.Error, t('address.errorFetchingDistricts'));
  } finally {
    isLoadingDistricts.value = false;
  }
};

const fetchWards = async (districtCode: number) => {
  try {
    isLoadingWards.value = true;
    wards.value = await provinceApi.getWardsByDistrictCode(districtCode);
  } catch (error) {
    console.error(`Error fetching wards for district ${districtCode}:`, error);
    showToast(ToastEnum.Error, t('address.errorFetchingWards'));
  } finally {
    isLoadingWards.value = false;
  }
};

const onProvinceChange = async () => {
  if (selectedProvinceCode.value) {
    const selectedProvince = provinces.value.find(p => p.code === selectedProvinceCode.value);
    if (selectedProvince) {
      form.province = selectedProvince.name;
      
      form.district = '';
      form.ward = '';
      selectedDistrictCode.value = '';
      selectedWardCode.value = '';
      districts.value = [];
      wards.value = [];
      
      await fetchDistricts(Number(selectedProvinceCode.value));
    }
  }
};

const onDistrictChange = async () => {
  if (selectedDistrictCode.value) {
    const selectedDistrict = districts.value.find(d => d.code === selectedDistrictCode.value);
    if (selectedDistrict) {
      form.district = selectedDistrict.name;
      
      form.ward = '';
      selectedWardCode.value = '';
      wards.value = [];
      
      await fetchWards(Number(selectedDistrictCode.value));
    }
  }
};

const onWardChange = () => {
  if (selectedWardCode.value) {
    const selectedWard = wards.value.find(w => w.code === selectedWardCode.value);
    if (selectedWard) {
      form.ward = selectedWard.name;
    }
  }
};

const closeModal = () => {
  emit('close');
  clearForm();
};

const clearForm = () => {
  Object.keys(form).forEach(key => {
    if (key === 'isDefaultShipping' || key === 'isDefaultBilling') {
      (form as any)[key] = false;
    } else {
      (form as any)[key] = '';
    }
  });

  Object.keys(errors).forEach(key => {
    (errors as any)[key] = '';
  });

  selectedProvinceCode.value = '';
  selectedDistrictCode.value = '';
  selectedWardCode.value = '';
  districts.value = [];
  wards.value = [];
};

watch(() => props.addressToEdit, async (newAddress) => {
  if (newAddress) {
    form.recipientName = newAddress.recipientName || newAddress.fullName || '';
    form.phoneNumber = newAddress.phoneNumber || newAddress.phone || '';
    form.province = newAddress.province || '';
    form.district = newAddress.district || '';
    form.ward = newAddress.ward || '';
    form.streetAddress = newAddress.streetAddress || '';
    form.isDefaultShipping = newAddress.isDefaultShipping || newAddress.isDefault || false;
    form.isDefaultBilling = newAddress.isDefaultBilling || false;
    
    if (form.province && provinces.value.length > 0) {
      const province = provinces.value.find(p => p.name === form.province);
      if (province) {
        selectedProvinceCode.value = province.code;
        await fetchDistricts(Number(province.code));
        
        if (form.district && districts.value.length > 0) {
          const district = districts.value.find(d => d.name === form.district);
          if (district) {
            selectedDistrictCode.value = district.code;
            await fetchWards(Number(district.code));
            
            if (form.ward && wards.value.length > 0) {
              const ward = wards.value.find(w => w.name === form.ward);
              if (ward) {
                selectedWardCode.value = ward.code;
              }
            }
          }
        }
      }
    }
  }
}, { immediate: true });

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
      district: form.district,
      ward: form.ward,
      streetAddress: form.streetAddress.trim(),
      isDefaultShipping: form.isDefaultShipping,
      isDefaultBilling: form.isDefaultBilling
    };

    let response;
    
    if (isEditing.value) {
      response = await addressApi.updateAddress(props.addressToEdit.id, addressData);
    } else {
      response = await addressApi.addAddress(addressData);
    }

    if (response.data) {
      showToast(ToastEnum.Success, t('address.saveSuccess'));
      emit('saved', response.data);
      
      if (props.redirectToList) {
        router.push({ name: RouterEnum.AddressList });
      } else {
      closeModal();
      }
    } else {
      throw new Error('No data returned from server');
    }
  } catch (error) {
    console.error('Error saving address:', error);
    showToast(ToastEnum.Error, t('address.saveError'));
  } finally {
    isSubmitting.value = false;
  }
};
</script>