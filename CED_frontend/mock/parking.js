const Mock = require('mockjs')
const fs = require('fs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment(1)',
    timestamp: +Mock.Random.date('T'),
    owner: '@title(5, 10)',
    token: Mock.Random.id()
  }))
}
fs.writeFile('user.json', JSON.stringify(List), (err) => {
  if (err) {
      throw err;
  }
  console.log("JSON data is saved.");
});


module.exports = [
  {
    url: '/tokenize/parking/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/tokenize/parking/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const parking of List) {
        if (parking.id === +id) {
          return {
            code: 20000,
            data: parking
          }
        }
      }
    }
  },

  {
    url: '/tokenize/parking/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/tokenize/parking/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/tokenize/parking/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

