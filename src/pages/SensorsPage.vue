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
      <!-- TABS -->
      <q-tabs
        v-if="sensors.length > 0"
        v-model="sensorsTab"
        active-color="primary"
        align="justify"
        class="text-grey"
        indicator-color="primary"
        narrow-indicator
      >
        <q-tab v-if="favoritesSensors.length > 0" icon="favorite" label="Capteurs favoris" name="favorites">
          <q-badge color="primary" floating>{{ favoritesSensors.length }}</q-badge>
        </q-tab>
        <q-tab icon="sensors" label="Tous les capteurs" name="all">
          <q-badge color="primary" floating>{{ sensors.length }}</q-badge>
        </q-tab>
      </q-tabs>

      <q-tab-panels v-model="sensorsTab" animated transition-next="jump-down" transition-prev="jump-up">
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

      <!-- BOUTON FLOTTANT -->
      <q-page-sticky v-if="isAdmin" :offset="[18, 18]" position="bottom-right">
        <q-btn color="primary" direction="up" fab icon="add" @click="addOtherSensor">
          <q-tooltip :offset="[0, 0]" class="bg-primary" transition-hide="scale" transition-show="scale">Ajouter un
            capteur
          </q-tooltip>
        </q-btn>
      </q-page-sticky>

      <!-- DIALOG POUR AJOUT -->
      <q-dialog v-model="displayAddDialog" transition-hide="jump-down" transition-show="jump-up">
        <q-card :class="{'min-width-350': $q.screen.width < 768, 'min-width-800': $q.screen.width >= 768}">
          <q-card-section>
            <div class="text-h6">Ajout d'un capteur</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <!-- FORMULAIRE D'AJOUT -->
            <add-sensor-form @close="displayAddDialog = false"/>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- SI AUCUN CAPTEUR -->
      <p v-if="sensorsLoaded && sensors.length === 0">Aucun capteur</p>
    </div>

  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import AddSensorForm from 'components/Sensors/AddSensorForm.vue'

export default defineComponent({
  name: 'SensorsPage',
  setup () {
    return {
      sensorsTab: ref('all'),
      displayAddDialog: ref(false)
    }
  },
  computed: {
    // Mappage des getters
    ...mapGetters('sensors', ['sensors', 'favoritesSensors']),
    ...mapGetters('auth', ['isAdmin']),
    // Mappage des données
    ...mapState('sensors', ['sensorsLoaded'])
  },
  methods: {
    // Mappage des actions
    ...mapActions('sensors', ['getAllSensorsApi']),
    addOtherSensor () {
      this.displayAddDialog = true
    }
  },
  components: {
    AddSensorForm,
    sensorComponent: require('components/Sensors/SensorComponent.vue').default
  },
  mounted () {
    // Récupère les capteurs de l'api
    this.getAllSensorsApi()

    // S'il y a des favoris
    if (this.favoritesSensors.length > 0) {
      // Le tab actuel est sur les favoris
      this.sensorsTab = 'favorites'
    }
  }
})
</script>

<style lang="sass" scoped>
.div-sensors
  text-align: center

.min-width-350
  min-width: 350px

.min-width-800
  min-width: 800px
</style>
