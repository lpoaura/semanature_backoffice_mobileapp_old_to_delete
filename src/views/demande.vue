<template>
<h1>Liste des demandes</h1> 
<div class="demande-list-container">
    <div class="demande-container" v-for="(demande, index) in demandes" :key="index">
        <div class="demande-nickname">
            <p>{{ demande.nickname }} </p>
        </div>
        <div class="demande-email">
            <p>{{ demande.email }}</p>
        </div>
    </div>
</div>
   
</template>


<script>

import { ref, onMounted } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default {
  name: 'demandeComponent',
  setup() {
    const demandes = ref([]);

    const fetchDemandes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'demande'));
        querySnapshot.forEach((doc) => {
          demandes.value.push(doc.data());
        });
      } catch (error) {
        console.error('Error fetching demandes: ', error);
      }
    };

    onMounted(() => {
      fetchDemandes();
    });

    return { demandes };
  },
};
</script>

<style scoped>

.demande-list-container{
    display: flex;
    flex-direction: column;
}

.demande-container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>