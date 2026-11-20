
const isVerifiedUser = async(req,res,next) => {
  
  //if session does not exist
  if (req.session.data===undefined){
    res.render("error_views/unauthorized_access", {error_msg:'login to access this page!'});

  }
  else{
    if(req.session.data.role=='user')
    {
      if(req.session.data.is_user_verified==0)
      {
        res.render("error_views/unauthorized_access", {error_msg:'your account is not verified.please verify it.'});
      }
      else
      {
        next();
          //res.render("user_views/user_home",{welcome_msg:'',userid:userid,});   
      }

    }
    else res.render("error_views/unauthorized_access", {error_msg:'only verified user is allowed access !'});
  }
}

module.exports={
	isVerifiedUser,
};