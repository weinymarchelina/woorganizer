const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema(
  {
    name: String,
    field: String,
    phone: Number,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    team: Array,
    image: {
      type: String,
      default: null,
    },

    inventory: [
      {
        name: String,
        description: String,
        variation: [
          {
            name: {
              type: String,
              default: null,
            },
            active: {
              type: Boolean,
              default: true,
            },
            image: {
              type: String,
              default: null,
            },
            capital: [
              {
                desc: String,
                cost: Number,
              },
              { timestamps: true },
            ],
          },
        ],
      },
    ],
    products: [
      {
        name: String,
        desc: String,
        variation: [
          {
            name: {
              type: String,
              default: null,
            },
            active: {
              type: Boolean,
              default: true,
            },
            image: {
              type: String,
              default: null,
            },
            capital: [
              {
                desc: String,
                cost: Number,
              },
              { timestamps: true },
            ],
            price: [
              {
                desc: String,
                cost: Number,
              },
              { timestamps: true },
            ],
          },
        ],
      },
    ],
    invoice: [
      {
        customer: String,
        products: [
          {
            name: String,
            desc: String,
            variation: {
              name: {
                type: String,
              },
              image: {
                type: String,
                default: null,
              },
              capital: {
                desc: String,
                cost: Number,
              },
              price: {
                desc: String,
                cost: Number,
              },
            },
          },
        ],
      },
      { timestamps: true },
    ],
    targets: [
      {
        name: {
          type: String,
          default: null,
        },
        target: Number,
        time: Number,
      },
      { timestamps: true },
    ],
    cash: {
      balance: Number,
      expenses: [
        {
          desc: String,
          cost: Number,
          addedBy: String,
        },
        { timestamps: true },
      ],
      income: [
        {
          desc: String,
          value: Number,
        },
        { timestamps: true },
      ],
    },
    activities: [
      {
        doneBy: String,
        activity: String,
        desc: String,
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

const Business =
  mongoose.models.businesses || mongoose.model("businesses", BusinessSchema);

// export default Business;
module.exports = Business;

// products: {
//     type: Array,
//     default: null,
//   },
//   invoice: {
//     type: Array,
//     default: null,
//   },
//   targets: {
//     type: Array,
//     default: null,
//   },
//   cash: {
//     type: Array,
//     default: null,
//   },
//   activities: {
//     type: Array,
//     default: null,
//   },
