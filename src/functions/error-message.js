// Importation du plugin Dialog de Quasar
import { Notify } from 'quasar'

// Exporte notre fonction
export function displayErrorMessage (message, erreurs) {
  // Si un tableau d'erreurs est envoyé, crée une liste <ul> avec les erreurs
  if (Array.isArray(erreurs) && erreurs.length) {
    message += '<ul><li>' + erreurs.join('</li><li>') + '</li></ul>'
  }
  // Crée et affiche une notification
  Notify.create({
    type: 'negative', // Type de la notification
    icon: 'error', // Icône de la notification
    message, // Message de la notification
    html: true, // Html utilisable dans le message
    actions: [
      {
        label: 'OK',
        color: 'white'
      }
    ]
  })
}
