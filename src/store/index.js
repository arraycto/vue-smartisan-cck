import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
  state: {
    carPanelData: [], // 数组中存放购物车的每个商品数据
    maxOff: false, // 购物车数量是否达到最大值
    carShow: false, // 购物车是否显示
    carTimer: null, // 收起购物车的动作是否延迟
    ball: {
      show: false,
      el: null, // 小球的父集
      img: ''
    }
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
    // 天假商品至购物车
    addCarPanalData (state, data) {
      let bOff = true
      state.carPanelData.forEach((goods) => {
        // 如果该商品已存在购物车，则直接使商品数量加 1
        if (goods.sku_id === data.sku_id) {
          goods.count++
          bOff = false

          if (goods.count > goods.limit_num) { // 判断是否达到最大值
            goods.count = goods.limit_num
            state.maxOff = true
            return
          }

          state.carShow = true
        }
      })

      // 如果商品不存在，则添加到购物车
      if (bOff) {
        let goodsData = data
        Vue.set(goodsData, 'count', 1) // 给对象goodsData设置属性 count，并赋值为 1
        state.carPanelData.push(goodsData)
        state.carShow = true
      }

      state.ball.show = true
      state.ball.img = data.ali_image
      console.log(event)
      state.ball.el = event.path[0]
    },

    // 从购物车删除商品
    delCarPanelData (state, id) {
      state.carPanelData.forEach((goods, index) => {
        if (goods.sku_id === id) {
          state.carPanelData.splice(index, 1)
        }
      })
    },

    // 关闭弹窗
    closePrompt (state) {
      state.maxOff = false
    },

    // 展开购车
    showCar (state) {
      clearTimeout(state.carTimer) // 清空延时动作
      state.carShow = true
    },

    // 收起购车
    hideCar (state) {
      state.carTimer = setTimeout(() => {
        state.carShow = false
      }, 500)
    }

  }
})

export default store
