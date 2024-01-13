module.exports = 
    class CustomError extends Error{ 
        constructor(msg, statusCode, desc){
            super(msg)
            this.statusCode = statusCode
            if(desc)
                this.desc = desc
            else 
                this.desc = "Please wait a few minutes before trying again"
        }
    }
