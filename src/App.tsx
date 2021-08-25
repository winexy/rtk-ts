import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  doSomethingGood,
  jsonplaceholder,
  useFetchUsersQuery,
  useCreateUserMutation,
  hideModal,
  useAppSelector,
  showModal,
  useFetchPostsQuery,
  useFetchUserQuery
} from './store';
import { useDispatch, useSelector } from 'react-redux';

function Modal() {
  const dispatch = useDispatch();
  const { data, isLoading, isFetching } = useFetchPostsQuery(undefined, {
    pollingInterval: 3000
  });
  const {
    name,
    refetch,
    isFetching: isUserFetching
  } = useFetchUserQuery(String(1), {
    selectFromResult: query => ({
      name: query.data?.name ?? 'I am loading',
      isFetching: query.isFetching
    })
  });

  const posts = [];

  console.log({ posts });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, .5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: 20,
          width: 300,
          color: 'gray'
        }}
      >
        <button onClick={() => dispatch(hideModal())}>close</button>
        <hr />
        <div>{name}</div>
        <button onClick={refetch}>
          refetch me {isUserFetching && '...fetching'}
        </button>
        <hr />
        {isFetching && <div>fetching...</div>}
        {isLoading && <div>loading....</div>}
        <div>
          {posts.map(post => (
            <div key={post.id}>
              {post.id} - {post.title.slice(0, 10)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Users() {
  const { isLoading, data: users, isFetching } = useFetchUsersQuery();

  return (
    <div>
      {isLoading && <div>loading...</div>}
      {isFetching && <div>Fetching....</div>}
      {users &&
        users.ids.map(id => <div key={id}>{users.entities[id]?.name}</div>)}
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const [isUsersVisible, toggle] = React.useReducer(state => !state, false);
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const isModalVisible = useAppSelector(state => state.modal.visible);

  async function onUserCreate() {
    const user = await createUser({ id: 1, name: 'test' });
    alert(JSON.stringify(user));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={toggle}>toggle </button>
        {isUsersVisible && <Users />}
        <button onClick={() => onUserCreate()}>
          {isCreatingUser ? 'loading....' : 'create user'}
        </button>
        <button onClick={() => dispatch(showModal())}>open modal</button>
        {isModalVisible && <Modal />}
      </header>
    </div>
  );
}

export default App;
