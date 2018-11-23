const render = require('./lib/render');
const Koa = require('koa');
const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');

const app = module.exports = new Koa();
const pushes = [];

app.use(logger());
app.use(render);
app.use(koaBody());

router.get('/', getPushs)
  .get('/push/:id', getPush)
  .post('/push', createPush);

app.use(router.routes());

async function getPushs(ctx) {
  await ctx.render('list', { pushes });
}

async function getPush(ctx) {
  const id = ctx.params.id;
  const push = pushes[id];
  if (!push) {
    ctx.throw(404, 'invalid post id');
  }
  await ctx.render('show', { push });
}

async function createPush(ctx) {
  const push = ctx.request.body;
  const id = pushes.push(
    {
      text: push.data,
      created_at: new Date(),
      id: -1
    }
  ) - 1;
  push.id = id;
  ctx.body = pushes;
  await ctx.upda('/');
}

if (!module.parent) {
  app.listen(3000);
} 
