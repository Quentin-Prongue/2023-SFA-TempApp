<template>
  <q-page padding>
    <!-- SPINNER POUR LES SALLES -->
    <div
      v-if="!roomsLoaded"
      class="q-pa-lg text-center"
    >
      <q-spinner-hourglass color="primary" size="4em"/>
    </div>

    <!-- SALLES -->
    <div v-if="roomsLoaded" class="q-pa-md absolute-bottom div-rooms">
      <div class="q-gutter-y-md">
        <!-- CONTENU DES TABS -->
        <q-tab-panels v-model="roomTab" animated transition-next="jump-down" transition-prev="jump-up">
          <q-tab-panel v-for="room in rooms" :key="room.id" :name="room.nom">

            <!-- COMPOSANT CAPTEUR -->
            <div v-if="sensorsOfRoomLoaded && sensorsOfRoom.length > 0" class="row">
              <sensor-component
                v-for="sensor in sensorsOfRoom"
                :key="sensor.id"
                :sensor="sensor"/>
            </div>

            <!-- SI AUCUN CAPTEUR -->
            <p v-else>Aucun capteur</p>
          </q-tab-panel>
        </q-tab-panels>

        <q-separator/>

        <!-- TABS POUR LES SALLES -->
        <q-tabs
          v-model="roomTab"
          active-color="primary"
          align="justify"
          class="text-grey"
          dense
          indicator-color="primary"
          narrow-indicator
        >
          <q-tab v-for="room in rooms" :key="room.id" :label="room.nom" :name="room.nom"
                 @click="getSensorsOfRoomByID(room.id); roomTab = room.nom"/>
        </q-tabs>
      </div>
    </div>

    <!-- BOUTON FLOTTANT -->
    <q-page-sticky :offset="[18, 100]" position="bottom-right">
      <q-fab color="primary" direction="up" icon="settings">
        <!-- BOUTON MODIFIER -->
        <q-fab-action color="primary" icon="edit" @click="editCurrentRoom">
          <q-tooltip :offset="[0, 0]" class="bg-primary">Modifier cette salle</q-tooltip>
        </q-fab-action>
        <!-- BOUTON SUPPRIMER -->
        <q-fab-action color="negative" icon="delete" @click="displayDeleteDialog = true">
          <q-tooltip :offset="[0, 0]" class="bg-primary">Supprimer cette salle</q-tooltip>
        </q-fab-action>
        <!-- BOUTON AJOUTER -->
        <q-fab-action color="primary" icon="add" @click="addOtherRoom">
          <q-tooltip :offset="[0, 0]" class="bg-primary">Ajouter une salle</q-tooltip>
        </q-fab-action>
      </q-fab>
    </q-page-sticky>

    <!-- DIALOG POUR MODIFICATION -->
    <q-dialog v-model="displayEditDialog" transition-hide="jump-down" transition-show="jump-up">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Modification de {{ roomTab }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <!-- FORMULAIRE DE MODIFICATION -->
          <room-form :action="'edit'" :room="currentRoom" @close="displayEditDialog = false"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- DIALOG POUR AJOUT -->
    <q-dialog v-model="displayAddDialog" transition-hide="jump-down" transition-show="jump-up">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Ajout d'une salle</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <!-- FORMULAIRE D'AJOUT -->
          <room-form :action="'add'" :room="currentRoom" @close="displayAddDialog = false"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- DIALOG POUR SUPPRESSION -->
    <q-dialog v-model="displayDeleteDialog" transition-hide="jump-down" transition-show="jump-up">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Suppression de {{ roomTab }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Voulez-vous vraiment supprimer cette salle ?
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-mt-md q-gutter-md" style="text-align: right">
            <!-- BOUTON ANNULER -->
            <q-btn v-close-popup color="primary" label="Annuler" outline/>
            <!-- BOUTON SUPPRIMER -->
            <q-btn v-close-popup color="negative" label="Supprimer" outline @click="deleteCurrentRoom"/>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- SI AUCUNE SALLE -->
    <p v-if="roomsLoaded && rooms.length === 0">Aucune salle</p>

  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import SensorComponent from 'components/Sensors/SensorComponent.vue'
import RoomForm from 'components/Rooms/RoomForm.vue'

export default defineComponent({
  name: 'RoomsPage',
  components: {
    RoomForm,
    SensorComponent
  },
  setup () {
    return {
      roomTab: ref('B1-01'),
      currentRoom: null,
      displayEditDialog: ref(false),
      displayDeleteDialog: ref(false),
      displayAddDialog: ref(false)
    }
  },
  data () {
    return {
      form: {
        nom: ''
      }
    }
  },
  computed: {
    // Mappage des getters
    ...mapGetters('rooms', ['rooms']),
    ...mapGetters('sensors', ['sensorsOfRoom', 'sensors']),
    // Mappage des données
    ...mapState('rooms', ['roomsLoaded']),
    ...mapState('sensors', ['sensorsOfRoomLoaded'])
  },
  methods: {
    // Mappage des actions
    ...mapActions('rooms', ['getAllRoomsApi', 'editRoom', 'deleteRoom']),
    ...mapActions('sensors', ['getSensorsOfRoom', 'getAllSensorsApi']),

    /**
     * Permet d'obtenir tous les capteurs d'une salle
     * @param roomID l'id de la salle
     */
    getSensorsOfRoomByID (roomID) {
      this.getSensorsOfRoom(roomID)
    },
    /**
     * Permet d'ouvrir le dialog de modification
     */
    editCurrentRoom () {
      // Récupère la salle actuelle
      this.currentRoom = this.rooms.find(room => room.nom === this.roomTab)
      // Ouvre le dialog
      this.displayEditDialog = true
    },
    /**
     * Permet d'ouvrir le dialog d'ajout
     */
    addOtherRoom () {
      // Ouvre le dialog
      this.displayAddDialog = true
    },
    /**
     * Permet de supprimer la salle actuelle
     */
    deleteCurrentRoom () {
      // Récupère la salle actuelle
      this.currentRoom = this.rooms.find(room => room.nom === this.roomTab)
      // Ouvre le dialog
      this.deleteRoom(this.currentRoom.id)
    }
  },
  watch: {
    /**
     * Permet de changer la route
     * @param newVal la nouvelle valeur
     */
    roomTab (newVal) {
      // Pousse la nouvelle route
      this.$router.push('/rooms/' + newVal)

      // Récupère la salle actuelle
      this.currentRoom = this.rooms.find(room => room.nom === this.roomTab)

      // Récupère les capteurs de la salle
      this.getSensorsOfRoomByID(this.currentRoom.id)
    }
  },
  mounted () {
    // Récupère toutes les salles de l'api
    this.getAllRoomsApi()

    // Récupère tous les capteurs de l'api
    this.getAllSensorsApi()

    // Récupère le nom de la salle en paramètre
    const roomName = this.$route.params.roomName
    // S'il y a un nom de salle
    if (roomName) {
      // Change le tab de la salle par le nom de la salle
      this.roomTab = roomName
    }

    // Pousse la nouvelle route
    this.$router.push('/rooms/' + this.roomTab)

    // Si le tab de salle est la première salle
    if (this.roomTab === 'B1-01') {
      // Récupère tous les capteurs de la première salle
      this.getSensorsOfRoom(1)
    }

    // Charge les données
    this.form.nom = roomName
  }
})
</script>

<style lang="sass" scoped>
.div-rooms
  margin-bottom: 15px
</style>
