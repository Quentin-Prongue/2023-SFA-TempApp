<template>
  <q-page padding>
    <q-card class="connexion q-pa-md">
      <connexion-form/>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'ConnexionPage',
  components: {
    'connexion-form': require('components/connexion/ConnexionForm.vue').default
  }
}
</script>

<style lang="sass" scoped>
.connexion
  max-width: 500px
  width: auto
  margin: 0 auto
</style>
