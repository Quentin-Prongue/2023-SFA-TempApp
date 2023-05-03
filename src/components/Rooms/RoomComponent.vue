<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card bordered class="room-card" flat>
      <q-card-section vertical>
        <!-- NOM DE LA SALLE -->
        <div class="text-h6">{{ room.nom }}</div>
      </q-card-section>

    </q-card>
  </div>
</template>

<script>
export default {
  name: 'RoomComponent',
  props: {
    room: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="sass" scoped>
.room-card
  width: 100%
  max-width: 450px
</style>
