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
              <router-link class="nav-cart-btn" to="/cart">去购物车</router-link>
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
      <div class="addcart-mask" v-show="ball.show">  <!-- 外面包裹小球的父集  纵向移动（贝塞尔） -->
        <img class="mask-item" /> <!-- 小球  横向移动（线性）-->
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
    beforeEnter (ev) {
      /*
        beforeEnter : 刚刚按下鼠标时（点击加入购物车的按钮），记录小球的初始位置
        enter : 按下鼠标后，开始运动
        afterenter : 运动结束

        rect 记录了“加入购物车”这个按钮的位置
        rectEl 记录了购物车所在的位置

        x和y 分别代表按钮和购物车的距离
      */
      let rect = this.ball.el.getBoundingClientRect()
      let rectEl = document.getElementsByClassName('ball-rect')[0].getBoundingClientRect() // 这里不能用ref,因为只有在挂载完成以后，才能取到$refs
      let ball = document.getElementsByClassName('mask-item')[0]

      let x = (rectEl.left + 15) - (rect.left + rect.width / 2)
      let y = (rect.top + rect.height / 2) - (rectEl.top + 10)

      ev.style.transform = 'translate3d(0,' + y + 'px, 0)'
      ball.style.transform = 'translate3d(-' + x + 'px, 0, 0)'
      ball.src = this.ball.img
    },
    enter (ev) {
      let a = ev.offsetHeight // 主动触发浏览器重绘(这里要求浏览器给出该元素的高度，所以浏览器不得不立即重排，参考http://www.ruanyifeng.com/blog/2015/09/web-page-performance-in-depth.html)
      ev.a = a // 这一句仅仅为了让浏览器不报错（定义了a，不用不行）
      ev.style.transform = 'translate3d(0, 0, 0)' // 让小球外面父集回到原点
      document.getElementsByClassName('mask-item')[0].style.transform = 'translate3d(0, 0, 0)' // 让小球回到原点
    },
    afterEnter (ev) {
      this.ball.show = false
    }
  }
}
</script>

<style>
  /*购物车*/
  .nav-cart{
    margin-left: 21px;
    width: 61px;
  }
  .nav-cart>a{
    display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 1;
  }
  .nav-cart>a:before{
    content: ' ';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 30px;
      height: 20px;
      background: url(../assets/img/account-icon.png) -150px -22px;
      background-size: 240px 107px;
  }
  .nav-cart:hover>a:before{
    background-position: 0 -22px;
  }
  .cart-empty-num{
    position: relative;
      margin-left: 31px;
      margin-top: -1px;
      min-width: 30px;
      text-indent: 0;
      line-height: 20px;
  }
  .cart-empty-num i{
    font-style: normal;
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 10px;
      color: #fff;
      font-size: 12px;
      text-align: center;
      background: #969696;
      background-image: linear-gradient(#A4A4A4,#909090);
      box-shadow: inset 0 0 1px #838383, 0 1px 2px #838383;
  }
  .cart-num i {
    background: #eb746b;
      background-image: linear-gradient(#eb746b,#e25147);
      box-shadow: inset 0 0 1px rgba(255,255,255,.15), 0 1px 2px rgba(255,255,255,.15);
  }
  .nav-cart-wrapper{
      position: absolute;
      right: 0;
      padding-top: 18px;
      opacity: 1;
      top: 18px;
      z-index: 30;
      width: 360px;
  }
  .nav-cart-wrapper:before{
      position: absolute;
      content: ' ';
      background: url(../assets/img/account-icon.png) no-repeat -49px -43px;
      -webkit-background-size: 240px 107px;
      background-size: 240px 107px;
      width: 20px;
      height: 8px;
      right: 34px;
      top: 10px;
      z-index: 11;
  }
  .nav-cart.active .nav-cart-wrapper{
    display: block;
    top: 18px;
    opacity: 1;
    visibility: visible;
  }
  .nav-cart-list{
    position: relative;
      z-index: 10;
      background: #fff;
      border: 0 solid rgba(255,255,255,.01);
      border-radius: 8px;
      box-shadow: 0 0 0 1px rgba(0,0,0,.06), 0 20px 40px rgba(0,0,0,.15);
      overflow: hidden;
  }
  .nav-cart-list .empty{
    overflow: hidden;
      height: 134px;
      padding-top: 180px;
      background: url(../assets/img/cart-empty.png) center 90px no-repeat;
      background-size: auto 62px;
      text-align: center;
  }
  .nav-cart-list .empty h3{
    font-size: 18px;
      color: #333;
      margin-bottom: 7px;
  }
  .nav-cart-list .empty p{
    font-size: 12px;
      color: #bcbcbc;
  }
  .nav-cart-list .full{
    border-radius: 8px;
      overflow: hidden;
  }
  .nav-cart-list .nav-cart-items{
    max-height: 665px;
      overflow-x: hidden;
      overflow-y: auto;
  }
  .nav-cart-list .cart-item{
    height: 120px;
      width: 100%;
      overflow: hidden;
      border-top: 1px solid #f0f0f0;
  }
  .nav-cart-list .cart-item:first-child{
    border-top: none;
      border-radius: 8px 8px 0 0;
      overflow: hidden;
  }
  .nav-cart-list .cart-item-inner{
    height: 80px;
      padding: 20px;
      position: relative;
  }
  .nav-cart-list .item-thumb{
    position: relative;
      float: left;
      width: 80px;
      height: 80px;
      border-radius: 3px;
  }
  .nav-cart-list .item-thumb:before{
    content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 2;
      border: 1px solid #f0f0f0;
      border: 0 solid transparent;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,.06);
      border-radius: 3px;
  }
  .nav-cart-list .item-thumb img{
    display: block;
      width: 80px;
      height: 80px;
      border-radius: 3px;
      overflow: hidden;
  }
  .nav-cart-list .item-desc{
    margin-left: 98px;
      display: table;
      width: 205px;
      height: 80px;
  }
  .nav-cart-list .cart-cell{
    display: table-cell;
      vertical-align: middle;
  }
  .nav-cart-list .item-desc h4, .nav-cart-list .item-desc h4 a{
    color: #000;
  }
  .nav-cart-list .item-desc h4{
    width: 185px;
      overflow: hidden;
      word-break: keep-all;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 14px;
      line-height: 16px;
      margin-bottom: 10px;
  }
  .nav-cart-list .item-desc .attrs{
    font-size: 0;
  }
  .nav-cart-list .item-desc .attrs span{
    position: relative; */
      display: inline-block;
      margin-right: 20px;
      font-size: 14px;
      line-height: 14px;
      color: #999;
  }
  .nav-cart-list .item-desc .attrs span:last-child{
    margin-right: 0;
  }
  .nav-cart-list .item-desc h6{
    color: #cacaca;
      font-size: 12px;
      line-height: 14px;
      margin-top: 20px;
  }
  .nav-cart-list .del-btn{
    cursor: pointer;
      display: none;
      overflow: hidden;
      width: 20px;
      height: 20px;
      position: absolute;
      right: 20px;
      top: 50%;
      margin-top: -11px;
      background: url(../assets/img/account-icon.png) -50px -60px no-repeat;
      background-size: 240px 107px;
      text-indent: -9999em;
  }
  .nav-cart-list .cart-item:hover .del-btn{
    display: block;
  }
  .nav-cart-list .del-btn:hover{
    background-position: -75px -60px; 
  }
  .nav-cart-list .nav-cart-total{
    position: relative;
      padding: 20px;
      height: 40px;
      background: #fafafa;
      border-top: 1px solid #f0f0f0;
      border-radius: 0 0 8px 8px;
      box-shadow: inset 0 -1px 0 rgba(255,255,255,.5), 0 -3px 8px rgba(0,0,0,.04);
      background: linear-gradient(#fafafa,#f5f5f5);
  }
  .nav-cart-list .nav-cart-total p{
    margin-bottom: 4px;
      line-height: 16px;
      font-size: 12px;
      color: #c1c1c1;
  }
  .nav-cart-list .nav-cart-total h5{
    line-height: 20px;
      font-size: 14px;
      color: #6f6f6f;
  }
  .nav-cart-list .nav-cart-total h5 span{
    font-size: 18px;
      color: #de4037;
      display: inline-block;
      font-weight: 700;
  }
  .nav-cart-list .nav-cart-total h5 span:first-child{
    font-size: 12px;
      margin-right: 5px;
  }
  .nav-cart-list .nav-cart-total h5 span{
    font-size: 18px;
      color: #de4037;
      display: inline-block;
      font-weight: 700;
  }
  .nav-cart-list .nav-cart-total h6{
    position: absolute;
      right: 20px;
      top: 20px;
      width: 108px;

  }
  .nav-aside .nav-cart-btn{
    display: block;
      height: 38px;
      background: #688fe8;
      background: linear-gradient(#688fe8,#5079e1);
      border: 1px solid #5c81e3;
      border-radius: 6px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 1px 3px rgba(0,0,0,.2);
      line-height: 38px;
      text-align: center;
      color: #FFF;
      text-shadow: 0 -1px 0 rgba(0,0,0,.15)
  }

  /*定义小球的位置，在右上角*/
  .addcart-mask{
    position: absolute;
    left: 0;
    top: -5px;
    padding: 0;
    width: 32px;
    height: 32px;
    /*background: red;*/
    pointer-events: none;
    z-index: 240;
    transform: translate3d(0,0,0);
  }
  .mask-item{
    pointer-events: none;
    width: 32px;
    height: 32px;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 0 1px rgba(0,0,0,.05), 0 3px 8px rgba(0,0,0,.1);
    background-size: contain;
    transform: translate3d(0,0,0);
  }
  .ball-enter-active{
    transition: .5s cubic-bezier(.14,1.06,.73,1.09);
  }
  .ball-enter-active .mask-item{
    transition: .5s linear;
  }
</style>
