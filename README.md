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


## Rococo WebFramework

component

1. 获取列表数据，
2. 简单和高级查询列表数据
3. 数据分页，页码变更
4. 显示添加或者编辑窗口
5. 删除数据


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
