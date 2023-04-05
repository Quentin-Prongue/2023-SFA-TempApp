<template>
  <q-form @submit.prevent="submitForm">
    <q-input
      outlined
      v-model="form.email"
      label="E-mail"
      class="q-my-md"
      :rules="[val => validateEmail(val) || 'Email invalide']"
      lazy-rules
    />

    <q-input
      type="password"
      outlined
      v-model="form.password"
      label="Mot de passe"
      class="q-my-md"
      :rules="[ val => val.length >= 4 || 'Minimum 4 caractère']"
      lazy-rules
    />

    <q-btn
      type="submit"
      color="primary"
      label="Se connecter"
    />
  </q-form>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'

export default defineComponent({
  name: 'ConnexionForm',
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions('auth', ['connectUser']),
    /**
     * Méthode pour l'envoi du formulaire
     */
    submitForm () {
      this.connectUser(this.form)
    },
    /**
     * Permet de valider l'email
     * @param email l'email
     * @returns {boolean} si l'email est valide ou pas
     */
    validateEmail (email) {
      // Source : https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    }
  }
})
</script>
