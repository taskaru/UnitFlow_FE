import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/login/index.vue';
import Home from '../pages/home/index.vue';
import Reports from '../pages/reports/index.vue';
import Tasks from '../pages/tasks/index.vue';
import BookMarks from '../pages/bookmarks/index.vue';
import MyPage from '../pages/mypage/index.vue';

const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: Login,
  },
  {
    path: '/home',
    name: 'Homepage',
    component: Home,
  },
  {
    path: '/reports',
    name: 'ReportsPage',
    component: Reports,
  },
  {
    path: '/tasks',
    name: 'TasksPage',
    component: Tasks,
  },
  {
    path: '/book-marks',
    name: 'BookMarks',
    component: BookMarks,
  },
  {
    path: '/my-page',
    name: 'MyPage',
    component: MyPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
