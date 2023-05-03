import { api } from 'boot/axios'
import { Loading, LocalStorage } from 'quasar'
import { displayErrorMessage } from 'src/functions/error-message'
import { displaySuccessMessage } from 'src/functions/success-message'
import { displayLoadingMessage } from 'src/functions/loading-message'

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
   * @param state
   * @param user l'utilisateur
   */
  SET_USER (state, user) {
    state.user = user
  },
  /**
   * Assigne le token
   * @param state
   * @param token le token
   */
  SET_TOKEN (state, token) {
    state.token = token
  },
  /**
   * Modifie l'utilisateur
   * @param state
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
  /**
   * Permet de connecter un utilisateur
   * @param commit
   * @param dispatch
   * @param payload contient les données
   */
  connectUser ({
    commit,
    dispatch
  }, payload) {
    // Affiche un loading
    displayLoadingMessage('Connexion en cours')

    api.post('/login', payload)
      .then(function (response) {
        dispatch('setUser', response.data)
        // Affiche un message de succès
        displaySuccessMessage(
          'Bienvenue ' + response.data.user.prenom
        )
      })
      .catch(function (error) {
        Loading.hide()
        // Affiche un message d'erreur
        displayErrorMessage(
          'Connexion impossible !',
          Object.values(error.response.data)
        )
        throw error
      })
  },
  /**
   * Déifni l'utilisateur
   * @param commit
   * @param dispatch
   * @param state
   * @param data contient les données
   */
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
  /**
   * Permet de déconnecter l'utilisateur
   * @param commit
   * @param state
   */
  disconnectUser ({
    commit,
    state
  }) {
    // Affiche un loading
    displayLoadingMessage('Déconnexion en cours')

    const that = this
    // Configuration du header avec token
    const config = {
      headers: { Authorization: 'Bearer ' + state.token }
    }

    // Déconnexion de l'API
    api.post('/logout', {}, config)
      .catch(function (error) {
        // Affiche un message d'erreur
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
  /**
   * Permet de modifier l'utilisateur
   * @param commit
   * @param state
   * @param payload contient les données
   */
  editUser ({
    commit,
    state
  }, payload) {
    // Affiche un loading
    displayLoadingMessage('Application des modifications en cours')

    const config = {
      headers: { Authorization: 'Bearer ' + state.token }
    }

    // Appel à l'API pour modifier l'utilisateur
    api.put('/updateme', payload, config)
      .then(function (response) {
        payload = response.data
        commit('EDIT_USER', payload)
        // Affiche un message de succès
        displaySuccessMessage(
          'Modifications appliquées avec succès'
        )
      })
      .catch(function (error) {
        // Affiche un message d'erreur
        displayErrorMessage(
          'Erreur lors de l\'application des modifications',
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
const getters = {
  /**
   * Permet de savoir si l'utilisateur est administrateur
   * @param state
   * @returns {*} un booléen si l'utilisateur est administrateur
   */
  isAdmin: (state) => {
    if (state.user) {
      // Retourne la valeur convertie en booléen (!!)
      return !!state.user.is_admin
    }
  }
}

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
