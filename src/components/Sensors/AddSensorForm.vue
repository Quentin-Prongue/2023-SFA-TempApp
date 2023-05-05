<template>
  <!-- FORMULAIRE -->
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
        <!-- ICONE CAPTEUR -->
        <template v-slot:append>
          <q-icon name="sensors"/>
        </template>
      </q-input>

      <!-- CODE -->
      <q-input
        v-model="form.code"
        :rules="[ val => val.length >= 2 || 'Minimum 2 caractères']"
        class="col"
        label="Code *"
        lazy-rules
      >
        <!-- ICONE CODE -->
        <template v-slot:append>
          <q-icon name="tag"/>
        </template>
      </q-input>
    </div>

    <div class="q-gutter-xl row q-pa-md">
      <!-- PHOTO -->
      <q-input
        v-model="form.logo"
        bottom-slots
        class="col"
        label="Photo"
        lazy-rules
      >
        <!-- IMAGE ACTUELLE CAPTEUR -->
        <template v-slot:before>
          <q-avatar>
            <img :src="this.form.logo" alt="Photo du capteur">
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
          URL du logo
        </template>
      </q-input>

      <!-- SALLE -->
      <q-select v-model="form.salle" :options="this.rooms" :rules="[ val => !!val || 'Ce champ est requis !']"
                class="col" label="Choix de la salle *"
                option-label="nom"
                transition-hide="jump-down"
                transition-show="jump-up">
        <!-- ICONE SALLE -->
        <template v-slot:append>
          <q-icon name="meeting_room"/>
        </template>
      </q-select>
    </div>

    <div class="q-mt-md q-gutter-md" style="text-align: right">
      <!-- BOUTON ANNULER -->
      <q-btn v-close-popup color="red" label="Annuler" outline/>
      <!-- BOUTON ENREGISTRER -->
      <q-btn color="primary" label="Enregistrer" outline type="submit"/>
    </div>
  </q-form>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default defineComponent({
  name: 'AddSensorForm',
  setup () {
    return {
      picture: ref('')
    }
  },
  data () {
    return {
      form: {
        nom: '',
        logo: '',
        code: '',
        salle: ''
      }
    }
  },
  methods: {
    ...mapActions('sensors', ['addSensor']),
    ...mapActions('rooms', ['getAllRoomsApi']),
    /**
     * Permet de soumettre le formulaire
     */
    submitForm () {
      const payload = {
        nom: this.form.nom,
        logo: this.form.logo,
        code: this.form.code,
        salle_id: this.form.salle.id
      }
      this.addSensor(payload)
      // Emet un évènement de fermeture
      this.$emit('close')
    }
  },
  computed: {
    // Mappage des getters
    ...mapGetters('rooms', ['rooms'])
  },
  mounted () {
    // Récupère les salles de l'api
    this.getAllRoomsApi()
  }
})
</script>
