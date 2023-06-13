import axios from 'axios';
import VueCookies from 'vue-cookies';

axios.defaults.headers.common['X-CSRFToken'] = VueCookies.get("csrftoken");

export default axios;

//Use import axios from '@/path/to/axiosConfig.js';