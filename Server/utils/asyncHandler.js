export const asyncHandler = (fn) =>  async(req, res, next) =>{
  // fn is a asynchronous function
  try {
    await fn(req, res, next);
  } catch (error) {
    console.log(error)
    res.status(error.statusCode||500).json({
      message: error.message,
    })
  }
};
