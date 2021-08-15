<template>
    <div>
        <measurement-details :active="isDetailsOn" :message="message" :ok="true" @modal-ok="detailsClose" />
        <div class="filter-line">
           <!-- <datetime-input class="filter-item" label="Kezdő" v-model="startDate" @input="filterChanged"  name="start" />
            <datetime-input class="filter-item" label="Végző" v-model="endDate" @input="filterChanged"  name="end" />
            <text-input class="filter-item" label="JSN"  :value="jsn" :size="15" :maxLength="15" @input="jsnChanged($event)"/>
            <select-input class="filter-item" label="Állomás"  :value="shopId" :size="1" :items="shopList" emptyText="nincs megadva" @input="shopSelected($event)"/>
            <select-input class="filter-item" label="Mérési pont"  :value="measurementPointId" :size="1" :items="measurementPointList" emptyText="nincs megadva" @input="measurementPointSelected($event)"/>
            <div class="pager">
                <pager :totalCount="pagination.totalItemCount" :pageSize="pagination.pageSize" :page="pagination.page" @page-previous="getDataPage" @page-next="getDataPage"/>
            </div> -->
            
        </div>
        <grid-table v-if="fileData.length > 0" key="measurements" ref="data" :columns="tableCols()" :rows="tableRows()"  
            @link-clicked="showLink($event)" :tableHeight="600" :fontSize="0.9" />
    </div>
</template>

<script>
import { fileService } from '@/modules/services.js';
// import { optionList } from '@/modules/util.js';
// import pager from '@/components/pager.vue';
// import dateTimeInput from '@/components/dateTimeInput.vue';
// import textInput from '@/components/textInput.vue';
// import selectInput from '@/components/selectInput.vue';
import gridTable from '@/components/gridTable.vue';
import detailPanel from '@/components/detailPanel.vue';
import { dateFromEpoch } from '@/modules/dateHelper.js';
export default {
    name: 'home',
    components: {
        'grid-table': gridTable,
        // pager,
        // 'datetime-input': dateTimeInput,
        // 'text-input': textInput,
        // 'select-input': selectInput,
        'measurement-details': detailPanel
    },
    data() {
        return {
            isSaving: false,
            // endDate: new Date(),
            // jsn: null,
            // shopId: null,
            // measurementPointId: null,
            // pagination: { totalItemCount: 0, pageSize: 50, page: 1, orderBy: 'id' },
            fileData: [],
            // measurementPointList: [],
            // shopList: [],
            isDetailsOn: false,
            message: []
        };
    },
    methods: {
        async detailsClose() {
            this.isDetailsOn = false;
            // await this.filterChanged();
        },
        // async jsnChanged(jsn) {
        //     this.jsn = jsn || null;
        //     await this.filterChanged();
        // },
        // async shopSelected(id) {
        //     this.shopId = id || null;
        //     await this.filterChanged();
        // },
        // async measurementPointSelected(id) {
        //     this.measurementPointId = id || null;
        //     await this.filterChanged();
        // },
        // async filterChanged() {
        //     this.pagination.page = 1;
        //     await this.getDataPage(this.pagination.page, true);
        // },
        // selectRow(row) {
        //     this.message = [
        //         { key: 'Mérés azonosítója', value: row.find(f => f.name === 'id').value },
        //         { key: 'JSN', value: row.find(f => f.name === 'jsn').value },
        //         { key: 'Jármű modell', value: row.find(f => f.name === 'vehicleModel').value },
        //         { key: 'Állomás', value: row.find(f => f.name === 'shopName').value },
        //         { key: 'Mérési pont', value: row.find(f => f.name === 'measurementPointName').value },
        //         { key: 'Mérés ideje', value: row.find(f => f.name === 'date').value },
        //         { key: 'Gap', value: row.find(f => f.name === 'gap').value },
        //         { key: 'Flush', value: row.find(f => f.name === 'flush').value },
        //     ];
        //     this.isDetailsOn = true;
        // },
        // async getDataPage(requestedPage, force = false) {
		// 	if(requestedPage < 1 || requestedPage > Math.ceil(this.pagination.totalCount / this.pagination.pageSize) || (!force && this.pagination.page == requestedPage)) {
		// 		return;
		// 	}
		// 	this.pagination.page = requestedPage;
		// 	await this.refresh();
		// },
        async showLink(name) {
            this.message = [{ key: 'Link', value: await fileService.getLink(name)}]
            this.isDetailsOn = true
        },
        tableCols() { 
            let cols = [
                { name: 'fileName', title: 'File név', type: 'string', width: 11, fontSize: 0.9 },
                { name: 'time', title: 'Idő', type: 'date', width: 11, fontSize: 0.9 },
                { name: 'link', title: 'Link', type: 'link', width: 11, fontSize: 0.9 }
            ];
            return cols;
        },
        tableRows() {
			if(!this.fileData) { return []; }
			return this.fileData.map(d => {
				let row = [{ name: 'link', value: d.name }];
				for(let data in d) {
                    const value = data === 'time' ? dateFromEpoch(d[data]) : d[data]
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