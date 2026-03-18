import * as categoriaService from './category.service.js';

  export const createCategoria = async (req, res, next) => {
    try {
      const data = req.body;

      const categoria = await categoriaService.createCategoriaRecord(data);

      res.status(201).json({
        success: true,
        message: 'Categoría registrada correctamente',
        data: categoria,
      });

    } catch (error) {
      next(error);
    }
  };

  export const getCategorias = async (req, res, next) => {
    try {
      const categorias = await categoriaService.getCategoriasRecord();

      res.json({
        success: true,
        message: 'Categorías obtenidas correctamente',
        total: categorias.length,
        data: categorias,
      });

    } catch (error) {
      next(error);
    }
  };

  export const getCategoriaById = async (req, res, next) => {
    try {
      const categoria = await categoriaService.getCategoriaByIdRecord(req.params.id);

      if (!categoria) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
      }

      res.json({
        success: true,
        data: categoria,
      });

    } catch (error) {
      next(error);
    }
  };


  export const updateCategoria = async (req, res, next) => {
    try {
      const categoria = await categoriaService.updateCategoriaRecord(
        req.params.id,
        req.body
      );

      if (!categoria) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
      }

      res.json({
        success: true,
        message: 'Categoría actualizada correctamente',
        data: categoria,
      });

    } catch (error) {
      next(error);
    }
  };

  export const deleteCategoria = async (req, res, next) => {
    try {
      const categoria = await categoriaService.deleteCategoriaRecord(req.params.id);

      if (!categoria) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
      }

      res.json({
        success: true,
        message: 'Categoría eliminada correctamente',
      });

    } catch (error) {
      next(error);
    }
};
