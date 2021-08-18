<template>
    <div class="dropbox">
        <input type="file" :disabled="isSaving" @change="fileSelected($event.target.files)" class="input-file">
        <p v-if="isInitial">Drag your file here to upload<br> or click to browse</p>
        <p v-if="isSaving">Uploading...</p>
        <p v-if="isFailed">{{error}}</p>
        <p v-if="isSuccess">Succeeded</p>
    </div>
</template>

<script>

  const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

  export default {
    name: 'fileInput',
    props: {
      status: Number,
      errorText: String
    },
    data() {
      return {
        uploadError: null,
        currentStatus: null
      }
    },
    computed: {
      error() {
        return this.errorText;
      },
      isInitial() {
        return this.status == STATUS_INITIAL;
      },
      isSaving() {
        return this.status == STATUS_SAVING;
      },
      isSuccess() {
        return this.status == STATUS_SUCCESS;
      },
      isFailed() {
        return this.status == STATUS_FAILED;
      }
    },
    methods: {
      fileSelected(fileList) {
        if (!fileList.length) return;
        this.$emit('file-save', fileList[0]);
      }
    }
  }

</script>

<style >
  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px ; /* minimum height */
    position: relative;
    cursor: pointer;
    overflow-wrap: normal;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
</style>