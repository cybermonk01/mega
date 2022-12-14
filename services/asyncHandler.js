// export const asyncHandler = ()=>{}
// export const asyncHandler = (fn)=>{}          this fn was passed into function as parameter
// export const asyncHandler = (fn)=()=>{}       then this fn was passed into another function as param
// export const asyncHandler = (fn)= async()=>{}       then this async

export const asyncHandler = (fn = async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    res.status(err.status || 500).send("async error");
  }
});
