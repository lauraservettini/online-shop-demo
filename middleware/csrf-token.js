const { csrfSync } = require("csrf-sync");

const {
  invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
  generateToken, // Use this in your routes to generate, store, and get a CSRF token.
  getTokenFromRequest, // use this to retrieve the token submitted by a user
  getTokenFromState, // The default method for retrieving a token from state.
  storeTokenInState, // The default method for storing a token in state.
  revokeToken, // Revokes/deletes a token by calling storeTokenInState(undefined)
  csrfSynchronisedProtection, // This is the default CSRF protection middleware.
} = csrfSync({
  //     ignoredMethods : ["GET", "HEAD", "OPTIONS"],
  //     getTokenFromState : (req) => {
  //       return req.session.csrfToken;
  //     }, // Used to retrieve the token from state.
  getTokenFromRequest: (req) => {
    if (req.is("multipart")) {
        const csrfToken = req.session.csrfToken;

        if(!req._parsedOriginalUrl.query || req._parsedOriginalUrl.query === ""){
            return;
        }
        else if (req._parsedOriginalUrl.query === ("csrftoken=" + csrfToken)){
            return csrfToken;
        }
        return;
    }
    
    return req.body["CSRFToken"];
  }, 
  
  // Used to retrieve the token submitted by the request from body
  //     storeTokenInState : (req, token) => {
  //       req.session.csrfToken = token;
  //     }, // Used to store the token in state.
  //     size : 128, // The size of the generated tokens in bits
});

function addCsrfToken(req, res, next) {
  const csrfToken = generateToken(req); 
  res.locals.csrfToken = csrfToken;
  next();
}

module.exports = {
  addCsrfToken: addCsrfToken,
  csrfSynchronisedProtection: csrfSynchronisedProtection,
};
