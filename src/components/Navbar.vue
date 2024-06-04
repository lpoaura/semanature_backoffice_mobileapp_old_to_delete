<template>
  <nav>
    <div id="left-side-container">
      <p>Backoffice Scrute la nature</p>
    </div>
    <div id="right-side-container">
      <div id="name-container">
        <p v-if="nickname" class="name">{{ nickname }}</p>
      </div>
      <div id="disconnect-btn-container">
        <button id="disconnect-btn" @click="Logout">Déconnection</button>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getUserInfo } from '@/utils/queries.js'
import store from '@/store'
import { useRouter } from "vue-router"

export default {
name: "NavBar",

  setup() {
    const nickname = ref('')
    const error = ref(null)
    const router = useRouter()

    const fetchUserNickname =  async () => {
      try {
        const userData = await getUserInfo(store.getters.user.data.email)
        if (userData) {
          nickname.value = userData.nickname
        }
        }catch (err) {
        console.error("Error fetching user data: ", err)
      }
    };

    const Logout = async () => {
      try {
        await store.dispatch('logOut')
        router.push("/")
      }
      catch (err) {
        error.value = err.message
      }
    }

    onMounted(() => {
      fetchUserNickname();
    });

    return { nickname, Logout };
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
