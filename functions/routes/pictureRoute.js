import express from 'express';

import {
  createPicture,
  getPicture,
  getPictures,
  updatePicture,
  deletePicture,
} from '../controllers/pictureController.js';

const router = express.Router();

router.get('/', getPictures);
router.post('/', createPicture);
router.get('/:id', getPicture);
router.put('/:id', updatePicture);
router.delete('/:id', deletePicture);

export default router;
