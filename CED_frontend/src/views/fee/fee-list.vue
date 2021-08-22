<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.account" placeholder="Account" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-button type="primary" @click="clear">
        Clear
      </el-button>
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
       <el-table-column label="User" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Fee" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.fee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Time" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getFee } from '@/api/fee'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        itemId: undefined,
        account: undefined,
        sort: '+time'
      },
      sortOptions: [{ label: 'Newest First', key: '+time' }, { label: 'Oldest First', key: '-time' }],
      downloadLoading: false
    }
  },
  created: async function() {
    await this.connect()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getFee(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'time') {
        this.sortByTime(order)
      }
    },
    sortByTime(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+time'
      } else {
        this.listQuery.sort = '-time'
      }
      this.handleFilter()
    },
    clear() {
      this.$notify.closeAll()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', 'Token ID', 'Owner address']
        const filterVal = ['id', 'token', 'owner']
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
    },
    connect: async function() {
      if (!this.checkMetaMask) return false
      await window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(this.handleAccountsChanged)
        .catch((error) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log('Please connect to MetaMask.')
          } else {
            console.error(error)
          }
        })
    },
    handleAccountsChanged: function(result) {
      console.log(result)
      this.listQuery.account = result[0]
      console.log('success')
    },
    checkMetaMask() {
      if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!')
        return true
      }
      return false
    }
  }
}
</script>
