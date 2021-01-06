module.exports = ({ orderId, products, currentOrder }) => {
   return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>Order ${orderId}</title>
          <style>
            .orderDetails {

            }

            .shippingContainer {
               display: flex;
            }

            .shippingColumn {
               display: flex;
               flex-direction: column;
            }
          </style>
       </head>
       <body>
       <h1>Order# ${orderId}</h1>
       <div
          class="orderDetails"
       >
          <div class="MuiCardContent-root">
          <div class="shippingContainer">
             <div class="shippingColumn">
                <strong>Billing Address</strong>
                <span>${currentOrder.billingAddress.addressCountry}</span>
                <span>${currentOrder.billingAddress.addressState}</span>
                <span>${currentOrder.billingAddress.addressLine1}</span>
             </div>
             <div class="shippingColumn">
                <strong">Billing Address</strong>
                <span>${currentOrder.billingAddress.addressCountry}</span>
                <span>${currentOrder.billingAddress.addressState}</span>
                <span>${currentOrder.billingAddress.addressLine1}</span>
             </div>
          </div>
          </div>
       </div>

       ${products.map(product => (
      `    
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

         <table cellpadding="0" cellspacing="0" width="100%">
            <tr class="information">
               <td>
                  Subtotal
               </td>
               <td>
                  ${currentOrder.orderInvoiceId.price.currency} ${currentOrder.orderInvoiceId.subtotal}
               </td>
            </tr>
            <tr class="information">
               <td>
                  Services
               </td>
               <td>
                  ${currentOrder.orderInvoiceId.price.currency} ${currentOrder.orderInvoiceId.surcharges}
               </td>
            </tr>      
            <tr class="information">
               <td>
               S&amp;H
               </td>
               <td>
               ${currentOrder.orderInvoiceId.price.currency} ${currentOrder.orderInvoiceId.shipping}
               </td>
            </tr>      
            <tr class="information">
               <td>
                  Total
               </td>
               <td>
                  ${currentOrder.orderInvoiceId.price.currency} ${currentOrder.orderInvoiceId.total}
               </td>
            </tr>
         </table>
       </body>
    </html>
    `;
};