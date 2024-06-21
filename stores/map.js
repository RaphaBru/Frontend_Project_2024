import { defineStore } from "pinia";
import { ref } from "vue";

export const useMapStore = defineStore('mapStore', () => {
    const mapData = ref([]);

    async function fetchData() {
        const client = useSupabaseClient();
        const { data, error } = await client.from('travel')
            .select('id, country, highlight, score')
            .order('id', { ascending: false }) // Sorting by id in descending order
        if (data) {
            mapData.value = data;
        } else {
            console.error('Error when fetching the data:', error);
        }
    }

    return { mapData, fetchData};
});