<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card bordered class="sensor-card">
      <q-card-section vertical>
        <!-- NOM DU CAPTEUR -->
        <div class="text-h6">{{ sensor.nom }}</div>
        <!-- NOM DE LA SALLE -->
        <div class="text-subtitle2">Salle : {{ sensor.salle.nom }}</div>
      </q-card-section>

      <!-- AJOUTER AUX FAVORIS -->
      <q-card-actions class="justify-around q-px-md" vertical>
        <q-checkbox
          size="lg"
          class="flex-center"
          v-model="fav"
          checked-icon="favorite"
          unchecked-icon="favorite_border"
          indeterminate-icon="help"
          color="red"
          @click="toggleFavorite(this.sensor.id)"
        />
      </q-card-actions>

      <q-separator inset/>

      <!-- COMPOSANT DES MESURES -->
      <measure-component :measures="sensor.mesures">
      </measure-component>

    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SensorComponent',
  setup () {
    return {
      fav: ref(false)
    }
  },
  methods: {
    ...mapActions('sensors', ['addSensorToFavorites', 'removeSensorFromFavorites']),

    /**
     * Permet d'ajouter ou de supprimer un capteur des favoris
     * @param sensorID l'id du capteur
     */
    toggleFavorite (sensorID) {
      // Ajoute le capteur aux favoris
      if (this.fav) {
        this.addSensorToFavorites(sensorID)
      } else {
        // Supprime le capteur des favoris
        this.removeSensorFromFavorites(sensorID)
      }
    }
  },
  computed: {
    ...mapGetters('sensors', ['favoritesSensors']),

    /**
     * Teste si le capteur fait partie des favoris
     * @returns {*} un booléen avec la réponse
     */
    isSensorFavorite () {
      return this.favoritesSensors.includes(this.sensor)
    }
  },
  props: {
    sensor: {
      type: Object,
      required: true
    }
  },
  components: {
    measureComponent: require('components/Measures/MeasureComponent.vue').default
  },
  mounted () {
    // Teste si le capteur fait partie des favoris
    if (this.isSensorFavorite) {
      // Change la valeur de fav
      this.fav = true
    }
  }
}
</script>

<style lang="sass" scoped>
.sensor-card
  width: 100%
  max-width: 450px
  border-color: $primary
  border-radius: 15px
  text-align: center
  box-shadow: 9px 7px 10px -6px rgba(0, 0, 0, 0.25)
</style>
