## Get 请求

```ts
  @Get({url:'init/menu'})
  getMenuData(@Feedback() response?: ResponseData) {
    console.log(response);
  }
```
* Get 装饰器有两个参数。
    * GetConfig: 用来设置请求的url地址
    * showError： 默认为ture。
        * 当为true时：response.meta.success = false 时，自动显示对应error message. 并且停止处理response。
        * 当为false： 调用端自主处理response.meta.success = false的情况。
* Get装饰器会为自动生成一个变量，用来控制此请求的spin状态。变量名称为：`方法名+IsLoading`。上例：`getMenuDataIsLoading`。
```html
 <nz-spin [nzSpinning]="this['getMenuDataIsLoading']"></nz-spin>
```
* 方法体里面的代码，只会被请求返回后调用。

## Post请求
```ts
  @Post({url:'init/menu'})
  getMenuData(@Body() data, @Feedback() response?: ResponseData) {
    console.log(response);
  }
```

## 为请求添加参数
```ts
  @Get({url:'init/menu'})
  getMenuData(@Query() data, @Feedback() response?: ResponseData) {
    console.log(response);
  }
```


## 为请求添加路径参数
```ts
  @Get({url:'init/menu/{id}'})
  getMenuData(@Path('id') id, @Feedback() response?: ResponseData) {
    console.log(response);
  }
```
