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
              <q-menu>
                <div class="row no-wrap q-pa-md">
                  <div class="column">
                    <div class="text-h6 q-mb-md">Paramètres</div>
                    <div class="cursor-pointer text-primary" @click="prompt = true">
                      Réinitialiser mot de passe
                      <q-dialog v-model="prompt" persistent>
                        <q-card style="min-width: 350px">
                          <q-card-section>
                            <div class="text-h6">Modification mot de passe</div>
                          </q-card-section>

                          <q-card-section class="q-pt-none">
                            <!-- NOM -->
                            <q-input
                              v-model="user.nom"
                              class="q-my-md"
                              label="Nom"
                              lazy-rules
                            >
                              <template v-slot:append>
                                <q-icon name="person"/>
                              </template>
                            </q-input>

                            <!-- PRENOM -->
                            <q-input
                              v-model="user.prenom"
                              class="q-my-md"
                              label="Prénom"
                              lazy-rules
                            >
                              <template v-slot:append>
                                <q-icon name="person"/>
                              </template>
                            </q-input>

                            <!-- MOT DE PASSE -->
                            <q-input v-model="password" :type="isPwd ? 'password' : 'text'" autofocus
                                     class="q-my-md" label="Mot de passe" lazy-rules
                                     @keyup.enter="prompt = false">
                              <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                        @click="isPwd = !isPwd"/>
                                <q-icon name="lock"/>
                              </template>
                            </q-input>
                          </q-card-section>

                          <q-card-actions align="right" class="text-primary">
                            <q-btn v-close-popup color="red" label="Annuler" outline/>
                            <q-btn v-close-popup color="primary" label="Modifier" @click="editPassword"/>
                          </q-card-actions>
                        </q-card>
                      </q-dialog>
                    </div>
                  </div>

                  <q-separator class="q-mx-lg" inset vertical/>

                  <!-- PHOTO DE PROFIL -->
                  <div class="column items-center">
                    <q-avatar size="72px">
                      <img :src="user.photo" alt="Photo de profil">
                    </q-avatar>

                    <!-- NOM COMPLET -->
                    <div class="text-subtitle1 q-mt-md q-mb-xs">{{ fullName }}</div>

                    <!-- BOUTON DÉCONNEXION -->
                    <q-btn v-close-popup color="primary" label="Se déconnecter" push size="sm" @click="logout"/>

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
          // Lien pour l'accueil
          id: 1,
          text: 'Accueil',
          icon: 'home',
          path: '/'
        },
        {
          // Lien pour les capteurs
          id: 2,
          text: 'Capteurs',
          icon: 'sensors',
          path: '/sensors'
        },
        {
          // Lien pour les salles
          id: 3,
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
      password: ref(''),
      isPwd: ref(true),
      drawer: ref(false),
      miniState: ref(true)
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
    ...mapActions('auth', ['disconnectUser', 'editUserPassword']),
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
    editPassword () {
      const payload = {
        nom: this.user.nom,
        prenom: this.user.prenom,
        password: this.password
      }

      this.editUserPassword(payload)
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
</style>
