import {defineStore} from "pinia"
import {ref} from "vue"

export const useTableStore = defineStore('tableStore', () => {
    const tableData = ref()

    async function fetchData() {
        const client = useSupabaseClient();
        const {data, error} = await client.from('travel')
            .select('country, year, highlight, score')
            .order('year', { ascending: false }) // Sorting by year in descending order
            .limit(100);
        if (data) {
            tableData.value = data
        } else {
            console.error('Error when fetching the data:', error)
        }
    }

    return {tableData, fetchData}
})