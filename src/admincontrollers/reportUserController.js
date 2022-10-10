const reportSchema = require("../models/reportSchema")
var ObjectId = require('mongodb').ObjectID;


exports.getReport = async (req, res) => {
    try{
      let pipeline= [
          {
         $match: { to_userid: ObjectId(req.params.id) }
          },
          {
          $lookup:
            {
              from: "users",
              localField: "to_userid",
              foreignField: "_id",
              as: "userRequest",
            },
            },
            
       ];
       const users = await reportSchema.aggregate(pipeline);
      return res.status(201).send(users);
  }
  catch(e){
      console.log("e===",e);
      res.status(406).send({message:"something went wrong"})
  }
}

exports.deleteReport = async (req, res) => {
  try {
    const report = await reportSchema.findById(req.params.id)
    await report.remove();
    res.status(200).send({ data: true });
  } catch {
    res.status(404).send({ error: "report is not found!" });
  }
};

exports.getAllreports = async (req, res, next) => {
  try {
    let searchfield = req.query.name;
    let { page=1, limit=10 } = req.query;
    page = Number(page);
    limit=Number(limit);
    const skip=((page - 1) * limit);
    console.log(skip);

    const totalReports = await reportSchema.aggregate([ 
      {
      $lookup:
        {
          from: "users",
          localField: "to_userid",
          foreignField: "_id",
          as: "users",
        },
        }
      ]);
    if(searchfield){
      const allReports = await reportSchema.aggregate([ 
        {$match:{"name": { $regex: searchfield }}},
        {
        $lookup:
          {
            from: "users",
            localField: "to_userid",
            foreignField: "_id",
            as: "users",
          },
          },
          { 
            $skip: skip
          },
          {
            $limit:limit
          }
        ]);
      res.status(200).send({"count":allReports.length,"total":totalReports.length,allReports});
     
    }
   else if(page >= 1){
    const allReports = await reportSchema.aggregate([ 
      {
      $lookup:
        {
          from: "users",
          localField: "to_userid",
          foreignField: "_id",
          as: "users",
        },
        },
        { 
          $skip: skip
        },
        {
          $limit:limit
        }
      ]);
      res.status(200).send({"count":allReports.length,"total":totalReports.length,allReports});
   }
   else{
   const allReports = await reportSchema.aggregate([ 
    {
    $lookup:
      {
        from: "users",
        localField: "to_userid",
        foreignField: "_id",
        as: "users",
      },
      }
    ]);
    res.status(200).send({"count":allReports.length,"total":totalReports.length,allReports});
  }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

exports.updateReportById = async (req, res, next) => {
  try {
    console.log("request body for report update", req.body);
    const updateReportById = await reportSchema.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send(updateReportById);
  } catch (error) {
    res.status(404).send(error);
  }
}



exports.reportPagination = async (req, res, next) => {
  try {

    let searchField = req.query.name;
    const { page = 1, limit = 10 } = req.query;
    var report;
    var totalReport;

    if (searchField) {
      report = await reportSchema.find({ name: { $regex: searchField, $options: '$i' } })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    }
    else {
      report = await reportSchema.find()
        .limit(limit * 1)
        .skip((page - 1) * limit);
    }

    totalReport = await reportSchema.find();


    res.status(200).json({ "total": report.length, "totalCount": totalReport.length, report, searchField });

  } catch (error) {
    res.status(500).send(error.message)
  }
}
  
exports.searchReport = async (req, res) => {
  try {
    let searchField = req.query.email;
    const report = await reportSchema.findOne({ email: { $regex: searchField, $options: '$i' } });
    res.status(200).send(report);
  }
  catch (error) {
    res.status(500).send(error.message)
  }



}

exports.reportSearchAndPagination = async (req, res) => {
  try {
    const filter = req.body.query;
    let where = {};
    if (filter.name) {
      where.name = { $regex: filter.name, $options: "i" }
    }
    let query = reportSchema.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await reportSchema.countDocuments(where);
    const pages = Math.ceil(total / pageSize);

    if (page > pages) {
      return res.status(404).json({
        status: "fail",
        message: "No page found",
      });
    }
    result = await query.skip(skip).limit(pageSize);
    res.json({
      status: "success",
      filter,
      count: result.length,
      page,
      pages,
      data: result
    });

  }
  catch (error) {
    res.status(500).send(error.message)
  }
}