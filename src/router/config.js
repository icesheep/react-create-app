import Page from '../js/audio';
import Home from '../js/home';
import Play from '../js/playlist';
export default {
  menu: [{
    path: '/audio',
    component: Page,
  },{
    path: '/',
    component: Home,
  },{
    path: '/play',
    component: Play,
  },]
}