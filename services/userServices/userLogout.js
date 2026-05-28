const logOut= function(req, res,session_name){
    req.session.destroy(function(err) {
    if (err) {
      //res.send('An err occured: ' +err.message);
      res.render("site_visitor_views/sign_in_page", {error_msg:err.message});
    } else {
      let message = 'You have been successfully logged out';
      //to do: display message on all user home page
      res.status(200).clearCookie(session_name).redirect('/');
    }
})
 
}

module.exports={
    logOut
};