import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number,
        min:1,
        max:5,
        default: 1,
        required:true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    images:[
        String
    ],
    description: {
        type: String,
        trim: true,
    }

})

reviewSchema.index({user:1,product:1},{unique:true})

reviewSchema.statics.calculateAvgRatings = async function (productId){
    const stats = await this.aggregate([
        {$match:{product:productId}},
        {$group:{
            _id:"$product",
            avgRating:{$avg:"$rating"}
        }},
    ])
    try{
        if (stats.length >0){
           await mongoose.model("Product").findByIdAndUpdate(productId,{
                rating:Math.round(stats[0].avgRating*10)/10
            })
        }else{
          await  mongoose.model("Product").findByIdAndUpdate(productId,{
                rating:0
            })
        }


    }catch(err){
        console.error("Error updating product rating:", err);
    }
}
reviewSchema.post('save',function (){
    this.constructor.calculateAvgRatings(this.product)
})
reviewSchema.post(/^findOneAnd/, async function (doc) {
    if (doc) {
        await doc.constructor.calculateAvgRatings(doc.product);
    }
});

export const Review = mongoose.model('Review', reviewSchema);