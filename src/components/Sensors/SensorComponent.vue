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

        <!-- BOUTON MODIFIER -->
        <q-btn v-show="isAdmin()" class="absolute-top-right bt-edit-sensor" color="primary" flat icon="edit"
               @click="displayForm = true"/>

        <q-dialog v-model="displayForm">
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Modification de {{ sensor.nom }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <edit-sensor-form :sensor="sensor"/>
            </q-card-section>
          </q-card>
        </q-dialog>

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
import EditSensorForm from 'components/Sensors/EditSensorForm.vue'

export default {
  name: 'SensorComponent',
  setup () {
    return {
      fav: ref(false),
      displayForm: ref(false)
    }
  },
  methods: {
    // Mappage des actions
    ...mapActions('sensors', ['addSensorToFavorites', 'removeSensorFromFavorites']),
    // Mappage des getters
    ...mapGetters('auth', ['isAdmin']),

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
    /**
     * Change les classes en fonction de la taille de l'écran
     * @returns {{'items-start': boolean, 'q-pa-md': boolean, 'q-gutter-sm': boolean, row: boolean, 'q-gutter-md': boolean, 'q-py-sm': boolean}}
     */
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
    // Mappage des getters
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
    EditSensorForm,
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

.bt-edit-sensor
  margin-top: 10px
  margin-right: 10px
</style>
