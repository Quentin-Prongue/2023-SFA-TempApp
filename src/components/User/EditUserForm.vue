<template>
  <div class="q-gutter-xl row q-pa-md">
    <!-- NOM -->
    <q-input
      v-model="form.nom"
      :rules="[ val => val.length >= 1 || 'Minimum 1 caractère']"
      class="col"
      label="Nom"
      lazy-rules
    >
      <template v-slot:append>
        <q-icon name="person"/>
      </template>
    </q-input>

    <!-- PRENOM -->
    <q-input
      v-model="form.prenom"
      :rules="[ val => val.length >= 1 || 'Minimum 1 caractère']"
      class="col"
      label="Prénom"
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
      label="Email"
      lazy-rules
    >
      <template v-slot:append>
        <q-icon name="email"/>
      </template>
    </q-input>

    <!-- MOT DE PASSE -->
    <q-input v-model="password" :rules="[ val => val.length >= 4 || 'Minimum 4 caractère']"
             :type="isPwd ? 'password' : 'text'" class="col" label="Mot de passe"
             lazy-rules
             @keyup.enter="prompt = false">
      <template v-slot:append>
        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="isPwd = !isPwd"/>
        <q-icon name="lock"/>
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
    <template v-slot:before>
      <q-avatar>
        <img :src="user.photo" alt="Photo de profil">
      </q-avatar>
    </template>

    <template v-slot:append>
      <q-icon v-if="picture !== ''" class="cursor-pointer" name="close"
              @click="picture = ''"/>
      <q-icon name="image"/>
    </template>

    <template v-slot:hint>
      URL de la photo
    </template>
  </q-input>
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
    saveEdit () {
      // Appeler la méthode submitForm avec les données du formulaire
      const payload = {
        nom: this.form.nom,
        prenom: this.form.prenom,
        email: this.form.email,
        password: this.form.password,
        photo: this.form.password
      }
      console.log(payload)
      this.editUser(payload)
    }
  },
  mounted () {
    if (this.user !== null) {
      this.form.nom = this.user.nom
      this.form.prenom = this.user.prenom
      this.form.email = this.user.email
      this.form.photo = this.user.photo
    }
  }
})
</script>
