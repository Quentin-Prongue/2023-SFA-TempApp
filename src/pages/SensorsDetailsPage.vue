<template>
  <q-page v-if="currentSensor !== null" padding>
    <q-btn color="primary" flat icon="arrow_back"/>
    <sensor-component :sensor="currentSensor" :full="true"/>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import SensorComponent from 'components/Sensors/SensorComponent.vue'

export default {
  name: 'SensorsDetailsPage',
  components: { SensorComponent },
  computed: {
    // Mappage des getters
    ...mapState('sensors', ['currentSensor'])
  },
  methods: {
    // Mappage des actions
    ...mapActions('sensors', ['getCurrentSensor'])
  },
  beforeMount () {
    const sensorId = this.$route.params.id
    this.getCurrentSensor(sensorId)
  }
}
</script>

<style scoped>

</style>
