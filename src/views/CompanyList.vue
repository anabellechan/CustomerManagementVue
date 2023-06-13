<template>
  <header>
    <div class="wrapper">
      <div column>
        <form @submit.prevent="SubmitFuzzy($event.target.value)">
          <input type="input" v-model="search" placeholder="Search Company..." />
        </form>
        <table class="table" id="myTable">
          <thead>
            <tr>
              <th>Companies, Click to View</th>
            </tr>
          </thead>
          <tbody>
            <tr class="info" v-for="x in filteredProducts" :key="x.company">
              <option @click="SubmitEvent($event.target.value)" :value="x.company">{{ x.company }}</option>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </header>

  <RouterView />
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import "vue-search-input/dist/styles.css";
import { ref } from "vue";
let input = ref("");

const API_URL = "http://127.0.0.1:8000";
import axios from "axios";
export default {
  name: "Home",
  data() {
    // like your usestate
    return {
      // x: this.company,
      customers: [],
      company: [],
      companysearch: [],
      search: "",
      id: this.$route.params.type,
      loggedin: "",
    };
  },
  mounted() {
    this.token = localStorage.getItem("access_token");
    axios
      .get(API_URL + "/api/my_protected_view", {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((response) => {
        const { loggedin, message } = response.data;
        if (loggedin) {
          this.loggedin = loggedin;
          console.log("You are logged in");
        } else {
          alert("User is not logged in. Please login.");
          this.$router.push({
            name: "login",
            path: "/",
          });
        }
      })
      .catch((error) => {
        alert(error);
      });
    this.getCustomers();
  },
  computed: {
    filteredProducts() {
      return this.customers.filter((p) => {
        return p.company.toLowerCase().indexOf(this.search.toLowerCase()) != -1;
      });
    },
  },
  methods: {
    // function to get the list of customers
    getCustomers() {
      axios({
        method: "get",
        url: API_URL + "/api/customer/company",
      }).then((response) => ((this.customers = response.data)));
    },
    SubmitEvent(value) {
      alert(value);
      this.$router.push({
        name: "company",
        path: "/api/companysearch/",
        params: {
          id: value,
        },
      });
      location.replace("/api/companysearch/" + value);
    },
    SubmitFuzzy() {
      alert(this.search);
      this.$router.push({
        name: "companysearch",
        path: "/api/companysearch/",
        params: {
          id: this.search,
        },
      });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
.header {
  margin-top: auto;
}

.wrapper {
  margin-top: auto;
}

.navbar {
  font-size: 10px;
}
.info {
  line-height: 0.5;
  max-height: 100vh;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 100px;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
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
    width: 350px;
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
    /* margin: 0 auto 10px auto;
    padding: 10px 20px; */
    font-size: 10px;
    color: rgb(255, 255, 255);
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  }

  .fruit {
    background-color: rgb(255, 255, 255);
    font-size: 5px;
    cursor: pointer;
  }

  .error {
    background-color: tomato;
  }
}
</style>
