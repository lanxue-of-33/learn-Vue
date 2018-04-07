###这里是一些小的错误记录
---
#### 使用v-for指令渲染商品列表
1. 使用vue-resource读取cartData.json文件里的数据（作用同从数据库中读取数据是一样的）：
```
cartView:function(){
			var _this=this;
			_this.$http.get("data/cartData.json",{"id":123}).then(function(response){ //id是参数，后面函数接收一个response回调
				_this.productList=response.data.result.list; //代表将回调里的result里的list赋值给_this.productList;
				_this.totalMoney=response.data.result.totalMoney;
			})
	}
	
//注意：response代表的是我们获取的回调，但当我们要读取其中的数据时，必须在res后加一个`data`才能成功；
//这样的原因是response会被封装在data中，所以我们要通过data进行调用
```
```
axios.get("data/cartData.json",{"id":123}).then(function(response){
				_this.productList=response.data.result.list;
				_this.totalMoney=response.data.result.totalMoney; //这里result写错了
			})
//这是使用axios代替vue-resource同`.json`文件进行数据读取
//好像现在的趋势就是使用axios进行开发吧
```

```
//改用箭头函数使表达式更见的简洁
axios.get("data/cartData.json",{"id":123}).then(response=>{
				this.productList=response.data.result.list;
				this.totalMoney=response.data.result.totalMoney; //这里result写错了
			})
//这里就不同在一开始就将`this`用`_this`来保存，并且可以直接在函数内部使用`this`
//这个原因是使用了箭头函数后可以保证`this`的作用域同外部的`this`作用域是相同的
//感觉挺神奇的，这好像是`ES6`的语法吧
```
2. 当我们的图片没有被渲染出来时，可能有连个原因
```
//.图片没有被正确的渲染，正确用法是用`v-bind:src=""`进行图片的渲染
<img v-bind:src="item.productImage" alt="烟">
//这样写会出错
<img src="item.productImage" alt="烟">

//2.错误的原因是`cartData.json`中的图片路径写错了，我们应该对其进行修正
```
---

#### vue过滤器的使用


---
#### 单件商品金额计算和单选全选功能
1. 属性`checkAllFlag`搞错了其父对象
```
<a href="javascript:void 0" v-bind:class="{'check':item.checkAllFlag}" >
//错误在这里，checkAllFlag是data里属性，而我们这样写表示checkAllFlag是item的属性，但item里其实没有这个属性，所以会一直报错
//正确的写法如下：<a href="javascript:void 0" v-bind:class="{'check':checkAllFlag}" >

//自己会犯这个错误是受了前一个单选的影响
<a href="javascript:void 0" class="item-check-btn" v-bind:class="{'check':item.checked}" @click="selectedProduct(item)">
```
---
#### 商品总金额计算
1. 因为我们这里总金额并非是数据双向绑定的，所以其数据的改变需要我们掉用相应的方法来改变；
   即我们单选，全选以及改变数量时都应该调用总金额的计算方法。
   
---
#### 删除功能的实现
[全局过滤器应该放在vue实例创建的前面](https://www.cnblogs.com/woaic/p/5525462.html)
1. 
