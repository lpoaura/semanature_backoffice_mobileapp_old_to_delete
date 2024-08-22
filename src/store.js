import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { auth } from './firebaseConfig'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { addDemande, addUser } from './utils/queries'
import { getUserInfo } from './utils/queries'
import { unOffuscate } from './utils/encrypt'
import { updateUserRole } from './utils/queries'

const store = createStore({
  plugins: [createPersistedState()],
  state: {
    user: {
      loggedIn: false,
      data: null,
      role: null, 
      nickname: null, 
      email: null
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
    }, 
    SET_ROLE(state, value){
      state.user.role = value
    }, 
    SET_EMAIL(state, value){
      state.user.email = value
    },
    SET_NICKNAME(state, value){
      state.user.nickname = value
    }
  },
  actions: {

    async register(context, { nickname, role, email, password }) {    
      try {

        const userData = await getUserInfo(email)
        if(userData && userData.role == "deleted"){
          await updateUserRole(email, "user")
          console.log(auth)
        }else{
          await createUserWithEmailAndPassword(auth, email, unOffuscate(password));
          await addUser(email, nickname, role, email);
        }
      } catch (error) {
        console.log(error);
        throw error; 
      }
    },
    async demande(context, { nickname, role, email, password }){
      addDemande(nickname, role, email, password)
    },
    async logIn(context, { email, password }) {
      const response = await signInWithEmailAndPassword(auth, email, password)
      if (response) {
        const userData = await getUserInfo(response.user.email)
        if(userData && userData.role != "deleted"){
          context.commit('SET_USER', response.user)
          context.commit('SET_LOGGED_IN', true)
          context.commit('SET_ROLE', userData.role)
          context.commit('SET_EMAIL', userData.email)
          context.commit('SET_NICKNAME', userData.nickname)
        }else{
          console.log("La connection n'a pas fonctionner")
        }
      } else {
        throw new Error('login failed')
      }
    },
    async logOut(context) {
      await signOut(auth)
      context.commit('SET_USER', null)
      context.commit('SET_LOGGED_IN', false)
      context.commit('SET_ROLE', null)
      context.commit('SET_EMAIL', null)
      context.commit('SET_NICKNAME', null)
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
    },

    async deleteUser(context, user) {
      console.log(auth)
      return context, user
    }
  }


})

// export the store
export default store