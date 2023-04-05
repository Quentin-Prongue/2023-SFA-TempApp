<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title class="absolute-center">
          Temp App
        </q-toolbar-title>
        <!-- BOUTON CONNEXION -->
        <q-btn
          v-if="!user"
          to="/login"
          flat
          icon-right="account_circle"
          label="Se connecter"
          class="absolute-right"
        />

        <!-- BOUTON GÉRER COMPTE -->
        <div class="q-pa-md">
          <q-btn flat rounded icon="manage_accounts" class="absolute-right" v-if="user">
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <div class="text-h6 q-mb-md">Paramètres</div>
                  <div class="cursor-pointer">
                    Réinitialiser mot de passe
                    <q-popup-edit
                      buttons
                      label-set="Save"
                      label-cancel="Close"
                      v-slot="scope"
                    >
                      <q-input
                        type="password"
                        v-model.number="scope.value"
                        dense
                        autofocus
                        @keyup.enter="scope.set"
                      />
                    </q-popup-edit>
                  </div>
                </div>

                <q-separator vertical inset class="q-mx-lg"/>

                <div class="column items-center">
                  <q-avatar size="72px">
                    <img :src="user.photo" alt="Photo de profil">
                  </q-avatar>

                  <div class="text-subtitle1 q-mt-md q-mb-xs">{{ fullName }}</div>

                  <!-- BOUTON DÉCONNEXION -->
                  <q-btn
                    @click="logout"
                    color="primary"
                    label="Se déconnecter"
                    push
                    size="sm"
                    v-close-popup
                  />

                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      breakpoint="767"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      width="250"
      dark
      class="bg-primary"
    >
      <q-list>
        <q-item-label
          header
          class="text-white"
        >
          Menu de navigation
        </q-item-label>
        <q-item
          v-for="link in links"
          :key="link.id"
          :to="link.path"
          exact
          clickable
          class="text-grey-4"
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
          :to="link.route"
          :icon="link.icon"
          :label="link.text"
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
          id: 1,
          text: 'Accueil',
          icon: 'home',
          path: '/'
        },
        {
          id: 2,
          text: 'Capteurs',
          icon: 'sensors',
          path: '/sensors'
        },
        {
          id: 3,
          text: 'Salles',
          icon: 'meeting_room',
          path: '/class'
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
    ...mapActions('auth', ['disconnectUser']),
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
