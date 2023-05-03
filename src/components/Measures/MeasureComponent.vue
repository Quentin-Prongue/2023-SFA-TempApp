<template>
  <!-- TABLEAU DES MESURES -->
  <q-table
    v-model:pagination="pagination"
    :columns="this.full ? this.fullColumns : this.baseColumns"
    :filter="filter"
    :loading="loading"
    :no-data-label="'Aucune donnée à afficher'"
    :rows="this.measures.slice(0, this.measures.length)"
    :rows-per-page-label="'Lignes par page'"
    :rows-per-page-options="this.full ? [50, 100, 250, 0] : [3, 5, 0]"
    row-key="id"
  >
    <!-- RECHERCHE -->
    <template v-if="full" v-slot:top-right>
      <q-input v-model="filter" borderless debounce="300" dense placeholder="Recherche">
        <template v-slot:append>
          <q-icon name="search"/>
        </template>
      </q-input>
    </template>
  </q-table>
</template>

<script>
import { ref } from 'vue'
import { date } from 'quasar'

export default {
  name: 'MeasureComponent',
  props: {
    measures: {
      type: Array,
      required: true
    },
    full: {
      Type: Boolean,
      required: true
    }
  },
  setup () {
    const filter = ref('')
    return {
      filter
    }
  },
  data () {
    return {
      loading: false,
      // Pagination
      pagination: {
        sortBy: 'date',
        descending: true,
        rowsPerPage: this.full ? 50 : 5
      },
      // Colonnes de base
      baseColumns: [
        {
          // Colonne date
          name: 'date',
          required: true,
          label: 'Date',
          align: 'center',
          field: row => this.formatDate(row.date),
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
      ],
      // Colonnes complètes
      fullColumns: [
        {
          // Colonne id
          name: 'id',
          required: true,
          label: 'ID',
          align: 'center',
          field: row => row.id
        },
        {
          // Colonne date
          name: 'date',
          required: true,
          label: 'Date',
          align: 'center',
          field: row => this.formatDate(row.date),
          sortable: true
        },
        {
          // Colonne séquence
          name: 'sequence',
          required: true,
          label: 'Séquence',
          align: 'center',
          field: row => row.sequence
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
     * Permet de formater une date au format (JJ.MM.AAAA - HH:MM)
     * @param dateString la date en string
     * @returns {string} la date formatée
     */
    formatDate (dateString) {
      // Source : https://quasar.dev/quasar-utils/date-utils/#format-for-display
      const dateToFormat = new Date(dateString)
      return date.formatDate(dateToFormat, 'DD.MM.YYYY - HH:MM')
    }
  },
  mounted () {
    // Si l'écran est plus petit que 767px, met des icônes à la place des labels
    if (this.$q.screen.width < 767) {
      this.baseColumns[0].label = '📅'
      this.baseColumns[1].label = '🌡️'
      this.baseColumns[2].label = '💧'
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
