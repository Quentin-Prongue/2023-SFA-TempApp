<template>
  <!-- TABLEAU DES MESURES -->
  <q-table
    v-model:pagination="pagination"
    :columns="columns"
    :loading="loading"
    :no-data-label="'Aucune donnée à afficher'"
    :rows="this.measures.slice(0, this.pagination.rowsPerPage)"
    :rows-per-page-label="'Lignes par page'"
    :rows-per-page-options="[3, 5, 10]"
    row-key="id"
    @update:pagination="onUpdatePagination"
  >
  </q-table>
</template>

<script>
export default {
  name: 'MeasureComponent',
  props: {
    measures: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      // Pagination
      pagination: {
        sortBy: 'date',
        descending: true,
        page: 1,
        rowsPerPage: 5
      },
      // Toutes les colonnes
      columns: [
        {
          // Colonne date
          name: 'date',
          required: true,
          label: 'Date',
          align: 'center',
          field: row => row.date,
          sortable: true
        },
        {
          // Colonne température
          name: 'temperature',
          required: true,
          label: 'Température',
          align: 'center',
          field: row => row.temperature + ' °C',
          sortable: true
        },
        {
          // Colonne humidité
          name: 'humidite',
          required: true,
          label: 'Humidité',
          align: 'center',
          field: row => row.humidite + ' %',
          sortable: true
        }
      ]
    }
  },
  methods: {
    /**
     * Agit quand la pagination est mise à jour, met à jour le nombre de lignes par page
     * @param pagination la nouvelle pagination
     */
    onUpdatePagination (pagination) {
      this.pagination.rowsPerPage = pagination.rowsPerPage
    }
  }
}
</script>

<style scoped>

</style>
