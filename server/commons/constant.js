module.exports = {
    SUCCESS: {
        code: 1000
        ,message: "success"
    }
    ,EMPTY_DATA: {
        code: 1001
        ,message: "data not found"
    }
    ,ALREADY_SIGNUPED: {
        code: 1002
        ,message: "already signuped"
    }

    ,EMPTY_PARAMETER: {
        code: 2000
        ,message: "empty parameters"
    }
    ,INVALID_PARAMETER: {
        code: 2001
        ,message: "invalid parameters"
    }
    ,INVALID_TOKEN: {
        code: 2002
        ,message: "invalid token"
    }
    ,NOT_AUTHORIZED: {
        code: 2003
        ,message: "not authorized"
    }
    ,NOT_ALLOWED_PROVIDER: {
        code: 2005
        ,message: "not allowed provider"
    }
    ,AUTHORIZED_CHECK_FAULURE: {
        code: 2006
        ,message: "authorization check failure"
    }

    ,JSON_PARSE_ERROR: {
        code: 4000
        ,message: "json parse error"
    }
    ,ERROR_404: {
        code: 4001
        ,message: "not found"
    }

    ,ERROR_500: {
        code: 5000
        ,message: "something broken"
    }
}
