<template>
  <q-page padding>
    <h1>Page des salles</h1>
    <!-- Spinner -->
    <div
      v-if="!roomsLoaded"
      class="q-pa-lg text-center"
    >
      <q-spinner-radio color="primary" size="4em"/>
    </div>

    <div class="row">
      <class-component
        v-for="room in rooms"
        :key="room.id"
        :room="room">
      </class-component>

      <p v-if="!roomsLoaded" v-show="roomsLoaded">Aucun capteurs</p>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'

export default defineComponent({
  name: 'ClassesPage',
  computed: {
    // Mappage des getters
    ...mapGetters('rooms', ['rooms']),
    ...mapState('rooms', ['roomsLoaded'])
  },
  methods: {
    // Mappage des actions
    ...mapActions('rooms', ['getAllRoomsApi'])
  },
  components: {
    classComponent: require('components/Rooms/RoomComponent.vue').default
  },
  mounted () {
    // Récupère toutes les salles de l'api
    this.getAllRoomsApi()
  }
})
</script>
