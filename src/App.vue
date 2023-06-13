<template>
  <div class="center">
    <Menubar :model="items" class="center" v-if="!isLoginPage">
      <template #start>
        <img alt="logo" src="@/assets/logo.svg" width="100" height="100" class="mr-2" />
      </template>
      <template #end> <Button @click="Logout()" class="center" severity="help">Logout</Button></template>
    </Menubar>
  </div>

  <RouterView />
</template>

<script setup>
import Menubar from "primevue/menubar";
import { RouterView } from "vue-router";
import "vue-search-input/dist/styles.css";
import { ref } from "vue";

const items = ref([
  { label: "Home", to: "/home", icon: "pi pi-fw pi-plus" },
  { label: "Import a CSV", to: "/about", icon: "pi pi-fw pi-trash" },
  { label: "Company List", to: "/companylist" },
]);
</script>

<script>
const API_URL = "http://127.0.0.1:8000";
import axios from "axios";
import VueCookies from "vue-cookies";
export default {
  name: "Home",
  components: {
    Menubar,
  },
  data() {
    return {
      customers: [],
      company: [],
      companysearch: [],
      search: "",
      id: this.$route.params.type,
    };
  },
  mounted() {},
  methods: {
    async Logout() {
      await axios
        .post(API_URL + "/api/logout")
        .then((response) => {
          localStorage.removeItem("access_token");
          alert("User is now logged out.");
          this.$router.push({
            name: "login",
            path: "/",
          });
        })
        .catch((error) => {
          // Handle logout errors
          console.log(error.response.data.message);
          alert("Logout failed");
        });
    },
  },
  computed: {
    isLoginPage() {
      // Add any logic to determine if it's the login page
      return this.$route.name === "login";
    },
    filteredProducts() {
      return this.customers.filter((p, i) => {
        return p.company.toLowerCase().indexOf(this.search.toLowerCase()) != -1;
      });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");

.center {
  display: stretch;
  justify-content: left;
  max-height: 100px;
  font-size: 20px;
}

.info {
  line-height: 0.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: "Montserrat", sans-serif;
  }

  body {
    padding: 20px;
    min-height: 100vh;
    background-color: rgb(234, 242, 255);
  }

  input {
    display: block;
    margin: 20px auto;
    padding: 10px 10px;
    background: white url("assets/search-icon.svg") no-repeat 15px center;
    background-size: 15px 15px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  }

  .item {
    width: 50px;
    font-size: 10px;
    color: rgb(255, 255, 255);
    border-radius: 5px;
    box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  }
}
</style>
