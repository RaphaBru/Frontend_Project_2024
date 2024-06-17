import { defineStore } from 'pinia';

export const useCountryStore = defineStore('countryStore', {
  state: () => ({
    countries: ['US', 'CA', 'MX'] // Example countries, modify as needed
  }),
  actions: {
    setCountries(newCountries) {
      this.countries = newCountries;
    }
  }
})