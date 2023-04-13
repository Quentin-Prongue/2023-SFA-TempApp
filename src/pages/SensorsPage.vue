<template>
  <q-page padding>
    <h2>Page des capteurs</h2>
    <!-- SPINNER -->
    <div
      v-if="!sensorsLoaded"
      class="q-pa-lg text-center"
    >
      <q-spinner-radio color="primary" size="4em"/>
    </div>

    <!-- COMPOSANT CAPTEUR -->
    <div class="row">
      <sensor-component
        v-for="sensor in sensors"
        :key="sensor.id"
        :sensor="sensor">
      </sensor-component>

      <!-- SI AUCUN CAPTEUR -->
      <p v-if="sensors.length" v-show="!sensorsLoaded">Aucun capteur</p>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'

export default defineComponent({
  name: 'SensorsPage',
  computed: {
    // Mappage des getters
    ...mapGetters('sensors', ['sensors']),
    // Mappage des données
    ...mapState('sensors', ['sensorsLoaded'])
  },
  methods: {
    // Mappage des actions
    ...mapActions('sensors', ['getAllSensorsApi'])
  },
  components: {
    sensorComponent: require('components/Sensors/SensorComponent.vue').default
  },
  mounted () {
    // Récupère les capteurs de l'api
    this.getAllSensorsApi()
  }
})
</script>
