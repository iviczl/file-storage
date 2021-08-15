<template>
  <table v-if="!inProgress" ref="table" class="table is-bordered is-fullwidth is-scrollable" :style="tableStyle" @mousedown.left="leftMouseButtonDown" @mouseup.left="leftMouseButtonUp" >
    <thead ref="headSelectableGroup" v-if="hasSelectableColumnGroup" class="thead">
      <td v-if="hasAggregatedColumn" :style="aggregationHeaderStyle"></td>
      <td v-for="n in beforeActionColumns.length" class="w2" :key="n"></td>
      <td v-for="columnGroup in columnGroups" :key="columnGroup.name" :style="cellStyle(columnGroup)" :colspan="columnGroup.columns ? columnGroup.columns.length : 1">
        <div v-if="columnGroup.selectable" class="control" style="text-align: center;">
          <label class="radio is-small label">
            <input v-if="columnGroup.radioSelect" name="columnGroupSelector" class="radio" type="radio" :value="columnGroup.name" :checked="columnGroup.name === selectedColumnGroupName" @change="selectColumnGroup" :disabled="isDisabled">
            <input v-else name="columnGroupSelector" class="checkbox is-small" type="checkbox" :value="columnGroup.name" @click="selectColumnGroup" :disabled="isDisabled">
          </label>
        </div>
      </td>
      <td v-for="n in afterActionColumns.length" class="w2" :key="n"></td>
    </thead>
    <thead ref="headGroup" class="thead">
      <td v-if="hasAggregatedColumn" :style="aggregationHeaderStyle"></td>
      <th v-for="n in beforeActionColumns.length" class="w2" :key="n"></th>
      <th v-for="columnGroup in columnGroups" :class="['th', 'has-text-centered']" :key="columnGroup.name" :style="cellStyle(columnGroup)" :colspan="columnGroup.columns ? columnGroup.columns.length : 1">
        {{columnGroup.title}}
      </th>
      <th v-for="n in afterActionColumns.length" class="w2" :key="n"></th>
    </thead>
    <thead ref="headSelectable" v-if="hasSelectableColumn" class="thead">
      <td v-if="hasAggregatedColumn" :style="aggregationHeaderStyle"></td>
      <td v-for="n in beforeActionColumns.length" class="w2" :key="n"></td>
      <td v-for="column in columns" :key="column.name" :style="cellStyle(column)">
        <div v-if="column.selectable" class="control" style="text-align: center;">
          <label class="radio is-small label">
            <input v-if="column.radioSelect" name="columnSelector" class="radio" type="radio" :value="column.name" :checked="column.name === selectedColumnName" @change="selectColumn" :disabled="isDisabled">
            <input v-else name="columnSelector" class="checkbox is-small" type="checkbox" :value="column.name" @click="selectColumn" :disabled="isDisabled">
          </label>
        </div>
      </td>
      <td v-for="n in afterActionColumns.length" class="w2" :key="n"></td>
    </thead>
    <thead ref="headFilterable" v-if="filterable" class="thead">
      <td v-if="hasAggregatedColumn" :style="aggregationHeaderStyle"></td>
      <td v-for="n in beforeActionColumns.length" class="w2" :key="n"></td>
      <td v-for="column in columns" :key="column.name" :style="cellStyle(column)">
        <filterinput @filter-updated="filterRows(column.name, $event)" :disabled="isDisabled"/>
      </td>
      <td v-for="n in afterActionColumns.length" class="w2" :key="n"></td>
    </thead>
    <thead ref="head" class="thead">
      <td v-if="hasAggregatedColumn" :style="aggregationHeaderStyle"></td>
      <th v-for="n in beforeActionColumns.length" class="w2" :key="n"></th>
      <th v-for="column in columns" :class="['th', 'has-text-centered']" @click="sortable && !isDisabled ? sortRows(column): null" :key="column.name" :style="cellStyle(column)" >
        {{column.title}}
        <i v-if="isSorted && sorting.column.name === column.name" :class="['fas', sorting.ascending ? 'fa-angle-down' : 'fa-angle-up']"></i>
      </th>
      <th v-for="n in afterActionColumns.length" class="w2" :key="n"></th>
    </thead>
    <tbody ref="body" :style="bodyStyle" @scroll.passive="fixScroll" @wheel.passive="wheelRolled" >
      <tr v-for="row in filteredRows" :class="{'is-selected': selectedRow ? selectedRow.find(el => el.name === 'id').value === row.find(el => el.name === 'id').value : false}"
        @click="selectable && !isDisabled ? selectRow(row): null" :key="row.id" :style="rowStyle ? rowStyle(row) : {}" >
        <td v-if="hasAggregatedColumn" :style="aggregationHeaderStyle"></td>
        <td v-for="(a, index) in beforeActionColumns" class="w2" :key="index">
          <a @click.prevent="a.method && !isDisabled ? a.method(row) : null">
            <i :class="a.icon"></i>
          </a>
        </td>
        <td v-for="column in columns" :key="column.name" :style="cellStyle(column, row)">
          <template v-if="column.type === 'link'">
            <a @click.prevent="!isDisabled ? fileOpen(row.find(el => { return el.name === column.name;}).value) : null" >
            {{ row.find(el => { return el.name === column.name;}).value }}
            </a>
          </template>
          <template v-else>
            {{ column.format ? column.format(row.find(el => { return el.name === column.name;}).value, column.name) : row.find(el => { return el.name === column.name;}).value }}
          </template>
        </td>
        <td v-for="(a, index) in afterActionColumns" class="w2" :key="index">
          <a @click.prevent="a.method && !isDisabled ? a.method(row) : null" >
            <i :class="a.icon"></i>
          </a>
        </td>
      </tr>
    </tbody>
    <tfoot ref="footAggregated" v-if="hasAggregatedColumn" class="thead">
      <tr v-for="(row, index) in aggregationRows" :key="index">
        <td :style="aggregationHeaderStyle">{{aggregationHeader(index)}}</td>
        <td v-for="n in beforeActionColumns.length" class="w2" :key="n"></td>
        <td v-for="column in columns" :key="column.name" :style="cellStyle(column)" >
          {{ column.format ? column.format(row.find(el => { return el.name === column.name;}).value, column.name) : row.find(el => { return el.name === column.name;}).value }}
        </td>
        <td v-for="n in afterActionColumns.length" class="w2" :key="n"></td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
import filterinput from './filterinput.vue';

export default {
  name: 'gridTable',
  components: {
    filterinput
  },
  data() {
    return {
      selectedRow: this.preSelectedRow,
      selectedColumn: this.preSelectedColumn,
      selectedColumnGroup: this.preSelectedColumnGroup,
      searchFilters: {},
      sorting: {
        column: null,
        ascending: true
      },
      beforeActionColumns: [],
      afterActionColumns: [],
      headerStyle: {},
      tableStyle: {
        height:
          typeof this.tableHeight === 'number'
            ? this.tableHeight == 0
              ? 'fit-content'
              : this.tableHeight.toString() + 'px'
            : '100%',
        width:
          typeof this.tableWidth === 'number'
            ? this.tableWidth == 0
              ? 'fit-content'
              : this.tableWidth.toString() + 'px'
            : '100%',
        marginTop: this.listItem ? '0.75rem' : 0,
        fontSize: this.fontSize ? this.fontSize.toString() + 'rem' : 'inherited'
      },
      bodyStyle: {
        overflowY: this.scrollable ? 'scroll' : 'hidden',
        height:
          typeof this.bodyHeight === 'number'
            ? this.bodyHeight == 0
              ? 'fit-content'
              : this.bodyHeight.toString() + 'px'
            : '100%'
      },
      inProgress: this.isProgressing,
      isDisabled: this.disabled,
      isLeftMouseButtonDown: false,
      isBodyScrolling: false,
      context: document.createElement('canvas').getContext('2d')
    };
  },
  props: {
    name: String,
    tableHeight: Number,
    tableWidth: Number,
    bodyHeight: Number,
    fontSize: Number,
    filterable: Boolean,
    sortable: Boolean,
    selectable: Boolean,
    scrollable: { type: Boolean, default: true },
    listItem: Boolean,
    preSelectedRow: Object,
    preSelectedColumn: String,
    preSelectedColumnGroup: String,
    columns: Array,
    columnGroups: Array,
    maximumSelectableColumns: Number,
    rows: Array,
    maxRows: { type: Number, default: 1000 },
    initialSort: Object,
    actionButtons: Array,
    maximumHeader: String,
    minimumHeader: String,
    averageHeader: String,
    deviationHeader: String,
    rowStyle: Function,
    isProgressing: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  watch: {
    rows() {},
    actionButtons() {
      this.refreshActionButtons();
    },
    preSelectedColumn() {
      this.selectedColumn = this.preSelectedColumn;
    },
    preSelectedColumnGroup() {
      this.selectedColumnGroup = this.preSelectedColumnGroup;
    },
    isProgressing() {
      this.inProgress = this.isProgressing;
    },
    disabled() {
      this.isDisabled = this.disabled;
    }
  },
  computed: {
    aggregationHeaderStyle() {
      const width = Math.max(this.textWidth(this.maximumHeader || ''), this.textWidth(this.minimumHeader || ''), 
        this.textWidth(this.averageHeader || ''), this.textWidth(this.deviationHeader || ''));
      return this.cellStyle({ width: width + 'px' });
    },
    selectedColumnName() {
      return this.selectedColumn;
    },
    selectedColumnGroupName() {
      return this.selectedColumnGroup;
    },
    aggregationRows() {
      if (this.filteredRows.length == 0) {
        return [];
      }
      let rows = [];
      let maxColumns = this.columns.filter(c => c.maximum);
      let minColumns = this.columns.filter(c => c.minimum);
      let avgColumns = this.columns.filter(c => c.average);
      let devColumns = this.columns.filter(c => c.deviation);

      if(maxColumns.length == 0 && minColumns.length == 0 && avgColumns.length == 0 && devColumns.length == 0) { return []; }

      if (maxColumns.length > 0) {
        let maxRow = [];
        for (let column of this.columns) {
          const valuableRows = this.filteredRows.filter(r => r.find(el => el.name === column.name).value != null);
          maxRow.push({
            name: column.name,
            value: column.maximum
              ? (typeof column.maximum === 'function' 
                  ? (column.maximum(column.name))
                  : (valuableRows.length > 0 ? Math.max(...valuableRows.map(r => r.find(el => el.name === column.name).value)) : ''))
              : ''
          });
        }
        rows.push(maxRow);
      }

      if (minColumns.length > 0) {
        let minRow = [];
        for (let column of this.columns) {
          const valuableRows = this.filteredRows.filter(r => r.find(el => el.name === column.name).value != null);
          minRow.push({
            name: column.name,
            value: column.minimum
              ? (typeof column.minimum === 'function' 
                  ? (column.minimum(column.name))
                  : (valuableRows.length > 0 ? Math.min(...valuableRows.map(r => r.find(el => el.name === column.name).value)) : ''))
              : ''
          });
        }
        rows.push(minRow);
      }
      const average = (data, rowCount) =>
        data.reduce((sum, value) => sum + value) / rowCount;
      const deviation = (values, rowCount) =>
        Math.sqrt(average(values.map(value => (value - average(values, rowCount)) ** 2), rowCount));
      const round = num => Math.round(num * 100) / 100;

      if (avgColumns.length > 0) {
        let avgRow = [];
        for (let column of this.columns) {
          const valuableRows = this.filteredRows.filter(r => r.find(el => el.name === column.name).value != null);
          const values = valuableRows.map(r => r.find(el => el.name === column.name).value);
          avgRow.push({
            name: column.name,
            value: column.average
              ? (typeof column.average === 'function' 
                  ? (column.average(column.name))
                  : (values.length > 0 ? round(average(values, valuableRows.length)) : ''))
              : ''
          });
        }
        rows.push(avgRow);
      }

      if (devColumns.length > 0) {
        let devRow = [];
        for (let column of this.columns) {
          const valuableRows = this.filteredRows.filter(r => r.find(el => el.name === column.name).value != null);
          const values = valuableRows.map(r => r.find(el => el.name === column.name).value);
          devRow.push({
            name: column.name,
            value: column.deviation
              ? (typeof column.deviation === 'function' 
                  ? (column.deviation(column.name))
                  : (values.length > 0 ? round(deviation(values, valuableRows.length)) : ''))
              : ''
          });
        }
        rows.push(devRow);
      }

      return rows;
    },
    hasAggregatedColumn() {
      return this.columns.some(
        c => c.maximum || c.minimum || c.average || c.deviation
      );
    },
    hasSelectableColumn() {
      return this.columns.some(c => c.selectable);
    },
    hasColumnGroup() {
      return !!this.columnGroups;
    },
    hasSelectableColumnGroup() {
      if(!this.columnGroups) { return false; }
      return this.columnGroups.some(c => c.selectable);
    },
    filteredRows() {
      var filtered = this.rows.filter(row => {
        var isMatch = true;
        for (var column of this.columns) {
          let filter = this.searchFilters[column.name];
          if (filter) {
            if (typeof filter === 'function') {
              isMatch = isMatch && filter(row);
            } else {
              isMatch =
                isMatch &&
                row
                  .find(el => {
                    return el.name === column.name;
                  })
                  .value.match(filter) != null;
            }
          }
        }
        return isMatch;
      });
      if (this.isSorted) {
        if (this.sorting.column.type === 'number') {
          filtered.sort((a, b) => {
            return (
              a.find(el => {
                return el.name === this.sorting.column.name;
              }).value -
              b.find(el => {
                return el.name === this.sorting.column.name;
              }).value
            );
          });
        } else {
          filtered.sort((a, b) => {
            return a.find(el => {
              return el.name === this.sorting.column.name;
            }).value >
              b.find(el => {
                return el.name === this.sorting.column.name;
              }).value
              ? 1
              : -1;
          });
        }
        if (!this.sorting.ascending) {
          filtered.reverse();
        }
      }
      return filtered;
    },
    isSorted() {
      return this.sorting.column != null;
    }
  },
  created() {
    this.context.font = (this.fontSize ? this.fontSize.toString() + 'rem ' : '') + 'Avenir, Helvetica, Arial, sans-serif';
    for (var column of this.columns) {
      this.$set(this.searchFilters, column.name, '');
    }
    if (this.initialSort) {
      this.sorting.ascending = this.initialSort.ascending;
      this.sorting.column = this.columns.find(c => {
        return c.name === this.initialSort.columnName;
      });
    }
    this.refreshActionButtons();
  },
  beforeDestroy() {
    this.$refs.body = null;
    this.$refs.head = null;
    if(this.hasSelectableColumnGroup) {
      this.$refs.headSelectableGroup = null;
    }
    if(this.hasColumnGroup) {
      this.$refs.headGroup = null;
    }
    if(this.hasSelectableColumn) {
      this.$refs.headSelectable = null;
    }
    if(this.filterable) {
      this.$refs.headFilterable = null;
    }
    if(this.hasAggregatedColumn) {
      this.$refs.footAggregated = null;
    }
    this.$refs.table = null;
  },
  methods: {
    textWidth(text) {
      let metrics = this.context.measureText(text + 'm');
      return metrics.width;
    },
    fixScroll(event) {
      if(!this.$refs || !this.$refs.body) { return; }
      const bodyScroll = this.$refs.body.scrollLeft;
      this.$refs.head.scrollLeft = bodyScroll;
      if(this.hasSelectableColumnGroup) {
        this.$refs.headSelectableGroup.scrollLeft = bodyScroll;
      }
      if(this.hasColumnGroup) {
        this.$refs.headGroup.scrollLeft = bodyScroll;
      }
      if(this.hasSelectableColumn) {
        this.$refs.headSelectable.scrollLeft = bodyScroll;
      }
      if(this.filterable) {
        this.$refs.headFilterable.scrollLeft = bodyScroll;
      }
      if(this.hasAggregatedColumn) {
        this.$refs.footAggregated.scrollLeft = bodyScroll;
      }
      if(event.target.scrollTop == 0) {
        this.$emit('scrolled-to-top');
      } else if(event.target.scrollHeight - event.target.clientHeight == event.target.scrollTop) {
        this.$emit('scrolled-to-bottom');
      }
      if(this.isLeftMouseButtonDown) {
        this.isBodyScrolling = true;
      }
    },
    leftMouseButtonDown() {
      this.isLeftMouseButtonDown = true;
    },
    leftMouseButtonUp() {
      this.isLeftMouseButtonDown = false;
      this.scrolled();
    },
    wheelRolled() {
      this.isBodyScrolling = true;
      this.scrolled();
    },
    scrolled() {
      if(this.isBodyScrolling) {
        this.$emit('scrolled', this.$refs.body.scrollTop / (this.$refs.body.scrollHeight - this.$refs.body.clientHeight));
        this.isBodyScrolling = false;
      }
    },
    scrollTo(position) {
      const scrollHeight = (this.$refs.body.scrollHeight - this.$refs.body.clientHeight) * position;
      if(Math.abs(this.$refs.body.scrollTop - scrollHeight) > 1) {
        this.$refs.body.scrollTop = scrollHeight;
      }
    },
    scrollToHalf() {
      const halfHeight = (this.$refs.body.scrollHeight - this.$refs.body.clientHeight) / 2;
      if(Math.abs(this.$refs.body.scrollTop - halfHeight) > 1) {
        this.$refs.body.scrollTop = halfHeight;
      }
    },
    aggregationHeader(index) {
      switch (index) {
        case 0:
          return this.maximumHeader;
        case 1:
          return this.minimumHeader;
        case 2:
          return this.averageHeader;
        case 3:
          return this.deviationHeader;
      }
    },
    selectColumnGroup(event) {
			let eventValue = null;
      if(event.target.type === 'checkbox') {
				const columnGroup = this.columnGroups.find(g => g.name === event.target.value);
				if(event.target.checked) {
					if(this.maximumSelectableColumns) {
						const selectableColumnCount = this.selectedColumns()
							.filter(c => !(columnGroup.columns.includes(c.value))).length +
							columnGroup.columns.length;
						if(selectableColumnCount > this.maximumSelectableColumns) {
							event.returnValue = false;
							return;
						}
					}
					const columns = this.selectableColumns().filter(c => columnGroup.columns.includes(c.value));
					columns.forEach(column => {
						column.checked = true;
					});
				} else {
					const columns = this.selectableColumns().filter(c => columnGroup.columns.includes(c.value));
					columns.forEach(column => {
						column.checked = false;
					});
				}
				eventValue = { columnGroupName: event.target.value, checked: event.target.checked };
      } else {
				eventValue = event.target.value;
			}
      this.$emit('columngroup-selected', eventValue);
    },
    selectColumn(event) {
			let eventValue = null;
      if(event.target.type === 'checkbox') {
				if(event.target.checked) {
					if(this.maximumSelectableColumns && this.selectedColumnCount() > this.maximumSelectableColumns) {
						event.returnValue = false;
						return;
					}
				} else if(this.columnGroups) {
					const columnGroup = this.columnGroups.find(g => g.columns ? g.columns.includes(event.target.value) : false);
					if(columnGroup && columnGroup.selectable) {
						this.getColumnGroupByValue(columnGroup.name).checked = false;
					}
				}
				eventValue = { columnName: event.target.value, checked: event.target.checked };
      } else {
				eventValue = event.target.value;
			}
      this.$emit('column-selected', eventValue);
		},
		getColumnGroupByValue(value) {
			return [].slice.call(this.$refs.table.querySelectorAll('[name=columnGroupSelector]')).filter(g => g.value === value)[0];
		},
		selectableColumns() {
			return [].slice.call(this.$refs.table.querySelectorAll('[name=columnSelector]'));
		},
		selectedColumns() {
			return this.selectableColumns().filter(t => t.checked);
		},
    selectedColumnCount() {
      return this.selectedColumns().length;
    },
    refreshActionButtons() {
      this.beforeActionColumns = [];
      this.afterActionColumns = [];
      if (this.actionButtons) {
        for (let button of this.actionButtons) {
          if (button.beforePosition) {
            this.beforeActionColumns.push({
              position: button.beforePosition,
              title: button.title,
              icon:
                button.action == 'delete'
                  ? 'fas fa-times'
                  : 'fas fa-pencil-alt',
              url: button.url,
              method: button.method
            });
          } else if (button.afterPosition) {
            this.afterActionColumns.push({
              position: button.afterPosition,
              title: button.title,
              icon:
                button.action == 'delete'
                  ? 'fas fa-times'
                  : 'fas fa-pencil-alt',
              url: button.url,
              method: button.method
            });
          }
        }
      }
    },
    fileOpen(path) {
      this.$emit('link-clicked', path);
    },
    cellStyle(column, row) {
      const fontSize = typeof column.fontSize === 'number' ? column.fontSize.toString() + 'em' : '1em';
      const width =  typeof column.width === 'number' ? (column.width == 0 ? 'fit-content' : column.width.toString() + 'em') : column.width;
      let style = {
        textAlign: column.type === 'number' ? 'right' : 'inherited',
        width,
        minWidth: width,
        maxWidth: width,
        fontSize
      };
      if(row && column.styleByData && typeof column.styleByData === 'function') {
        let dataStyle = column.styleByData(column, row);
        style.borderColor = dataStyle.borderColor || undefined;
        style.borderWidth = dataStyle.borderWidth || undefined;
        style.color = dataStyle.color || undefined;
        style.backgroundColor = dataStyle.backgroundColor || undefined;
      }
      return style;
    },
    selectRow(row) {
      this.selectedRow = this.selectedRow ? (this.selectedRow.find(el => el.name === 'id').value === row.find(el => el.name === 'id').value ? null : row) : row;
      // this.selectedRow = row === this.selectedRow ? null : row;
      this.$emit('selected-row-changed', this.selectedRow);
    },
    selectNextRow() {
      let index = 0;
      if (this.selectedRow) {
        index = this.filteredRows.indexOf(this.selectedRow) + 1;
      }
      if (this.filteredRows[index]) {
        this.selectRow(this.filteredRows[index]);
      }
    },
    selectPreviousRow() {
      let index = 0;
      if (this.selectedRow) {
        index = this.filteredRows.indexOf(this.selectedRow) - 1;
      }
      if (this.filteredRows[index]) {
        this.selectRow(this.filteredRows[index]);
      }
    },
    sortRows(column) {
      this.selectedRow = null;
      if (this.isSorted && this.sorting.column.name === column.name) {
        this.sorting.ascending = !this.sorting.ascending;
      }
      this.sorting.column = column;
    },
    filterRows(columnName, filter) {
      this.selectedRow = null;
      // let filteringOut = false;
      // if(typeof filter === 'string') {
      //   filteringOut = this.searchFilters[columnName].length > filter.length;
      // }
      let originalRowCount = this.filteredRows.length;
      this.searchFilters[columnName] = filter;
      if (
        this.rows.length == 0 ||
        (originalRowCount < this.rows.length &&
          this.rows.length == this.filteredRows.length)
      ) {
        this.$emit('requery-needed', this.searchFilters);
      }
    }
  }
};
</script>

<style scoped>
.radio.is-small, .checkbox.is-small {
	font-size: .75rem !important;
	line-height: .5rem;
}
i.fa-times {
  color: red;
}
i:not(.fa-times) {
  color: grey;
}

table.is-scrollable {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 5px;
  overflow: hidden;
}

.table.is-scrollable tr {
  display: table-row;
  vertical-align: inherit;
}
.table td,
th {
  display: table-cell;
  width: 8em;
  min-width: 8em;
  max-width: 8em;
  padding: 0.1em 0.2em !important;
  /* Important in case your data is too long for your cell */
  overflow: hidden;
  word-wrap: break-word;
}

.table tr.is-selected {
  background-color: #167df0;
}
table.is-scrollable thead, tfoot {
  flex: 1 0 auto;
  overflow-x: hidden;
  overflow-y: scroll;
  /* overflow: hidden; */
  scrollbar-base-color: rgb(230, 230, 230);
  scrollbar-face-color: rgb(230, 230, 230);
  scrollbar-highlight-color: rgb(230, 230, 230);
  scrollbar-track-color: rgb(230, 230, 230);
  scrollbar-arrow-color: rgb(230, 230, 230);
  scrollbar-shadow-color: rgb(230, 230, 230);
  /* scrollbar-dark-shadow-color: rgb(230, 230, 230); */
  background-color: rgb(230, 230, 230);
  cursor: pointer;
}

thead::-webkit-scrollbar { display: block; background-color: rgb(230, 230, 230); }
thead::-webkit-scrollbar-track { background-color: rgb(230, 230, 230); }

table.is-scrollable tbody {
  flex: 1 1 auto;
  overflow-y: scroll;
}

table.is-scrollable thead,
tbody {
  display: block;
  width: inherit;
}
table.is-scrollable .w1 {
  width: 1em;
  min-width: 1em;
  max-width: 1em;
}
table.is-scrollable .w2 {
  width: 2em;
  min-width: 2em;
  max-width: 2em;
}
table.is-scrollable .w3 {
  width: 3em;
  min-width: 3em;
  max-width: 3em;
}
table.is-scrollable .w4 {
  width: 4em;
  min-width: 4em;
  max-width: 4em;
}
table.is-scrollable .w5 {
  width: 5em;
  min-width: 5em;
  max-width: 5em;
}
table.is-scrollable .w6 {
  width: 6em;
  min-width: 6em;
  max-width: 6em;
}
table.is-scrollable .w7 {
  width: 7em;
  min-width: 7em;
  max-width: 7em;
}
table.is-scrollable .w8 {
  width: 8em;
  min-width: 8em;
  max-width: 8em;
}
table.is-scrollable .w9 {
  width: 9em;
  min-width: 9em;
  max-width: 9em;
}
table.is-scrollable .w10 {
  width: 10em;
  min-width: 10em;
  max-width: 10em;
}
table.is-scrollable .w12 {
  width: 12em;
  min-width: 12em;
  max-width: 12em;
}
table.is-scrollable .w14 {
  width: 14em;
  min-width: 14em;
  max-width: 14em;
}
table.is-scrollable .w16 {
  width: 16em;
  min-width: 16em;
  max-width: 16em;
}
table.is-scrollable .w18 {
  width: 18em;
  min-width: 18em;
  max-width: 18em;
}
table.is-scrollable .w20 {
  width: 20em;
  min-width: 20em;
  max-width: 20em;
}
table.is-scrollable .w22 {
  width: 22em;
  min-width: 22em;
  max-width: 22em;
}
table.is-scrollable .w24 {
  width: 24em;
  min-width: 24em;
  max-width: 24em;
}
table.is-scrollable .w26 {
  width: 26em;
  min-width: 26em;
  max-width: 26em;
}
table.is-scrollable .w28 {
  width: 28em;
  min-width: 28em;
  max-width: 28em;
}
table.is-scrollable .w30 {
  width: 30em;
  min-width: 30em;
  max-width: 30em;
}
table.is-scrollable .w32 {
  width: 32em;
  min-width: 32em;
  max-width: 32em;
}
table.is-scrollable .w34 {
  width: 34em;
  min-width: 34em;
  max-width: 34em;
}
table.is-scrollable .w36 {
  width: 36em;
  min-width: 36em;
  max-width: 36em;
}
table.is-scrollable .w38 {
  width: 38em;
  min-width: 38em;
  max-width: 38em;
}
table.is-scrollable .w40 {
  width: 40em;
  min-width: 40em;
  max-width: 40em;
}

.table:not(:last-child) {
  margin-bottom: 0;
}
</style>
