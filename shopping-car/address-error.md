### 在地址列表中所遇到的问题

---
#### 地址列表渲染
1. 错将`methods`写成了`mothods`,导致一直报`XXX`不是一个函数的错；
2. 在开发中使用指令时不要加`this`，因为指令的作用域就是this；

---
#### 设为默认
1. 设为默认和默认地址重合了，这是因为自己忘记在设为默认这个div中添加判断`v-if:item.isDefault`;
```
<div class="addr-opration addr-set-default" v-if="!item.isDefault">
    <a href="javascript:;" class="addr-set-default-btn" @click="setDefault(item.addressId)"><i>设为默认</i></a>
</div>
```
2. 删除功能的实现参照cart.html中的实例；