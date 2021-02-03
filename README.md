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


