<template>
  <q-page padding>
    <h1>Page des salles</h1>
    <!-- SPINNER -->
    <div
      v-if="!roomsLoaded"
      class="q-pa-lg text-center"
    >
      <q-spinner-radio color="primary" size="4em"/>
    </div>

    <div class="q-pa-md absolute-bottom">
      <div class="q-gutter-y-md">
        <q-card>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel v-for="room in rooms" :key="room.id" :name="room.nom">
              <div class="text-h6">{{ room.nom }}</div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>
          </q-tab-panels>

          <q-separator/>

          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab v-for="room in rooms" :key="room.id" :name="room.nom" :label="room.nom"/>
          </q-tabs>
        </q-card>
      </div>
    </div>

    <!-- SI AUCUNE SALLE -->
    <p v-if="!roomsLoaded" v-show="roomsLoaded">Aucun capteurs</p>

  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'

export default defineComponent({
  name: 'ClassesPage',
  setup () {
    return {
      tab: ref('B1-01')
    }
  },
  computed: {
    // Mappage des getters
    ...mapGetters('rooms', ['rooms']),
    // Mappage des données
    ...mapState('rooms', ['roomsLoaded'])
  },
  methods: {
    // Mappage des actions
    ...mapActions('rooms', ['getAllRoomsApi'])
  },
  mounted () {
    // Récupère toutes les salles de l'api
    this.getAllRoomsApi()
  }
})
</script>
