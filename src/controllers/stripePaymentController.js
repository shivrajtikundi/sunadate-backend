const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { response } = require('express');
const UTILS = require('../utils/format-number.js');
// const customer_details=require('../models/paymentDetailsSchemas/customerSchema');
const product_details =require('../models/paymentDetailsSchemas/productSchema');
const userPayDetails = require ('../models/paymentDetailsSchemas/customerSchema')
const ObjectId = require('mongodb').ObjectID;


exports.createProduct = async (req, res, next) => {

  try {
    let {description, features, name, prices} = req.body;
    console.log(req.body);
    const product = await stripe.products.create({
      name: name,
      type: 'service',
      metadata: {features: features},
      description: description
    });

    if(product.id) {
     for (const price of prices) {
      await stripe.prices.create({
        product: product.id,
        unit_amount: price.unit_amount,
        currency: 'usd',
        recurring: {
          interval: price.interval,
          interval_count:price.interval_count
          },
      });
    };
  }
    res.status(200).json(product);
  } catch (err) {
    console.log("error", err);
    res.status(500).send({ error: err });
  }
}

exports.getAllProducts = async (req,res,next) => {
  try {
    // const products = await product_details.find();
    const products = await stripe.products.list({
     
    });
    const formattedProducts = [];
    for (const product of products.data ) {
      let prices = await stripe.prices.list({
        product:product.id,
        active:true
      });

      let formattedProduct = {
        id:product.id,
        active: product.active,
        created:product.creaated,
        name:product.name,
        metadata:product.metadata,
        description:product.description
      }

      formattedProduct.prices = prices.data.map(price => {
        return {
          id: price.id,
          active: prices.active,
          currency: price.currency,
          recurring: price.recurring,
          unit_amount: price.unit_amount / 100
        }
      });

      formattedProducts.push(formattedProduct);

    };
    res.status(200).json({length:products.data.length,products,formattedProducts});
  } catch(err) {
    console.error("Error fetching ",err);
    res.status(500).send({ error: err });
  }
}

exports.updatePlanActiveStatus = async (req, res, next) =>{
  try {
    let productId = req.params.id;
    let {active} = req.body;
    console.log("Active", active);
    console.log("id", productId);
    let updatedPlan = await stripe.products.update( productId , { active: active });
    console.log("updatedPlan", updatedPlan);
    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("Error fetching ",err);
    res.status(500).send({ error: err });
  }
}

exports.addProductprice= async (req, res, next) => {
  try{
    const price = await stripe.prices.create({
      product: req.body.productId,
      unit_amount: req.body.productPrice[0].unit_amount,
      currency: 'usd',
      recurring: {interval: req.body.productPrice[0].period,interval_count: req.body.productPrice[0].interval_count},
    });

    let productDetails = {
      priceId:price.id,
      price:price.unit_amount,
      interval:{
        interval:price.recurring.interval,
        interval_count:price.recurring.interval_count
      }
    }
    const addprice = await product_details.findByIdAndUpdate(req.params.id,{$push:{product_details:[productDetails]}})
    res.status(200).send(price);
  }
  catch(error){
  res.status(500).send({message: error.message});
  }
}

exports.listPrice = async (req, res) => { 
  try {
    const products = await stripe.prices.list({
      product: req.body.product,
      active: true
    });
    // var result = products.data.map(productid => ({ }));
    res.status(200).send(products);
  } catch (error) {
    res.status(401).send(error.message);
  }
}

exports.updateProductprice= async (req, res, next) => {
try {
  const price = await stripe.prices.update(
    req.body.priceId,
    {active: req.body.active}
  );
  const addprice = await product_details.findByIdAndUpdate(req.params.id,{product_details:req.body.product_details})
  res.status(200).send(price,addprice)
} catch (error) {
  res.status(500).send({message: error.message});
}
}

exports.createCustomerId=async (req, res, next) => {
  // Create a new customer object
 try {
  const customer = await stripe.customers.create({
    email: req.body.email,
  });
  // const details=new customer_details({
  //   userid: req.body.userid,
  //   customerId:customer.id,
  //   email:req.body.email
  // })
  // await details.save();
  // Save the customer.id in your database alongside your user.
  // We're simulating authentication with a cookie.
  // res.cookie('customer', customer.id, { maxAge: 900000, httpOnly: true });

  res.send({ customer: customer });
  // next()
 } catch (error) {
  res.send({ error: error.message });
 }
  
}

exports.create_subscription= async (req, res) => {
  // Simulate authenticated user. In practice this will be the
  // Stripe Customer ID related to the authenticated user.
  const customerId = req.body.customerId
  // Create the subscription
  const priceId = req.body.priceId;
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: priceId,
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    
    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      subscription
    });
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }
};

exports.getCustomerSubscription = async (req, res) => {
  try {
    const customerId = req.params.customerid;
    const subscriptions = await stripe.subscriptions.list({ customer: customerId });

    let formattedSubscriptions = subscriptions.data.map((data=>{
      return data;
    }));
    let user = new userPayDetails({
      userid:req.params.userid,
      customerId: formattedSubscriptions[0].customer,
      subscription_id:formattedSubscriptions[0].id,
      current_period_end:formattedSubscriptions[0].current_period_end,
      current_period_start:formattedSubscriptions[0].current_period_start,
      planName:formattedSubscriptions[0].plan.nickname,
      amount:formattedSubscriptions[0].plan.amount/100+formattedSubscriptions[0].plan.currency,
      active:formattedSubscriptions[0].plan.active,
      interval:formattedSubscriptions[0].plan.interval,
      latest_invoice:formattedSubscriptions[0].latest_invoice
    })
    await user.save();
    res.status(200).send({user});
  }
  catch (err) {
    console.log("error", err);
    res.status(404).send({ error: err });
  }
}

exports.checkout= async (req, res) => {
  try{
const session = await stripe.checkout.sessions.create({
  customer:req.body.customerId,
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel',
  line_items: [
    {price: req.body.priceId, quantity: 1}
  ],
  mode: 'subscription',
})
res.send(session);
}catch(e) { 
  console.error(e) 
res.send({status: 'error', message: e.message});
}
}

exports.listAllcustomers = async (req, res, next) => {
  try {
    const customers = await stripe.customers.list({});
    let formattedCustomer = customers.data.map(customer =>{
      return {
        id: customer.id,
        email: customer.email, 
        country: customer?.address?.country || "NA",
        currency: customer?.currency || "NA"
      }
    });
    res.status(200).send( formattedCustomer );
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message)
  }
 
}

exports.payments=async(req, res, next) => { 
try {
  // const paymentIntents = await stripe.paymentIntents.list({
  // });
  const paymentIntent = await stripe.paymentIntents.search({
    query: 'status:\'succeeded\'',
  });
  res.send(paymentIntent)
} catch (error) {
  res.send(error.message)
}
 
}

exports.activeSubscriptions= async (req, res) => {
  const subscriptions = await stripe.subscriptions.list({
  });
  res.send(subscriptions)
}

exports.invoice= async (req, res) => {
  const invoice = await stripe.invoices.retrieve(
    'in_1LKV4ZLpA7E67eR2htVqseY0'
  );
  res.send(invoice)
}

exports.createPlan = async (req, res, next) => {
  const plan = await stripe.plans.create({
    nickname: requestBody.planName,
    amount: UTILS.formatStripeAmount(requestBody.planAmount),
    interval: requestBody.planInterval,
    interval_count: parseInt(requestBody.planIntervalNumber),
    product: requestBody.productId,
    currency: 'USD'
  });

  res.status(200).json({ plan });
}

exports.createSubscription=async (req, res) => {
  // Simulate authenticated user. In practice this will be the
  // Stripe Customer ID related to the authenticated user.
  const customerId = req.body.customerId;

  // Create the subscription
  const priceId = req.body.priceId;

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: priceId,
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }
}

//Create customer subscription 
exports.createCustomerAndSubscription = async (req, res, next) => {
  try {
    const customer = await stripe.customers.create({
      source: req.body.stripeToken,
      email: req.body.customerEmail
    });
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          plan: req.body.planId
        }
      ]
    });

    res.status(200).json({ subscription });

  }
  catch (err) {
    console.log("error", err);
    res.status(404).send({ error: err });
  }

}

exports.sendStripeApiKey = async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
}

exports.create_Subscription = async (req,res,next) => {
  // const body = req.body.price;
  const priceId = 'price_1LDpl3SBfB4rS9YYRH6SsIMZ'
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    s: [
      {
        price: priceId,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    success_url: 'https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://example.com/canceled.html',
  });
  res.status(200).json({message:session})
}


exports.testcheckout =  async (req,res,next) =>{
  
  try{
    const session = await stripe.checkout.sessions.create({
      customer:req.body.customerId,
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      line_items: [
        {price: req.body.priceId, quantity: 1}
      ],
      mode: 'subscription',
    })
    res.send(session);
    }catch(e) { 
      console.error(e) 
    res.send({status: 'error', message: e.message});
    }
    }

exports.allCustomerDetails= async (req, res, next) => {
  try{
    const customer = await userPayDetails.aggregate([
     { 
       $lookup:
      {
          from: "users",
          localField: "userid",
          foreignField: "_id",
          as: "user"
      }
    }
    ]); 
    res.status(200).send(customer);
  }catch(e) {
    res.send({status: 'error', message: e.message});
  }
   
}

exports.customerDetails= async (req, res, next) => {
  try{
    const customer = await userPayDetails.findById({userid:ObjectId(req.params.id)})
    res.status(200).send(customer);
  }catch (error) {
    res.status(500).send({status: 'error', message: error.message});
  }
}
