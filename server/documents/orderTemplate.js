module.exports = ({ orderId, products, currentOrder }) => {
   return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>Order ${orderId}</title>
          <style>

          </style>
       </head>
       <body>
       ${products.map(product => (
      `
      <h1>Order# ${orderId}</h1>
      <div
         class="MuiPaper-root MuiCard-root sc-bBXqnf bfSAfY MuiPaper-elevation1 MuiPaper-rounded"
      >
         <div class="MuiCardContent-root">
         <div class="sc-iwyYcG edtAEI">
         <div class="sc-cxFLnm bqwsBM">
            <strong class="sc-lmoMRL ePAGas">Billing Address</strong>
            <span>${currentOrder.billingAddress.addressCountry}</span>
            <span>${currentOrder.billingAddress.addressState}</span>
            <span>${currentOrder.billingAddress.addressLine1}</span>
         </div>
         <div class="sc-cxFLnm bqwsBM">
            <strong class="sc-lmoMRL ePAGas">Billing Address</strong>
            <span>${currentOrder.billingAddress.addressCountry}</span>
            <span>${currentOrder.billingAddress.addressState}</span>
            <span>${currentOrder.billingAddress.addressLine1}</span>
         </div>
         </div>
         </div>
      </div>
    
            <div class="MuiBox-root MuiBox-root-5 sc-kEjbxe glGZIs">
               <div class="MuiBox-root MuiBox-root-6 sc-pFZIQ bfoFZq">
                  <img src="${product.imageURLs.length && product.imageURLs[0]}" style="width:100%; max-width:156px;" alt="">
               </div>
               <div class="MuiBox-root MuiBox-root-7 sc-fubCfw eNqXsX">
                  <p class="sc-jSgupP eYNhsK"></p>
                  <p class="sc-gKsewC hCUSFp">${product.title}</p>
               </div>
               <div class="MuiBox-root MuiBox-root-8 sc-iqHYGH bVGya-d">${product.price.currency} ${product.price.value}</div>
            </div>
            `
   ))}
       </body>
    </html>
    `;
};