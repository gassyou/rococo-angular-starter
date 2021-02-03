import { Application } from "https://deno.land/x/abc@v1.2.4/mod.ts";
import { cors } from "https://deno.land/x/abc@v1.2.4/middleware/cors.ts";

const app = new Application();
let users = [
  {id:1, name:"David", roleName:"Admin", lastLoginTime:"2020/01/01 12:01:00", lastLoginIP:"192.168.1.1", enable:0, deleteFlag:0},
  {id:2, name:"Mark", roleName:"Admin", lastLoginTime:"2020/01/01 11:01:00", lastLoginIP:"192.168.1.2", enable:1, deleteFlag:0},
  {id:3, name:"Jimmy", roleName:"Admin", lastLoginTime:"2020/01/01 10:01:00", lastLoginIP:"192.168.1.3", enable:0, deleteFlag:0},
  {id:4, name:"Remo", roleName:"Admin", lastLoginTime:"2020/01/01 09:01:00", lastLoginIP:"192.168.1.4", enable:1, deleteFlag:0},
  {id:5, name:"Jansen", roleName:"Admin", lastLoginTime:"2020/01/01 08:01:00", lastLoginIP:"192.168.1.5", enable:0, deleteFlag:0},
  {id:6, name:"David1", roleName:"Admin", lastLoginTime:"2020/01/01 12:01:00", lastLoginIP:"192.168.1.1", enable:0, deleteFlag:0},
  {id:7, name:"Mark1", roleName:"Admin", lastLoginTime:"2020/01/01 11:01:00", lastLoginIP:"192.168.1.2", enable:1, deleteFlag:0},
  {id:8, name:"Jimmy1", roleName:"Admin", lastLoginTime:"2020/01/01 10:01:00", lastLoginIP:"192.168.1.3", enable:0, deleteFlag:0},
  {id:9, name:"Remo1", roleName:"Admin", lastLoginTime:"2020/01/01 09:01:00", lastLoginIP:"192.168.1.4", enable:1, deleteFlag:0},
  {id:10, name:"Jansen1", roleName:"Admin", lastLoginTime:"2020/01/01 08:01:00", lastLoginIP:"192.168.1.5", enable:0, deleteFlag:0},
  {id:11, name:"David2", roleName:"Admin", lastLoginTime:"2020/01/01 12:01:00", lastLoginIP:"192.168.1.1", enable:0, deleteFlag:0},
  {id:12, name:"Mark2", roleName:"Admin", lastLoginTime:"2020/01/01 11:01:00", lastLoginIP:"192.168.1.2", enable:1, deleteFlag:0},
  {id:13, name:"Jimmy2", roleName:"Admin", lastLoginTime:"2020/01/01 10:01:00", lastLoginIP:"192.168.1.3", enable:0, deleteFlag:0},
  {id:14, name:"Remo2", roleName:"Admin", lastLoginTime:"2020/01/01 09:01:00", lastLoginIP:"192.168.1.4", enable:1, deleteFlag:0},
  {id:15, name:"Jansen2", roleName:"Admin", lastLoginTime:"2020/01/01 08:01:00", lastLoginIP:"192.168.1.5", enable:0, deleteFlag:0},
  {id:16, name:"David3", roleName:"Admin", lastLoginTime:"2020/01/01 12:01:00", lastLoginIP:"192.168.1.1", enable:0, deleteFlag:0},
  {id:17, name:"Mark3", roleName:"Admin", lastLoginTime:"2020/01/01 11:01:00", lastLoginIP:"192.168.1.2", enable:1, deleteFlag:0},
  {id:18, name:"Jimmy3", roleName:"Admin", lastLoginTime:"2020/01/01 10:01:00", lastLoginIP:"192.168.1.3", enable:0, deleteFlag:0},
  {id:19, name:"Remo3", roleName:"Admin", lastLoginTime:"2020/01/01 09:01:00", lastLoginIP:"192.168.1.4", enable:1, deleteFlag:0},
  {id:20, name:"Jansen3", roleName:"Admin", lastLoginTime:"2020/01/01 08:01:00", lastLoginIP:"192.168.1.5", enable:0, deleteFlag:0},
]

app
  .get("/hello",()=>{
      return {a:'test'};
  })
  .get("/users",(c)=>{

    const {name,pi,ps}  = c.queryParams;

    const startIndex = (Number(pi)-1) * Number(ps);
    const endIndex = startIndex + Number(ps);

    console.log(startIndex, endIndex);

    return {
      total: users.length,
      list:users.filter( x=> name ? x.name.toLowerCase().indexOf(name.toLowerCase())>=0 : true)
        .slice(startIndex, endIndex)
    };
  },cors())
  .start({port:3000});


