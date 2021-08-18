<template>
    <div>
        <detail-panel :active="isDetailsOn" :message="message" :ok="true" @modal-ok="detailsClose" />
        <div class="filter-line">
           <!-- <datetime-input class="filter-item" label="Kezdő" v-model="startDate" @input="filterChanged"  name="start" />
            <datetime-input class="filter-item" label="Végző" v-model="endDate" @input="filterChanged"  name="end" />
            <text-input class="filter-item" label="JSN"  :value="jsn" :size="15" :maxLength="15" @input="jsnChanged($event)"/>
            <select-input class="filter-item" label="Állomás"  :value="shopId" :size="1" :items="shopList" emptyText="nincs megadva" @input="shopSelected($event)"/>
            <select-input class="filter-item" label="Mérési pont"  :value="measurementPointId" :size="1" :items="measurementPointList" emptyText="nincs megadva" @input="measurementPointSelected($event)"/>
            <div class="pager">
                <pager :totalCount="pagination.totalItemCount" :pageSize="pagination.pageSize" :page="pagination.page" @page-previous="getDataPage" @page-next="getDataPage"/>
            </div> -->
            <file-input @file-save="fileUpload" :status="fileUploadStatus" :errorText="uploadError" />
        </div>
        <grid-table v-if="fileData.length > 0" ref="data" :columns="tableCols()" :rows="tableRows()"  
            @link-clicked="showLink($event)" :tableHeight="600" :fontSize="0.9" />
    </div>
</template>

<script>
import { fileService } from '@/modules/services.js';
// import pager from '@/components/pager.vue';
import gridTable from '@/components/gridTable.vue';
import detailPanel from '@/components/detailPanel.vue';
import fileInput from '@/components/fileUpload.vue';
import { dateFromEpoch } from '@/modules/dateHelper.js';
export default {
	name: 'home',
	components: {
			'grid-table': gridTable,
			// pager,
			'file-input': fileInput,
			'detail-panel': detailPanel
	},
	data() {
			return {
					// pagination: { totalItemCount: 0, pageSize: 50, page: 1, orderBy: 'id' },
					fileData: [],
					fileUploadStatus: 0,
					uploadError: '',
					isDetailsOn: false,
					message: []
			};
	},
	methods: {
		async fileUpload(file) {
			this.fileUploadStatus = 1;
			try{
				const response = await fileService.postFile(file);
				if(!response){
					throw new Error('An error happened during the upload.');
				}
				this.fileUploadStatus = 2;
				this.refresh();
			}	catch(err) {
					this.uploadError = err.message;
					this.fileUploadStatus = 3;
			} finally {
				setTimeout(() => this.fileUploadStatus = 0, 5000)
			}
		},
			async detailsClose() {
					this.isDetailsOn = false;
					// await this.filterChanged();
			},
			async showLink(name) {
					this.message = [{ key: 'Link', value: await fileService.getLink(name)}]
					this.isDetailsOn = true
			},
			tableCols() { 
					let cols = [
							{ name: 'fileName', title: 'File name', type: 'string', width: 11, fontSize: 0.9 },
							{ name: 'time', title: 'Update time', type: 'date', width: 20, fontSize: 0.9 },
							{ name: 'link', title: 'Link', fieldTitle: 'Create', type: 'link', width: 5, fontSize: 0.9 }
					];
					return cols;
			},
			tableRows() {
		if(!this.fileData) { return []; }
		return this.fileData.map(d => {
			let row = [{ name: 'link', value: d.name }];
			for(let data in d) {
				const value = data === 'time' ? dateFromEpoch(d[data]) : d[data];
				row.push({ name: data, value: value == null ? null : value });
			}
			return row;
		});
			},
		async refresh() {
			let dataPromise = fileService.getFiles();
			await Promise.all([dataPromise]);
			dataPromise.then(r => {
				this.fileData = r.list; //.sort((a, b) => a.date.localeCompare(b.date)); 
							//this.pagination = r.pagination;
			});
		}

	},
	async mounted() {
			await this.refresh();
	}
}
</script>

<style scoped>
.filter-line {
    display: flex;
    flex-direction: row;
    /* justify-content: space-evenly; */
    margin: 1rem 0.5rem;
}
.filter-item {
    align-self: flex-start;
    margin-left: 0.5rem;
}
.pager {
    display: flex;
    flex-grow: 4;
    justify-content: flex-end;
    flex-direction: row;
}
</style>