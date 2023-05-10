<template>
  <router-view/>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'

export default defineComponent({
  name: 'App',
  methods: {
    // Mappage des actions
    ...mapActions('auth', ['setUser']),
    ...mapActions('sensors', ['setFavoritesSensors', 'getAllSensorsApi']),
    ...mapActions('rooms', ['getAllRoomsApi'])
  },
  mounted () {
    // Récupère les données du localStorage
    const user = this.$q.localStorage.getItem('user')
    const token = this.$q.localStorage.getItem('token')
    // Si un utilisateur et un token existent
    if (user && token) {
      // Construction de l'objet payload
      const payload = {
        user,
        access_token: token
      }

      // Définit l'utilisateur en cours
      this.setUser(payload)

      // Récupère les capteurs favoris du localStorage
      const favoritesSensors = this.$q.localStorage.getItem('favoritesSensors')
      // Si il y a des capteurs favoris
      if (favoritesSensors) {
        // Défini les capteurs favoris
        this.setFavoritesSensors(favoritesSensors)
      }
    }
  }
})
</script>
