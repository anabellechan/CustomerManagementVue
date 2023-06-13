<template>
  <SearchInput v-model="searchVal" />
</template>

<script>
import SearchFocus from "./SearchFocus.vue";
import axios from "axios";

export default {
  components: {
    SearchFocus,
  },
  // computed: {
  //   pages () {
  //     let result = [];
  //     const allPost = this.$static.allPost.edges.map(edge => edge.node);
  //     allPost.forEach(page => {
  //       result.push({
  //         path: page.path,
  //         title: page.title,
  //         summary: page.summary
  //       });
  //     });
  //     const allDocs = this.$static.allDocumentation.edges.map(edge => edge.node);
  //     allDocs.forEach(page => {
  //       result.push({
  //         path: page.path,
  //         title: page.title
  //       });
  //     });
  //     return result;
  //   }
  // },
  data() {
    return {
      query: "",
      results: [],
      highlightedIndex: 0,
      searchResultsVisible: false,
      options: {
        shouldSort: true,
        includeMatches: true,
        threshold: 0.5,
        location: 0,
        distance: 500,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ["company"],
      },
    };
  },
  // created() {
  //   axios({
  //     method: "get",
  //     url: API_URL + "/api/customer",
  //     auth: {
  //       username: "bellabo",
  //       password: "Anabelle21!",
  //     },
  //   }).then((response) => ((this.customers = response.data), console.log("response", response.data)));
  // },
  methods: {
    reset() {
      this.query = "";
      // this.highlightedIndex = 0
    },
    softReset() {
      // this.highlightedIndex = 0
      this.searchResultsVisible = true;
    },
    // performSearch() {
    //   this.$search(this.query, this.pages, this.options).then(results => {
    //     this.results = results
    //   })
    // },
    // highlightPrev() {
    //   if (this.highlightedIndex > 0) {
    //     this.highlightedIndex = this.highlightedIndex - 1
    //     this.scrollIntoView()
    //   }
    // },
    // highlightNext() {
    //   if (this.highlightedIndex < this.results.length - 1) {
    //     this.highlightedIndex = this.highlightedIndex + 1
    //     this.scrollIntoView()
    //   }
    // },
    // scrollIntoView() {
    //   this.$refs.results.children[this.highlightedIndex].scrollIntoView({ block: 'nearest' })
    // },
    // gotoLink() {
    //   if (this.results[this.highlightedIndex]) {
    //     window.location = this.results[this.highlightedIndex].item.path
    //   }
    // },
    focusSearch(e) {
      if (e.key === "/") {
        this.$refs.search.focus();
      }
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
