<template>
  <!-- FORMULAIRE -->
  <q-form @submit.prevent="submitForm">
    <!-- NOM -->
    <q-input
      v-model="form.nom"
      :rules="[ val => val.length >= 2 || 'Minimum 2 caractères']"
      class="q-my-md"
      label="Nom *"
      lazy-rules
    >
      <!-- ICONE CAPTEUR -->
      <template v-slot:append>
        <q-icon name="sensors"/>
      </template>
    </q-input>

    <!-- PHOTO -->
    <q-input
      v-model="form.logo"
      bottom-slots
      class="q-my-md"
      label="Photo"
      lazy-rules
    >
      <!-- IMAGE ACTUELLE CAPTEUR -->
      <template v-slot:before>
        <q-avatar>
          <img :src="sensor.logo" alt="Photo du capteur">
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

    <!-- CODE -->
    <q-input
      v-model="form.code"
      :rules="[ val => val.length >= 2 || 'Minimum 2 caractères']"
      class="q-my-md"
      label="Code *"
      lazy-rules
    >
      <!-- ICONE CODE -->
      <template v-slot:append>
        <q-icon name="tag"/>
      </template>
    </q-input>

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
import { mapActions } from 'vuex'

export default defineComponent({
  name: 'EditSensorForm',
  props: {
    sensor: {
      Type: Object,
      Required: true
    }
  },
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
        code: ''
      }
    }
  },
  methods: {
    ...mapActions('sensors', ['editSensor']),
    /**
     * Permet de sauvegarder les modifications
     */
    submitForm () {
      const payload = {
        nom: this.form.nom,
        logo: this.form.logo,
        code: this.form.code,
        sensorID: this.sensor.id
      }
      this.editSensor(payload)
      // Emet un évènement de fermeture
      this.$emit('close')
    }
  },
  mounted () {
    // Si le capteur n'est pas null
    if (this.sensor !== null) {
      // Charge les données
      this.form.nom = this.sensor.nom
      this.form.logo = this.sensor.logo
      this.form.code = this.sensor.code
    }
  }
})
</script>
