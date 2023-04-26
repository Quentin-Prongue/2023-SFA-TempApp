import { api } from 'boot/axios'
import { displayErrorMessage } from 'src/functions/error-message'
import { Loading, LocalStorage } from 'quasar'
import { displaySuccessMessage } from 'src/functions/success-message'

// State : données du magasin
const state = {
  sensors: [],
  sensorsLoaded: false,
  sensorsOfRoomLoaded: false,
  favoritesSensors: [],
  sensorsOfRoom: [],
  currentSensor: null
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
   * @param value si les capteurs sont chargés
   */
  SET_SENSORS_LOADED (state, value) {
    state.sensorsLoaded = value
  },
  /**
   * Défini si les capteurs d'une salle sont chargés
   * @param state
   * @param value si les capteurs sont chargés
   */
  SET_SENSORS_OF_ROOM_LOADED (state, value) {
    state.sensorsOfRoomLoaded = value
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
  },
  /**
   * Défini les capteurs d'une salle
   * @param state
   * @param sensorsOfRoom les capteurs d'une salle
   */
  SET_SENSORS_OF_ROOM (state, sensorsOfRoom) {
    state.sensorsOfRoom = sensorsOfRoom
    // Cache le loading
    Loading.hide()
  },
  /**
   * Change le capteur actuel
   * @param state
   * @param sensor le capteur actuel
   */
  SET_CURRENT_SENSOR (state, sensor) {
    state.currentSensor = sensor
    // Cache le loading
    Loading.hide()
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
  },
  /**
   * Permet d'obtenir tous les capteurs d'une salle
   * @param commit
   * @param rootState
   * @param roomID l'id de la salle
   */
  getSensorsOfRoom ({
    commit,
    rootState
  }, roomID) {
    commit('SET_SENSORS_OF_ROOM_LOADED', false)

    const config = {
      headers: { Authorization: 'Bearer ' + rootState.auth.token }
    }

    // Teste s'il y a des capteurs dans la salle et si l'id de la salle est différent que l'id actuel
    if (state.sensorsOfRoom.length === 0 || (state.sensorsOfRoom.length !== 0 && state.sensorsOfRoom.id !== roomID)) {
      // Affiche un loading
      Loading.show()
    }

    api.get(`salles/${roomID}/capteurs`, config)
      .then(function (response) {
        commit('SET_SENSORS_OF_ROOM', response.data)
        commit('SET_SENSORS_OF_ROOM_LOADED', true)
      })
      .catch(function (error) {
        displayErrorMessage(
          'Erreur lors de la récupération des capteurs de la salle !'
        )
        throw error
      })
  },
  /**
   * Permet d'obtenir le capteur actuel
   * @param commit
   * @param rootState
   * @param sensorID l'id du capteur
   */
  getCurrentSensor ({
    commit,
    rootState
  }, sensorID) {
    const config = {
      headers: { Authorization: 'Bearer ' + rootState.auth.token }
    }

    // Teste s'il y a un capteur actuel et que son id est pareil que l'id du capteur
    if ((state.currentSensor && state.currentSensor.id.toString() !== sensorID) || !state.currentSensor) {
      // Affiche un loading
      Loading.show()
    }

    api.get(`capteurs/${sensorID}/all`, config)
      .then(function (response) {
        commit('SET_CURRENT_SENSOR', response.data)
      })
      .catch(function (error) {
        displayErrorMessage(
          'Erreur lors de la récupération du capteur actuel !'
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
    return state.sensors.filter((sensor) => state.favoritesSensors.includes(sensor.id))
  },
  /**
   * Permet d'obtenir les capteurs d'une salle
   * @param state
   * @returns {*[]} les capteurs d'une salle
   */
  sensorsOfRoom: (state) => {
    // Récupère l'id de chaque capteur de la salle
    const sensorsIdOfRoom = state.sensorsOfRoom.capteurs.map(sensor => sensor.id)

    // Filtre la liste des capteurs et retourne seulement ceux qui ont le même id que ceux de la liste sensorsIdOfRoom
    return state.sensors.filter(sensor => sensorsIdOfRoom.includes(sensor.id))
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
