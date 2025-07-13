class ApiError extends Error{
    constructor(
        statusCode,
        message="Something Went Wrong !!!",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false
        this.errors=errors

        // Production Code ,for error handling 
        if(stack){
            this.stack=stack

        }else{
            Error.captureStackTrace(this,this.constructor)
            // we passed the instance , which error we are talking about
        }
    }

}

export {ApiError}