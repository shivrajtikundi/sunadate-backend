const express = require('express');
const { processPayment, sendStripeApiKey,getAllProductsAndPlans,
        getCustomerSubscription,createCustomerAndSubscription,
        createProduct,create_Subscription,addProductprice,checkout,
        updatePlanActiveStatus,listAllcustomers,listPrice,
        create_subscription,createCustomerId ,getAllProducts,
        payments,activeSubscriptions,invoice,
        testcheckout,allCustomerDetails,customerDetails} = require('../controllers/stripePaymentController');
const router = express.Router();



// router.route("/createProduct").post(createProduct);

//add price
// router.route("/addProductprice/:id").post(addProductprice);

//update price set status active:false/true
// router.route("/updatePlanActiveStatus/:id").post(updatePlanActiveStatus);

// router.route("/listPrice").get(listPrice);

// router.route("/createCustomerId").post(createCustomerId);

// router.route("/create_subscription").post(create_subscription);

// router.route("/checkout").post(checkout);

// router.route("/listAllcustomers").get(listAllcustomers);

// router.route("/payments").get(payments);

// router.route("/activeSubscriptions").get(activeSubscriptions);

router.route("/getAllProducts").get(getAllProducts)

// router.route("/invoice").get(invoice)


// router.route("/process").post(processPayment);

// router.route("/stripeapikey").get(sendStripeApiKey);

// router.route("/getProducts").get(getAllProductsAndPlans);


// router.route('/getSubscription/:userid/:customerid').get(getCustomerSubscription);

// router.route("/createCustomerSubscription").post(createCustomerAndSubscription);

// router.route("/createSubscription").post(create_Subscription);

//test

router.route('/testcheckout').post(testcheckout);

router.route('/allCustomerDetails').get(allCustomerDetails);

router.route("/customerDetails/:id").get(customerDetails);   

module.exports = router;