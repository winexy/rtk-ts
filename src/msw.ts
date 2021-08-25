import { rest, setupWorker } from 'msw';

const baseURL = 'https://jsonplaceholder.typicode.com';

const worker = setupWorker(
  rest.post(`${baseURL}/users`, (req, res, ctx) => {
    return res(
      ctx.delay(3000),
      ctx.json({
        ok: true
      })
    );
  }),
  rest.get(`${baseURL}/users/*`, async (req, res, ctx) => {
    const response = await ctx.fetch(req);
    const json = await response.json();

    return res(ctx.delay(3000), ctx.json(json));
  }),
  rest.get(`${baseURL}/posts`, async (req, res, ctx) => {
    const response = await ctx.fetch(req);
    const json = await response.json();

    return res(ctx.delay(1000), ctx.json(json));
  })
);

export { worker };
