<template>
  <div :class="classes()">
    <q-card :class="full ? 'sensor-card-full' : 'sensor-card-base'" bordered>
      <q-card-section vertical>
        <!-- NOM DU CAPTEUR -->
        <div :class="full ? 'text-h4' : 'text-h6 sensor-clickable'" @click="!full && showSensorDetails(sensor.id)">
          {{ sensor.nom }}
          <q-tooltip v-if="!full" :offset="[0, 0]" class="bg-primary" transition-hide="scale" transition-show="scale">
            Afficher les détails du capteur
          </q-tooltip>
        </div>

        <!-- BOUTON GERER CAPTEUR -->
        <q-btn-dropdown v-if="isAdmin()" class="absolute-top-right bt-manage-sensor" color="primary" flat
                        icon="settings">
          <q-list>
            <div class="column">
              <!-- BOUTON MODIFIER -->
              <q-btn color="primary" flat icon="edit"
                     @click="displayEditForm = true">
                <q-tooltip :offset="[0, 0]" class="bg-primary" transition-hide="scale" transition-show="scale">Modifier
                  le capteur
                </q-tooltip>
              </q-btn>

              <!-- BOUTON SUPPRIMER -->
              <q-btn color="negative" flat icon="delete"
                     @click="displayDeleteDialog = true">
                <q-tooltip :offset="[0, 0]" class="bg-primary" transition-hide="scale" transition-show="scale">Supprimer
                  le capteur
                </q-tooltip>
              </q-btn>
            </div>
          </q-list>
        </q-btn-dropdown>

        <!-- DIALOG POUR MODIFICATION -->
        <q-dialog v-model="displayEditForm" transition-hide="jump-down" transition-show="jump-up">
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Modification de {{ sensor.nom }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <!-- FORMULAIRE DE MODIFICATION -->
              <edit-sensor-form :sensor="sensor" @close="displayEditForm = false"/>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- DIALOG POUR SUPPRESSION -->
        <q-dialog v-model="displayDeleteDialog" transition-hide="jump-down" transition-show="jump-up">
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Suppression de {{ sensor.nom }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              Voulez-vous vraiment supprimer ce capteur ?
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div class="q-mt-md q-gutter-md" style="text-align: right">
                <!-- BOUTON ANNULER -->
                <q-btn v-close-popup color="primary" label="Annuler" outline/>
                <!-- BOUTON SUPPRIMER -->
                <q-btn v-close-popup color="negative" label="Supprimer" outline @click="deleteSensor(this.sensor.id)"/>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- NOM DE LA SALLE -->
        <div :class="[full ? 'text-h6' : 'text-subtitle2', {'sensor-clickable': displayClickLink}]"
             @click="displayClickLink && this.$router.push('/romos/' + sensor.salle.nom)">
          Salle : {{ sensor.salle.nom }}
          <q-tooltip v-if="displayClickLink" :offset="[0, 0]" class="bg-primary" transition-hide="scale"
                     transition-show="scale">Afficher la salle
          </q-tooltip>
        </div>
      </q-card-section>

      <!-- AJOUTER AUX FAVORIS -->
      <q-card-actions class="justify-around q-px-md" vertical>
        <q-checkbox
          v-model="fav"
          checked-icon="favorite"
          class="flex-center"
          color="negative"
          indeterminate-icon="help"
          size="lg"
          unchecked-icon="favorite_border"
          @click="toggleFavorite(this.sensor.id)"
        />
      </q-card-actions>

      <q-separator inset/>

      <!-- GRAPHIQUE -->
      <LineChartComponent v-if="full" :catchLegendEvents="true" :measures="sensor.mesures"/>

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
      fav: ref(false),
      displayEditForm: ref(false),
      displayDeleteDialog: ref(false)
    }
  },
  methods: {
    // Mappage des actions
    ...mapActions('sensors', ['addSensorToFavorites', 'removeSensorFromFavorites', 'deleteSensor']),
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
        // Ecran plus grand que 767px
        'q-pa-md row items-start q-gutter-md': this.$q.screen.width > 767,
        // Ecran plus petit que 767px
        'q-gutter-sm q-py-sm': this.$q.screen.width < 767
      }
    },
    displayClickLink () {
      return this.$route.path !== ('/rooms/' + this.sensor.salle.nom)
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
    EditSensorForm: require('components/Sensors/EditSensorForm.vue').default,
    measureComponent: require('components/Measures/MeasureComponent.vue').default,
    LineChartComponent: require('components/Charts/LineChartComponent.vue').default
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

.bt-manage-sensor
  margin-top: 15px
  margin-right: 10px
</style>
