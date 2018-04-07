### 这里是项目开发的简单流程介绍
---

#### 使用v-for指令渲染商品列表
1. 构建如下属性：
```
//编译好的HTML挂载到页面完成后执行的事件钩子
    //此钩子函数中一般会做些ajax请求获取数据
    //进行数据初始化
	mounted:function(){  //渲染完后会调用该函数里的方法
		//使用新的mounted钩子函数应该注意：并不能保证
    	//该实例已经插入文档，所以还应该在钩子函数中包含
   		//Vue.nextTick/this.$nextTick
   		this.cartView();
	},
```
2. 然后再创建`.cartView()`方法读取`cartData.json`文件中的数据；
再在页面中渲染我们所读取并存储在`productList`中的数据；

3. 计算总金额：
```
	//首先，进行输入框数据的绑定：
	<input type="text" value="0" disabled v-model="item.productQuantity">
	//其次，计算总金额：用产品数量`item.productQuantity`乘以产品单价`item.productPrice`,注意不要写错了属性，否则会出错
```
---

#### vue过滤器的使用
1. 分为局部过滤器和全局过滤器
```
//局部过滤器
	filters:{
		formatMoney:function(value){
			return "$"+value.toFixed(2); //表示保留两位小数
			//其实这种价格应该是由后端来返回的，因为使用了toFixed()这样的函数可能会造成精度的丢失
		}
	},
```
使用：`<div class="item-price">{{item.productPrice | formatMoney}}</div>`
```
//创建全局过滤器
//第一个参数是过滤器的名称，这里叫“money”
//第二个是我们的回调函数，其默认只有一个值，如果我们要再加的话就是我们在过滤器中传的参数了
Vue.filter("Money",function(value,type){
	return "$"+value.toFixed(2)+type;
})
```
使用：`<div class="item-price-total" >{{item.productPrice*item.productQuantity | Money('元')}}</div>`
<br/>
由上可知当我们需要给过滤器额外加参数时才需要在调用过滤器时传入参数；不加参数直接写过滤器的名字会默认的传入我们需要处理的值；

---
#### 单间商品金额计算和单选全选功能
1. 通过点击`+`和`-`号来控制商品数量的增加和减少（使用`v-on:click`或缩写`@click`来绑定事件）
```
<a href="javascript:void 0" v-on:click="changeMoney(item,-1)">-</a>
<a href="javascript:void 0" @click="changeMoney(item,+1)">+</a>
//item传递操作对象，参数`+1`和`-1`来判断我们需要增加还是减少商品

//下面的就是我们自定义的商品数量控制函数
changeMoney:function(product,way){
			if(way>0){
				product.productQuantity++;
			}else{
				product.productQuantity--;
			}
		}
```

2. 单选功能的实现：思路就是当我们单击相应的链接时，为其绑定相应的class属性
```
<a href="javascript:void 0" class="item-check-btn" v-bind:class="{'check':item.checked}" @click="selectedProduct(item)">
                          <svg class="icon icon-ok"><use xlink:href="#icon-ok"></use></svg>
                        </a>
//注意：绑定的class也应该是个对象或数组，我们这里采用的是对象的方式，即是用的是大括号

//单击事件的实现方式如下：
selectedProduct:function(item){
			if(typeof item.checked=='undefined'){
				//全局注册
				Vue.set(item,"checked",true); //代表向item里添加一个"checked"属性，默认值为true
				//局部注册
//				this.$set(item,"checked",true)
			}else{
				item.checked=!item.checked;
			}
		}
//首先，我们是向item中添加`checked`属性，使用的是全局注册`Vue.set()`或局部注册`this.$set()`方法
//判断`checked`属性是否存在的方法是`typeof item.checkec== "undefined"`
```

3. 全选功能的实现
```
//全选函数
checkAll:function(flag){
			//flag是用来区分我们是取消全选还是全选
			this.checkAllFlag=flag;
			var _this=this;
			//定义上面的变量的原因是因为在函数之中，this的作用域会发生变化
			
			//我们可以使用遍历的方法来做
			_this.productList.forEach(function(item,index){
				if(typeof item.checked== 'undefined'){
					_this.$set(item,"checked",_this.checkAllFlag);
				}else{
					item.checked=_this.checkAllFlag;
				}
			});
}
//主要就是控制`class`的添加于删除

//点击
<a href="javascript:void 0" class="item-check-btn" v-bind:class="{'check':item.checked}" @click="selectedProduct(item)"></a>
//我们需要特别注意`class`属性是添加在<a></a>里还是其它的里面

//这里使用到的知识点还是属性的绑定：v-bind:class="{}"
//里面主要是用到了对象的形式
```

---
#### 商品总金额计算
1. 我们这里实现的思路是：遍历所有的item，如果被选中(item.checked为真)，就将其金额加到总金额里面；
```
calcTotalPrice:function(){
			var _this=this;
			this.totalMoney=0;
			this.productList.forEach(function(item,index){
				if(item.checked){
					_this.totalMoney+=item.productPrice*item.productQuantity;
				}
			});
		}
		
//为了防止出现总金额会一直叠加的情况，需要在每次一开始的时候就将总金额置0
```

---
#### 删除功能的实现
1. 在data总添加`delFlag`和`curProduct`属性来判断是否要删除以及存储要删除的项目；
2. 要删除是即为相应的位置绑定class`md-show`；
3. 选中要删除的项目：
```
delConfirm:function(item){
			this.delFlag=true;
			//把我们要删除的商品存起来
			this.curProduct=item;
		},
```
4. 使用原生的js方法`splice()`来从数组之中删除item;
```
delProduct:function(){
			//获取索引
			var index=this.productList.indexOf(this.curProduct);
			//使用js原生的splice（index，number）方法进行删除
			//表示从当前的index索引处开始删除number个元素
			this.productList.splice(index,1);
			//删除后，v-for会重新进行渲染
			this.delFlag=false;
		}
```
