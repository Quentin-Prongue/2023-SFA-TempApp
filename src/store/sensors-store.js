import { api } from 'boot/axios'
import { afficherMessageErreur } from 'src/functions/message-erreur'

// State : données du magasin
const state = {
  sensors: [],
  sensorsLoaded: false
}

/*
Mutations : méthode qui manipulent les données
Les mutations ne peuvent pas être asynchrones !!!
 */
const mutations = {
  SET_SENSORS (state, sensors) {
    state.sensors = sensors
  },
  SET_SENSORS_LOADED (state, valeur) {
    state.sensorsLoaded = valeur
  }
}
/*
Actions : méthodes du magasin qui font appel aux mutations.
Elles peuvent être asynchrones !
 */
const actions = {
  getAllSensorsApi ({
    commit,
    rootState
  }) {
    commit('SET_SENSORS_LOADED', false)
    const config = {
      headers: { Authorization: 'Bearer ' + rootState.auth.token }
    }
    api.get('/capteurs', config)
      .then(function (response) {
        commit('SET_SENSORS', response.data)
        commit('SET_SENSORS_LOADED', true)
      })
      .catch(function (error) {
        afficherMessageErreur(
          'Erreur lors de la récupération des capteurs !'
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
  sensors: (state) => {
    return state.sensors
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
