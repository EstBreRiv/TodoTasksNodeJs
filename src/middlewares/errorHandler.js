export const errorHandler = (err, req, res, next) => {
    //console.error(err); // Imprime el error en consola
    const status = err.status || 500; // settea el status code
    const message = err.message || "Internal Server Error"; // settea el mensaje
    res.status(status).json({ 
        status,
        error: err.status || 500,
        error: err.name || 'Internal Server Error',
     }); // devuelve la respuesta
};