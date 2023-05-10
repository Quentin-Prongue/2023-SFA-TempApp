<template>
  <div>
    <div :class="{'duration-selector': $q.screen.width > 767}" class="flex flex-center">
      <div v-for="option in durationOptions" :key="option.value" class="q-ma-xs">
        <q-btn :class="{
        'duration-button': true,
        'active': selectedDuration === option.value,
        'disabled': option.disabled
      }"
               :disable="option.disabled"
               dense
               flat
               @click="changeDuration(option.value)"
        >
          {{ option.label }}
        </q-btn>
      </div>
    </div>
    <highcharts ref="lineCharts" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
import AccessibilityModule from 'highcharts/modules/accessibility'

stockInit(Highcharts)
AccessibilityModule(Highcharts)

export default {
  name: 'LineChartComponent',
  props: {
    catchLegendEvents: {
      type: Boolean,
      default: false
    },
    measures: {
      type: Array,
      required: true
    }
  },
  components: {
    highcharts: Chart
  },
  data () {
    const data = this.measures.map(measure => ([
      this.formatDateToUTC(measure.date),
      measure.temperature
    ]))

    const durationOptions = [
      {
        value: '24h',
        label: '24h',
        disabled: true
      },
      {
        value: '48h',
        label: '48h',
        disabled: true
      },
      {
        value: '1w',
        label: '1 Semaine',
        disabled: true
      },
      {
        value: '1m',
        label: '1 Mois',
        disabled: true
      },
      {
        value: '1y',
        label: '1 Année',
        disabled: true
      },
      {
        value: 'all',
        label: 'Tous',
        disabled: true
      }
    ]

    return {
      durationOptions,
      selectedDuration: 'all',
      chartOptions: {
        chart: {
          zoomType: 'x',
          type: 'line',
          height: 250
        },
        title: {
          text: 'Graphique températures'
        },
        xAxis: {
          type: 'datetime',
          labels: {
            formatter: function () {
              return Highcharts.dateFormat('%e %b %Y', this.value)
            }
          }
        },
        yAxis: {
          title: {
            text: 'Température (°C)'
          }
        },
        tooltip: {
          xDateFormat: '%e %b %Y %H:%M',
          valueSuffix: '°C'
        },
        series: [{
          name: 'Température',
          data
        }],
        plotOptions: {
          line: {
            marker: {
              enabled: false // Désactive les marqueurs de points
            }
          }
        },
        credits: {
          enabled: false // Masque la mention de crédit dans le coin inférieur droit du graphique
        }
      }
    }
  },
  methods: {
    /**
     * Change la durée actuelle
     * @param duration la nouvelle durée
     */
    changeDuration (duration) {
      this.selectedDuration = duration
      // Met à jour les données du graphique
      this.updateChartData()
    },
    /**
     * Met à jour les données du graphique
     */
    updateChartData () {
      // Variable qui contient les mesures filtrées
      let filteredMeasures = []

      // Vérifier chaque option de durée et déterminer si elle est désactivée ou non
      this.durationOptions.forEach(option => {
        // Récupère la date de début
        const startDate = this.getStartDate(option.value)
        filteredMeasures = this.measures.filter(measure => new Date(measure.date) >= startDate)

        // Désactive l'option s'il n'y a pas de mesures
        option.disabled = filteredMeasures.length === 0
      })

      // Filtrer les mesures en fonction de la durée sélectionnée
      filteredMeasures = this.measures.filter(measure => new Date(measure.date) >= this.getStartDate(this.selectedDuration))

      // Mettre à jour les données du graphique avec les mesures filtrées
      this.chartOptions.series[0].data = filteredMeasures.map(measure => ([
        this.formatDateToUTC(measure.date),
        measure.temperature
      ]))

      // Forcer la mise à jour du graphique en réaffectant les options
      this.chartOptions = { ...this.chartOptions }
    },
    /**
     * Récupère la date de début en fonction de la durée
     * @param duration la durée
     * @returns {Date} la date de début
     */
    getStartDate (duration) {
      // Récupère la date actuelle
      const now = new Date()
      let startDate

      // Switch sur la durée
      switch (duration) {
        // Durée de 24 heures
        case '24h':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        // Durée de 48 heures
        case '48h':
          startDate = new Date(now.getTime() - 48 * 60 * 60 * 1000)
          break
        // Durée de 1 semaine
        case '1w':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        // Durée de 1 mois
        case '1m':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
          break
        // Durée de 1 année
        case '1y':
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
          break
        // Toute la durée
        case 'all':
          startDate = new Date(0)
          break
        // Valeur par défaut
        default:
          startDate = new Date(0)
      }

      return startDate
    },
    /**
     * Formate une date (2023.05.10 13:00) en date UTC
     * @param date la date a formaté
     */
    formatDateToUTC (date) {
      return Date.UTC(
        parseInt(date.slice(0, 4)), // année
        parseInt(date.slice(5, 7)) - 1, // mois (de 0 à 11)
        parseInt(date.slice(8, 10)), // jour
        parseInt(date.slice(11, 13)), // heure
        parseInt(date.slice(14, 16)), // minutes
        parseInt(date.slice(17, 19)) // secondes
      )
    }
  },
  mounted () {
    // Met à jour les données du graphique
    this.updateChartData()
  }
}
</script>

<style lang="sass" scoped>
.duration-selector
  display: flex
  justify-content: center

.duration-button
  padding: 10px 20px
  font-size: 14px
  background-color: #f0f0f0
  border: none
  border-radius: 4px
  margin-right: 10px
  cursor: pointer

  &.active
    background-color: #b4d7f7
</style>
