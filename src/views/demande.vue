<template>
<Navbar />
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
<p v-if="isLoadingUser">Chargement...</p>
<div>
  <input class="findUser" v-model="searchQuery" type="text" placeholder="Rentrer email">
  <div class="demande-list-container">
    <div v-if="userSearched != null && userSearched.role != 'deleted'" class="demande-container" style="background-color: lightgreen;" >
    <div class="demande-nickname">
            <p>{{ userSearched.nickname }} </p>
        </div>
        <div class="demande-email">
            <p>{{ userSearched.email }}</p>
        </div>

        <div class="btn-add-container" v-if="userSearched.email != userConnectedEmail">
            <button class="btn-add" v-if="userSearched.role == 'user'" @click="updateRole(userSearched.email, 'admin')">Promouvoir</button>
            <button class="btn-add" v-if="userSearched.role == 'admin'" @click="updateRole(userSearched.email, 'user')">Rétrograder</button>
            <button class="btn-delete" @click="delUser(userSearched.email, 'deleted')">Supprimer</button>
        </div>
    </div>
    <div class="noDemande" v-else>
      Pas d'utilisateur sous ce nom 
    </div>
  </div>
</div>
   
</template>


<script>

import { ref, onMounted, watch } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import store from '@/store';
import { deleteDemande } from '@/utils/queries';
import { getUserInfo } from '@/utils/queries';
import showNotification from '../components/Notification';
import { updateUserRole } from '@/utils/queries';
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'demandeComponent',
  components:  {
    Navbar
  },
  setup() {
    const demandes = ref([])
    const isLoading = ref(false)
    const isLoadingUser = ref(false)
    const demandesLength = ref(0)
    const searchQuery = ref('')
    const userSearched = ref(null)
    const userConnectedEmail = store.state.user.email


    // Get the demande
    const fetchDemandes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'demande'))
        demandesLength.value = querySnapshot.size
        demandes.value = [];
        querySnapshot.forEach((doc) => {
          demandes.value.push(doc.data());
        });
      } catch (error) {
        showNotification(2000, "Problème lors du chargement des demandes")
      }
    };

    // Register the user
    const addDemande = async (nickname, role, email, password) => {
      isLoading.value = true 
        try {
            // Register the user
            await store.dispatch('register', {
                nickname: nickname,
                role: "user",
                email: email, 
                password: password,
            })
            .then(() => {
              isLoading.value = false 
              showNotification(3000, "Ajout de l'utilisateur effectué", "success")
            })
            .catch(() => {
              isLoading.value = false
              showNotification(5000, "Problème lors de l'ajout de cet utilisateur, veuillez contacter l'administrateur")
            })

            await deleteDemande(email)

            // Reload the demande section 
            isLoading.value = true 
            await fetchDemandes()
            .then(() => {
              isLoading.value = false 
            })
            .catch(() => {
              isLoading.value = false
            })
        } catch (error) {
            console.log(error)
        }
      }


    // Delete a demande
    const deleteCall = async (email) => {
      isLoading.value = true 
      await deleteDemande(email)
      .then(() => {
        isLoading.value = false
        showNotification(3000, "Demande supprimé ", "success")
      })
      .catch(() => {
        isLoading.value = false
        showNotification(2000, "Nous avons pas reussi à supprimer cette demande")
      })
      await fetchDemandes()
    }
    
    // Get the user according to the input 
    watch(searchQuery, (newValue) => {
      if (newValue) {
        getUserInfo(newValue).then((data) => {
          userSearched.value = data
        })
      }
    });

    // Delete a user unable, can not longer connect 
    const delUser = async (email, newRole) => {
      isLoadingUser.value = true
      await updateUserRole(email, newRole)
      .then(() => {
        isLoadingUser.value = false
        showNotification(3000, "Ajout de l'utilisateur effectué.", "success")
      })
      .catch(() => {
        isLoadingUser.value = false
        showNotification(2000, "Nous avons pas reussi à supprimer cette l'utilisateur")
      }) 
    }

    async function updateRole(email, newRole) {
      isLoadingUser.value = true
      updateUserRole(email, newRole)
      .then(() => {
        isLoadingUser.value = false
        showNotification(3000, "Nouveau rôle donné à l'utilisateur", "success")
      })
      .catch(() => {
        isLoadingUser.value = false
        showNotification(2000, "Nous avons pas reussi à promulguer l'utilisateur en administrateur")
      })
    }

    onMounted(() => {
      fetchDemandes()
    })

    return { 
      demandes, 
      addDemande, 
      deleteCall, 
      fetchDemandes, 
      isLoading, 
      isLoadingUser, 
      demandesLength, 
      searchQuery, 
      userSearched, 
      store, 
      userConnectedEmail,
      delUser,
      updateRole
    }
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