import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
  state: {
    carPanelData: [] // 数组中存放购物车的每个商品数据
  },
  getters: {
    totalCount (state) { // 购物车商品总数
      let count = 0
      state.carPanelData.forEach((goods) => {
        count += goods.count
      })
      return count
    },
    totalPrice (state) { // 购物车商品总价
      let price = 0
      state.carPanelData.forEach((goods) => {
        price += goods.price * goods.count
      })
      return price
    }
  },
  mutations: {
    addCarPanalData (state, data) {
      let bOff = true
      state.carPanelData.forEach((goods) => {
        // 如果该商品已存在购物车，则直接使商品数量加 1
        if (goods.sku_id === data.sku_id) {
          goods.count++
          bOff = false
        }
      })

      // 如果商品不存在，则添加到购物车
      if (bOff) {
        let goodsData = data
        Vue.set(goodsData, 'count', 1) // 给对象goodsData设置属性 count，并赋值为 1
        state.carPanelData.push(goodsData)
      }

      console.log(state.carPanelData)
    }
  }
})

export default store
