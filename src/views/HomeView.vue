<template>
  <TheWelcome />
  <div class="home">
    <div>
      <h1 class="subtitle">Customer Details</h1>
      <br />
      <header>
        <div class="wrapper">
          <div column>
            <!-- <form @submit.prevent="SubmitFuzzy($event.target.value)">
              <input type="input" v-model="search" placeholder="Search Company..." required />
            </form> -->
            <form @submit.prevent="SubmitFuzzy($event.target.value)">
              <div class="field">
                <div class="control">
                  <InputText class="input" type="text" v-model="search" placeholder="Search Company..." required />
                </div>
              </div>
            </form>
          </div>
        </div>
      </header>
      <div class="table">
        <n>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</n>
        <div><Button @click="DeleteAll()" severity="success">Delete All</Button></div>
        <DataTable :value="formattedCustomers" sortField="index" :sortOrder="1" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
          <Column field="index" header="Index" :sortable="true" sortable style="width: 50%"></Column>
          <Column field="customerid" header="Customer ID" :sortable="true" sortable style="width: 50%"></Column>
          <Column field="firstname" header="First Name" sortable style="width: 50%"></Column>
          <Column field="lastname" header="LastName" sortable style="width: 50%"></Column>
          <Column field="company" header="Company" sortable style="width: 50%"></Column>
          <Column field="city" header="City" sortable style="width: 50"></Column>
          <Column field="country" header="Country" sortable style="width: 50"></Column>
          <Column field="phone1" header="Phone 1" sortable style="width: 50%"></Column>
          <Column field="phone2" header="Phone 2" sortable style="width: 50%"></Column>
          <Column field="email" header="Email" sortable style="width: 50%"></Column>
          <Column field="subscriptiondate" header="Subscription Date" sortable style="width: 50%"></Column>
          <Column field="website" header="Website" sortable style="width: 50%"></Column>
        </DataTable>
      </div>
      <div class="addcustomer">
        <Panel class="subtitle" header="Add a Customer" toggleable>
          <template #header>
            <span class="header-text">Add a Customer</span>
          </template>
          <form v-on:submit.prevent="addCustomer">
            <br />

            <br />
            <label class="labels">Customer ID</label>
            <div class="field">
              <div class="control">
                <!-- <input class="input" type="text" v-model="customerid" required /> -->
                <InputText class="input" type="text" v-model="customerid" required />
              </div>
            </div>
            <label class="labels">First Name</label>
            <div class="field">
              <div class="control">
                <InputText class="input" type="text" v-model="firstname" required />
              </div>
            </div>
            <label class="labels">Last Name</label>
            <div class="field">
              <div class="control">
                <InputText class="input" type="text" v-model="lastname" required />
              </div>
            </div>
            <label class="labels">Company</label>
            <div class="field">
              <div class="control">
                <InputText class="input" type="text" v-model="company" required />
              </div>
            </div>
            <label class="labels">City</label>
            <div class="field">
              <div class="control">
                <InputText class="input" type="text" v-model="city" required />
              </div>
            </div>
            <label class="labels">Country</label>
            <div class="field">
              <div class="control">
                <InputText class="input" type="text" v-model="country" required />
              </div>
            </div>
            <label class="labels">Email</label>
            <div class="field">
              <div class="control">
                <InputText class="input" type="email" v-model="email" required />
              </div>
            </div>
            <label class="labels">Subscription Date</label>
            <div class="field">
              <div class="control">
                <InputText class="input" type="date" v-model="subscriptiondate" required />
              </div>
            </div>
            <label class="labels">Company URL: (https://)</label>
            <div class="field">
              <div class="control">
                <InputText class="input" placeholder="https://example.com" type="url" pattern="https://.*" v-model="website" required />
              </div>
            </div>
            <label class="labels">Phone 1</label>
            <div class="field">
              <div class="control">
                <InputText class="input" type="text" v-model="phone1" required />
              </div>
            </div>
            <label class="labels">Phone 2</label>
            <div class="field">
              <div class="control">
                <InputText class="input" type="text" v-model="phone2" required />
              </div>
            </div>

            <div class="field">
              <div class="control">
                <button class="button is-link">Submit</button>
              </div>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Panel from "primevue/panel";
import TheWelcome from "../components/TheWelcome.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useCookies } from "vue3-cookies";
import VueCookies from "vue-cookies";
const API_URL = "http://127.0.0.1:8000";
import axios from "axios";

export default {
  components: {
    DataTable,
    Column,
    Panel,
    InputText,
  },
  name: "Home",
  data() {
    // like your usestate
    return {
      customers: [],
      message: "",
      index: "",
      loggedin: "",
      headers: {},
    };
  },
  computed: {
    formattedCustomers() {
      // Modify the customers array to include an auto-incremented index field
      return this.customers.map((customer, index) => ({
        ...customer,
        index: index + 1,
      }));
    },
  },
  mounted() {
    this.token = localStorage.getItem("access_token");
    if (this.token) {
      this.headers = {
        Authorization: `Bearer ${this.token}`,
      };
    }
    axios
      .get(API_URL + "/api/my_protected_view", {
        headers: this.headers,
      })
      .then((response) => {
        const { loggedin, message } = response.data;
        if (loggedin) {
          this.loggedin = loggedin;
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
  methods: {
    // function to get the list of customers
    getCustomers() {
      axios({
        method: "get",
        url: API_URL + "/api/customer",
      }).then((response) => (this.customers = response.data));
    },
    async addCustomer() {
      if (this.customerid) {
        await axios({
          method: "post",
          url: API_URL + "/api/customer",
          data: {
            customerid: this.customerid,
            firstname: this.firstname,
            lastname: this.lastname,
            company: this.company,
            city: this.city,
            country: this.country,
            email: this.email,
            subscriptiondate: this.subscriptiondate,
            website: this.website,
            phone1: this.phone1,
            phone2: this.phone2,
          },
          headers: { Authorization: `Bearer ${this.token}` },
        })
          .then((response) => {
            alert("Successful Registration");
            window.location.reload();
          })
          .catch((error) => {
            alert("Error in Registration. Please check the inputs.");
            if (error.response.data.theerror.customerid) {
              alert(error.response.data.theerror.customerid);
            } else {
              alert(error.response.data.theerror);
            }
            // alert("Invalid! " + error.response.data.theerror[0]);
            // this.message = error.response.data.theerror[0];
          });
      } else {
        alert("Please enter a customer ID.");
      }
    },
    SubmitFuzzy() {
      alert(this.search);
      this.$router.push({
        name: "companysearch",
        path: "/api/companysearch/",
        params: {
          id: this.search,
        },
        headers: { Authorization: `Bearer ${this.token}` },
      });
    },
    DeleteAll() {
      axios({
        method: "get",
        url: API_URL + "/api/deleteall",
        headers: { Authorization: `Bearer ${this.token}` },
      })
        .then((response) => {
          if (response) {
            alert("Deleting all Customer's Details");
            window.location.reload();
          }
        })
        .catch((error) => {
          alert("Unable to Delete! " + error.response.data.message);
        });
    },
  },
};
</script>

<style lang="scss">
.addcustomer {
  max-width: 500px;
  min-height: 80vh;
}
.table {
  margin-top: 50px;
  min-height: 50vh;
  // margin-bottom: 50px;
}

.home {
  margin-top: 100px;
  min-height: 150vh;
}

.labels {
  font-size: 18px;
  font-weight: bold;
}

.input {
  font-size: 18px;
  min-width: 300px;
  font-weight: bold;
}

.h1 {
  font-size: px;
}

.label {
  color: rgb(0, 0, 0);
}

.is-link {
  margin-top: 50px;
  font-size: 20px;
}

.select,
select {
  width: 100%;
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
