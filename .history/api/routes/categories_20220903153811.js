
const router = require('express').Router();
const CategoryModel = require('../models/Category');
const categoriesController = require('../controllers/CategoriesController');

const validateCategoryId = async (req, res, next) => {
  const category = await CategoryModel.findByPk(req.params.categoryId);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  next();
}

router.get('/categories', categoriesController.index);

router.post('/categories', categoriesController.create);

router.get('/categories/:userId', validateCategoryId, categoriesController.show);

router.put('/categories/:userId', validateCategoryId, categoriesController.update);

router.delete('/categories/:userId', validateCategoryId, categoriesController.delete);

module.exports = router;