<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar>
        <q-btn aria-label="Menu" class="bt-menu" dense flat icon="menu" round @click="toggleLeftDrawer"/>
        <q-toolbar-title class="absolute-center">
          Temp App
        </q-toolbar-title>
        <!-- BOUTON CONNEXION -->
        <q-btn v-if="!user" class="absolute-right" flat icon-right="account_circle" label="Se connecter" to="/login"/>

        <!-- BOUTON GÉRER COMPTE -->
        <div class="q-pa-md">
          <q-btn v-if="user" class="absolute-right" flat icon="manage_accounts" rounded>
            <q-menu
              transition-hide="jump-up"
              transition-show="jump-down">
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <div class="text-h6 q-mb-md">Paramètres</div>
                  <div class="cursor-pointer text-primary" @click="prompt = true">
                    Modifier mon compte
                    <q-dialog v-model="prompt" persistent>
                      <q-card style="min-width: 800px">
                        <q-form @submit.prevent="submitForm">
                          <q-card-section>
                            <div class="text-h5">Modification de compte</div>
                          </q-card-section>

                          <q-card-section>
                            <!-- FORMULAIRE DE MODIFICATION DE L'UTILISATEUR -->
                            <edit-user-form :user="user"/>
                          </q-card-section>

                          <q-card-actions align="right" class="text-primary">
                            <q-btn v-close-popup color="red" label="Annuler" outline/>
                            <q-btn v-close-popup color="primary" label="Modifier" @click="submitForm"/>
                          </q-card-actions>
                        </q-form>
                      </q-card>
                    </q-dialog>
                  </div>

                  <!-- BOUTON DÉCONNEXION -->
                  <q-btn v-close-popup class="bt-logout" color="primary" label="Se déconnecter" size="sm"
                         @click="logout"/>

                </div>

                <q-separator class="q-mx-lg" inset vertical/>

                <!-- PHOTO DE PROFIL -->
                <div class="column items-center">
                  <q-avatar size="72px">
                    <img :src="user.photo" alt="Photo de profil">
                  </q-avatar>

                  <!-- NOM COMPLET -->
                  <div class="text-subtitle1 q-mt-md q-mb-xs">{{ fullName }}</div>

                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :breakpoint="500"

      :mini="miniState"
      :width="200"
      bordered
      class="bg-primary"

      mini-to-overlay
      show-if-above
      @mouseout="miniState = true"
      @mouseover="miniState = false"
    >
      <q-list>
        <q-item v-for="link in links" :key="link.id" :to="link.path" class="text-grey-4" clickable exact>
          <q-item-section avatar>
            <q-icon :name="link.icon"/>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ link.text }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <q-footer bordered elevated>
      <q-tabs>
        <q-route-tab v-for="link in links" :key="link.id" :label="link.text" :to="link.path"
                     exact/>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapActions, mapState } from 'vuex'
import { Dialog } from 'quasar'

export default defineComponent({
  name: 'MainLayout',
  data () {
    return {
      // Tableau des liens de l'application
      links: [
        {
          // Lien pour les capteurs
          id: 1,
          text: 'Capteurs',
          icon: 'sensors',
          path: '/'
        },
        {
          // Lien pour les salles
          id: 2,
          text: 'Salles',
          icon: 'meeting_room',
          path: '/rooms'
        }
      ]
    }
  },
  setup () {
    const leftDrawerOpen = ref(false)
    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      prompt: ref(false),
      drawer: ref(false),
      miniState: ref(true)
    }
  },
  computed: {
    // Mappage des données
    ...mapState('auth', ['user']),
    /**
     * Permet d'obtenir le nom complet de l'utilisateur
     * @returns {string} le nom complet de l'utilisateur
     */
    fullName () {
      return this.user.nom + ' ' + this.user.prenom
    }
  },
  methods: {
    // Mappage des actions
    ...mapActions('auth', ['disconnectUser', 'editUser']),
    /**
     * Permet de déconnecter l'utilisateur
     */
    logout () {
      Dialog.create({
        title: 'Déconnexion',
        message: 'Voulez-vous vraiment vous déconnecter',
        cancel: {
          label: 'Annuler',
          focus: true,
          color: 'negative',
          outline: true
        },
        ok: {
          label: 'Oui'
        },
        persistent: true
      }).onOk(() => {
        this.disconnectUser()
      })
    },
    /**
     * Méthode qui s'exécute quand le formulaire est soumis
     */
    submitForm () {
      // Construction du payload
      const payload = {
        nom: this.lastName,
        prenom: this.firstName,
        email: this.email,
        photo: this.picture
      }

      this.editUser(payload)
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
  },
  mounted () {
    if (this.user !== null) {
      // Initialise chaque valeur avec les valeurs de l'utilisateur
      this.firstName = this.user.prenom
      this.lastName = this.user.nom
      this.email = this.user.email
      this.picture = this.user.photo
    }
  },
  components: {
    EditUserForm: require('components/User/EditUserForm.vue').default
  }
})
</script>

<style lang="sass">
/* Applique les règles de ce bloc uniquement aux écrans >= 768px */
@media screen and (min-width: 768px)
  /* Cache les éléments avec la classe CSS q-footer */
  .q-footer
    display: none
  .bt-menu
    display: block

@media screen and (max-width: 767px)
  .q-footer
    display: block
  .bt-menu
    display: none

/* Lien actif du menu latéral */
.q-router-link--exact-active
  color: $secondary !important

.bt-logout
  position: absolute
  bottom: 20px
</style>
