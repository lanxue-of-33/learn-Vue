var tt=new Vue({
	
	el:'.container',
	
	data:{
		//需要显示的记录数量
		limitNum:3,
		addressList:[],
		currentIndex:0,
		shippingMethods:1,
		//删除判断
		delFlag:false,
		//要删除的地址
		curAddress:''
	},
	
	mounted:function(){
		this.$nextTick(function(){
   			tt.getAddressList();
   		});
	},
	
	//一般用于实时的计算
	computed:{
		filterAddress:function(){
			return this.addressList.slice(0,this.limitNum);
		}
	},
	
	methods:{
		getAddressList:function(){
			var _this=this;
			this.$http.get("data/address.json").then(function(response){
				var res=response.data;
				if(res.status=="0"){
					_this.addressList=res.result;
				}
			});
		},
		loadMore:function(){
			this.limitNum=this.addressList.length;
		},
		setDefault:function(addressid){
			this.addressList.forEach(function(address,index){
				//address是一个值，这个值是this.addressList里的值，index是索引
				if(address.addressId==addressid){
					address.isDefault=true;
				}else{
					address.isDefault=false;
				}
			})
		},
		delConfirm:function(item){
			this.delFlag=true;
			this.curAddress=item;
		},
		delAddress:function(){
			var index=this.addressList.indexOf(this.curAddress);
			
			this.addressList.splice(index,1);
			
			this.delFlag=false;
		}
	}
});
