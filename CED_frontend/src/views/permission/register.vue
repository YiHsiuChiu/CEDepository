<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddCar">New Car</el-button>

    <el-table :data="carsList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="carAddress" width="220">
        <template slot-scope="scope">
          {{ scope.row.carAddress }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="carID" width="220">
        <template slot-scope="scope">
          {{ scope.row.carID}}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="contractAddress">
        <template slot-scope="scope">
          {{ scope.row.contractAddress}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button> -->
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Car':'New Car'">
      <el-form :model="car" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="car.carAddress" placeholder="Car Address" />
        </el-form-item>
        <!-- <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item> -->
        <!-- <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item> -->
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmCar">Confirm</el-button>
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getCars, addCar, deleteCar, updateRole } from '@/api/register'

// const defaultRole = {
//   key: '',
//   name: '',
//   description: '',
//   routes: []
// }
const defaultCar = {
    carAddress:'',
    carID:'',
    contractAddress:''
}

export default {
  data() {
    return {
      // role: Object.assign({}, defaultRole),
      car: {
              carAddress:'',
              carID:'',
              contractAddress:''
      },
      routes: [],
      carsList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    // this.getRoutes()
    this.getCars()
  },
  methods: {
    // async getRoutes() {
    //   const res = await getRoutes()
    //   this.serviceRoutes = res.data
    //   // this.routes = this.generateRoutes(res.data)
    // },
    async getCars() {
      const res = await getCars()
      // console.log(res)
      this.carsList = res.data
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    // generateRoutes(routes, basePath = '/') {
    //   const res = []

    //   for (let route of routes) {
    //     // skip some route
    //     if (route.hidden) { continue }

    //     const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

    //     if (route.children && onlyOneShowingChild && !route.alwaysShow) {
    //       route = onlyOneShowingChild
    //     }

    //     const data = {
    //       path: path.resolve(basePath, route.path),
    //       title: route.meta && route.meta.title

    //     }

    //     // recursive child routes
    //     if (route.children) {
    //       data.children = this.generateRoutes(route.children, data.path)
    //     }
    //     res.push(data)
    //   }
    //   return res
    // },
    // generateArr(routes) {
    //   let data = []
    //   routes.forEach(route => {
    //     data.push(route)
    //     if (route.children) {
    //       const temp = this.generateArr(route.children)
    //       if (temp.length > 0) {
    //         data = [...data, ...temp]
    //       }
    //     }
    //   })
    //   return data
    // },
    handleAddCar() {
      this.car = Object.assign({}, defaultCar)
      // if (this.$refs.tree) {
      //   this.$refs.tree.setCheckedNodes([])
      // }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.car = deepClone(scope.row)
      // this.$nextTick(() => {
      //   const routes = this.generateRoutes(this.role.routes)
      //   this.$refs.tree.setCheckedNodes(this.generateArr(routes))
      //   // set checked state of a node not affects its father and child nodes
      //   this.checkStrictly = false
      // })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the car?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          console.log("row.carAddress")
          console.log(row.carAddress)
          await deleteCar(row.carAddress)
          this.carsList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    // generateTree(routes, basePath = '/', checkedKeys) {
    //   const res = []

    //   for (const route of routes) {
    //     const routePath = path.resolve(basePath, route.path)

    //     // recursive child routes
    //     if (route.children) {
    //       route.children = this.generateTree(route.children, routePath, checkedKeys)
    //     }

    //     if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
    //       res.push(route)
    //     }
    //   }
    //   return res
    // },
    async confirmCar() {
      const isEdit = this.dialogType === 'edit'

      // const checkedKeys = this.$refs.tree.getCheckedKeys()
      // this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        await updateRole(this.car.carAddress, this.car)
        for (let index = 0; index < this.carsList.length; index++) {
          if (this.carsList[index].carAddress === this.car.carAddress) {
            this.carsList.splice(index, 1, Object.assign({}, this.car))
            break
          }
        }
      } else {
        const { data } = await addCar(this.car)
        // console.log('data')
        // console.log(data)
        // this.role.carAddress = data[0].carAddress
        this.car = data
        this.carsList.push(this.car)
        // console.log('roleList')
        // console.log(this.rolesList)
        // console.log(this.role)
      }

      const { carAddress, carID, contractAddress } = this.car
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>carAddress: ${carAddress}</div>
            <div>carID: ${carID}</div>
            <div>contractAddress: ${contractAddress}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
