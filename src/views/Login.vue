<template>
  <div class="home">
    <div>
      <h1 class="subtitle">Login</h1>
      <br />
      <header>
        <div class="wrapper"></div>
      </header>
      <div class="login">
        <Panel class="subtitle" header="Login">
          <template #header>
            <span class="header-text">Login</span>
          </template>
          <form v-on:submit.prevent="Login">
            <!-- prevent reload when submit button is pressed -->
            <br />

            <br />
            <label class="labels">Username</label>
            <div class="field">
              <div class="control">
                <!-- <input class="input" type="text" v-model="customerid" required /> -->
                <InputText class="input" type="text" v-model="username" required />
              </div>
            </div>
            <label class="labels">Password</label>
            <div class="field">
              <div class="control">
                <InputText class="input" type="password" v-model="password" required />
              </div>
              <br />
              <Button @click="Login()" severity="success">Login</Button>
              <!-- <div>{csrf_token}</div> -->
            </div>
          </form>
        </Panel>
      </div>
    </div>
  </div>
</template>

<script>
const API_URL = "http://127.0.0.1:8000";
import InputText from "primevue/inputtext";
import Panel from "primevue/panel";
import axios from "axios";

export default {
  components: {
    Panel,
    InputText,
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async Login() {
      if (this.username && this.password) {
        console.log("submitting credentials!!!", this.username, this.password);
        const formData = new FormData();
        formData.append("username", this.username);
        formData.append("password", this.password);
        await axios
          .post(API_URL + "/api/login", formData, {})
          .then((response) => {
            var accessToken = response.data.access_token;
            localStorage.setItem("access_token", accessToken);
            this.$router.push({
              name: "home",
              path: "/home",
            });
          })
          .catch((error) => {
            console.log(error);
            alert("Invalid, Wrong Username or Password");
          });
      } else {
        alert("Please enter the username and password.");
      }
    },
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
          this.$router.push({
            name: "home",
            path: "/home",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style lang="scss">
.login {
  max-width: 500px;
  min-height: 80vh;
  display: flex;
  flex-wrap: wrap;
}

.home {
  margin-top: 100px;
  min-height: 100vh;
}

.h1 {
  font-size: px;
}

.label {
  color: rgb(0, 0, 0);
}

.card {
  margin-bottom: 20px;
}

.done {
  opacity: 0.3;
}

.header-text {
  width: 200px;
  font-size: 20px;
}
</style>
