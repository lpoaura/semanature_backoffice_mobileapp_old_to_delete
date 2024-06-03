<template>
  <div class="container">
    <form class="form-signin" @submit.prevent="signIn">       
      <h2 class="form-signin-heading">Création d'un compte</h2>
      <input type="text" v-model="email" class="form-control" name="email" placeholder="Email" required="" autofocus="" />
      <input type="password" v-model="password" class="form-control" name="password" placeholder="Mot de passe " required=""/>      
      <button id="sendBtn" type="submit">Envoyer une demande</button>   
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import store from '@/store';
import { useRouter } from 'vue-router'

export default {
  name: 'SignInComponent',
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter()

    const signIn = async () => {
      try {
        await store.dispatch('register', {
          email: email.value, 
          password: password.value
        });
        router.push('/')
      } catch (err) {
        console.log(err);
      }
    }

    return { email, password, signIn };
  }
};
</script>

  
<style scoped>

.container{
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
    text-align: center;
}

.form-control{
    display: block;
    width: 100%;
}

#sendBtn{
    font-size: 12px;
    color: white; 
    background-color: rgb(10, 102, 194);
    padding: 15px 35px; 
    border-style: none; 
    border-radius: 25px; 
    font-weight: 600; 
    cursor: pointer; 
    transition: 0.15s; 
}

#sendBtn:hover{
    background-color: rgb(12, 78, 129);
}

</style>