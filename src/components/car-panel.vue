<template>
  <li class="nav-cart" @mouseenter="showCar" @mouseleave="hideCar">
    <a href="javascript:;" class="ball-rect">购物车</a>
    <!--根据class改变颜色-->
    <span class="cart-empty-num" :class="{'cart-num':totalCount>0}">
      <i>{{totalCount}}</i>
    </span>
    <div class="nav-cart-wrapper"  v-if="carShow">
      <div class="nav-cart-list">
        <div class="empty" v-if="totalCount<=0">
          <h3>购物车为空</h3>
          <p>您还没有选购任何商品，现在前往商城选购吧!</p>
        </div>
        <div class="full" v-else>
          <div class="nav-cart-items">
            <ul>
              <li class="clear" v-for="item,index in carPanelData">
                <div class="cart-item js-cart-item cart-item-sell">
                  <div class="cart-item-inner">
                    <div class="item-thumb">
                      <img :src="item.ali_image+'?x-oss-process=image/resize,w_80/quality,Q_100/format,webp'">
                    </div>
                    <div class="item-desc">
                      <div class="cart-cell">
                        <h4> 
                          <a href="">{{item.title}}</a>
                        </h4>
                        <p class="attrs">
                          <span>{{item.spec_json.show_name}}</span>
                        </p>
                        <h6>
                          <span class="price-icon">¥</span><span class="price-num">{{item.price}}</span><span class="item-num">x {{item.count}}</span>
                        </h6>
                      </div>
                    </div>
                    <div class="del-btn" @click="delCarPanelData(item.sku_id)">删除</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="nav-cart-total">
            <p>共 <strong class="ng-binding">{{totalCount}}</strong> 件商品</p>
            <h5>合计：<span class="price-icon">¥</span><span class="price-num ng-binding" ng-bind="cartMenu.totalPrice">{{totalPrice}}</span></h5>
            <h6>
              <a ng-href="http://www.smartisan.com/shop/#/cart" class="nav-cart-btn" href="http://www.smartisan.com/shop/#/cart">去购物车</a>
            </h6>
          </div>
        </div>
      </div>
    </div>
    <!-- 购物车小球飞入效果 -->
    <transition
      name="ball"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      :css="true"
    >
      <div class="addcart-mask" v-show="ball.show">
        <img class="mask-item" />
      </div>
    </transition>
  </li>
</template>

<script>
export default {
  computed: {
    carPanelData () {
      return this.$store.state.carPanelData
    },
    totalCount () {
      return this.$store.getters.totalCount
    },
    totalPrice () {
      return this.$store.getters.totalPrice
    },
    carShow () {
      return this.$store.state.carShow
    },
    ball () {
      return this.$store.state.ball
    }
  },
  methods: {
    delCarPanelData (id) {
      this.$store.commit('delCarPanelData', id)
    },
    showCar () {
      this.$store.commit('showCar')
    },
    hideCar () {
      this.$store.commit('hideCar')
    },
    beforeEnter (el) {
      /*
        getBoundingClientRect()方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离。
      */
      let rect = this.ball.getBoundingClientRect()
      let rectEl = document.getElementsByClassName('ball-rect')[0].getBoundingClientRect() // 这里不能用ref,因为只有在挂载完成以后，才能取到$refs
      let ball = document.getElementsByClassName('mask-item')[0]

      let x = (rectEl + 16) - (rect.left + rect.width / 2)
      let y = (rect.top + rect.height / 2) - (rect.top + 11)

      el.style.transform = 'translate3d(0,' + y + 'px, 0)'
      ball.style.transform = 'translate3d(' + x + 'px, 0, 0)'
      ball.src = this.ball.img
    },
    enter () {

    },
    afterEnter () {

    }
  }
}
</script>

<style>

</style>
