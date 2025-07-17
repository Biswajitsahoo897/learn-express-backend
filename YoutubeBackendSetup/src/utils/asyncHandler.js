// const asyncHandler=()=>{

// }

// this is higher order function
// const asyncHandler=(fn)=>{async ()=>{

// }}

// Approach 1 ,Using Promises

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err));
    };
}
export { asyncHandler }


// Approach 2 ,Using try-catch block
/*
const asyncHandler=(fn)=>async (req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(error.code || 500).json({
            success:false,
            message:error.message
        })
    }
}

export {asyncHandler}


/*
    WHAT IS THE PURPOSE OF THIS CODE?

This is a wrapper code will gonna help in every code we will write in future for the use, so we dont have to use try-catch block 
every single time & it automatically forwards errors to your Express error handler so it is useful

*/
