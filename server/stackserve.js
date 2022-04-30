const Koa = require('koa');
const Router = require('@koa/router');
const app = new Koa();
const router = new Router();

// app.use(async ctx => {
    // ctx.body = 'Hello World';
// });


router.get("/master", (ctx, next) => {
	console.log("SERVER GOT REQUEST!");
	ctx.body = "hello paul!!!";
})

app.use( router.routes() );
console.log("SERVER is RUNNING!");
app.listen(3001);
