<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.id" placeholder="ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-input v-model="listQuery.carID" placeholder="Car ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-input v-model="listQuery.owner" placeholder="Owner address" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button> -->
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button> -->
      <!-- <el-button type="primary" @click="clear">
        Clear
      </el-button> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!-- <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="CarID" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.carID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Timestamp" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.timestamp }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="User Address" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.user }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="ShowCurrent(row,row.index)">
            Current Event
          </el-button>
          <el-button size="mini" type="danger" @click="ShowPast(row,row.index)">
            Past Events
          </el-button>
          <!-- <el-button size="mini" type="danger" @click="handleRedeem(row,$index)">
            Redeem
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <!-- <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left">
        <el-form-item v-if="dialogStatus==='create'" label="Token ID" prop="token">
          <el-input v-model="temp.token" />
        </el-form-item>
        <el-form-item label="Owner Address" prop="owner">
          <el-input v-model="temp.owner" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div> -->
        <el-table :data="tableData" :key="tableDataKey">
          <el-table-column prop="header" label="header" >
          </el-table-column>
          <el-table-column prop="data" label="data" >
          </el-table-column>
        </el-table>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="past_dialogFormVisible">
        <el-table :data="past_tableData" >
          <el-table-column prop="header" label="header" >
          </el-table-column>
          <el-table-column prop="data" label="data" >
          </el-table-column>
        </el-table>
        <div class="right-items" style="position:absolute; right:2px; bottom:2px;">
          <el-button-group>
            <el-button @click = changedata(-1) size="mini" type="primary" icon="el-icon-arrow-left">Prev</el-button>
            <el-button @click = changedata(1) size="mini" type="primary">Next<i class="el-icon-arrow-right el-icon--right"></i></el-button>
          </el-button-group>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchallList,fetchList} from '@/api/search'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      // tableData: [{
      //     header: 'CarID',
      //     data: 'test',
      //   }, {
      //     header: 'vin',
      //     data: 'test',
      //   }, {
      //     header: 'longitude',
      //     data: 'test',
      //   }, {
      //     header: 'latitude',
      //     data: 'test',
      //   }, {
      //     header: 'timestamp',
      //     data: 'test',
      //   }, {
      //     header: 'speed',
      //     data: 'test',
      //   }, {
      //     header: 'acceleratorPos',
      //     data: 'test',
      //   }, {
      //     header: 'PRNDL',
      //     data: 'test',
      //   }, {
      //     header: 'travelDirection',
      //     data: 'test',
      //   }, {
      //     header: 'steeringWheelPos',
      //     data: 'test',
      //   }, {
      //     header: 'acceleration',
      //     data: 'test',
      //   }, {
      //     header: 'tirePressureLF',
      //     data: 'test',
      //   }, {
      //     header: 'tirePressureRF',
      //     data: 'test',
      //   }, {
      //     header: 'tirePressureLR',
      //     data: 'test',
      //   }, {
      //     header: 'tirePressureRR',
      //     data: 'test',
      //   }, {
      //     header: 'status',
      //     data: 'test',
      //   }, {
      //     header: 'note',
      //     data: 'test',
      //   }],
      tableData: [],
      past_tableData: [],
      tableKey: 0,
      tableDataKey: 0,
      list: null,
      past_list: null,
      total: 0,
      past_event_total:0,
      past_event_index:0,
      listLoading: true,
      listQuery: {
        page: 1,
        carID:undefined,
        limit: 20,
        token: undefined,
        owner: undefined,
        ip: undefined,
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      temp: {
        // id: undefined,
        timestamp: new Date(),
        token: '',
        owner: '',
        user: '',
        ip: ''
      },
      dialogFormVisible: false,
      past_dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        current: 'Current Event Data',
        past: 'Past Events Data'
      },
      rules: {
        token: [{ required: true, message: 'token is required', trigger: 'change' }, { pattern: /^[1-9][0-9]*$/, message: 'Must be a number', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        owner: [{ required: true, message: 'owner is required', trigger: 'change' }, { pattern: /^0x[a-fA-F0-9]{40}$/, message: 'Must be a vaild ETH account', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      console.log(this.listQuery)
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.length

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    // getPastEvents(){
    //   this.listLoading = true;
    //   fetchList(this.listQuery).then(response => {
    //     this.past_list = response.data
    //     this.total = response.data.length

    //     // Just to simulate the time of the request
    //     setTimeout(() => {
    //       this.listLoading = false
    //     }, 0.5 * 1000)
    //   })
    // },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        // id: undefined,
        timestamp: new Date(),
        token: '',
        owner: ''
      }
    },
    clear() {
      console.log("closeall")
      this.$notify.closeAll()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = this.list.length + 1 // mock a id
          this.temp.owner = this.temp.owner.toLowerCase()
          this.$notify({
            title: 'Waiting',
            group: 'waiting',
            message: 'Waiting for transaction result (up to 60 sec)',
            type: 'warning',
            duration: 60000
          })
          createParking(this.temp).then((res) => {
            // this.temp.id = res.id
            this.temp.user = this.temp.owner
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify.closeAll()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    changedata(num){
      console.log("past_total")
      console.log(this.past_event_index)
      console.log((this.past_event_index+num)%this.past_event_total)
      this.past_event_index = (this.past_event_index+num)%this.past_event_total
      if(this.past_event_index<0)
        this.past_event_index = this.past_event_total -1
      this.past_tableData = []
      let key,val;
      let dic = this.past_list[this.past_event_index]
      for([key, val] of Object.entries(dic)){
        this.past_tableData.push({'header':key,'data':val})
      }
    },
    ShowCurrent(row,index) {
      this.tableData = []; 
      console.log('index')
      console.log(row)
      // this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'current'
      this.dialogFormVisible = true
      fetchallList().then(response => {
        console.log('response.data')
        console.log(response.data)
        let key,val;
        let dic = response.data[parseInt(index)].current_event
        for([key, val] of Object.entries(dic)){
          this.tableData.push({'header':key,'data':val})
        }
        console.log(this.tableData)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    ShowPast(row,index) {
      this.past_tableData = []; 
      console.log("index")
      console.log(index)
      this.dialogStatus = 'past'
      this.past_dialogFormVisible = true
      fetchallList().then(response => {
        console.log('response.data')
        console.log(response.data)
        this.past_list = response.data[parseInt(index)].past_event
        console.log("past_list")
        console.log(this.past_list)
        let key,val;
        let dic = response.data[parseInt(index)].past_event[0]
        this.past_event_total =  response.data[parseInt(index)].past_event.length
        this.past_event_index = 0
        for([key, val] of Object.entries(dic)){
          this.past_tableData.push({'header':key,'data':val})
        }
        console.log(this.past_tableData)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.owner = tempData.owner.toLowerCase()
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          this.$notify({
            title: 'Waiting',
            group: 'waiting',
            message: 'Waiting for transaction result (up to 60 sec)',
            type: 'warning',
            duration: 60000
          })
          updateParking(tempData).then(() => {
            const index = this.list.findIndex(v => v.token === this.temp.token)
            this.temp.owner = this.temp.owner.toLowerCase()
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify.closeAll()
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Waiting',
        group: 'waiting',
        message: 'Waiting for transaction result (up to 60 sec)',
        type: 'warning',
        duration: 60000
      })
      deleteParking(row).then(() => {
        this.list.splice(index, 1)
        this.$notify.closeAll()
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleRedeem(row, index) {
      this.$notify({
        title: 'Waiting',
        group: 'waiting',
        message: 'Waiting for transaction result (up to 60 sec)',
        type: 'warning',
        duration: 60000
      })
      redeemParking(row).then(() => {
        const tempData = Object.assign({}, row)
        tempData.user = tempData.owner
        this.list.splice(index, 1, tempData)
        this.$notify.closeAll()
        this.$notify({
          title: 'Success',
          message: 'Redeem Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Token ID', 'Owner address']
        const filterVal = ['token', 'owner']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
