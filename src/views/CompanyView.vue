<template>
  <div class="company"></div>
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
          <DataTable :value="customers" sortField="id" :sortOrder="1" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
            <Column field="id" header="ID" :sortable="true" sortable style="width: 50%"></Column>
            <Column field="customerid" header="Customer ID" :sortable="true" sortable style="width: 50%"></Column>
            <Column field="firstname" header="First Name" sortable style="width: 50%"></Column>
            <Column field="lastname" header="LastName" sortable style="width: 50%"></Column>
            <Column field="company" header="Company" sortable style="width: 50%"></Column>
            <Column field="city" header="City" sortable style="width: 50"></Column>
            <Column field="country" header="Country" sortable style="width: 50"></Column>
            <Column field="cleanedphone1" header="C.Phone 1" sortable style="width: 50%"></Column>
            <Column field="cleanedphone2" header="C. Phone 2" sortable style="width: 50%"></Column>
            <Column field="email" header="Email" sortable style="width: 50%"></Column>
            <Column field="subscriptiondate" header="Subscription Date" sortable style="width: 50%"></Column>
            <Column field="website" header="Website" sortable style="width: 50%"></Column>
          </DataTable>
          <Button href="" @click="downloadFile()" severity="success">Export to CSV</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Button from "primevue/button";
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
        alert(error);
      });
    if (this.loggedin == true) {
      axios({
        method: "get",
        url: API_URL + "/api/customer/" + this.$route.params.id,
        auth: {
          username: "bellabo",
          password: "Anabelle21!",
        },
      }).then((response) => ((this.customers = response.data)));
    }
  },
  methods: {
    downloadFile() {
      if (this.customers) {
        var arr = [];
        var myarray = JSON.parse(JSON.stringify(this.customers)); //my array
      }
      if (myarray) exportFromJSON({ data: myarray, fileName: "customers-company-data", exportType: exportFromJSON.types.csv });
    },
    SubmitEvent(value) {
      alert(value);
      this.$router.push({
        name: "company",
        path: "/companycsv/",
        params: {
          id: value,
        },
      });
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

<style>
@media (min-width: 500px) {
  a {
    display: block;
  }

  .company {
    margin-top: 20px;
    /* min-height: 100vh; */
    padding: 20px;
    display: flex;
    align-items: flex;
  }

  .customerdetails {
    margin-top: 20px;
    /* min-height: 10vh; */
    margin-bottom: 50px;
    display: flex;
    /* align-items: center; */
  }
}
</style>
