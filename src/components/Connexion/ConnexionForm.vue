<template>
  <!-- FORMULAIRE -->
  <q-form @submit.prevent="submitForm">
    <!-- EMAIL -->
    <q-input
      v-model="form.email"
      :rules="[val => validateEmail(val) || 'Email invalide']"
      class="q-my-md"
      label="E-mail"
      lazy-rules
      outlined
    >
      <template v-slot:prepend>
        <q-icon name="email"/>
      </template>
    </q-input>

    <!-- MOT DE PASSE -->
    <q-input
      v-model="form.password"
      :rules="[ val => val.length >= 4 || 'Minimum 4 caractère']"
      class="q-my-md"
      label="Mot de passe"
      lazy-rules
      outlined
      :type="isPwd ? 'password' : 'text'"
    >
      <template v-slot:prepend>
        <q-icon name="lock"/>
      </template>
      <template v-slot:append>
        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="isPwd = !isPwd"/>
      </template>
    </q-input>

    <!-- BOUTON SE CONNECTER -->
    <q-btn
      color="primary"
      label="Se connecter"
      type="submit"
    />
  </q-form>
</template>

<script>
import { defineComponent, ref } from 'vue'
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
  setup () {
    return {
      isPwd: ref(true)
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
