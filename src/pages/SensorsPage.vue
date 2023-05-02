<template>
  <q-page>
    <!-- SPINNER -->
    <div
      v-if="!sensorsLoaded"
      class="q-pa-lg text-center"
    >
      <q-spinner-hourglass color="primary" size="4em"/>
    </div>

    <div>
      <q-tabs
        v-if="sensors.length > 0"
        v-model="sensorsTab"
        active-color="primary"
        align="justify"
        class="text-grey"
        indicator-color="primary"
        narrow-indicator
      >
        <q-tab v-if="favoritesSensors.length > 0" icon="favorite" label="Capteurs favoris" name="favorites"/>
        <q-tab icon="sensors" label="Tous les capteurs" name="all"/>
      </q-tabs>

      <q-tab-panels v-model="sensorsTab" animated>
        <!-- CAPTEURS FAVORIS -->
        <q-tab-panel v-if="favoritesSensors.length > 0" name="favorites">
          <!-- COMPOSANT CAPTEUR -->
          <div class="row">
            <sensor-component
              v-for="sensor in favoritesSensors"
              :key="sensor.id"
              :sensor="sensor">
            </sensor-component>
          </div>
        </q-tab-panel>

        <!-- TOUS LES CAPTEURS -->
        <q-tab-panel name="all">
          <!-- COMPOSANT CAPTEUR -->
          <div class="row">
            <sensor-component
              v-for="sensor in sensors"
              :key="sensor.id"
              :sensor="sensor">
            </sensor-component>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <!-- SI AUCUN CAPTEUR -->
      <p v-if="sensorsLoaded && sensors.length === 0">Aucun capteur</p>
    </div>

  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'

export default defineComponent({
  name: 'SensorsPage',
  setup () {
    return {
      sensorsTab: ref('all')
    }
  },
  computed: {
    // Mappage des getters
    ...mapGetters('sensors', ['sensors', 'favoritesSensors']),
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

    if (this.favoritesSensors.length > 0) {
      this.sensorsTab = 'favorites'
    }
  }
})
</script>

<style lang="sass" scoped>
.div-sensors
  text-align: center
</style>
