<template>
  <div class="companysearch"></div>
  <div class="columns">
    <div class="column is-3">
      <div class="customerdetails">
        <br />
        <h2 class="title">Customer Details</h2>
        <br />
        <div>
          <div class="card">
            <h3>{{ customers.company }}</h3>
          </div>
          <DataTable :value="formattedCustomers" sortField="index" :sortOrder="1" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
            <Column field="index" header="Index" :sortable="true" sortable style="width: 50%"></Column>
            <Column field="customerid" header="Customer ID" :sortable="true" sortable style="width: 50%"></Column>
            <Column field="firstname" header="First Name" sortable style="width: 50%"></Column>
            <Column field="lastname" header="LastName" sortable style="width: 50%"></Column>
            <Column field="company" header="Company" sortable style="width: 50%"></Column>
            <Column field="city" header="City" sortable style="width: 50"></Column>
            <Column field="country" header="Country" sortable style="width: 50"></Column>
            <Column field="email" header="Email" sortable style="width: 50%"></Column>
            <Column field="subscriptiondate" header="Subscription Date" sortable style="width: 50%"></Column>
            <Column field="website" header="Website" sortable style="width: 50%"></Column>
            <Column field="phone1" header="Phone 1" sortable style="width: 50%"></Column>
            <Column field="phone2" header="Phone 2" sortable style="width: 50%"></Column>
          </DataTable>
          <Button @click="downloadFile()" severity="success">Export to CSV</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import exportFromJSON from "export-from-json";
import axios from "axios";
const API_URL = "http://127.0.0.1:8000";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; // optional
export default {
  components: {
    DataTable,
    Column,
  },
  name: "mydata",
  data() {
    return {
      customers: [],
      csv: null,
      myarray: [],
      arr: [],
      loggedin: "",
    };
  },
  computed: {
    formattedCustomers() {
      return this.customers.map((customer, index) => ({
        ...customer,
        index: index + 1,
      }));
    },
  },
  mounted() {
    this.token = localStorage.getItem("access_token");
    console.log(this.token);
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
          console.log(message);
          console.log("You are logged in!!");
        } else {
          console.log("User is not logged in", message);
          alert("User is not logged in. Please login.");
          this.$router.push({
            name: "login",
            path: "/",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // companysearch verifies user identity
    axios({
      method: "get",
      url: API_URL + "/api/companysearch/" + this.$route.params.id,
      headers: { Authorization: `Bearer ${this.token}` },
    })
      .then((response) => ((this.customers = response.data), console.log(this.$route.params.id)))
      .catch((error) => {
        alert("Error in Generating Table for CSV. Please check if you are logged in.");
        console.log(error);
      });
  },
  methods: {
    downloadFile() {
      if (this.customers) {
        const formattedCustomers = this.customers.map((customer, index) => ({
          index: index + 1,
          ...customer,
        }));
        exportFromJSON({ data: formattedCustomers, fileName: "customers-company-data", exportType: exportFromJSON.types.csv });
      }
    },
    // SubmitEvent(value) {
    //   alert(value);
    //   this.$router.push({
    //     name: "company",
    //     path: "/companycsv/",
    //     params: {
    //       id: value,
    //     },
    //   });
    // },
    // SubmitFuzzy() {
    //   alert(this.search);
    //   this.$router.push({
    //     name: "companysearch",
    //     path: "/api/companysearch/",
    //     params: {
    //       id: this.search,
    //     },
    //     headers: {
    //       Authorization: `Bearer ${this.token}`,
    //     },
    //   });
    // },
  },
};
</script>

<style>
@media (min-width: 500px) {
  .companysearch {
    margin-top: 0px;
    /* min-height: 100vh; */
    padding: 20px;
    display: flex;
    align-items: flex;
  }

  .customerdetails {
    margin-top: 0px;
    margin-bottom: 50px;
    display: flex;
  }
}
</style>
