import mongoose from "mongoose";


const Operations = new mongoose.Schema(
  {
    user:{
      type:Object
    },
    type: {
      type: String,
    },
    data: {
      type: Object
    },
    signature:{
      type:String,
    }

  },
  {
    timestamps: true
  }
);



export default mongoose.model("operations", Operations);
