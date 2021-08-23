import { rest, setupWorker } from 'msw';

const baseURL = 'https://jsonplaceholder.typicode.com';

const worker = setupWorker(
  rest.post(`${baseURL}/users`, async (req, res, ctx) => {
    return res(
      ctx.delay(3000),
      ctx.json({
        ok: true
      })
    );
  })
);

export { worker };
