const  mongoose  = require('mongoose')
let express = require('express')
let morgan = require('morgan')
let fs = require('fs')
app = express();
const dotenv = require("dotenv")
dotenv.config({path:'./config.env'})
// console.log(process.env)
const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
)
app.use(express.json())  
// console.log(DB)
mongoose.connect(DB, 
    {

  useNewUrlParser: true,
  useCreateIndex:true,
  useFindAndModify:false
  
  
})
.then(()=>{
    console.log('DB connection succeed')
})
.catch(err => {
    console.log('network issue')
})

let DT = new mongoose.Schema({
    vehicleNo: {
        type: String,
        required: [true, 'Vehicle Number is required!']
    },
    vehicleColor: {
        type: String,
        required: [true, 'Vehicle color is required!']
    },
    vehicleModel: {
        type: String,
        required: [true, ' Vehicle Model is required!']
    },
    parkingCharges: {
        type: Number,
        required: [true, 'Parking Charges are musr!']
    }
})

let dt = mongoose.model("dt", DT)

// let data = JSON.parse(fs.readFileSync(${__dirname}/APIs/Data.json));

app.use(morgan('dev'))

app.use((req,res,next)=>{
    console.log('Hi');
    next();
})



//Extra

               
let arr= [];
let obj = {
    saman:'bakery',
    karobar: 'dukaan'
}


//vehicle system

app.post('/accountant/vehicle/entry', async (req,res)=>{
    // console.log(req.body)
    try{
      const data=  await dt.create(req.body);
        res.status(200).json({
            Data: data
        })
    }
    catch(err){
        res.status(404).json({
            message: 'Failed',
            Error: err
        })
    }
})

app.get('/admin/vehicle/check', async (req,res)=>{
    try{
        let data = await dt.find();
        // console.log(data)
        let stats = await dt.aggregate([
            {
                $match: { parkingCharges: {$gte: 1} }
            },
            {
                $group: {
                    _id: null,
                    TotalEntries: { $sum: 1},
                    TotalBalance: { $sum: '$parkingCharges'}
                }
            }
        ])
        res.status(200).json({
            Stats: stats,
            Entries: data
        })
    }
    catch(err){
        res.status(404).json({
            message: 'Failed',
            Error: err
        })
    }
})

app.delete('/admin/vehicle/delete/:id', async(req,res)=>{
    // console.log(req.params.id)
    try{
        await dt.findByIdAndDelete(req.params.id,)
        res.send('Done')
    }
    catch(err){
        res.status(404).json({
            message: 'Failed',
            Error: err
        })
    }
})

app.listen(3000, () => {
    console.log('pr')
})
