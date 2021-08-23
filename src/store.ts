import {
  combineReducers,
  configureStore,
  createAction,
  createEntityAdapter,
  EntityState
} from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const usersAdapter = createEntityAdapter<User>();

export const doSomethingGood = createAction(
  'doSomethingGood',
  (arg1, arg2) => ({
    payload: [arg1, arg2]
  })
);

type User = {
  id: number;
  name: string;
};

const jsonplaceholder = createApi({
  reducerPath: 'jsonplaceholder',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
    mode: 'cors'
  }),
  endpoints: builder => {
    return {
      fetchUsers: builder.query<EntityState<User>, void>({
        query: () => 'users',
        transformResponse(users: Array<User>) {
          return usersAdapter.addMany(usersAdapter.getInitialState(), users);
        }
      }),
      createUser: builder.mutation<void, User>({
        query: newUser => ({
          method: 'POST',
          url: 'users',
          body: newUser
        })
      })
    };
  }
});

const { useFetchUsersQuery, useCreateUserMutation } = jsonplaceholder;

export { useFetchUsersQuery, useCreateUserMutation };

export const store = configureStore({
  reducer: combineReducers({
    [jsonplaceholder.reducerPath]: jsonplaceholder.reducer
  }),
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(jsonplaceholder.middleware);
  }
});

export { jsonplaceholder };
