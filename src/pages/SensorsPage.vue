<template>
  <q-page padding>
    <h2>Page des capteurs</h2>
    <!-- Spinner -->
    <div
      v-if="!sensorsLoaded"
      class="q-pa-lg text-center"
    >
      <q-spinner-radio color="primary" size="4em"/>
    </div>

    <div class="row">
      <sensor-component
        v-for="sensor in sensors"
        :key="sensor.id"
        :sensor="sensor">
      </sensor-component>

      <p v-if="sensors.length" v-show="!sensorsLoaded">Aucun capteurs</p>
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
