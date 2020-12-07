var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var Product = require('../models/Product');
var ProductSearchMetaData = require('../models/ProductSearchMetaData');
var ProductTag = require('../models/ProductTag');
const {sendEmail} = require("../email/emailClient");
var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);
const mongoose = require('mongoose');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
	accessKeyId: 'AKIAICO4I2GPW7SSMN6A',
	secretAccessKey: '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'
});
//stores
//users

const STYLES = {
  'trending': {
    handle: 'trending',
    title: 'Trending'
  },
  'waterfall': {
    handle: 'waterfall',
    title: 'Waterfall'
  },
  'blooming': {
    handle: 'blooming',
    title: 'Blooming'
  },
  'patterned': {
    handle: 'patterned',
    title: 'Patterned'
  },
  'cascading': {
    handle: 'cascading',
    title: 'Cascading'
  },
}

const LIGHT = {
  'low-light': {
    handle: 'low-light',
    title: 'Low Light'
   },
  'medium-light': { 
    handle: 'medium-light',
    title: 'Medium Light'
  },
  'bright-light': { 
    handle: 'bright-light',
    title: 'Bright Light'
  }
}

const WATER_LEVEL = {
  'low-level': {
    handle: 'low-water-level',
    title: 'Low level'
  },
  'medium-level': {
    handle: 'medium-water-level',
    title: 'Medium level'
   },
  'high-level': {
    handle: 'high-water-level',
    title: 'High level'
  }
}

const LEVEL = {
  'beginner': {
    handle: 'beginner-friendly',
    title: 'Beginner Friendly'
  },
  'intermediate': {
    handle: 'intermediate-friendly',
    title: 'Intermediate Friendly'
  },
  'advanced': {
    handle: 'advanced-friendly',
    title: 'Advanced Friendly'
  }
}

const SIZE = {
  'seed': {
    handle: 'size-seed',
    title: 'Seed'
  },
  'seedling': {
    handle: 'size-seedling',
    title: 'Seedling'
  }, // baby
  'mini': {
    handle: 'size-mini',
    title: 'Mini ( < 2.5in )'
  }, // 2.5in - 4in
  'small': {
    handle: 'size-small',
    title: 'Small ( 2.5-4in )'
  }, // < 4in
  'medium': {
    handle: 'size-medium',
    title: 'Medium ( 4-8in )'
  }, // < 8in
  'large': {
    handle: 'size-large',
    title: 'Large ( 8-12in )'
  }, // < 14 in
  'xlarge': {
    handle: 'size-xlarge',
    title: 'XLarge ( 12in+ )'
  }, // < 16in// 10+ gallon
}

const BENEFIT = {
  'pet-friendly': {
    handle: 'pet-friendly',
    title: 'Pet Friendly'
  },
  'air-purifying': {
    handle: 'air-purifying',
    title: 'Air Purifying'
  },
  'beginner-friendly': {
    handle: 'beginner-friendly',
    title: 'Beginner Friendly'
  },
  'advanced': {
    handle: 'advanced-friendly',
    title: 'Advanced Friendly'
  },
  'low-light-friendly': {
    handle: 'low-light-friendly',
    title: 'Low Light Friendly'
  },
  'allergen-friendly': {
    handle: 'allergen-friendly',
    title: 'Allergen Friendly'
  },
  'good-for-tea': {
    handle: 'good-for-tea',
    title: 'Good For Tea'
  },
  'good-for-cooking': {
    handle: 'good-for-cooking',
    title: 'Good For Cooking'
  },
  'medicinal': {
    handle: 'medicinal',
    title: 'Medicinal'
  }
}

let plantVariety = {
  'air-plant': {},
  'calathea': {},
  'fern': {},
  'fiddle-leaf-fig': {},
  'marimo': {},
  'monstera': {},
  'money-tree': {},
  'parlor-palm': {},
  'pepromia': {},
  'philodendron': {},
  'pilea': {},
  'pothos': {},
  'snake-plant': {},
  'zz-plant': {},
  'succulent': {}
}

const COLOR = {
  'blue' : {
    handle: 'blue',
    title: 'Blue',
    hex: '#1E1DCD',
  },
  'green': {
    handle: 'green',
    title: 'Green',
    hex: '#477138',
  },
  'yellow': {
    handle: 'yellow',
    title: 'Yellow',
    hex: '#DCBC4D'
  },
  'red': {
    handle: 'red',
    title: 'Red',
    hex: '#9F2458',
  },
  'purple': {
    handle: 'purple',
    title: 'Purple',
    hex: '#6A1DCD'
  },
  'orange': {
    handle: 'orange',
    title: 'Orange',
    hex: '#CD671D'
  },
  'brown': {
    handle: 'brown',
    title: 'Brown',
    hex: '#5C2D0A'
  },
  'white': {
    handle: 'white',
    title: 'White',
    hex: '#FFF'
  },
  'pink': {
    handle: 'pink',
    title: 'Pink',
    hex: '#C716A0'
  },
  'black': {
    handle: 'black',
    title: 'Black',
    hex: '#312A2D'
  },
  'gold': {
    handle: 'gold',
    title: 'Gold',
    hex: '#B1942D'
  },
  'silver': {
    handle: 'silver',
    title: 'Silver',
    hex: '#C5C5C5'
  },
  'gray': {
    handle: 'gray',
    title: 'Gray',
    hex: '#848484'
  },
  'beige': {
    handle: 'beige',
    title: 'Beige',
    hex: '#E4DCCF'
  },
  'cream': {
    handle: 'cream',
    title: 'Cream',
    hex: '#F2DFC3',
  },
  'tan': {
    handle: 'tan',
    title: 'Tan',
    hex: '#C7B498'
  },
  'mixed': {
    handle: 'mixed',
    title: 'Mixed'
  }

}
router.post('/initTestdata', function(req, res, next) {
});

router.get('/meta-data/init', async function(req, res, next) {
  // init tag for each product search metadata
  console.log("Meta data init...")
  let now = new Date();
  for (var i in STYLES) {
    let style = STYLES[i];
    const title = style.title;
    const handle = style.handle;
    let newMetaScheme = new ProductSearchMetaData({
      createdAt: now,
      updatedAt: now,
      type: 'style',
      title: title,
      handle: handle,
    });
    await newMetaScheme.save();
  }

  for (var i in LIGHT) {
    let light = LIGHT[i];
    const title = light.title;
    const handle = light.handle;
    let newMetaScheme = new ProductSearchMetaData({
      createdAt: now,
      updatedAt: now,
      type: 'light',
      title: title,
      handle: handle,
    });
    await newMetaScheme.save();
  }

  for (var i in WATER_LEVEL) {
    let light = WATER_LEVEL[i];
    const title = light.title;
    const handle = light.handle;
    let newMetaScheme = new ProductSearchMetaData({
      createdAt: now,
      updatedAt: now,
      type: 'water-level',
      title: title,
      handle: handle,
    });
    await newMetaScheme.save();
  }

  for (var i in LEVEL) {
    let light = LEVEL[i];
    const title = light.title;
    const handle = light.handle;
    let newMetaScheme = new ProductSearchMetaData({
      createdAt: now,
      updatedAt: now,
      type: 'level',
      title: title,
      handle: handle,
    });
    await newMetaScheme.save();
  }

  for (var i in SIZE) {
    let light = SIZE[i];
    const title = light.title;
    const handle = light.handle;
    let newMetaScheme = new ProductSearchMetaData({
      createdAt: now,
      updatedAt: now,
      type: 'size',
      title: title,
      handle: handle,
    });
    await newMetaScheme.save();
  }

  for (var i in BENEFIT) {
    let light = BENEFIT[i];
    const title = light.title;
    const handle = light.handle;
    let newMetaScheme = new ProductSearchMetaData({
      createdAt: now,
      updatedAt: now,
      type: 'benefit',
      title: title,
      handle: handle,
    });
    await newMetaScheme.save();
  }

  for (var i in COLOR) {
    let color = COLOR[i];
    const title = color.title;
    const handle = color.handle;
    let newMetaScheme = new ProductSearchMetaData({
      createdAt: now,
      updatedAt: now,
      type: 'color',
      title: title,
      handle: handle,
      metaData: {
        hex: color.hex
      }
    });
    await newMetaScheme.save();
  }

});

module.exports = router;