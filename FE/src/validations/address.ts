export interface AddressFormErrors {
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
}

export interface AddressFormData {
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export const validateAddressForm = (form: AddressFormData, t: Function): AddressFormErrors => {
  const errors: AddressFormErrors = {
    recipientName: '',
    phoneNumber: '',
    province: '',
    district: '',
    ward: '',
    streetAddress: ''
  };

  if (!form.recipientName.trim()) {
    errors.recipientName = t('address.requiredField');
  } else if (form.recipientName.trim().length < 2) {
    errors.recipientName = t('address.invalidName');
  } else if (form.recipientName.trim().length > 100) {
    errors.recipientName = t('address.nameTooLong');
  }

  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = t('address.requiredField');
  } else if (!/^[0-9]{10,11}$/.test(form.phoneNumber.trim())) {
    errors.phoneNumber = t('address.invalidPhone');
  }

  if (!form.province) {
    errors.province = t('address.requiredField');
  }

  if (!form.district.trim()) {
    errors.district = t('address.requiredField');
  } else if (form.district.trim().length < 2) {
    errors.district = t('address.invalidDistrict');
  }

  if (!form.ward.trim()) {
    errors.ward = t('address.requiredField');
  } else if (form.ward.trim().length < 2) {
    errors.ward = t('address.invalidWard');
  }

  if (!form.streetAddress.trim()) {
    errors.streetAddress = t('address.requiredField');
  } else if (form.streetAddress.trim().length < 5) {
    errors.streetAddress = t('address.invalidStreetAddress');
  } else if (form.streetAddress.trim().length > 200) {
    errors.streetAddress = t('address.streetAddressTooLong');
  }

  return errors;
};

export const hasAddressFormErrors = (errors: AddressFormErrors): boolean => {
  return Object.values(errors).some(error => error !== '');
}; 