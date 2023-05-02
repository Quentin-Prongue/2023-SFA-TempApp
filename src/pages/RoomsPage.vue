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

      <q-fab color="primary" direction="up" icon="settings" class="absolute-bottom-right bt-floating-action">
        <q-fab-action color="primary" icon="add" @click="addRoom"/>
        <q-fab-action color="red" icon="delete" @click="deleteRoom"/>
      </q-fab>

      <div class="q-gutter-y-md">
        <!-- CONTENU DES TABS -->
        <q-tab-panels v-model="roomTab" animated>
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

    <!-- SI AUCUNE SALLE -->
    <p v-if="roomsLoaded && rooms.length === 0">Aucune salle</p>

  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import SensorComponent from 'components/Sensors/SensorComponent.vue'

export default defineComponent({
  name: 'ClassesPage',
  components: { SensorComponent },
  setup () {
    return {
      roomTab: ref('B1-01')
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
    ...mapActions('rooms', ['getAllRoomsApi']),
    ...mapActions('sensors', ['getSensorsOfRoom', 'getAllSensorsApi']),

    /**
     * Permet d'obtenir tous les capteurs d'une salle
     * @param roomID l'id de la salle
     */
    getSensorsOfRoomByID (roomID) {
      this.getSensorsOfRoom(roomID)
    },

    addRoom () {
      alert('Ajout ' + this.roomTab)
    },

    deleteRoom () {
      alert('Suppression ' + this.roomTab)
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
      const room = this.rooms.find(room => room.nom === this.roomTab)

      // Récupère les capteurs de la salle
      this.getSensorsOfRoomByID(room.id)
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
  }
})
</script>

<style lang="sass" scoped>
.div-rooms
  margin-bottom: 15px

.bt-floating-action
  margin-bottom: 100px
  margin-right: 20px
</style>
