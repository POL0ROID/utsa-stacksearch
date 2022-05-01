const Koa = require('koa');
const Router = require('@koa/router');
const parser = require('koa-bodyparser')
const app = new Koa();
const router = new Router();



router.get("/query", (ctx, next) => {
	console.log("SERVER GOT GET REQUEST!");
	ctx.body = "hello paul!!!";
})

router.post("/query", (ctx, next) => {
	console.log("SERVER GOT POST REQUEST!");
	console.log( "POST BODY", ctx.request.body );
	console.log( "POST callMe: ", ctx.request.body.callMe );
	// console.log("CTX", ctx);
	// console.log("NEXT", next);
	ctx.body = "post hello paul!!!";
	// next( ctx );
})

//app.use(async ctx => {
//	ctx.body = ctx.request.body;
//});

app.use( parser() );
app.use( router.routes() );
app.use( router.allowedMethods() );
console.log("SERVER is RUNNING!");
app.listen(3001);
