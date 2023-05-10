import { LocalStorage } from 'quasar'
import { displayErrorMessage } from 'src/functions/error-message'

// Récupère l'objet router représentant Vue router
export default ({ router }) => {
  // Avant de rediriger le visiteur
  router.beforeEach((to, from, next) => {
    // Récupère l'utilisateur depuis le localStorage
    const user = LocalStorage.getItem('user')
    // Vérifie si l'utilisateur est connecté
    if (!user && to.path !== '/login') {
      // Affiche un message d'erreur uniquement si utilisateur tente d'accéder
      // à une autre page après avoir été redirigé vers la connexion une 1re fois.
      if (from.path === '/login') {
        displayErrorMessage('Page protégée, connexion requise !')
      }
      next('/login') // Redirige vers /login
    } else {
      // Vérifie si l'utilisateur est administrateur
      const isAdmin = user && user.is_admin

      // Vérifie si l'utilisateur tente d'accéder à la page "/users"
      if (to.path === '/users' && !isAdmin) {
        // Affiche un message d'erreur
        displayErrorMessage('Page réservée aux administrateurs, accès non autorisé !')
        next('/') // Redirige vers une autre page, par exemple la page d'accueil
      } else {
        next() // Continue la navigation normalement
      }
    }
  })
}
