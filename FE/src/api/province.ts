import axios from 'axios';

const PROVINCES_API_URL = import.meta.env.PROVINCES_API_URL;

export interface Province {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
  districts?: District[];
}

export interface District {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  province_code: number;
  wards?: Ward[];
}

export interface Ward {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  district_code: number;
}

export default {
  async getProvinces() {
    try {
      const response = await axios.get(`${PROVINCES_API_URL}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return [];
    }
  },

  async getProvincesWithDistricts() {
    try {
      const response = await axios.get(`${PROVINCES_API_URL}/?depth=2`);
      return response.data;
    } catch (error) {
      console.error('Error fetching provinces with districts:', error);
      return [];
    }
  },

  async getFullData() {
    try {
      const response = await axios.get(`${PROVINCES_API_URL}/?depth=3`);
      return response.data;
    } catch (error) {
      console.error('Error fetching full data:', error);
      return [];
    }
  },

  async getDistrictsByProvinceCode(provinceCode: number) {
    try {
      const response = await axios.get(`${PROVINCES_API_URL}/p/${provinceCode}?depth=2`);
      return response.data.districts || [];
    } catch (error) {
      console.error(`Error fetching districts for province ${provinceCode}:`, error);
      return [];
    }
  },

  async getWardsByDistrictCode(districtCode: number) {
    try {
      const response = await axios.get(`${PROVINCES_API_URL}/d/${districtCode}?depth=2`);
      return response.data.wards || [];
    } catch (error) {
      console.error(`Error fetching wards for district ${districtCode}:`, error);
      return [];
    }
  },

  async searchProvince(query: string) {
    try {
      const response = await axios.get(`${PROVINCES_API_URL}/p/search/?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching provinces:', error);
      return [];
    }
  },

  async searchDistrict(query: string) {
    try {
      const response = await axios.get(`${PROVINCES_API_URL}/d/search/?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching districts:', error);
      return [];
    }
  },

  async searchWard(query: string) {
    try {
      const response = await axios.get(`${PROVINCES_API_URL}/w/search/?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching wards:', error);
      return [];
    }
  }
};
