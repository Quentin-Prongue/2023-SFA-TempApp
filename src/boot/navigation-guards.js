import { LocalStorage } from 'quasar'
import { displayErrorMessage } from 'src/functions/error-message'

// Récupère l'objet router représentant Vue router
export default ({ router }) => {
  // Avant de rediriger le visiteur
  router.beforeEach((to, from, next) => {
    // Récupère l'utilisateur depuis le localStorage
    const user = LocalStorage.getItem('user')
    // Si PAS connecté et ne vas par vers /login, on force la redirection
    if (!user && to.path !== '/login') {
      // Affiche un message d'erreur uniquement si utilisateur tente d'accéder
      // à une autre page après avoir été redirigé vers la connexion une 1re fois.
      if (from.path === '/login') {
        displayErrorMessage('Page protégée, connexion requise !')
      }
      next('/login') // Redirige vers /login
    } else {
      next() // Continue la navigation normalement
    }
  })
}
