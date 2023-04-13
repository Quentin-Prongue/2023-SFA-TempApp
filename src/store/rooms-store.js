import { api } from 'boot/axios'
import { displayErrorMessage } from 'src/functions/error-message'

// State : données du magasin
const state = {
  rooms: [],
  roomsLoaded: false
}

/*
Mutations : méthode qui manipule les données
Les mutations ne peuvent pas être asynchrones !!!
 */
const mutations = {
  SET_ROOMS (state, rooms) {
    state.rooms = rooms
  },
  SET_ROOMS_LOADED (state, valeur) {
    state.roomsLoaded = valeur
  }
}
/*
Actions : méthodes du magasin qui font appel aux mutations.
Elles peuvent être asynchrones !
 */
const actions = {
  getAllRoomsApi ({
    commit,
    rootState
  }) {
    commit('SET_ROOMS_LOADED', false)
    const config = {
      headers: { Authorization: 'Bearer ' + rootState.auth.token }
    }
    api.get('/salles', config)
      .then(function (response) {
        commit('SET_ROOMS', response.data)
        commit('SET_ROOMS_LOADED', true)
      })
      .catch(function (error) {
        displayErrorMessage(
          'Erreur lors de la récupération des salles !'
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
  // Prend le state comme 1er paramètre
  rooms: (state) => {
    return state.rooms
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
