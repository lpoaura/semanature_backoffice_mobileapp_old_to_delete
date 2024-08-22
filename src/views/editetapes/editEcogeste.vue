<template>
  <h2 align="center">
    Edition d'un Eco-geste
  </h2>
  <v-row>
    <v-col>
      <h3 align="center"> Paramètres du jeu</h3>
      <v-textarea label="Nom " rows="1" variant="outlined" no-resize autofocus required v-model="etape.nom"></v-textarea>
      <br>
      <LinkInsert />
      <v-textarea label="Instruction de l'Eco-Geste" rows="3" required auto-grow v-model="etape.texte" />
      <br>
    </v-col>
    <v-col v-if="loaded">
      <ImagePicker :previousImageUrl="etape.image_url" @imageUpdated="(image) => updateImage(image)"
        @bytesUpdated="(bytesArray) => updateBytes(bytesArray)" />
    </v-col>
    <div class="audio-container">
        <div>
            <h3>Télécharger un fichier audio</h3>
          </div>
          <div>
            <input type="file" @change="onFileChange" accept="audio/*">
          </div>
          <div v-if="etape.audio_url">
            <p>Audio existant</p>
            <audio controls>
              <source :src="etape.audio_url" type="audio/mp3">
              Votre navigateur ne supporte pas l'élément audio.
          </audio>
        </div>
      </div>
  </v-row>
  <div align="center">
    <button @click="EditEtape()" type="submit" width="100%" class="btn greenbtn bg-green">Modifier l'étape</button>
    <br><br>
    <router-link class="routerLink" :to="'/editetapes/' + parcoursId"><button
        class="btn orangebtn">Retour</button></router-link><br>
  </div>
</template>

<script>

import { uploadImage } from '../../utils/UploadImage.js'
import { modifyEtapeInParcours } from '../../utils/queries.js'
import ImagePicker from '../../components/ImagePicker.vue'
import { uploadAudio } from "@/utils/UploadAudio"

export default {
  components: { ImagePicker },
  name: "EditBlagueComponent",
  data() {
    return {
      etape: {},
      parcoursId: String,
      hasimagechanged: false,
      hasaudiochanged: false, 
      imagepicked: false,
      bytesArray: '',
      image_url: '',
      loaded: false, 
      audio: null
    }
  },
  methods: {
    updateImage(image) {
      this.image_url = image
      this.hasimagechanged = true
    },
    updateBytes(bytesArray) {
      this.bytesArray = bytesArray
      this.hasimagechanged = true
    },
    onFileChange() {
      const file = event.target.files[0];
      if (file && file.type.startsWith('audio/')) {
        this.audio = file;
        this.hasaudiochanged = true
      } else {
        alert("Veuillez sélectionner un fichier audio valide.");
      }
    },
    async getInfos() {
      this.parcoursId = this.$route.query.parcoursId
      this.etape = JSON.parse(this.$route.query.etape).etape
      this.loaded = true
      this.etapeId = JSON.parse(this.$route.query.etape).id
    },
    async EditEtape() {
      try {
        if (this.image_url !== '' && this.hasimagechanged) { //FROM API IMAGE         
          const response = await fetch(this.image_url);
          const arrayBuffer = await response.arrayBuffer();
          const byteArray = new Uint8Array(arrayBuffer);
          uploadImage(byteArray, "image_etape", this.etapeId, this.parcoursId)
        } else { //FROM LOCAL IMAGE
          if (this.bytesArray && this.hasimagechanged) {
            uploadImage(this.bytesArray, "image_etape", this.etapeId, this.parcoursId)
          }
        }

        if(this.audio != null && this.hasaudiochanged){
          await uploadAudio(this.audio, "son/", this.etapeId, this.parcoursId )
        }
      } catch (error) {
        alert("La taille de l'image dépasse la limite autorisée (2Mo Max)")
        console.error(error);
        return;
      }
      const p_obj = {
        nom: this.etape.nom,
        ordre: this.etape.ordre,
        texte: this.etape.texte,
      }
      modifyEtapeInParcours(this.parcoursId, this.etapeId, p_obj).then(() => {
        this.$router.push('/editetapes/' + this.parcoursId)
      })
    }
  },

  async mounted() {
    await this.getInfos()
  },

};
</script>

<style scoped>

.audio-container{
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
