import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  doSomethingGood,
  jsonplaceholder,
  useFetchUsersQuery,
  useCreateUserMutation
} from './store';
import { useDispatch } from 'react-redux';

function App() {
  const { isLoading, data: users } = useFetchUsersQuery();
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {isLoading && <div>loading...</div>}
        {users &&
          users.ids.map(id => <div key={id}>{users.entities[id]?.name}</div>)}
        <button onClick={() => createUser({ id: 42, name: 'test' })}>
          {isCreatingUser ? 'loading....' : 'click'}
        </button>
      </header>
    </div>
  );
}

export default App;
