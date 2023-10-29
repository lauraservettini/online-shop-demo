

function createUserSession(req, user, action){
    req.session.uid = user._id.toString();
    req.session.isAdmin = user.isAdmin;
    req.session.save(action);//save method da express-session package
}

function cancelSession(req){
    req.session.uid = null;
}

module.exports = {
    createUserSession,
    cancelSession
}