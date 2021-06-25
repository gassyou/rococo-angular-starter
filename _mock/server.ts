import { Application,  Router } from "https://deno.land/x/oak@v7.6.3/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { delay } from "https://deno.land/std@0.96.0/async/delay.ts";

let roles = [
  {id:1, name:"admin1",    detail:'15167267210', enable:0, deleteFlag:0},
  {id:2, name:"admin2",    detail:'15167267210', enable:0, deleteFlag:0},
  {id:3, name:"admin3",    detail:'15167267210', enable:0, deleteFlag:0},
  {id:4, name:"admin4",    detail:'15167267210', enable:0, deleteFlag:0},
  {id:5, name:"admin5",    detail:'15167267210', enable:0, deleteFlag:0},
  {id:6, name:"admin6",    detail:'15167267210', enable:0, deleteFlag:0},
  {id:7, name:"admin7",    detail:'15167267210', enable:0, deleteFlag:0},
  {id:8, name:"admin8",    detail:'15167267210', enable:0, deleteFlag:0},
  {id:9, name:"admin9",    detail:'15167267210', enable:0, deleteFlag:0},
];

let users = [
  {id:1, name:"David",    mobile:'15167267210', password:"111111", role:1, roleName:"Admin0", lastLoginTime:"2020/01/01 12:01:00", lastLoginIP:"192.168.1.1", enable:0, deleteFlag:0},
  {id:2, name:"Mark",     mobile:'15167209311', password:"111111", role:1, roleName:"Admin9", lastLoginTime:"2020/01/01 11:01:00", lastLoginIP:"192.168.1.2", enable:1, deleteFlag:0},
  {id:3, name:"Jimmy",    mobile:'15167218319', password:"111111", role:1, roleName:"Admin8", lastLoginTime:"2020/01/01 10:01:00", lastLoginIP:"192.168.1.3", enable:0, deleteFlag:0},
  {id:4, name:"Remo",     mobile:'15167209818', password:"111111", role:1, roleName:"Admin7", lastLoginTime:"2020/01/01 09:01:00", lastLoginIP:"192.168.1.4", enable:1, deleteFlag:0},
  {id:5, name:"Jansen",   mobile:'15167287617', password:"111111", role:1, roleName:"Admin6", lastLoginTime:"2020/01/01 08:01:00", lastLoginIP:"192.168.1.5", enable:0, deleteFlag:0},
  {id:6, name:"David1",   mobile:'15167266716', password:"111111", role:1, roleName:"Admin5", lastLoginTime:"2020/01/01 12:01:00", lastLoginIP:"192.168.1.1", enable:0, deleteFlag:0},
  {id:7, name:"Mark1",    mobile:'15167232315', password:"111111", role:1, roleName:"Admin4", lastLoginTime:"2020/01/01 11:01:00", lastLoginIP:"192.168.1.2", enable:1, deleteFlag:0},
  {id:8, name:"Jimmy1",   mobile:'15167276714', password:"111111", role:1, roleName:"Admin3", lastLoginTime:"2020/01/01 10:01:00", lastLoginIP:"192.168.1.3", enable:0, deleteFlag:0},
  {id:9, name:"Remo1",    mobile:'15167254513', password:"111111", role:1, roleName:"Admin2", lastLoginTime:"2020/01/01 09:01:00", lastLoginIP:"192.168.1.4", enable:1, deleteFlag:0},
  {id:10, name:"Jansen1", mobile:'15167200012', password:"111111", role:1, roleName:"Admin1", lastLoginTime:"2020/01/01 08:01:00", lastLoginIP:"192.168.1.5", enable:0, deleteFlag:0},
  {id:11, name:"David2",  mobile:'15167211111', password:"111111", role:1, roleName:"Admin21", lastLoginTime:"2020/01/01 12:01:00", lastLoginIP:"192.168.1.1", enable:0, deleteFlag:0},
  {id:12, name:"Mark2",   mobile:'15167222210', password:"111111", role:1, roleName:"Admin22", lastLoginTime:"2020/01/01 11:01:00", lastLoginIP:"192.168.1.2", enable:1, deleteFlag:0},
  {id:13, name:"Jimmy2",  mobile:'15167233313', password:"111111", role:1, roleName:"Admin23", lastLoginTime:"2020/01/01 10:01:00", lastLoginIP:"192.168.1.3", enable:0, deleteFlag:0},
  {id:14, name:"Remo2",   mobile:'15167244412', password:"111111", role:1, roleName:"Admin24", lastLoginTime:"2020/01/01 09:01:00", lastLoginIP:"192.168.1.4", enable:1, deleteFlag:0},
  {id:15, name:"Jansen2", mobile:'15167255511', password:"111111", role:1, roleName:"Admin25", lastLoginTime:"2020/01/01 08:01:00", lastLoginIP:"192.168.1.5", enable:0, deleteFlag:0},
  {id:16, name:"David3",  mobile:'15167200014', password:"111111", role:1, roleName:"Admin26", lastLoginTime:"2020/01/01 12:01:00", lastLoginIP:"192.168.1.1", enable:0, deleteFlag:0},
  {id:17, name:"Mark3",   mobile:'15167299915', password:"111111", role:1, roleName:"Admin27", lastLoginTime:"2020/01/01 11:01:00", lastLoginIP:"192.168.1.2", enable:1, deleteFlag:0},
  {id:18, name:"Jimmy3",  mobile:'15167288816', password:"111111", role:1, roleName:"Admin28", lastLoginTime:"2020/01/01 10:01:00", lastLoginIP:"192.168.1.3", enable:0, deleteFlag:0},
  {id:19, name:"Remo3",   mobile:'15167277717', password:"111111", role:1, roleName:"Admin29", lastLoginTime:"2020/01/01 09:01:00", lastLoginIP:"192.168.1.4", enable:1, deleteFlag:0},
  {id:20, name:"Jansen3", mobile:'15167266618', password:"111111", role:1, roleName:"Admin30", lastLoginTime:"2020/01/01 08:01:00", lastLoginIP:"192.168.1.5", enable:0, deleteFlag:0},
];


const router = new Router();
router
  .post("/api/s020/index", async(context) => {

    // await delay(300000);
    // context.response.body = {
    //   status	 :	 2 	,
    //   response	 :	 {
    //     error_code	 : "8000",
    //     error_message	 :	 "Api	 Connection"

    //     // t_status:"0","t_last_api	":"1",
    //     // f_status:"0:0",
    //     // card_status:"8",
    //     // card_enable_flag:"0"
    //   }
    // }
  })
  .post("/users", async (context) => {
    const result = context.request.body();
    const value = await result.value;
    context.response.body = search(value,users);
  })
  .post("/user/add", async (context) => {
    const result = context.request.body();
    const value = await result.value;
    context.response.body = add(value,users);
  })
  .post("/user/update",async (context)=>{
    const result = context.request.body();
    const value = await result.value;
    context.response.body = edit(value,users);
  })
  .post("/user/delete", async (context)=>{
    const result = context.request.body();
    const value = await result.value;
    context.response.body = deleteData(value,users);
  })
  .post("/user/check-mobile", async (context)=>{
    const params = context.request.body();
    const value = await params.value;
    context.response.body = checkMobile(value,users);
  })
  .post("/user/check-old-pw", async (context)=>{
    const params = context.request.body();
    const value = await params.value;
    context.response.body = checkOldPw(value,users);
  })
  .post("/user/check-new-pw", async (context)=>{
    const params = context.request.body();
    const value = await params.value;
    context.response.body = checkNewPw(value,users);
  })
  .post("/user/update-password", async (context)=>{
    const params = context.request.body();
    const value = await params.value;
    context.response.body = updatePassword(value,users);
  })
  .post("/roles", async (context) => {
    const result = context.request.body();
    const value = await result.value;
    context.response.body = search(value,roles);
  })
  .post("/role/add", async (context) => {
    const result = context.request.body();
    const value = await result.value;
    context.response.body = add(value,roles);
  })
  .post("/role/update",async (context)=>{
    const result = context.request.body();
    const value = await result.value;
    context.response.body = edit(value,roles);
  })
  .post("/role/delete", async (context)=>{
    const result = context.request.body();
    const value = await result.value;
    context.response.body = deleteData(value,roles);
  })
  .post("/role/check-name", async (context)=>{
    const params = context.request.body();
    const value = await params.value;
    context.response.body = checkRoleName(value,roles);
  })
  .post("/all-roles", (context) => {
    context.response.body =  serverResponse(roles.length,roles);
  });

const app = new Application();
app.use(oakCors());
app.use(router.routes());
await app.listen({ port: 3000 });


function checkRoleName(value: any, datasource: any[]) {

  let index = -1;

  if(value.id) {
    index = datasource.findIndex((x)=>{ return x.id !== value.id && x.name === value.name;});
  } else {

    index = datasource.findIndex((x)=>{return x.name === value.name;});
  }

  if (index >= 0) {
    return {
      meta:{
        success:false,
        message: '角色名称已存在',
        statusCode: 200,
        popup: false
      },
      data: {}
    };
  } else {
    return {
      meta:{
        success:true,
        message: 'OK',
        statusCode: 200,
        popup: false
      },
      data: {}
    };
  }
}

function updatePassword(value: any, datasource: any[]) {

  datasource.forEach(data => {
    if(data.id === value.id) {
      data.password = value.newPw;
    }
  });

  return serverResponse(datasource.length,datasource);

}

function checkNewPw(value: any, datasource: any[]) {
  let user:any = datasource.filter(x => {return x.id === value.id});

  if(user && user[0].password === value.newPw) {
    return {
      meta:{
        success:false,
        message: '新密码和旧密码一样',
        statusCode: 200,
        popup: false
      },
      data: {}
    };
  } else {
    return {
      meta:{
        success:true,
        message: 'ok',
        statusCode: 200,
        popup: false
      },
      data: {}
    };
  }
}

function checkOldPw(value: any, datasource: any[]) {
  let user:any = datasource.filter(x => {return x.id === value.id});

  if(user && user[0].password === value.oldPw) {
    return {
      meta:{
        success:true,
        message: 'OK',
        statusCode: 200,
        popup: false
      },
      data: {}
    };
  } else {
    return {
      meta:{
        success:false,
        message: '旧密码不正确',
        statusCode: 200,
        popup: false
      },
      data: {}
    };
  }
}


function checkMobile(value: any, datasource: any[]) {

  let index = -1;

  if(value.id) {
    index = datasource.findIndex((x)=>{ return x.id !== value.id && x.mobile === value.mobile;});
  } else {

    index = datasource.findIndex((x)=>{return x.mobile === value.mobile;});
  }

  if (index >= 0) {
    return {
      meta:{
        success:false,
        message: '电话号码已存在',
        statusCode: 200,
        popup: false
      },
      data: {}
    };
  } else {
    return {
      meta:{
        success:true,
        message: 'OK',
        statusCode: 200,
        popup: false
      },
      data: {}
    };
  }
}

function deleteData(data:any, datasource: any[]) {
  users =datasource.filter(x => x.id !== data.id);
  return serverResponse(datasource.length,users);
}

function edit(params: any,datasource:any[]) {
  datasource.forEach(data => {
    if(data.id === params.id) {
      for(let p in data) {
        data[p] = params[p];
      }
    }
  });
  return serverResponse(datasource.length,datasource);
}

function add(params:any,datasource:any[]) {
  params.id = datasource.length + 1;
  datasource.push(params);
  return serverResponse(datasource.length,datasource);
}

function search(params: any, datasource:any[]){
  let recoreds = datasource;
  for(let p in params) {
    if(p!=="currentPage" && p!=="pageSize" && p!=="sortName" && p!="sortValue") {
      recoreds = recoreds.filter( x=> params[p] ? x[p].toLowerCase().indexOf(params[p].toLowerCase())>=0 : true);
    }
  }
  const startIndex = (Number(params.currentPage)-1) * Number(params.pageSize);
  const endIndex = startIndex + Number(params.pageSize);
  const pageRecoreds = recoreds.slice(startIndex, endIndex);
  return serverResponse(datasource.length, pageRecoreds);
}

function serverResponse(total: number, data: any) {
  return {
    meta:{
      success:true,
      message: 'ok',
      statusCode: 200,
      popup: false
    },
    data: {
      total: total,
      records: data
    }
  };
}
