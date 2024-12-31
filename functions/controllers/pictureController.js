import Picture from '../models/pictureModel.js';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

initializeApp();
const db = getFirestore('travel-thing-database');

export const createPicture = async (req, res) => {
  try {
    const data = req.body;
    await db.collection('pictures').add(data);
    res.status(200).send('picture created successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getPictures = async (req, res) => {
  try {
    const pictures = await db.collection('pictures').get();
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

export const getPicture = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await db.collection('pictures').doc(id).get();
    if (data.exists) {
      res.status(200).send(data.data());
    } else {
      res.status(404).send('picture not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

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
    db.collection('pictures').doc(id).delete();
    res.status(200).send('picture deleted successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};
