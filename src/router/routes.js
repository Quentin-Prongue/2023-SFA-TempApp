const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        // Route de connexion
        path: '/login',
        component: () => import('pages/ConnexionPage.vue')
      },
      {
        // Route de l'accueil
        path: '',
        component: () => import('pages/SensorsPage.vue')
      },
      {
        // Route des détails d'un capteur
        path: '/sensor/:id',
        component: () => import('pages/SensorsDetailsPage.vue')
      },
      {
        // Route des salles
        path: '/rooms',
        component: () => import('pages/RoomsPage.vue')
      },
      {
        // Route par salle
        path: '/rooms/:roomName',
        component: () => import('pages/RoomsPage.vue')
      },
      {
        // Route des utilisateurs
        path: 'users',
        component: () => import('pages/UsersPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
