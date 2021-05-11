import { Application,  Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

let users = [
  {id:1, name:"David",    mobile:'15167267210', roleName:"Admin0", lastLoginTime:"2020/01/01 12:01:00", lastLoginIP:"192.168.1.1", enable:0, deleteFlag:0},
  {id:2, name:"Mark",     mobile:'15167209311', roleName:"Admin9", lastLoginTime:"2020/01/01 11:01:00", lastLoginIP:"192.168.1.2", enable:1, deleteFlag:0},
  {id:3, name:"Jimmy",    mobile:'15167218319', roleName:"Admin8", lastLoginTime:"2020/01/01 10:01:00", lastLoginIP:"192.168.1.3", enable:0, deleteFlag:0},
  {id:4, name:"Remo",     mobile:'15167209818', roleName:"Admin7", lastLoginTime:"2020/01/01 09:01:00", lastLoginIP:"192.168.1.4", enable:1, deleteFlag:0},
  {id:5, name:"Jansen",   mobile:'15167287617', roleName:"Admin6", lastLoginTime:"2020/01/01 08:01:00", lastLoginIP:"192.168.1.5", enable:0, deleteFlag:0},
  {id:6, name:"David1",   mobile:'15167266716', roleName:"Admin5", lastLoginTime:"2020/01/01 12:01:00", lastLoginIP:"192.168.1.1", enable:0, deleteFlag:0},
  {id:7, name:"Mark1",    mobile:'15167232315', roleName:"Admin4", lastLoginTime:"2020/01/01 11:01:00", lastLoginIP:"192.168.1.2", enable:1, deleteFlag:0},
  {id:8, name:"Jimmy1",   mobile:'15167276714', roleName:"Admin3", lastLoginTime:"2020/01/01 10:01:00", lastLoginIP:"192.168.1.3", enable:0, deleteFlag:0},
  {id:9, name:"Remo1",    mobile:'15167254513', roleName:"Admin2", lastLoginTime:"2020/01/01 09:01:00", lastLoginIP:"192.168.1.4", enable:1, deleteFlag:0},
  {id:10, name:"Jansen1", mobile:'15167200012', roleName:"Admin1", lastLoginTime:"2020/01/01 08:01:00", lastLoginIP:"192.168.1.5", enable:0, deleteFlag:0},
  {id:11, name:"David2",  mobile:'15167211111', roleName:"Admin21", lastLoginTime:"2020/01/01 12:01:00", lastLoginIP:"192.168.1.1", enable:0, deleteFlag:0},
  {id:12, name:"Mark2",   mobile:'15167222210', roleName:"Admin22", lastLoginTime:"2020/01/01 11:01:00", lastLoginIP:"192.168.1.2", enable:1, deleteFlag:0},
  {id:13, name:"Jimmy2",  mobile:'15167233313', roleName:"Admin23", lastLoginTime:"2020/01/01 10:01:00", lastLoginIP:"192.168.1.3", enable:0, deleteFlag:0},
  {id:14, name:"Remo2",   mobile:'15167244412', roleName:"Admin24", lastLoginTime:"2020/01/01 09:01:00", lastLoginIP:"192.168.1.4", enable:1, deleteFlag:0},
  {id:15, name:"Jansen2", mobile:'15167255511', roleName:"Admin25", lastLoginTime:"2020/01/01 08:01:00", lastLoginIP:"192.168.1.5", enable:0, deleteFlag:0},
  {id:16, name:"David3",  mobile:'15167200014', roleName:"Admin26", lastLoginTime:"2020/01/01 12:01:00", lastLoginIP:"192.168.1.1", enable:0, deleteFlag:0},
  {id:17, name:"Mark3",   mobile:'15167299915', roleName:"Admin27", lastLoginTime:"2020/01/01 11:01:00", lastLoginIP:"192.168.1.2", enable:1, deleteFlag:0},
  {id:18, name:"Jimmy3",  mobile:'15167288816', roleName:"Admin28", lastLoginTime:"2020/01/01 10:01:00", lastLoginIP:"192.168.1.3", enable:0, deleteFlag:0},
  {id:19, name:"Remo3",   mobile:'15167277717', roleName:"Admin29", lastLoginTime:"2020/01/01 09:01:00", lastLoginIP:"192.168.1.4", enable:1, deleteFlag:0},
  {id:20, name:"Jansen3", mobile:'15167266618', roleName:"Admin30", lastLoginTime:"2020/01/01 08:01:00", lastLoginIP:"192.168.1.5", enable:0, deleteFlag:0},
];

let roles = [{id:1,name:"admin0"},{id:2,name:"admin1",},{id:3,name:"admin2"}];

const router = new Router();
router
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
  .post("/user/edit",async (context)=>{
    const result = context.request.body();
    const value = await result.value;
    context.response.body = edit(value,users);
  })
  .post("/user/delete", async (context)=>{
    const result = context.request.body();
    const value = await result.value;
    context.response.body = deleteData(value,users);
  })
  .post("/all-roles", (context) => {
    context.response.body =  serverResponse(roles);
  });

const app = new Application();
app.use(oakCors());
app.use(router.routes());
await app.listen({ port: 3000 });


function deleteData(id: number,datasource: any[]) {
  let records =datasource.filter(x => x.id !== id);
  return serverResponse(records);
}

function edit(params: any,datasource:any[]) {
  datasource.forEach(data => {
    if(data.id === params.id) {
      for(let p in data) {
        data[p] = params[p];
      }
    }
  });
  return serverResponse(datasource);
}

function add(params:any,datasource:any[]) {
  params.id = datasource.length + 1;
  datasource.push(params);
  return serverResponse(datasource);
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
  return serverResponse(pageRecoreds);
}

function serverResponse(data: any) {
  return {
    meta:{
      success:true,
      message: 'ok',
      statusCode: 200,
      popup: false
    },
    data: {
      total: data.length,
      records: data
    }
  };
}
