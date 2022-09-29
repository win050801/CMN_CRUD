const { request, response } = require("express")
const express = require("express")
const app = express()
app.use(express.json({extended:false}))
app.use(express.static('./views'))
app.set('view engine','ejs')
app.set('views','./views')

// config dynamo
const AWS = require('aws-sdk')
const config =new AWS.Config({
    accessKeyId:'AKIAZ2OYAWYVLUICT6A3',
    secretAccessKey:'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',
    region:'us-west-2'

})
AWS.config = config
const docClient = new AWS.DynamoDB.DocumentClient()
const tablename = 'SanPham'



const multer = require('multer')
const upload = multer()



app.get('/',(request,response)=>{
    const params = {
        TableName:tablename,
    }
    docClient.scan(params,(err,data)=>{
        if(err)
        {
            response.send('Error')
        }
        else
        {
            return response.render('index',{sanPhams:data.Items})
        }
    })
})

app.post('/update',upload.fields([]),(req,res)=>{
    const {ma_sp,ten_sp,so_luong} = req.body

    const params = {
        TableName:tablename,
        Item:{
            "ma_sp":ma_sp,
            "ten_sp":ten_sp,
            "so_luong":so_luong
        }
    }
    docClient.put(params,(err,data)=>{
        if(err)
        {
             return res.send('Error')
        }
        else
        {
            return res.redirect('/')
        }
    })
})

app.post('/delete',upload.fields([]),(req,res)=>{
    const {ma_sp} = req.body

    const params = {
        TableName:tablename,
        Key:{
            ma_sp
        }
    }
    docClient.delete(params,(err,data)=>{
        if(err)
        {
            console.log(ma_sp);
             return res.send(ma_sp)
        }
        else
        {
            return res.redirect('/')
        }
    })
})

// app.post('/delete',upload.fields([]),(req,res)=>{
//     const listItems = Object.keys(req.body)
//     if(listItems.length===0)
//     {   
//         console.log(listItems.length);
//         return res.redirect('/')
//     }
//     function onDeleteItem(index){
//         const params = {
//             TableName:tablename,
//             Key:{
//                 "ma_sp":listItems[index]
//         }
//     }}
//     docClient.delete(params,(err,data)=>{
//         if(err)
//         {
//              return res.send('Error')
//         }
//         else
//         {
//             if(index>0)
//             {
//                 onDeleteItem(index-1)
//             }
//             else{
//                 return res.redirect('/')
//             }
//         }
//     })
// })






//Test
// app.get('/',(request,response)=>{
//         return response.render('index')
//     })

app.listen(3000,()=>{
    console.log('sever is run');
})


