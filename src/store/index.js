import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
  state: {
    carPanalDate: [] // 数组中存放购物车的每个商品数据
  },
  mutations: {
    addCarPanalData (state, data) {
      let bOff = true
      state.carPanalDate.forEach((goods) => {
        if (goods.sku_id === data.sku_id) {
          goods.count++
          bOff = false
        }
      })

      if (bOff) {
        let goodsDate = data
        Vue.set(goodsDate, 'count', 1)
        state.carPanalDate.push(goodsDate)
      }

      console.log(state.carPanalDate)
    }
  }
})

export default store
