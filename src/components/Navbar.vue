<template>
  <nav>
    <div id="left-side-container">
      <p><a href="/gestioncommune">Backoffice Scrute la nature</a></p>
    </div>
    <div id="right-side-container">
      <div id="name-container">
        <p v-if="nickname" class="name">{{ nickname }}</p>
      </div>
      <div v-if="role==='admin' && route.path != '/demande'" id="disconnect-btn-container">
        <button id="request-btn" @click="gererDemande" role="link">Demande</button>
      </div>
      <div id="disconnect-btn-container">
        <button id="disconnect-btn" @click="Logout">Déconnection</button>
      </div>
    </div>
    
  </nav>
</template>

<script>
import { ref } from 'vue'
// import { getUserInfo } from '@/utils/queries.js'
import store from '@/store'
import { useRoute, useRouter } from "vue-router"

export default {
name: "NavBar",

  setup() {

    const nickname = store.state.user.nickname
    const role = store.state.user.role
    const error = ref(null)
    const router = useRouter()
    const route = useRoute()

    const gererDemande = async () => {
      if (role == "admin"){
        router.push("/demande")
      }
    }

    const Logout = async () => {
      try {
        await store.dispatch('logOut')
        router.push("/")
      }
      catch (err) {
        error.value = err.message
      }
    }

    return { role, nickname, Logout, gererDemande, route}
  }
};
</script>

<style scoped>

nav{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1976d2; 
  padding: 5px;
}

#left-side-container > p {
  color: white;
}


#disconnect-btn{
  font-size: 10px; 
  padding: 7px 15px; 
  color: rgb(108, 117, 125);
  border: 2px solid rgb(108, 117, 125);
  background-color: white; 
  border-radius: 5px; 
  cursor: pointer; 
  transition: 0.15s; 
}

#disconnect-btn:hover{
  color: white; 
  background-color: rgb(108, 117, 125); 
}

#request-btn{
  font-size: 10px; 
  padding: 7px 15px; 
  color: rgb(34, 197 ,94);
  border: 2px solid rgb(34, 197, 94);
  background-color: white; 
  border-radius: 5px; 
  cursor: pointer; 
  transition: 0.15s; 
}

#request-btn:hover{
  color: white; 
  background-color: rgb(34, 197, 94); 
}

#right-side-container{
  display: flex;
  flex-direction: row;
  align-items: center;
}

#name-container{
  margin-right: 30px;
}

.name{
  color: white;
}

</style>
