<template>
  <q-page padding>
    <h3>Page des capteurs</h3>

    <!-- SPINNER -->
    <div
      v-if="!sensorsLoaded"
      class="q-pa-lg text-center"
    >
      <q-spinner-radio color="primary" size="4em"/>
    </div>

    <div class="q-pa-md">
      <q-tabs
        v-model="tab"
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        v-if="sensors.length > 0"
      >
        <q-tab name="favorites" icon="favorite" label="Capteurs favoris" v-if="favoritesSensors.length > 0"/>
        <q-tab name="all" icon="sensors" label="Tous les capteurs"/>
      </q-tabs>

      <q-separator/>

      <q-tab-panels v-model="tab" animated>
        <!-- CAPTEURS FAVORIS -->
        <q-tab-panel name="favorites">
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
      <p v-if="sensors.length === 0" v-show="sensorsLoaded">Aucun capteur</p>
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
      tab: ref('all')
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
  }
})
</script>
