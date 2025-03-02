import { AppiError } from '../exeptions/api.errors.js';

export const errorMiddleware = (error, req, res, next) => {
  if (error instanceof AppiError) {
    return res.status(error.status).send({
      message: error.message,
      errors: error.errors
    });
  }

  res.status(500).send({
    message: 'Server error'
  });
};

