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
        <q-btn
          v-if="!user"
          to="/login"
          flat
          icon-right="account_circle"
          label="Se connecter"
          class="absolute-right"
        />

        <q-btn
          v-else
          @click="disconnectUser"
          flat
          icon-right="account_circle"
          label="Se déconnecter"
          class="absolute-right"
        />
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
    ...mapState('auth', ['user'])
  },
  methods: {
    ...mapActions('auth', ['disconnectUser'])
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
