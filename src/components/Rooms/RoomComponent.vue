<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="room-card" flat bordered>
      <q-card-section vertical>
        <div class="text-h6">{{ room.nom }}</div>
      </q-card-section>

    </q-card>
  </div>
</template>

<script>
export default {
  name: 'ClassComponent',
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
