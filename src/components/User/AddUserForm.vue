<template>
  <q-form @submit.prevent="submitForm">
    <div class="q-gutter-xl row q-pa-md">
      <!-- NOM -->
      <q-input
        v-model="form.nom"
        :rules="[ val => val.length >= 2 || 'Minimum 2 caractères']"
        class="col"
        label="Nom *"
        lazy-rules
      >
        <template v-slot:append>
          <q-icon name="person"/>
        </template>
      </q-input>

      <!-- PRENOM -->
      <q-input
        v-model="form.prenom"
        :rules="[ val => val.length >= 2 || 'Minimum 2 caractères']"
        class="col"
        label="Prénom *"
        lazy-rules
      >
        <template v-slot:append>
          <q-icon name="person"/>
        </template>
      </q-input>
    </div>

    <div class="q-gutter-xl row q-pa-md">
      <!-- EMAIL -->
      <q-input
        v-model="form.email"
        :rules="[val => validateEmail(val) || 'Email invalide']"
        class="col"
        label="Email *"
        lazy-rules
      >
        <template v-slot:append>
          <q-icon name="email"/>
        </template>
      </q-input>

      <!-- MOT DE PASSE -->
      <q-input v-model="form.password" :rules="[ val => val.length >= 4 || 'Minimum 4 caractère']"
               :type="isPwd ? 'password' : 'text'" class="col" label="Mot de passe *"
               lazy-rules
               @keyup.enter="prompt = false">
        <template v-slot:append>
          <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd"/>
          <q-icon name="lock"/>
        </template>
      </q-input>
    </div>

    <div class="q-pa-md">
      <!-- ADMINISTRATEUR -->
      <q-checkbox v-model="isAdmin" false-value="0" label="Administrateur" left-label true-value="1"/>
    </div>

    <div class="q-mt-md q-gutter-md" style="text-align: right">
      <q-btn v-close-popup color="red" label="Annuler" outline/>
      <q-btn color="primary" label="Ajouter" outline type="submit"/>
    </div>
  </q-form>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapActions } from 'vuex'

export default defineComponent({
  name: 'AddUserForm',
  setup () {
    return {
      picture: ref(''),
      isPwd: ref(true),
      isAdmin: ref('0')
    }
  },
  data () {
    return {
      form: {
        nom: '',
        prenom: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions('users', ['addUser']),
    /**
     * Permet de soumettre le formulaire
     */
    submitForm () {
      const payload = {
        nom: this.form.nom,
        prenom: this.form.prenom,
        email: this.form.email,
        password: this.form.password,
        is_admin: parseInt(this.isAdmin)
      }
      this.addUser(payload)
      // Emet un évènement de fermeture
      this.$emit('close')
    },
    /**
     * Permet de valider un email
     * @param email l'email
     * @returns {boolean} la réponse de la validation
     */
    validateEmail (email) {
      // Source : https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    }
  }
})
</script>
