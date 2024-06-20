import { defineStore } from "pinia";
import { ref } from "vue";

export const useTableStore = defineStore('tableStore', () => {
    const tableData = ref([]);
    const filteredData = ref([]);

    async function fetchData() {
        const client = useSupabaseClient();
        const { data, error } = await client.from('travel')
            .select('id, country, year, highlight, score')
            .order('year', { ascending: false }) // Sorting by year in descending order
            .limit(200);
        if (data) {
            tableData.value = data;
            // Filter out the 'id' field
            filteredData.value = data.map(({ id, ...rest }) => rest);
        } else {
            console.error('Error when fetching the data:', error);
        }
    }

    async function updateRow(id, updatedData) {
        const client = useSupabaseClient();
        const { error } = await client.from('travel').update(updatedData).eq('id', id);
        if (error) {
            console.error('Error when updating the data:', error);
        } else {
            await fetchData(); // Refresh data after update
        }
    }

    async function deleteRow(id) {
        const client = useSupabaseClient();
        const { error } = await client.from('travel').delete().eq('id', id);
        if (error) {
            console.error('Error when deleting the data:', error);
        } else {
            await fetchData(); // Refresh data after delete
        }
    }

    return { tableData, filteredData, fetchData, updateRow, deleteRow };
});