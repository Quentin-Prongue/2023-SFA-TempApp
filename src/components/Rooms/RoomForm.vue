<template>
  <!-- NOM -->
  <q-input
    v-model="form.nom"
    :rules="[ val => val.length >= 4 || 'Minimum 4 caractère']"
    autofocus
    class="q-my-md"
    label="Nom de la salle"
    lazy-rules
  >
    <template v-slot:append>
      <q-icon name="meeting_room"/>
    </template>
  </q-input>

  <div class="q-mt-md q-gutter-md" style="text-align: right">
    <q-btn v-close-popup color="red" label="Annuler" outline/>
    <q-btn v-close-popup :label="action === 'edit' ? 'Modifier' : 'Ajouter'"
           color="primary" @click="submitForm"/>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'

export default defineComponent({
  name: 'RoomForm',
  props: {
    room: {
      Type: Object,
      Required: true
    },
    action: {
      Type: String,
      Required: true
    }
  },
  data () {
    return {
      form: {
        nom: ''
      }
    }
  },
  methods: {
    ...mapActions('rooms', ['editRoom', 'addRoom']),
    /**
     * Permet de sauvegarder les modifications
     */
    submitForm () {
      // Teste l'action
      if (this.action === 'edit') {
        // Construction du payload
        const payload = {
          nom: this.form.nom,
          roomID: this.room.id
        }
        // Modifie la salle
        this.editRoom(payload)
      } else {
        // Construction du payload
        const payload = {
          nom: this.form.nom
        }
        // Ajoute une salle
        this.addRoom(payload)
      }
    }
  },
  mounted () {
    if (this.room !== null && this.action === 'edit') {
      // Charge les données
      this.form.nom = this.room.nom
    }
  }
})
</script>
