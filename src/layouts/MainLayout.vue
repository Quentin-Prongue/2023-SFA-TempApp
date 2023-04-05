<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title class="absolute-center">
          Temp App
        </q-toolbar-title>
        <!-- BOUTON CONNEXION -->
        <q-btn
          v-if="!user"
          class="absolute-right"
          flat
          icon-right="account_circle"
          label="Se connecter"
          to="/login"
        />

        <!-- BOUTON GÉRER COMPTE -->
        <div class="q-pa-md">
          <q-btn v-if="user" class="absolute-right" flat icon="manage_accounts" rounded>
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <div class="text-h6 q-mb-md">Paramètres</div>
                  <div class="cursor-pointer">
                    Réinitialiser mot de passe
                    <q-popup-edit
                      v-slot="scope"
                      buttons
                      label-cancel="Close"
                      label-set="Save"
                    >
                      <!-- INPUT MOT DE PASSE -->
                      <q-input
                        v-model.number="scope.value"
                        autofocus
                        dense
                        type="password"
                        @keyup.enter="scope.set"
                      />
                    </q-popup-edit>
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
                  <q-btn
                    v-close-popup
                    color="primary"
                    label="Se déconnecter"
                    push
                    size="sm"
                    @click="logout"
                  />

                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      breakpoint="767"
      class="bg-primary"
      dark
      show-if-above
      width="250"
    >
      <q-list>
        <q-item-label
          class="text-white"
          header
        >
          Menu de navigation
        </q-item-label>
        <q-item
          v-for="link in links"
          :key="link.id"
          :to="link.path"
          class="text-grey-4"
          clickable
          exact
        >
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
        <q-route-tab
          v-for="link in links"
          :key="link.id"
          :icon="link.icon"
          :label="link.text"
          :to="link.route"
          exact
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapState, mapActions } from 'vuex'
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
      }
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
    ...mapActions('auth', ['disconnectUser']),
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
          color: 'negative'
        },
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        this.disconnectUser()
      })
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
.q-drawer
  .q-router-link--exact-active
    color: white !important
</style>
