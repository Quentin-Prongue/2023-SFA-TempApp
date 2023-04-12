// Importation du plugin Dialog de Quasar
import { Notify } from 'quasar'

// Exporte notre fonction
export function displaySuccessMessage (message) {
  // Crée et affiche une notification
  Notify.create({
    type: 'positive', // Type de la notification
    icon: 'done', // Icône de la notification
    message, // Message de la notification
    html: true // Html utilisable dans le message
  })
}
