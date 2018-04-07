//创建全局过滤器
//第一个参数是过滤器的名称，这里叫“money”
//第二个是我们的回调函数，其默认只有一个值，如果我们要再加的话就是我们在过滤器中传的参数了
Vue.filter("Money",function(value,type){
	return "$"+value.toFixed(2)+type;
})


var vm=new Vue({
	el:"#app",
	data:{
		//总金额
		totalMoney:0,
		//商品列表
		productList:[],
		//是否全选
		checkAllFlag:false,
		//删除
		delFlag:false,
		//要删除的产品
		curProduct:''
	},
	//局部过滤器
	filters:{
		formatMoney:function(value){
			return "$"+value.toFixed(2); //表示保留两位小数
			//其实这种价格应该是由后端来返回的，因为使用了toFixed()这样的函数可能会造成精度的丢失
		}
	},
	//编译好的HTML挂载到页面完成后执行的事件钩子
    //此钩子函数中一般会做些ajax请求获取数据
    //进行数据初始化
    //类似于构造函数
	mounted:function(){  //渲染完后会调用该函数里的方法
		//使用新的mounted钩子函数应该注意：并不能保证
    	//该实例已经插入文档，所以还应该在钩子函数中包含
   		//Vue.nextTick/this.$nextTick
   		this.$nextTick(function(){
   			vm.cartView();
   		});
   		//必须加这个才能保证vm和this代表的是同一个对象
	},
	methods:{
		cartView:function(){
			var _this=this;
//			_this.$http.get("data/cartData.json",{"id":123}).then(function(response){ //id是参数，后面函数接收一个response回调
//				_this.productList=response.data.result.list; //代表将回调里的result里的list赋值给_this.productList;
//				_this.totalMoney=response.data.result.totalMoney;
//			})
			axios.get("data/cartData.json",{"id":123}).then(function(response){
				_this.productList=response.data.result.list;
//				_this.totalMoney=response.data.result.totalMoney; //这里result写错了
			});
		},
		//改变商品数量
		changeMoney:function(product,way){
			if(way>0){
				product.productQuantity++;
			}else{
				if(product.productQuantity<1)
					product.productQuantity=1;
				product.productQuantity--;
			};
			this.calcTotalPrice();
		},
		//单选
		selectedProduct:function(item){
			if(typeof item.checked=='undefined'){
				//全局注册
				Vue.set(item,"checked",true); //代表向item里添加一个"checked"属性，默认值为true
				//局部注册
//				this.$set(item,"checked",true)
			}else{
				item.checked=!item.checked;
			};
			this.calcTotalPrice();
		},
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
			
			this.calcTotalPrice();
//			if(this.checkAllPlag){
//				//forEach(value,index)函数第一个参数为value，第二个参数为index;同jQuery刚好是相反的
//				this.productList.forEach(value,index){
//					if(typeof item.checked=='undefined'){
//						_this.$set(item,"checked",true);
//					}else{
//						item.checked=true;
//					}
//				}
//			}
		},
		//计算总金额
		calcTotalPrice:function(){
			var _this=this;
			this.totalMoney=0;
			this.productList.forEach(function(item,index){
				if(item.checked){
					_this.totalMoney+=item.productPrice*item.productQuantity;
				}
			});
		},
		delConfirm:function(item){
			this.delFlag=true;
			//把我们要删除的商品存起来
			this.curProduct=item;
		},
		delProduct:function(){
			//获取索引
			var index=this.productList.indexOf(this.curProduct);
			//使用js原生的splice（index，number）方法进行删除
			//表示从当前的index索引处开始删除number个元素
			this.productList.splice(index,1);
			//删除后，v-for会重新进行渲染
			this.delFlag=false;
		}
	}
});




















