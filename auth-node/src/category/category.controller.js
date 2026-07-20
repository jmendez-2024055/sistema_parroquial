import * as categoriaService from './category.service.js';
import { seedCategorias } from './category.seeder.js';

  export const createCategoria = async (req, res, next) => {
    try {
      const data = { ...req.body };
      // Eliminar cualquier parroquiaId que venga del body para evitar spoofing
      delete data.parroquiaId;
      // Asignar parroquiaId del usuario autenticado
      data.parroquiaId = req.user.parroquiaId;

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

  export const initializeCategorias = async (req, res, next) => {
    try {
      const parroquiaId = req.user?.parroquiaId;

      if (!parroquiaId) {
        return res.status(400).json({
          success: false,
          message: 'No se puede inicializar categorías sin parroquiaId'
        });
      }

      await seedCategorias(parroquiaId);

      res.json({
        success: true,
        message: 'Categorías inicializadas correctamente para la parroquia'
      });

    } catch (error) {
      next(error);
    }
  };

  export const getCategorias = async (req, res, next) => {
    try {
      const parroquiaId = req.user?.parroquiaId;
      const categorias = await categoriaService.getCategoriasRecord(parroquiaId);

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
      const parroquiaId = req.user?.parroquiaId;
      const categoria = await categoriaService.getCategoriaByIdRecord(req.params.id, parroquiaId);

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
      const parroquiaId = req.user?.parroquiaId;
      const categoria = await categoriaService.updateCategoriaRecord(
        req.params.id,
        req.body,
        parroquiaId
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
      const parroquiaId = req.user?.parroquiaId;
      const categoria = await categoriaService.deleteCategoriaRecord(req.params.id, parroquiaId);

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
