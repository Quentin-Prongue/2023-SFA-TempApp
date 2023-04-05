<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="sensor-card" flat bordered>
      <q-card-section vertical>
        <div class="text-h6">{{ sensor.nom }}</div>
        <div class="text-subtitle2">Salle : {{ sensor.salle.nom }}</div>
      </q-card-section>

      <q-card-actions vertical class="justify-around q-px-md">
        <q-btn flat round color="red" icon="favorite"/>
      </q-card-actions>

      <q-separator inset />

      <measure-component :measures="sensor.mesures">
      </measure-component>

    </q-card>
  </div>
</template>

<script>
export default {
  name: 'SensorComponent',
  props: {
    sensor: {
      type: Object,
      required: true
    }
  },
  components: {
    measureComponent: require('components/Measures/MeasureComponent.vue').default
  }
}
</script>

<style lang="sass" scoped>
.sensor-card
  width: 100%
  max-width: 450px
</style>
