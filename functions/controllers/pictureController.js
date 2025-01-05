import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';
import Picture from '../models/pictureModel.js';

initializeApp({ storageBucket: 'travel-thing-474ce.firebasestorage.app' });
const db = getFirestore('travel-thing-database');
const storage = getStorage().bucket();

export const createPicture = async (req, res) => {
  try {
    const data = req.body;
    const pictureUrl = data.url;
    delete data.url;
    data.mediaType = pictureUrl.split(';')[0].split('/')[1];
    const newPicture = await db.collection('pictures').add(data);
    const byteString = atob(pictureUrl.split(',')[1]);
    let mimeString = pictureUrl.split(',')[0].split(':')[1].split(';')[0];
    let arrayBuffer = new ArrayBuffer(byteString.length);
    let intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    const newPictureRef = getFileFromPicture(data, newPicture.id);
    const pictureToReturn = (await newPicture.get()).data();
    await newPictureRef.save(intArray, { contentType: mimeString });
    const picturePublicUrl = await getDownloadURL(newPictureRef);
    res.status(200).send({ id: newPicture.id, ...pictureToReturn, url: picturePublicUrl });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

export const getPictures = async (req, res) => {
  try {
    const person = req.query.person;
    let query = db.collection('pictures');
    if (person) {
      query = query.where('person', '==', person);
    }
    const pictures = await query.get();
    const pictureArray = [];
    const options = { prefix: person ? person + '/' : '' };
    const [pictureBlobs] = await storage.getFiles(options);

    if (pictures.empty) {
      res.status(400).send('No Pictures found');
    } else {
      for (let i = 0; i < pictures.size; i++) {
        const doc = pictures.docs[i];
        const blob = pictureBlobs.find((blob) => blob.name === doc.data().person + '/' + doc.id + '.' + doc.data().mediaType);
        const url = blob ? await getDownloadURL(blob) : null;
        const picture = new Picture(
          doc.id,
          doc.data().name,
          doc.data().person,
          url,
          doc.data().mediaType
        );
        pictureArray.push(picture);
      }
      res.status(200).send(pictureArray);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

export const getPicture = async (req, res) => {
  try {
    const id = req.params.id;
    const data = (await db.collection('pictures').doc(id).get());
    const url = await getDownloadURL(getFileFromPicture(data.data(), id));
    if (data.exists) {
      const picture = new Picture(
        id,
        data.data().name,
        data.data().person,
        url,
        data.data().mediaType);
      res.status(200).send(picture);
    } else {
      res.status(404).send('picture not found');
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

// TODO: fix this if it's necessary, otherwise remove it
export const updatePicture = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await db.collection('pictures').doc(id).update(data);
    res.status(200).send('picture updated successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const deletePicture = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await db.collection('pictures').doc(id).get();
    db.collection('pictures').doc(id).delete();
    await getFileFromPicture(data.data(), id).delete();
    res.status(200).send('picture deleted successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getFileFromPicture = (picture, id) => {
  return storage.file(picture.person + '/' + id + '.' + picture.mediaType);
}
