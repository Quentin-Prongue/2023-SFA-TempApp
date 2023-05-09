<template>
  <LineChart
    id="my-chart-id"
    :data="chartData"
    :options="chartOptions"
  />
</template>

<script>
import { Line as LineChart } from 'vue-chartjs'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { date } from 'quasar'

ChartJS.register(Title, PointElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale)

export default {
  name: 'LineChartComponent',
  components: { LineChart },
  props: {
    measures: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      // Données du graphique
      chartData: {
        labels: this.measures.slice(0, 50).map(measure => this.formatDate(measure.date) + 'h'),
        datasets: [
          {
            label: 'Température °C',
            backgroundColor: 'rgba(24, 90, 189, 0.2)',
            borderColor: 'rgba(24, 90, 189, 1)',
            borderWidth: 1,
            data: this.measures.slice(0, 50).map(measure => measure.temperature)
          }
        ]
      },
      // Options du graphique
      chartOptions: {
        responsive: true
      }
    }
  },
  methods: {
    /**
     * Permet de formater une date au format (JJ.MM.AAAA - HH)
     * @param dateString la date en string
     * @returns {string} la date formatée
     */
    formatDate (dateString) {
      // Source : https://quasar.dev/quasar-utils/date-utils/#format-for-display
      const dateToFormat = new Date(dateString)
      return date.formatDate(dateToFormat, 'DD.MM.YYYY - HH')
    }
  }
}
</script>
