<template>
  <div class="importcsv">
    <div class="card align-items-center justify-content-center gap-10">
      <InlineMessage :severity="alertSeverity" style="width: 400px; height: 60px; font-weight: 90px; font-size: 30px">{{ alertMessage }}</InlineMessage>
    </div>
    <div class="submitfile">
      <h1 class="subtitle">Import a CSV</h1>
      <hr />
      <label
        >File
        <input type="file" accept=".csv" @change="handleFileUpload($event)" />
      </label>
      <br />
      <button v-on:click="submitFile()">Submit</button>
    </div>
    <n></n>
    <div class="tablesuccess">
      <!-- for success -->
      <InlineMessage v-if="!!customers" :severity="alertpartialSeverity" style="width: 400px; height: 60px; font-weight: 90px; font-size: 30px">{{ alertSuccessMessage }}</InlineMessage>
      <n></n>
      <DataTable v-if="!!customers" :value="customers" sortField="id" :sortOrder="1" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <!-- <Column field="id" header="ID" :sortable="true" sortable style="width: 40%"></Column> -->
        <Column field="customerid" header="Customer ID" :sortable="true" sortable style="width: 40%"></Column>
        <Column field="firstname" header="First Name" sortable style="width: 40%"></Column>
        <Column field="lastname" header="LastName" sortable style="width: 40%"></Column>
        <Column field="company" header="Company" sortable style="width: 40%"></Column>
        <Column field="city" header="City" sortable style="width: 40"></Column>
        <Column field="country" header="Country" sortable style="width: 40"></Column>
        <Column field="email" header="Email" sortable style="width: 40%"></Column>
        <Column field="subscriptiondate" header="Subscription Date" sortable style="width: 40%"></Column>
        <Column field="website" header="Website" sortable style="width: 40%"></Column>
        <Column field="phone1" header="Phone 1" sortable style="width: 40%"></Column>
        <Column field="phone2" header="Phone 2" sortable style="width: 40%"></Column>
      </DataTable>
    </div>
    <div class="table">
      <!-- for errors -->
      <InlineMessage v-if="hasError && duplicates !== undefined" :severity="alertdupeSeverity" style="width: 400px; height: 60px; font-weight: 90px; font-size: 30px">{{ alertDuplicates }}</InlineMessage>
      <InlineMessage v-if="hasError && errors !== undefined" :severity="alertdupeSeverity" style="width: 400px; height: 100px; font-weight: 90px; font-size: 30px">{{ errors }}</InlineMessage>
      <DataTable v-if="hasError && duplicates !== undefined" :value="duplicates" sortField="id" :sortOrder="1" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <!-- <Column field="id" header="ID" :sortable="true" sortable style="width: 40%"></Column> -->
        <Column field="customerid" header="Customer ID" :sortable="true" sortable style="width: 40%"></Column>
        <Column field="firstname" header="First Name" sortable style="width: 40%"></Column>
        <Column field="lastname" header="LastName" sortable style="width: 40%"></Column>
        <Column field="company" header="Company" sortable style="width: 40%"></Column>
        <Column field="city" header="City" sortable style="width: 40"></Column>
        <Column field="country" header="Country" sortable style="width: 40"></Column>
        <Column field="email" header="Email" sortable style="width: 40%"></Column>
        <Column field="subscriptiondate" header="Subscription Date" sortable style="width: 40%"></Column>
        <Column field="website" header="Website" sortable style="width: 40%"></Column>
        <Column field="phone1" header="Phone 1" sortable style="width: 40%"></Column>
        <Column field="phone2" header="Phone 2" sortable style="width: 40%"></Column>
      </DataTable>
    </div>
    <table v-if="parsed" style="width: 100%">
      <tbody></tbody>
    </table>

    <div class="thecsv">
      <pre class="mt-15" v-if="csv"><code>{{ csv }}</code></pre>
    </div>
  </div>
</template>

<script>
import InlineMessage from "primevue/inlinemessage";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Message from "primevue/message";
import axios from "axios";
const API_URL = "http://127.0.0.1:8000";
export default {
  name: "mydata",
  props: {},
  components: {
    InlineMessage,
    Message,
    DataTable,
    Column,
  },
  data() {
    return {
      csv: null,
      csvname: "",
      file: "",
      content: [],
      parsed: false,
      alertSeverity: null,
      alertMessage: null,
      duplicates: [],
      alertdupeSeverity: null,
      alertDuplicates: null,
      alertpartialSeverity: null,
      alertSuccessMessage: null,
      hasError: false,
      errors: "",
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
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
      this.csvname = this.file.name;
      if (this.file.type !== "text/csv") {
        alert("Error: The file-type doesn't belong to CSV.");
        event.target.value = null;
      }
    },
    submitFile() {
      if (this.file.size == null) {
        alert("Error: The file is empty.");
      }
      try {
        this.alertSeverity = "info";
        this.alertMessage = "Form submitted successfully! Please Wait for Response";
      } catch (error) {
        this.alertSeverity = "error";
        this.alertMessage = "An error occurred while submitting the form.";
      }
      //Perform Form Submission
      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("csvname", this.csvname);
      axios
        .post("http://127.0.0.1:8000/api/customercsv", formData, { headers: { Authorization: `Bearer ${this.token}` } })
        .then((response) => {
          this.alertSeverity = "success";
          this.alertMessage = "Successfully imported!";
        })
        .catch((error) => {
          this.duplicates = error.response.data.duplicates;
          this.customers = error.response.data.customers;
          this.errors = error.response.data.dateerrors;
          this.alertSeverity = "error";
          if (this.file.size == null) {
            this.alertMessage = "Invalid!";
          } else {
            this.alertMessage = "Invalid! " + error.response.data.message;
          }
          this.alertdupeSeverity = "error";
          this.alertDuplicates = "The following list of duplicates cannot be sent";
          this.hasError = true;
          this.alertpartialSeverity = "info";
          this.alertSuccessMessage = "The following list of data in csv has been imported successfully";
        });
    },
  },
};
</script>

<style>
@media (min-width: 500px) {
  .importcsv {
    margin-top: 100px;
    min-height: 100vh;
    grid-row: 2;
  }

  .submitfile {
    margin-bottom: 50px;
  }

  .table {
    justify-content: left;
  }

  .thecsv {
    max-width: 500px;
    display: auto;
  }
}
</style>
