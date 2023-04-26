<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lff">
      <q-header elevated>
        <q-toolbar>
          <q-btn aria-label="Menu" dense flat icon="menu" round @click="toggleLeftDrawer"/>
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
                              <div class="q-gutter-xl row q-pa-md">
                                <!-- NOM -->
                                <q-input
                                  v-model="lastName"
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
                                  v-model="firstName"
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
                                  v-model="email"
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

      <q-footer elevated>
        <q-tabs>
          <q-route-tab v-for="link in links" :key="link.id" :icon="link.icon" :label="link.text" :to="link.route"
                       exact/>
        </q-tabs>
      </q-footer>
    </q-layout>
  </div>
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
      isPwd: ref(true),
      drawer: ref(false),
      miniState: ref(true),
      firstName: ref(''),
      lastName: ref(''),
      email: ref(''),
      password: ref(''),
      picture: ref('')
    }
  },
  computed: {
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
    validateEmail (email) {
      // Source : https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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
  }
})
</script>

<style lang="sass">
/* Applique les règles de ce bloc uniquement aux écrans >= 768px */
@media screen and (min-width: 768px)
/* Cache les éléments avec la classe CSS q-footer */
.q-footer
  display: none

/* Lien actif du menu latéral */
.q-router-link--exact-active
  color: $secondary !important

.bt-logout
  position: absolute
  bottom: 20px
</style>
