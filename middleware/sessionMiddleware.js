const hasSessionEnded = async(req,res,next) => {
  if (req.session.data===undefined){
    res.render("error_views/unauthorized_access", {error_msg:'Unfortunately, your session has ended.Please login again.'});
  }
  else next();
}

module.exports={
  hasSessionEnded,
};