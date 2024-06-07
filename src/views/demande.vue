<template>
<Navbar/>
<h1 id="title">Liste des demandes</h1> 
<div class="demande-list-container">
    <div class="demande-container" v-for="(demande, index) in demandes" :key="index">
        <div class="demande-nickname">
            <p>{{ demande.nickname }} </p>
        </div>
        <div class="demande-email">
            <p>{{ demande.email }}</p>
        </div>
        <div class="btn-add-container">
            <button class="btn-add" @click="addDemande(demande.nickname, demande.role, demande.email, demande.password)">Add</button>
            <button class="btn-delete">Delete</button>
        </div>
    </div>
    
</div>
   
</template>


<script>

import { ref, onMounted } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '@/components/Navbar.vue';
import store from '@/store';
import { useRouter } from 'vue-router';

export default {
  name: 'demandeComponent',
  components:  {
    Navbar,
  },
  setup() {
    const demandes = ref([])
    const router = useRouter()

    const fetchDemandes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'demande'))
        querySnapshot.forEach((doc) => {
          demandes.value.push(doc.data());
        });
      } catch (error) {
        console.error('Error fetching demandes: ', error)
      }
    };


    const addDemande = async (nickname, role, email, password) => {
        try {
            await store.dispatch('register', {
                nickname: nickname,
                role: "user",
                email: email, 
                password: password
            });

            router.push("/demande")

        } catch (error) {
            console.log(error)
        }
    }

    onMounted(() => {
      fetchDemandes();
    });

    return { demandes, addDemande };
  },
};
</script>

<style scoped>

#title{
    text-align: center;
    font-size: 30px;
}

.demande-list-container{
    display: flex;
    flex-direction: column;
    row-gap: 2px;
    padding: 10px;
}

.demande-container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px solid grey;
    padding: 10px;
    background-color: lightblue;
    align-items: center;
    transition: 0.15s; 
}

.btn-add-container > button{
    margin-right: 10px;
}

.demande-container:hover{
    scale: 1.01;
}

.btn-add{
    font-size: 13px;
    color: white; 
    background-color: rgb(10, 102, 194);
    padding: 10px 20px; 
    border-style: none; 
    border-radius: 25px; 
    font-weight: 600; 
    cursor: pointer; 
    transition: 0.15s; 
}

.btn-add:hover{
  background-color: rgb(12, 78, 129);
}

.btn-delete{
    font-size: 13px;
    color: white; 
    background-color: rgb(255, 0, 0);
    padding: 10px 20px; 
    border-style: none; 
    border-radius: 25px; 
    font-weight: 600; 
    cursor: pointer; 
    transition: 0.15s; 
}

.btn-delete:hover{
    background-color: rgb(188, 0, 16);
}

</style>