# 项目结构

* AppRoutingModule (AppMoule)
  * 主画面：RoutesRoutingModule (RoutesModule)
    * LayoutModule （主画面布局）
    * 各个画面模块
  * 登录/注册等画面：PassportRoutingModule (PassportModule)
    * LoginComponent
    * RegistComponent
    * PasswordForgettenComponet
    * 登录系统前访问的各个画面（比如：登录，注册，忘记密码等等）
  * 异常画面：ExceptionRoutingModule (ExceptionModule)
    * 各种类型的系统级画面（例如：404）


* 推荐做法
  * 每个模块，比如人员管理模块，设置一个module 和routingmodule
  * shareModule里面是共同的东西，如果多个模块都要使用的，就不要放到sharemodule里面，会影响编译时间。
  * 各个模块的service，放在“core/service”文件下
  * 拦截器，一个功能一个文件

## Rococo WebFreamwork

框架设计的核心理念，经常重复编写的代码，共同化，抽象成父类。

确保一个远程都是对应的功能的实现逻辑，保证流转成功。

在框架中的模块是不涉及页面的具体展示的。

#### service

1. CRUD的抽象（增删改查）
2. 框架功能抽象
   1. 登录
   2. 注册
   3. 修改密码
   4. 忘记密码
   5. 登出
   6. 获取菜单数据

#### component

1. 列表的抽象
   1. 数据获取，
   2. 高级查询，简单查询，
   3. 分页，页码变更，
   4. 显示编辑窗口，
   5. 删除数据
2. 编辑窗口的抽象
3. 查询组件的抽象

#### util

1. 文件下载处理
2. 加密处理

#### http 注解
参考 freamwork/util/http/redme.md
#### websocket 注解
参考 freamwork/websocket-manager/redme.md

### 权限注解

* 控制某个按钮
```ts
  @ACL("ブランド管理","削除")
```

```ts
  @ACLConfig()
  ngOnInit(): void {
```

* 控制某个方法

```ts
@UsingAcl(['1','2','3'],'无权取得XX数据')
getDataFromServer(){

}
```

传入参数有2个。
1：调用该方法需要的权限，
2：当权限不满足时，显示的错误信息（非必须）

#### 关于打开对话框
```ts
 modalCreator(this.nzModal, '個人情報', null, null, MyInfoComponent, this.myInfo, true);
```
```ts
this.openModal(data ? '编辑' : '添加角色', '取消', '确定', EditComponent, data);
```

---

## 实现方式

以注解的方式实现。

0. 问题点
   注解中代码在什么时间点被执行？
   答：类注解在类对象被构造出来的时候调用。
   属性注解在属性发生变化出来是调用。
   方法注解在方法被调动是时候被调用
1. 针对列表显示数据的注解，包括如下注解

* 类级别
  * 注解类型：表格
  * 查找数据的URL
  * 查找参数
  * 分页参数
* 字段级别
  * 是否固定列
  * 是否checkbox显示

2. 针对编辑表单的注解

* 类级别
  * 注解类型：表单
  * 更新的URL
* 字段级别
  * 长度判断
  * 唯一性判断

3. 参考资料
   https://zhuanlan.zhihu.com/p/274328551
