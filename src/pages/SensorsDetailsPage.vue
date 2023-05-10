<template>
  <q-page v-if="currentSensor !== null" padding>
    <q-btn color="primary" flat icon="arrow_back" @click="this.$router.go(-1)"/>
    <!-- COMPOSANT CAPTEUR -->
    <sensor-component :full="true" :sensor="currentSensor"/>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import SensorComponent from 'components/Sensors/SensorComponent.vue'

export default {
  name: 'SensorsDetailsPage',
  components: { SensorComponent },
  data () {
    return {
      waiting: {
        interval: null,
        delay: 6000
      }
    }
  },
  computed: {
    // Mappage des getters
    ...mapState('sensors', ['currentSensor'])
  },
  methods: {
    // Mappage des actions
    ...mapActions('sensors', ['getCurrentSensor', 'clearCurrentSensor'])
  },
  beforeMount () {
    // Récupère l'id du capteur
    const sensorId = this.$route.params.id

    // Récupère le capteur actuel
    this.getCurrentSensor(sensorId)
  },
  mounted () {
    // Récupère l'id du capteur
    const sensorId = this.$route.params.id

    // Récupère le capteur avec un intervalle de 6 secondes sinon le capteur est null ou ne change pas
    this.waiting.interval = setInterval(() => {
      this.getCurrentSensor(sensorId)
    }, this.waiting.delay)
  },
  unmounted () {
    // Efface l'intervalle
    clearInterval(this.waiting.interval)

    // Efface le capteur actuel
    this.clearCurrentSensor()
  }
}
</script>

<style scoped>

</style>
