<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card bordered class="sensor-card" flat>
      <q-card-section vertical>
        <!-- NOM DU CAPTEUR -->
        <div class="text-h6">{{ sensor.nom }}</div>
        <!-- NOM DE LA SALLE -->
        <div class="text-subtitle2">Salle : {{ sensor.salle.nom }}</div>
      </q-card-section>

      <!-- AJOUTER AUX FAVORIS -->
      <q-card-actions class="justify-around q-px-md" vertical>
        <q-btn color="red" flat icon="favorite" round/>
      </q-card-actions>

      <q-separator inset/>

      <!-- COMPOSANT DES MESURES -->
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
