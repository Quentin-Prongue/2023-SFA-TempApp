import { api } from 'boot/axios'
import { displayErrorMessage } from 'src/functions/error-message'
import { Loading, LocalStorage, Notify, QSpinnerCube } from 'quasar'

// State : données du magasin
const state = {
  user: null,
  token: null
}

/*
Mutations : méthode qui manipule les données
Les mutations ne peuvent pas être asynchrones !!!
 */
const mutations = {
  /**
   * Assigne l'utilisateur
   * @param state l'état
   * @param user l'utilisateur
   */
  SET_USER (state, user) {
    state.user = user
  },
  /**
   * Assigne le token
   * @param state l'état
   * @param token le token
   */
  SET_TOKEN (state, token) {
    state.token = token
  },
  /**
   * Modifie l'utilisateur
   * @param state l'état
   * @param payload le payload
   */
  EDIT_USER (state, payload) {
    state.user = structuredClone(payload)
    LocalStorage.set('user', payload)
  }
}

/*
Actions : méthodes du magasin qui font appel aux mutations.
Elles peuvent être asynchrones !
 */
const actions = {
  connectUser ({
    commit,
    dispatch
  }, payload) {
    Loading.show({
      spinner: QSpinnerCube,
      message: 'Connexion en cours'
    })
    api.post('/login', payload)
      .then(function (response) {
        dispatch('setUser', response.data)
      })
      .catch(function (error) {
        Loading.hide()
        displayErrorMessage(
          'Connexion impossible !',
          Object.values(error.response.data)
        )
        throw error
      })
  },
  setUser ({
    commit,
    dispatch,
    state
  }, data) {
    // Sauvegarde, commite, les données dans le magasin
    commit('SET_USER', data.user)
    commit('SET_TOKEN', data.access_token)
    // Sauvegarde les données de l'utilisateur dans le localStorage
    LocalStorage.set('user', state.user)
    LocalStorage.set('token', state.token)
    this.$router.push('/')
    // Cache la fenêtre de chargement
    Loading.hide()
  },
  disconnectUser ({
    commit,
    state
  }) {
    Loading.show({
      spinner: QSpinnerCube,
      message: 'Déconnexion en cours'
    })
    const that = this
    // Configuration du header avec token
    const config = {
      headers: { Authorization: 'Bearer ' + state.token }
    }
    // Déconnexion de l'API
    api.post('/logout', {}, config)
      .catch(function (error) {
        displayErrorMessage(
          'Erreur lors de la déconnexion'
        )
        throw error
      })
      .finally(function () {
        // Réinitialise user et token
        commit('SET_USER', null)
        commit('SET_TOKEN', null)
        // Vide le localStorage
        LocalStorage.clear()
        // Redirige l'utilisateur vers la page de connexion
        that.$router.push('/login')
        // location.reload() // recharge la page du navigateur
        Loading.hide()
      })
  },
  editUserPassword ({
    commit,
    state
  }, payload) {
    Loading.show({
      spinner: QSpinnerCube,
      message: 'Changement du mot de passe en cours'
    })
    const config = {
      headers: { Authorization: 'Bearer ' + state.token }
    }
    // Appel à l'API pour changer le mot de passe
    api.put('/updateme', payload, config)
      .then(function (response) {
        payload = response.data
        commit('EDIT_USER', payload)
        Notify.create({
          type: 'positive',
          message: 'Mot de passe modifié avec succès'
        })
      })
      .catch(function (error) {
        Loading.hide()
        displayErrorMessage(
          'Erreur lors du changement de mot de passe',
          Object.values(error.response.data)
        )
        throw error
      })
      .finally(function () {
        Loading.hide()
      })
  }
}

/*
  Getters : retourne les données du magasin
  Fonctionne comme les propriétés calculées
  Sert à calculer, trier, filtrer ou formater les données
   */
const getters = {}

/*
  Exporte les constantes, variables du fichier
  On pourra ainsi les récupérer, les importer dans un autre fichier JS.

  namespace: true, ajoute un namespace à notre objet retourné.
   */
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
