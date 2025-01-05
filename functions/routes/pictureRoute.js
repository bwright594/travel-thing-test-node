import express from 'express';

import {
  createPicture,
  deletePicture,
  getPicture,
  getPictures,
  updatePicture
} from '../controllers/pictureController.js';

const router = express.Router();

router.get('/', getPictures);
router.get('/:id', getPicture);
router.post('/', createPicture);
router.put('/:id', updatePicture);
router.delete('/:id', deletePicture);

export default router;
