import firebase from '../firebase.js';
import Picture from '../models/pictureModel.js';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const db = getFirestore(firebase, "travel-thing-database");

export const createPicture = async (req, res, next) => {
  try {
    const data = req.body;
    await addDoc(collection(db, 'pictures'), data);
    res.status(200).send('picture created successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getPictures = async (req, res, next) => {
  try {
    const pictures = await getDocs(collection(db, 'pictures'));
    const pictureArray = [];

    if (pictures.empty) {
      res.status(400).send('No Pictures found');
    } else {
      pictures.forEach((doc) => {
        const picture = new Picture(
          doc.id,
          doc.data().name,
          doc.data().person
        );
        pictureArray.push(picture);
      });

      res.status(200).send(pictureArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getPicture = async (req, res, next) => {
  try {
    const id = req.params.id;
    const picture = doc(db, 'pictures', id);
    const data = await getDoc(picture);
    if (data.exists()) {
      res.status(200).send(data.data());
    } else {
      res.status(404).send('picture not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const updatePicture = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const picture = doc(db, 'pictures', id);
    await updateDoc(picture, data);
    res.status(200).send('picture updated successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const deletePicture = async (req, res, next) => {
  try {
    const id = req.params.id;
    await deleteDoc(doc(db, 'pictures', id));
    res.status(200).send('picture deleted successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};
