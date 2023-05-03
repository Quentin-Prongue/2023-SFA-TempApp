import { api } from 'boot/axios'
import { displayErrorMessage } from 'src/functions/error-message'
import { displaySuccessMessage } from 'src/functions/success-message'

// State : données du magasin
const state = {
  users: [],
  usersLoaded: false
}

/*
Mutations : méthode qui manipulent les données
Les mutations ne peuvent pas être asynchrones !!!
 */
const mutations = {
  /**
   * Défini les utilisateurs
   * @param state
   * @param users les utilisateurs
   */
  SET_USERS (state, users) {
    state.users = users
  },
  /**
   * Défini si les utilisateurs sont chargés
   * @param state
   * @param value si les utilisateurs sont chargés
   */
  SET_USERS_LOADED (state, value) {
    state.usersLoaded = value
  }
}
/*
Actions : méthodes du magasin qui font appel aux mutations.
Elles peuvent être asynchrones !
 */
const actions = {
  /**
   * Permet d'obtenir tous les utilisateurs depuis l'API
   * @param commit
   * @param rootState
   */
  getAllUsersApi ({
    commit,
    rootState
  }) {
    commit('SET_USERS_LOADED', false)

    const config = {
      headers: { Authorization: 'Bearer ' + rootState.auth.token }
    }

    api.get('/utilisateurs', config)
      .then(function (response) {
        commit('SET_USERS', response.data)
        commit('SET_USERS_LOADED', true)
      })
      .catch(function (error) {
        displayErrorMessage(
          'Erreur lors de la récupération des utilisateurs !'
        )
        throw error
      })
  },
  /**
   * Permet d'ajouter un utilisateur
   * @param dispatch
   * @param rootState
   * @param payload le payload
   */
  addUser ({
    dispatch,
    rootState
  }, payload) {
    const config = {
      headers: { Authorization: 'Bearer ' + rootState.auth.token }
    }

    api.post('newuser', payload, config)
      .then(function (response) {
        dispatch('getAllUsersApi')
        displaySuccessMessage('L\'utilisateur ' + payload.prenom + ' a bien été ajouté')
        return response
      })
      .catch(function (error) {
        displayErrorMessage(
          'Erreur lors de l\'ajout de l\'utilisateur' + payload.prenom + ' !'
        )
        throw error
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
   * Permet d'obtenir les utilisateurs
   * @param state
   * @returns {[]} les utilisateurs
   */
  users: (state) => {
    return state.users
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
