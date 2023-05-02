<template>
  <div :class="classes()">
    <q-card :class="full ? 'sensor-card-full' : 'sensor-card-base'" bordered>
      <q-card-section vertical>
        <!-- NOM DU CAPTEUR -->
        <div :class="full ? 'text-h4 sensor-clickable' : 'text-h6 sensor-clickable'"
             @click="showSensorDetails(sensor.id)">
          {{ sensor.nom }}
          <q-tooltip :offset="[0, 0]" class="bg-primary">Afficher les détails du capteur</q-tooltip>
        </div>

        <!-- NOM DE LA SALLE -->
        <div :class="full ? 'text-h6 sensor-clickable' : 'text-subtitle2 sensor-clickable'"
             @click="this.$router.push('/rooms/' + sensor.salle.nom)">
          Salle : {{ sensor.salle.nom }}
          <q-tooltip :offset="[0, 0]" class="bg-primary">Afficher la salle</q-tooltip>
        </div>
      </q-card-section>

      <!-- AJOUTER AUX FAVORIS -->
      <q-card-actions class="justify-around q-px-md" vertical>
        <q-checkbox
          v-model="fav"
          checked-icon="favorite"
          class="flex-center"
          color="red"
          indeterminate-icon="help"
          size="lg"
          unchecked-icon="favorite_border"
          @click="toggleFavorite(this.sensor.id)"
        />
      </q-card-actions>

      <q-separator inset/>

      <!-- COMPOSANT DES MESURES -->
      <measure-component :full="full" :measures="sensor.mesures">
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
    // Mappage des actions
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
    },

    /**
     * Permet d'ouvrir la page qui affiche les details du capteur
     * @param sensorID l'id du capteur
     */
    showSensorDetails (sensorID) {
      this.$router.push({
        path: `/sensor/${sensorID}`
      })
    },
    classes () {
      return {
        'q-pa-md': this.$q.screen.width > 767,
        row: this.$q.screen.width > 767,
        'items-start': this.$q.screen.width > 767,
        'q-gutter-md': this.$q.screen.width > 767,
        'q-gutter-sm': this.$q.screen.width < 767,
        'q-py-sm': this.$q.screen.width < 767
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
    },
    full: {
      Type: Boolean
    }
  },
  mounted () {
    // Teste si le capteur fait partie des favoris
    if (this.isSensorFavorite) {
      // Change la valeur de fav
      this.fav = true
    }
  },
  components: {
    measureComponent: require('components/Measures/MeasureComponent.vue').default
  }
}
</script>

<style lang="sass" scoped>
/* Applique les règles de ce bloc uniquement aux écrans >= 768px */
@media screen and (min-width: 768px)
  .sensor-card-base
    width: 100%
    max-width: 450px
    border-color: $primary
    border-radius: 15px
    text-align: center
    box-shadow: 9px 7px 10px -6px rgba(0, 0, 0, 0.25)

  .sensor-card-full
    width: 100%
    border-color: $primary
    border-radius: 15px
    text-align: center

/* Applique les règles de ce bloc uniquement aux écrans <= 768px */
@media screen and (max-width: 767px)
  .sensor-card-base
    width: 100%
    max-width: max-content
    border-color: $primary
    border-radius: 15px
    text-align: center
    box-shadow: 9px 7px 10px -6px rgba(0, 0, 0, 0.25)

.sensor-clickable
  &:hover
    cursor: pointer
    color: $primary
</style>
