<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.username" placeholder="Username" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
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
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Username" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Roles" min-width="30px">
        <template slot-scope="{row}">
          <span>{{ row.roles }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Introduction" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Avatar" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.avatar }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Token" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.token }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left">
        <el-form-item label="Username" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="temp.password"
            type="password"
          />
        </el-form-item>
        <el-form-item label="Roles (comma to separate mutiple roles)" prop="roles">
          <el-input v-model="temp.roles" />
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="Introduction" prop="introduction">
          <el-input v-model="temp.introduction" />
        </el-form-item>
        <el-form-item label="Avatar" prop="avatar">
          <el-input v-model="temp.avatar" />
        </el-form-item>
        <el-form-item label="Token" prop="token">
          <el-input v-model="temp.token" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createUser, updateUser, deleteUser } from '@/api/user'
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
        username: undefined,
        id: undefined,
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      temp: {
        id: undefined,
        timestamp: new Date(),
        token: '',
        username: '',
        password: '',
        introduction: '',
        avatar: '',
        roles: '',
        name: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        username: [{ required: true, message: 'username is required', trigger: 'change' }, { pattern: /^[\w\d]{3,128}$/, message: 'Not a vaild username', trigger: 'change' }],
        password: [{ required: true, message: 'password is required', trigger: 'change' }, { pattern: /^.{3,128}$/, message: 'Not a vaild password', trigger: 'change' }],
        roles: [{ required: true, message: 'roles is required', trigger: 'change' }, { pattern: /^\w+(\,\w+)*$/, message: 'Not a vaild roles', trigger: 'change' }]
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
      fetchList(this.listQuery).then(response => {
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
        id: undefined,
        timestamp: new Date(),
        token: '',
        owner: ''
      }
    },
    clear() {
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
          // this.temp.author = 'vue-element-admin'
          // this.$notify({
          //   title: 'Waiting',
          //   group: 'waiting',
          //   message: 'Waiting for transaction result (up to 60 sec)',
          //   type: 'warning',
          //   duration: 60000
          // })
          createUser(this.temp).then((res) => {
            this.temp.id = res.id
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.roles = this.temp.roles.toString()
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // this.$notify({
          //   title: 'Waiting',
          //   group: 'waiting',
          //   message: 'Waiting for transaction result (up to 60 sec)',
          //   type: 'warning',
          //   duration: 60000
          // })
          updateUser(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
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
      // this.$notify({
      //   title: 'Waiting',
      //   group: 'waiting',
      //   message: 'Waiting for transaction result (up to 60 sec)',
      //   type: 'warning',
      //   duration: 60000
      // })
      deleteUser(row).then(() => {
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', 'Username', 'Roles', 'Introduction', 'Avatar', 'Name', 'Token']
        const filterVal = ['id', 'username', 'roles', 'introduction', 'avatar', 'name', 'token']
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
