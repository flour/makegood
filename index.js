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
  await ctx.render('list', { pushes: pushes.reverse() });
}

async function getPush(ctx) {
  const id = parseInt(ctx.params.id, 10);
  const push = pushes.find(push => push.id === id);
  if (!push) {
    ctx.throw(404, 'invalid post id');  
  }
  await ctx.render('show', { push });
}

async function createPush(ctx) {
  const push = ctx.request.body;
  const newPush = {
    text: push.data,
    created: (new Date().toString()),
    id: pushes.length + 1
  };
  pushes.push(newPush);
  ctx.body = pushes;
  await ctx.redirect('/');
}

if (!module.parent) {
  app.listen(3000);
} 
