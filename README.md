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
本框架将经常重复编写的代码，进行了封装，抽象成父类。

#### service
1. CRUD的抽象（增删改查）
* 某个功能的增删改查service都要继承与CRUDService
* 在此service中设置好`serachURL`,`addURL`,`deleteURL`等后台接口后，即可实现增删改查的接口实现
* 某个功能的增删改查的相关组件都在一个module管理。
* 在此module中注入对应的service。如下：
  ```ts
   providers: [UserService, { provide: CRUDService, useExisting: UserService }]
  ```
* 如果一个画面中，存在多个功能画面的（例如：tabset）。需要进行在运行时对service进行切换。
  * 创建service继承于CRUDStrategyService
  * 在此service的`serviceFactory()`中实现切换的逻辑。例如：
  ```ts
  export type ServiceType = 'a' | 'b' | 'c';
  @Injectable({ providedIn: 'root' })
  export class TaskManagerService extends CRUDStrategyService {
    public serviceFactory(value: ServiceType | string): CRUDService {
      switch (value) {
        case 'a':
          return this.injector.get(AService);
        case 'b':
          return this.injector.get(BService);
        case 'c':
          return this.injector.get(CService);
        default:
          return this.injector.get(AService);
      }
    }

    constructor(http: _HttpClient, @Optional() message: NzMessageService, private injector: Injector) {
      super(http, message);
    }
  }
  ```
  * 将相关service进行注入
  ```ts
  providers: [
      AService,
      BService,
      CService,
      TaskManagerService,
      { provide: CRUDService, useExisting: TaskManagerService }
  ]
  ```
  * 运行时动态切换
  ```ts
  @Component({
    selector: 'app-task-progress',
    template: `
      <nz-tabset>
        <nz-tab (nzSelect)="select('a')"><app-a-task></app-a-task></nz-tab>
        <nz-tab (nzSelect)="select('b')"><app-b-task></app-b-task></nz-tab>
        <nz-tab (nzSelect)="select('c')"><app-c-single></app-c-single></nz-tab>
      </nz-tabset>
    `,
    styles: []
  })
  export class TaskProgressComponent {
    constructor(private service: TaskManagerService) {}

    select(mode: any) {
      this.service.mode = mode;
    }
  }
  ```

2. 框架功能抽象（ApplicationService）
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
  canAdd;
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

