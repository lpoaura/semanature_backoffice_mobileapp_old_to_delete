import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { auth } from './firebaseConfig'
///import { sendSignInLinkToEmail } from "firebase/auth";
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { addUser } from './utils/queries'

const store = createStore({
  plugins: [createPersistedState()],
  state: {
    user: {
      loggedIn: false,
      data: null
    }
  },

  getters: {
    user(state) {
      return state.user
    }
  },
  mutations: {
    SET_USER(state, payload) {
      state.user.data = payload
    },
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    }
  },
  actions: {
    register(context, { nickname, role, email, password }) {
        
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        context.commit('SET_LOGGED_IN', false)
        addUser(userCredential.user.uid, nickname, role, email, password)
      })
    },

    async logIn(context, { email, password }) {
      const response = await signInWithEmailAndPassword(auth, email, password)
      if (response) {
        context.commit('SET_USER', response.user)
        context.commit('SET_LOGGED_IN', true)
      } else {
        throw new Error('login failed')
      }
    },
    async logOut(context) {
      await signOut(auth)
      context.commit('SET_USER', null)
      context.commit('SET_LOGGED_IN', false)
    },

    async fetchUser(context, user) {
      context.commit("SET_LOGGED_IN", user !== null)
      if (user) {
        context.commit("SET_USER", {
          displayName: user.displayName,
          email: user.email
        });
      } else {
        context.commit("SET_USER", null)
      }
    }
  }


})

// export the store
export default store