/** @format */

import './App.css';

import { useNavigate } from 'react-router-dom'; //npm i react-router-dom
import { useState } from 'react';

// const users = JSON.parse(localStorage.getItem('users')) || [];

const getLoggedEmail = () => {
  const loggedEmail = localStorage.getItem('email');
  console.log(`L'e-mail dell'utente loggato:` + loggedEmail);
  return loggedEmail;
};

const getUserLogged = () => {
  const emailLogged = getLoggedEmail();
  console.log('GetUserLogged by Email:' + emailLogged);
  const prevUsers = JSON.parse(localStorage.getItem('users')) || [];
  const user = prevUsers.find(user => user.email === emailLogged);
  return user;
};

const isUserInLocalStorage = () => {
  const email = getLoggedEmail();
  const prevUsers = JSON.parse(localStorage.getItem('users')) || [];

  console.log('Email loggata:', email);

  console.log('Utenti nel localStorage:', prevUsers);
  const user = prevUsers.find(user => user.email === email);
  console.log('Utente trovato:', user);

  return !!user;
};

export function App() {
  const [email, setEmail] = useState(''); //state
  const [users, setUsers] = useState('');

  const navigate = useNavigate();

  const saveUserOnLocalStorage = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = {
      email: email,
      lastLogged: new Date().toLocaleString(),
      previousAccess: null,
      counter: 1,
    };
    // prevUsers è lo stato precedente,
    // crea un array dove aggiunge un user alla fine
    // setUser = hook che aggiorna la variabile users.
    setUsers(prevUsers => [...prevUsers, user]);
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  };

  const saveEmail = () => {
    localStorage.setItem(`email`, email);
  };

  const updateUser = () => {
    console.log('Updating...');

    const prevUsers = JSON.parse(localStorage.getItem('users')) || [];
    const emailLogged = getLoggedEmail();

    const newUsers = prevUsers.map(user => {
      if (user.email === emailLogged) {
        return {
          ...user,
          previousAccess: user.lastLogged,
          lastLogged: new Date().toLocaleString(),
          counter: user.counter + 1,
        };
      } else {
        return user;
      }
    });

    localStorage.setItem('users', JSON.stringify(newUsers));
    setUsers(newUsers);
  };

  const login = () => {
    const alreadyExist = isUserInLocalStorage();
    console.log("L'utente esiste già?" + alreadyExist);
    if (alreadyExist) {
      updateUser();
    } else {
      saveUserOnLocalStorage();
    }
  };
  const routeChange = () => {
    navigate(`/`);
  };

  const isUserLogged = () => {
    const user = localStorage.getItem('email');
    if (user) {
      console.log("C'è qualcuno loggato: " + getLoggedEmail());
      return true;
    } else {
      return false;
    }
  };

  if (isUserLogged()) {
    return <Welcome />;
  } else {
    return (
      <div className="App" style={{ width: 18 + 'rem', margin: 'auto' }}>
        <h2>Esegui il Login</h2>
        <form
          id="emailForm"
          name="emailform"
          action="#"
          onSubmit={e => {
            e.preventDefault();
            checkEmail(document.emailform.email);
            saveEmail(); //saveEmail prima di route change per salvare nel local storage ma anche prima di login, così che possa trovare la mail nel local storage ed aggiornare!!!
            login();
            routeChange();
          }}
        >
          <input
            type="email"
            className="form-control"
            id="inputEmail"
            name="email"
            size="30"
            required
            onInput={validateEmail}
            // stato della mail aggiorna il valore così
            onChange={event => setEmail(event.target.value)}
          ></input>
          <button className="btn btn-dark" type="submit" id="submitBtn" action="#" disabled>
            Login
          </button>
        </form>
      </div>
    );
  }
}

const checkEmail = input => {
  var regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,10})$/;
  if (input.value.match(regex)) {
    return true;
  } else {
    return false;
  }
};

const validateEmail = () => {
  const submitBtn = document.getElementById('submitBtn');
  const inputEmail = document.getElementById('inputEmail');
  const isEmailValid = checkEmail(inputEmail);

  submitBtn.disabled = !isEmailValid;
};

//logout button useNavigate per tornare a '/' dopo aver cancellato la mail dal local storage.
export function LogoutButton() {
  const navigate = useNavigate();

  const clearEmail = () => {
    const mail = localStorage.getItem('email');
    localStorage.removeItem('email', mail);
    navigate('/');
  };

  return (
    <button type="button" className="btn btn-light" onClick={clearEmail}>
      Logout
    </button>
  );
}
//Header] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>
//Soluzione:  <BrowserRouter><Header/>
export function Header() {
  return <LogoutButton />;
}

export function Welcome() {
  const email = localStorage.getItem('email');

  const currentUser = getUserLogged();
  if (currentUser && currentUser.counter > 1) {
    return (
      <div className="container">
        <h2>
          Bentornat* <br /> {email}
        </h2>
        <div>
          Sei stato qui {currentUser.counter} volte
          <br />
          <p>Ultimo accesso: {currentUser.previousAccess}</p> <br />
          <p>Ultimissimo accesso: {currentUser.lastLogged}</p>
        </div>
      </div>
    );
  } else if (currentUser) {
    return (
      <div className="container">
        <h1>Benvenut* <br /> {email}</h1>
        {currentUser.lastLogged} <br />
      </div>
    );
  }
}
