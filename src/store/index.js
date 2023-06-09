import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

// Récupère les magasins nécessaires
import sensors from './sensors-store'
import auth from './auth-store'
import rooms from './rooms-store'
import users from './users-store'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  return createStore({
    modules: {
      sensors,
      rooms,
      auth,
      users
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })
})
