<template>
<Navbar/>
<h1 id="title">Liste des demandes</h1> 
<p v-if="isLoading">Chargement...</p>
<div v-if="demandesLength > 0" class="demande-list-container">
    <div class="demande-container" v-for="(demande, index) in demandes" :key="index">
        <div class="demande-nickname">
            <p>{{ demande.nickname }} </p>
        </div>
        <div class="demande-email">
            <p>{{ demande.email }}</p>
        </div>
        <div class="btn-add-container">
            <button class="btn-add" @click="addDemande(demande.nickname, demande.role, demande.email, demande.password)">Add</button>
            <button class="btn-delete" @click="deleteCall(demande.email)">Delete</button>
        </div>
    </div>
</div>
<div v-else>
  <p class="noDemande">Il n'y a plus de demande</p>
</div>

<h1 id="title">Chercher utilisateur</h1> 
<div>
  <input class="findUser" v-model="searchQuery" type="text" placeholder="Rentrer email">
  <div v-if="user != null" class="">
    <p>{{ user.email }}</p>
  </div>
  <div v-else>
    Pas d'utilisateur sous ce nom 
  </div>
</div>
   
</template>


<script>

import { ref, onMounted, watch } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '@/components/Navbar.vue';
import store from '@/store';
import { deleteDemande } from '@/utils/queries';
import { getUserInfo } from '@/utils/queries';

export default {
  name: 'demandeComponent',
  components:  {
    Navbar,
  },
  setup() {
    const demandes = ref([])
    const isLoading = ref(false)
    const demandesLength = ref(0)
    const searchQuery = ref('');
    const user = ref(null)

    const fetchDemandes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'demande'))
        demandesLength.value = querySnapshot.size

        demandes.value = [];
        querySnapshot.forEach((doc) => {
          demandes.value.push(doc.data());
        });

      } catch (error) {
        console.error('Error fetching demandes: ', error)
      }
    };
    const addDemande = async (nickname, role, email, password) => {
      isLoading.value = true 
        try {
            await store.dispatch('register', {
                nickname: nickname,
                role: "user",
                email: email, 
                password: password,
            }).then(() => {
              isLoading.value = false 
            })
            isLoading.value = true 
            await fetchDemandes().then(() => {
              isLoading.value = false 
            }); 
        } catch (error) {
            console.log(error)
        }
      }

    const deleteCall = async (email) => {
      isLoading.value = true 
      await deleteDemande(email).then(() => {
        isLoading.value = false
      })
      await fetchDemandes()
    }

    watch(searchQuery, (newValue) => {
      if (newValue) {
        getUserInfo(newValue).then((data) => {
          user.value = data
        })
      }
    });

    onMounted(() => {
      fetchDemandes()
    })

    return { demandes, addDemande, deleteCall, fetchDemandes, isLoading, demandesLength, searchQuery, user }
  },
}
</script>

<style scoped>

#title{
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

.btn-add-container p {
  display: inline;
}

.findUser{
  font-size: 16px; 
  width: 500px; 
  border: 1px solid rgb(200, 200, 200);
  display: inline-block; 
  border-radius: 5px; 
  padding: 10px 15px; 
  margin-left: 100px;
}

.noDemande{
  margin-left: 100px;
}

</style>