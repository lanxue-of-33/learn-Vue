### 地址渲染中所涉及到的一些知识点
---
#### 地址列表的渲染
1. 我们控制显示的个数使用到了`computer`属性，在其中定义了一个用于控制显示个数的函数；
```
//一般用于实时的计算
	computed:{
		filterAddress:function(){
			return this.addressList.slice(0,this.limitNum);
		}
	},
		
```
由上面我们可以看出显示个数是由我们上面所设置的limitNum所控制的；而其是用于`slice(begin,end)`函数的；
2. 点击`more`时我们调用的是一个函数，而不是直接写`this.limitNum=this.addressList.length`这个表达式，因为会受到缓存的影响而失败；
3. 要想用表达式的话就不要加`this`；

---
#### 地址的选中
1. 采用索引判断的方式：` <li v-for="(item,index) in filterAddress " v-bind:class="{'check':index==currentIndex}" @click="currentIndex=index">`
2. 设为默认地址：只要思路就是通过isDefault来判断是否要设置为默认值；
```
setDefault:function(addressid){
			this.addressList.forEach(function(address,index){
				//address是一个值，这个值是this.addressList里的值，index是索引
				if(address.addressId==addressid){
					address.isDefault=true;
				}else{
					address.isDefault=false;
				}
			})
		}
		

<div class="addr-opration addr-set-default" v-if="!item.isDefault">
                  <a href="javascript:;" class="addr-set-default-btn" @click="setDefault(item.addressId)"><i>设为默认</i></a>
                </div>
                <div class="addr-opration addr-default" v-if="item.isDefault">默认地址</div>
```
