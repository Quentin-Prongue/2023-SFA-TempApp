<template>
  <q-page padding>
    <!-- SPINNER POUR LES UTILISATEURS -->
    <div
      v-if="!usersLoaded"
      class="q-pa-lg text-center"
    >
      <q-spinner-hourglass color="primary" size="4em"/>
    </div>

    <div v-if="users.length > 0">
      <!-- LISTE DES UTILISATEURS -->
      <q-list bordered separator>
        <q-item v-for="user in users" :key="user.id">
          <!-- AVATAR -->
          <q-item-section avatar>
            <q-avatar>
              <q-img
                :src="user.photo || 'https://picsum.photos/200'"
                basic
                contain>
              </q-img>
            </q-avatar>
          </q-item-section>

          <!-- NOM, PRENOM ET EMAIL DE L'UTILISATEUR -->
          <q-item-section>
            <q-item-label lines="1">
              {{ user.nom + ' ' + user.prenom }}
            </q-item-label>
            <q-item-label caption lines="2">
              {{ user.email }}
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <!-- LABEL ADMINISTRATEUR -->
            <q-item-label caption>{{ user.is_admin ? 'Administrateur' : 'Utilisateur' }}</q-item-label>
            <!-- ICONE EMAIL -->
            <q-icon color="primary" name="email"/>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- SI AUCUN UTILISATEUR -->
    <p v-else>Aucun utilisateur</p>

    <!-- BOUTON FLOTTANT -->
    <q-page-sticky :offset="[18, 18]" position="bottom-right">
      <!-- BOUTON AJOUTER -->
      <q-btn color="primary" direction="up" fab icon="add" @click="addOtherUser">
        <q-tooltip :offset="[0, 0]" class="bg-primary">Ajouter un utilisateur</q-tooltip>
      </q-btn>
    </q-page-sticky>

    <!-- DIALOG POUR AJOUT -->
    <q-dialog v-model="displayAddDialog" transition-hide="jump-down" transition-show="jump-up">
      <q-card :class="{'min-width-350': $q.screen.width < 768, 'min-width-800': $q.screen.width >= 768}">
        <q-card-section>
          <div class="text-h6">Ajout d'un utilisateur</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <!-- FORMULAIRE D'AJOUT -->
          <add-user-form @close="displayAddDialog = false"/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { defineComponent, ref } from 'vue'
import AddUserForm from 'components/User/AddUserForm.vue'

export default defineComponent({
  name: 'UsersPage',
  components: {
    AddUserForm
  },
  setup () {
    return {
      displayAddDialog: ref(false)
    }
  },
  computed: {
    // Mappage des getters
    ...mapGetters('users', ['users']),
    ...mapState('users', ['usersLoaded'])
  },
  methods: {
    // Mappage des actions
    ...mapActions('users', ['getAllUsersApi', 'addUser']),
    /**
     * Permet d'ouvrir le dialog d'ajout
     */
    addOtherUser () {
      // Ouvre le dialog
      this.displayAddDialog = true
    }
  },
  mounted () {
    // Récupère tous les utilisateurs
    this.getAllUsersApi()
  }
})

</script>

<style lang="sass" scoped>
.min-width-350
  min-width: 350px

.min-width-800
  min-width: 800px
</style>
