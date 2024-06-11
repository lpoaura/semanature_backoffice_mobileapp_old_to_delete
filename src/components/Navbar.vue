<template>
  <nav>
    <div id="left-side-container">
      <p><a href="/gestioncommune">Backoffice Scrute la nature</a></p>
    </div>
    <div id="right-side-container">
      <div id="name-container">
        <p v-if="nickname" class="name">{{ nickname }}</p>
      </div>
      <div v-if="role==='admin' && route.path != '/demande'" id="disconnect-btn-container-request">
        <div v-if="demandeCount != 0" class="notification">
          <p class="notification-text">{{ demandeCount }}</p>
        </div>
        <button id="request-btn" @click="gererDemande" role="link">Demande</button>
      </div>
      <div id="disconnect-btn-container">
        <button id="disconnect-btn" @click="Logout">Déconnection</button>
      </div>
    </div>
    
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue'
import store from '@/store'
import { useRoute, useRouter } from "vue-router"
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';


export default {
name: "NavBar",

  setup() {

    const nickname = store.state.user.nickname
    const role = store.state.user.role
    const error = ref(null)
    const router = useRouter()
    const route = useRoute()
    const demandeCount = ref(0);

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

    const countDemande = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'demande'));
        demandeCount.value = querySnapshot.size
      } catch (error) {
        return 0
      }
    }

    onMounted(() => {
      countDemande();
    })
    return { role, nickname, Logout, gererDemande, route, demandeCount}
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

#disconnect-btn-container-request{
  position: relative;
  margin-right: 10px;
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

.notification{
  display: flex;
  justify-content: center; 
  position: absolute; 
  top: -3px;
  right: -3px;
  background-color: red;
  width: 18px;
  scale: 1;
  border-radius: 9px;
  border: 1px solid white;
}

.notification-text{
  font-size: 12px;
  margin: 0; 
  color: white;
}

</style>
