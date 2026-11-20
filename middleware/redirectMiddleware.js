const redirectHome = (req, res, next) => {

 if (req.session.data!==undefined){
    if(req.session.data.role=='admin')// if admin session is valid
    {
       res.redirect("/admin/home");
    }
    else if(req.session.data.role=='user'){
      req.session.data.status='logged-in';
      let id=req.session.data.userid;
      res.redirect("/users/profile/"+id);

    }

 }
 else{
    //default website home page
    //res.render("index", {});
    next();
 }
}


module.exports={
	redirectHome,
};