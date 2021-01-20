# 项目结构

* AppRoutingModule (AppMoule)
  * RoutesRoutingModule (RoutesModule)
    * LayoutModule （画面布局）
    * 各个画面模块
  * PassportRoutingModule (PassportModule)
    * LoginComponent
    * RegistComponent
    * PasswordForgettenComponet
    * 登录系统前访问的各个画面（比如：登录，注册，忘记密码等等）
  * ExceptionRoutingModule (ExceptionModule)
    * 各种类型的系统级画面（例如：404）


