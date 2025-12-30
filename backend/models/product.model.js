// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     sellerCompany: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Company",
//       required: true,
//       index: true
//     },
//     name: {
//       type: String,
//       required: [true, "Product name is required"],
//       trim: true,
//       minlength: 3,
//       maxlength: 120
//     },
//     slug: {
//       type: String,
//       unique: true,
//       lowercase: true,
//       index: true
//     },
//     price: {
//       type: Number,
//       required: true,
//       min: [0, "Price cannot be negative"]
//     },
//     category: {
//       type: String,
//       required: true,
//       index: true
//     },
//     description: {
//       type: String,
//       trim: true,
//       maxlength: 2000
//     },
//     images: [
//       {
//         url: String,
//         alt: String
//       }
//     ],
//     stock: {
//       type: Number,
//       default: 0,
//       min: 0
//     },
//     isActive: {
//       type: Boolean,
//       default: true
//     },
//     minOrderQty: {
//       type: Number,
//       default: 1
//     },
//     tags: {
//       type: [String],
//       index: true
//     },
//     location: {
//       city: String,
//       state: String,
//       country: {
//         type: String,
//         default: "India"
//       }
//     }
//   },
//   {
//     timestamps: true
//   }
// );
// productSchema.index({ name: "text", description: "text", tags: "text" });
// productSchema.pre("save", function (next) {
//   if (!this.isModified("name")) return next();
//   this.slug = this.name.toLowerCase().replace(/ /g, "-");
//   next();
// });
// export default mongoose.model("Product", productSchema);

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    sellerCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },
    subDomain: {
      type: String,
      ref: "Company",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 3,
      maxlength: 120
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"]
    },

    category: {
      type: String,
      required: true,
      index: true
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000
    },

    images: [
      {
        url: String,
        alt: String
      }
    ],

    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    isActive: {
      type: Boolean,
      default: true
    },

    minOrderQty: {
      type: Number,
      default: 1
    },

    tags: {
      type: [String],
      index: true
    },

    location: {
      city: String,
      state: String,
      country: {
        type: String,
        default: "India"
      }
    }
  },
  {
    timestamps: true
  }
);

/* 🔍 TEXT SEARCH INDEX */
productSchema.index({
  name: "text",
  description: "text",
  tags: "text"
});

/* SLUG GENERATION */
productSchema.pre("save", async function () {
  if (!this.isModified("name")) return;

  const baseSlug = this.name.toLowerCase().trim().replace(/\s+/g, "-");
  let slug = baseSlug;
  let counter = 1;

  while (await mongoose.models.Product.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  this.slug = slug;
});

/* SUCCESS LOG ONLY */
productSchema.post("save", function (doc) {
  console.log("Product saved successfully");
  console.log("ID:", doc._id);
  console.log("Slug:", doc.slug);
});

export default mongoose.model("Product", productSchema);
