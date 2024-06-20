import { storage } from "@/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateAudioUrlEtape } from "./queries";

export function uploadAudio(audioFile, docName, fileName, id_parcours) {
    // Vérifier la taille du fichier audio (facultatif)
    console.log(fileName)
    console.log(id_parcours)
    const fileSizeInBytes = audioFile.size;
    const maxSizeInBytes = 10 * 1024 * 1024; // 10 Mo, par exemple

    if (fileSizeInBytes > maxSizeInBytes) {
        throw new Error("La taille du fichier audio dépasse la limite autorisée.");
    }

    // Upload du fichier dans le dossier <docName> avec le nom <fileName>
    const storageRef = ref(storage, docName + "/" + id_parcours + "/" + fileName + '_' + Date.now() + '.mp3')
    const metadata = {
        contentType: 'audio/mpeg'
    }
    const uploadTask = uploadBytesResumable(storageRef, audioFile, metadata);

    // Écoute des changements d'état, des erreurs et de l'achèvement du téléchargement
    uploadTask.on('state_changed',
        (snapshot) => {
            // Récupération de la progression de la tâche incluant le nombre d'octets téléchargés et le nombre total d'octets à télécharger
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            // Liste complète des codes d'erreur disponible à : https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    console.log("User doesn't have permission to access the object")
                    break;
                case 'storage/canceled':
                    console.log("User canceled the upload");
                    break;
                case 'storage/unknown':
                    console.log("Unknown error occurred, inspect error.serverResponse");
                    break;
            }
        },
        () => {
            // Upload effectué avec succès, maintenant on peut obtenir l'URL de téléchargement
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

                updateAudioUrlEtape(id_parcours, downloadURL, fileName)
                console.log(downloadURL)
            });
        }
    );

    return "";
}