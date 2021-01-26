import { Application } from "https://deno.land/x/abc@v1.2.4/mod.ts";

const app = new Application();

app.get("/hello",()=>{
    return {a:'test'};
}).start({port:3000});
