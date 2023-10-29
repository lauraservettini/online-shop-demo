require("json-circular-stringify");

function protectRoutes(req, res, next){
    if(!res.locals.isAuth){
        return res.redirect("/401");
    }

    const resPath = res.socket.parser.incoming._parsedUrl.path;
    let jsonPath = JSON.stringify(resPath);

    if(jsonPath.startsWith("/admin") && !res.locals.isAdmin){
        return res.redirect("/403");
    }

    next();
}

module.exports = protectRoutes;