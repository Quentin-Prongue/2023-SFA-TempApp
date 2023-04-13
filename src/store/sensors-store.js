import { api } from 'boot/axios'
import { displayErrorMessage } from 'src/functions/error-message'
import { LocalStorage } from 'quasar'
import { displaySuccessMessage } from 'src/functions/success-message'

// State : données du magasin
const state = {
  sensors: [],
  sensorsLoaded: false,
  favoritesSensors: []
}

/*
Mutations : méthode qui manipulent les données
Les mutations ne peuvent pas être asynchrones !!!
 */
const mutations = {
  /**
   * Défini les capteurs
   * @param state
   * @param sensors les capteurs
   */
  SET_SENSORS (state, sensors) {
    state.sensors = sensors
  },
  /**
   * Défini si les capteurs sont chargés
   * @param state
   * @param valeur si les capteurs sont chargés
   */
  SET_SENSORS_LOADED (state, valeur) {
    state.sensorsLoaded = valeur
  },
  /**
   * Défini les capteurs favoris
   * @param state
   * @param favoritesSensors les capteurs favoris
   */
  SET_FAVORITES_SENSORS (state, favoritesSensors) {
    state.favoritesSensors = favoritesSensors
  },
  /**
   * Ajoute un capteur dans les capteurs favoris
   * @param state
   * @param sensorID l'id du capteur
   */
  ADD_SENSOR_TO_FAVORITES (state, sensorID) {
    // Ajoute le capteur dans la liste des capteurs favoris
    state.favoritesSensors.push(sensorID)
    // Met à jour les capteurs favoris dans le LocalStorage
    LocalStorage.set('favoritesSensors', state.favoritesSensors)
  },
  /**
   * Supprime un capteur des capteurs favoris
   * @param state
   * @param sensorID l'id du capteur
   */
  REMOVE_SENSOR_FROM_FAVORITES (state, sensorID) {
    // Supprime le capteur de la liste des capteurs favoris
    state.favoritesSensors.splice(state.favoritesSensors.indexOf(sensorID), 1)
    // Met à jour les capteurs favoris dans le LocalStorage
    LocalStorage.set('favoritesSensors', state.favoritesSensors)
  }
}
/*
Actions : méthodes du magasin qui font appel aux mutations.
Elles peuvent être asynchrones !
 */
const actions = {
  /**
   * Permet d'obtenir tous les capteurs depuis l'API
   * @param commit
   * @param rootState
   */
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
        displayErrorMessage(
          'Erreur lors de la récupération des capteurs !'
        )
        throw error
      })
  },
  /**
   * Défini les capteurs favoris
   * @param commit
   * @param favoritesSensors les capteurs favoris
   */
  setFavoritesSensors ({
    commit
  }, favoritesSensors) {
    commit('SET_FAVORITES_SENSORS', favoritesSensors)
  },
  /**
   * Ajoute un capteur dans les capteurs favoris
   * @param commit
   * @param state
   * @param sensorID l'id du capteur
   */
  addSensorToFavorites ({
    commit,
    state
  }, sensorID) {
    // Teste si le capteur n'est pas déjà dans les favoris
    if (!state.favoritesSensors.includes(sensorID)) {
      commit('ADD_SENSOR_TO_FAVORITES', sensorID)
      // Récupère le nom du capteur
      const sensorName = state.sensors.find(sensor => sensor.id === sensorID).nom
      displaySuccessMessage('Le capteur ' + sensorName + ' a bien été ajouté aux favoris')
    }
  },
  /**
   * Supprime un capteur des capteurs favoris
   * @param commit
   * @param state
   * @param sensorID l'id du capteur
   */
  removeSensorFromFavorites ({
    commit,
    state
  }, sensorID) {
    // Teste si le capteur est dans la liste des capteurs favoris
    if (state.favoritesSensors.includes(sensorID)) {
      commit('REMOVE_SENSOR_FROM_FAVORITES', sensorID)
      // Récupère le nom du capteur
      const sensorName = state.sensors.find(sensor => sensor.id === sensorID).nom
      displaySuccessMessage('Le capteur ' + sensorName + ' a bien été supprimé des favoris')
    }
  }
}

/*
Getters : retourne les données du magasin
Fonctionne comme les propriétés calculées
Sert à calculer, trier, filtrer ou formater les données
 */
const getters = {
  /**
   * Permet d'obtenir les capteurs
   * @param state
   * @returns {[]} les capteurs
   */
  sensors: (state) => {
    return state.sensors
  },
  /**
   * Permet d'obtenir les capteurs favoris
   * @param state
   * @returns {[]} les capteurs favoris
   */
  favoritesSensors: (state) => {
    return state.favoritesSensors
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
