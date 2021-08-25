import {
  combineReducers,
  configureStore,
  createAction,
  createEntityAdapter,
  createSlice,
  EntityAdapter,
  EntityState
} from '@reduxjs/toolkit';
import { ApiEndpointQuery } from '@reduxjs/toolkit/dist/query/core/module';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

const usersAdapter = createEntityAdapter<User>();
const postsAdapter = createEntityAdapter<Post>();

export const { selectTotal: selectUsersTotal, selectAll: selectAllUsers } =
  usersAdapter.getSelectors();

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

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
  tagTypes: ['User', 'Post'],
  endpoints: builder => {
    return {
      fetchUsers: builder.query<EntityState<User>, void>({
        query: () => 'users',
        transformResponse(users: Array<User>) {
          return usersAdapter.addMany(usersAdapter.getInitialState(), users);
        },
        providesTags(result) {
          return result?.ids
            ? [
                { type: 'User', id: 'LIST' },
                ...result.ids.map(id => ({ type: 'User', id } as const))
              ]
            : [{ type: 'User', id: 'LIST' }];
        },
        onQueryStarted(arg, context) {
          console.log('started', arg, context);
        }
      }),
      fetchUser: builder.query<User, string>({
        query: id => `users/${id}`,
        providesTags: (_, __, id) => [{ type: 'User', id }]
      }),
      createUser: builder.mutation<void, User>({
        query: newUser => ({
          method: 'POST',
          url: 'users',
          body: newUser
        }),
        invalidatesTags(result, error, arg) {
          console.log('invalidate', { result, error, arg });
          return [{ type: 'User', id: arg.id }];
        }
      }),
      fetchPosts: builder.query<EntityState<Post>, void>({
        query: () => 'posts',
        transformResponse(posts: Array<Post>) {
          return postsAdapter.addMany(postsAdapter.getInitialState(), posts);
        }
      })
    };
  }
});

export const {
  useFetchUsersQuery,
  useCreateUserMutation,
  useFetchPostsQuery,
  useFetchUserQuery
} = jsonplaceholder;

const modal = createSlice({
  name: 'modal',
  initialState: {
    visible: false
  },
  reducers: {
    showModal(state) {
      state.visible = true;
    },
    hideModal(state) {
      state.visible = false;
    }
  }
});

export const { showModal, hideModal } = modal.actions;

export const store = configureStore({
  reducer: {
    [jsonplaceholder.reducerPath]: jsonplaceholder.reducer,
    modal: modal.reducer
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(jsonplaceholder.middleware);
  }
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { jsonplaceholder };
