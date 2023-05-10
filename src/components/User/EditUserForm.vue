<template>
  <!-- FORMULAIRE -->
  <q-form @submit.prevent="submitForm">
    <div :class="{'q-gutter-xl row q-pa-md': $q.screen.width >= 768}">
      <!-- NOM -->
      <q-input
        v-model="form.nom"
        :rules="[ val => val.length >= 2 || 'Minimum 2 caractères']"
        autofocus
        class="col"
        label="Nom *"
        lazy-rules
      >
        <!-- ICONE PERSONNE -->
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
        <!-- ICONE PERSONNE -->
        <template v-slot:append>
          <q-icon name="person"/>
        </template>
      </q-input>
    </div>

    <div :class="{'q-gutter-xl row q-pa-md': $q.screen.width >= 768}">
      <!-- EMAIL -->
      <q-input
        v-model="form.email"
        :rules="[val => validateEmail(val) || 'Email invalide']"
        class="col"
        label="Email *"
        lazy-rules
      >
        <!-- ICONE EMAIL -->
        <template v-slot:append>
          <q-icon name="email"/>
        </template>
      </q-input>
    </div>

    <!-- PHOTO -->
    <q-input
      v-model="picture"
      bottom-slots
      class="row q-pa-md"
      label="Photo"
      lazy-rules
    >
      <!-- PHOTO ACTUELLE DE L'UTILISATEUR -->
      <template v-slot:before>
        <q-avatar>
          <img :src="user.photo" alt="Photo de profil">
        </q-avatar>
      </template>

      <template v-slot:append>
        <!-- PERMET DE SUPPRIMER LE CONTENU -->
        <q-icon v-if="picture !== ''" class="cursor-pointer" name="close"
                @click="picture = ''"/>
        <!-- ICONE IMAGE -->
        <q-icon name="image"/>
      </template>

      <!-- INDICE -->
      <template v-slot:hint>
        URL de la photo
      </template>
    </q-input>

    <div class="q-mt-md q-gutter-md" style="text-align: right">
      <!-- BOUTON ANNULER -->
      <q-btn v-close-popup color="negative" label="Annuler" outline/>
      <!-- BOUTON MODIFIER -->
      <q-btn color="primary" label="Modifier" outline type="submit"/>
    </div>
  </q-form>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapActions } from 'vuex'

export default defineComponent({
  name: 'EditUserForm',
  props: {
    user: {
      Type: Object,
      Required: true
    }
  },
  setup () {
    return {
      password: ref(''),
      picture: ref(''),
      isPwd: ref(true)
    }
  },
  data () {
    return {
      form: {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        photo: ''
      }
    }
  },
  methods: {
    // Mappage des actions
    ...mapActions('auth', ['editUser']),
    /**
     * Permet de valider un email
     * @param email l'email
     * @returns {boolean} la réponse de la validation
     */
    validateEmail (email) {
      // Source : https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    },
    /**
     * Permet de soumettre le formulaire
     */
    submitForm () {
      // Appeler la méthode submitForm avec les données du formulaire
      const payload = {
        nom: this.form.nom,
        prenom: this.form.prenom,
        email: this.form.email,
        photo: this.form.photo
      }
      this.editUser(payload)
      // Emet un évènement de fermeture
      this.$emit('close')
    }
  },
  mounted () {
    // Si l'utilisateur n'est pas null
    if (this.user !== null) {
      // Charge les données
      this.form.nom = this.user.nom
      this.form.prenom = this.user.prenom
      this.form.email = this.user.email
      this.form.photo = this.user.photo
    }
  }
})
</script>
