// Importation du plugin Loading de Quasar
import { Loading, QSpinnerCube } from 'quasar'

// Exporte notre fonction
export function displayLoadingMessage (message) {
  // Crée et affiche un loading
  Loading.show({
    spinner: QSpinnerCube,
    message
  })
}
