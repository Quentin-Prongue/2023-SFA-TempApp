import { api } from 'boot/axios'
import { displayErrorMessage } from 'src/functions/error-message'
import { displaySuccessMessage } from 'src/functions/success-message'

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
  /**
   * Défini les salles
   * @param state
   * @param rooms les salles
   */
  SET_ROOMS (state, rooms) {
    state.rooms = rooms
  },
  /**
   * Défini si les salles sont chargées
   * @param state
   * @param valeur si elles sont chargées
   */
  SET_ROOMS_LOADED (state, valeur) {
    state.roomsLoaded = valeur
  }
}
/*
Actions : méthodes du magasin qui font appel aux mutations.
Elles peuvent être asynchrones !
 */
const actions = {
  /**
   * Récupère toutes les salles depuis l'api
   * @param commit
   * @param rootState
   */
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
          'Erreur lors de la récupération des salles !',
          Object.values(error.response.data)
        )
        throw error
      })
  },
  /**
   * Permet de modifier un capteur
   * @param dispatch
   * @param rootState
   * @param payload payload qui contient les données
   */
  editRoom ({
    dispatch,
    rootState
  }, payload) {
    const config = {
      headers: { Authorization: 'Bearer ' + rootState.auth.token }
    }

    // Récupère et supprime l'id de la salle du payload
    const {
      roomID,
      ...newPayload
    } = payload

    api.put(`salles/${roomID}`, newPayload, config)
      .then(function (response) {
        dispatch('getAllRoomsApi')
        displaySuccessMessage('La salle ' + newPayload.nom + ' a bien été modifiée')
        return response
      })
      .catch(function (error) {
        displayErrorMessage(
          'Erreur lors de la modification de la salle ' + newPayload.nom + ' !',
          Object.values(error.response.data)
        )
        throw error
      })
  },
  /**
   * Permet de supprimer une salle
   * @param dispatch
   * @param rootState
   * @param roomID l'id de la salle
   */
  deleteRoom ({
    dispatch,
    rootState
  }, roomID) {
    const config = {
      headers: { Authorization: 'Bearer ' + rootState.auth.token }
    }

    api.delete(`salles/${roomID}`, config)
      .then(function (response) {
        dispatch('getAllRoomsApi')
        displaySuccessMessage('La salle a bien été supprimée')
        return response
      })
      .catch(function (error) {
        displayErrorMessage(
          'Erreur lors de la suppression de la salle !',
          Object.values(error.response.data)
        )
        throw error
      })
  },
  /**
   * Permet d'ajouter une salle
   * @param dispatch
   * @param rootState
   * @param payload le payload
   */
  addRoom ({
    dispatch,
    rootState
  }, payload) {
    const config = {
      headers: { Authorization: 'Bearer ' + rootState.auth.token }
    }

    api.post('salles', payload, config)
      .then(function (response) {
        dispatch('getAllRoomsApi')
        displaySuccessMessage('La salle ' + payload.nom + ' a bien été ajoutée')
        return response
      })
      .catch(function (error) {
        displayErrorMessage(
          'Erreur lors de l\'ajout de la salle ' + payload.nom + ' !',
          Object.values(error.response.data)
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
