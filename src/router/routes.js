const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        // Route de l'accueil
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
      {
        // Route de connexion
        path: '/login',
        component: () => import('pages/ConnexionPage.vue')
      },
      {
        // Route des capteurs
        path: '/sensors',
        component: () => import('pages/SensorsPage.vue')
      },
      {
        // Route des salles
        path: '/rooms',
        component: () => import('pages/RoomsPage.vue')
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
