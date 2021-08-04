const path=require('path')
const ScheduleModel=require('../models/schedule');
const router=require('express').Router();
const {check,body,validationResult}=require('express-validator');
const moment=require('moment');

const format="hh:mm:ss"
const class_begin="06:40";
const class_end="07:39";





// GET ROUTE- (the link that the student will have)
// Path - /:uid
router.get('/:uid',check('uid').notEmpty().withMessage("Error in the link"),(req,res)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
      res.render('redirect',{content:"Incorrect URL",url:"https://meet.google.com",code:"422"});
  }
  else{

  
  ScheduleModel.findOne({uid:req.params.uid}).then(result=>{
      if(result===null)
      res.render('redirect',{content:"URL not found",url:"https://meet.google.com",code:"404"});
      else{
          const curr_time=moment(moment(),format);
          var flag=false;
          var i;
          for(i=0;i<result.schedule.length;i++){
              const {days,startTime,endTime,link}=result.schedule[i];
              if( days.includes(moment().day()) &&  curr_time.isBetween(moment(startTime,format),moment(endTime,format))){
                 flag=true
                 res.redirect(link);
                 break;
              }
            }
          if(!flag)
          res.render('redirect',{content:"You haven't put any meet link for this time you can relax",url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ",code:"401"});
          
      }
  })
  }
})


// POST ROUTE- (the link that the student will actually get)
// Path - /link/add
router.post('/add',[
    body("uid").notEmpty().isLength({min:6}),
    body("schedule").isArray(),
    body("schedule.*.days").notEmpty().isArray(),
    body("schedule.*.hour").notEmpty().isNumeric(),
    body("schedule.*.link").notEmpty().isURL()
],(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({errors:errors.array()});
    }
    const {uid,schedule}=req.body;
    
    ScheduleModel.findOne({uid:uid}).then(result=>{
        // console.log(res);
        if(result!= null)
        {
            schedule.forEach(element => {
                element.startTime=element.startTime?moment(element.startTime,format).toISOString():moment(class_begin,format).add(element.hour,'hour').toISOString(),
                element.endTime=element.endTime?moment(element.startTime,format).toISOString():moment(class_end,format).add(element.hour,'hour').toISOString()
             });
            result.schedule=schedule;
            return result.save();
        }
        else 
         {
            schedule.forEach(element => {
                element.startTime=element.startTime?moment(element.startTime,format).toISOString():moment(class_begin,format).add(element.hour,'hour').toISOString(),
                element.endTime=element.endTime?moment(element.startTime,format).toISOString():moment(class_end,format).add(element.hour,'hour').toISOString()
             });
             const newSchedule=new ScheduleModel({
                 uid:uid,
                 schedule:schedule
             })
             return newSchedule.save();
         }
    }).then(result=>{
        res.status(200)
        .json({
            err:[],
            mssg:"Operation Successful",
            data:{ 
                link:`/link/${uid}`
        }});
    })
    .catch(err=>{
        console.log(err);
    })
})

module.exports=router;