module.exports = ({ orderId, products, currentOrder }) => {
   const orderDate = new Date(currentOrder.createdAt);
   const getPrice = (price) => {
      return Math.ceil(new Number(price)) / 100
   }
   return `
   <!DOCTYPE html>
   <html>
   <head>
      <meta charset="utf-8" />
      <title>Order</title>
      <style>
         .invoice-box {
            font-size: 16px;
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, .15);
            font-size: 16px;
            line-height: 24px;
            font-family: 'Helvetica Neue', 'Helvetica',
            color: #555;
         }
         .margin-top {
            margin-top: 50px;
         }
         .justify-right {
            text-align: right;
         }
         .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left;
         }
         .invoice-box table td {
            padding: 5px;
            vertical-align: top;
         }
         .invoice-box table tr.top table td {
            padding-bottom: 20px;
         }
         .invoice-box table tr.top table td.title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
         }
         .invoice-box table tr.information table td {
            padding-bottom: 40px;
         }
         .invoice-box table tr.information table td.no-offset {
            padding-bottom: 10px;
         }
         .invoice-box table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
         }
         .invoice-box table tr.details td {
            padding-bottom: 20px;
         }
         .invoice-box table tr.item td {
            border-bottom: 1px solid #eee;
         }
         .invoice-box table tr.item.last td {
            border-bottom: none;
         }
         .invoice-box table tr.total td:nth-child(2) {
            border-top: 2px solid #eee;
            font-weight: bold;
         }
         @media only screen and (max-width: 600px) {
            .invoice-box table tr.top table td {
               width: 100%;
               display: block;
               text-align: center;
            }
            .invoice-box table tr.information table td {
               width: 100%;
               display: block;
               text-align: center;
            }
         }
      </style>
   </head>
   <body>
      <div class="invoice-box">
         <table cellpadding="0" cellspacing="0">
            <tr class="top">
               <td colspan="2">
                  <table>
                  <tr>
                     <td>
                        Date: ${`${orderDate.getDate()}. ${orderDate.getMonth() + 1}.
                        ${orderDate.getFullYear()}.`}
                     </td>
                  </tr>
                  </table>
               </td>
            </tr>
            <tr class="information">
               <td colspan="2">
                  <table>
                  <tr>
                     <td class="no-offset">
                        <b>Customer name:</b> ${currentOrder.billingAddress.userId.name}
                     </td>
                     <td class="justify-right">
                        <b>Order number:</b> ${orderId}
                     </td>
                  </tr>
                  <tr>
                     <td>
                        <b>Shipping Addres:</b> ${currentOrder.billingAddress.addressCountry}, ${currentOrder.billingAddress.addressState},  ${currentOrder.billingAddress.addressLine1}
                     </td>
                  </tr>
                  </table>
               </td>
            </tr>
            <tr class="heading">
               <td colspan="2">Bought items:</td>
               <td>Price</td>
            </tr>
            ${products.map(product => {
      return `
                        <tr class="item">
                           <td>
                              <img
                              src="${product.imageURLs.length && product.imageURLs[0]}"
                              style="width: 100%; max-width: 156px;"
                              />
                           </td>
                           <td>
                              ${product.title}
                           </td>
                           <td class="justify-right">${product.price.currency} ${getPrice(product.price.value)}</td>
                        </tr>
                     `
   }).join('')}
         
         </table>
         <br />
         <h2 class="justify-right">Subtotal: ${currentOrder.orderInvoiceId.price.currency} ${getPrice(currentOrder.orderInvoiceId.subtotal)}</h2>
         <h2 class="justify-right">Services: ${currentOrder.orderInvoiceId.price.currency} ${getPrice(currentOrder.orderInvoiceId.surcharges)}</h2>
         <h2 class="justify-right">S&amp;H: ${currentOrder.orderInvoiceId.price.currency} ${getPrice(currentOrder.orderInvoiceId.shipping)}</h2>
         <h1 class="justify-right">
            Total price: ${currentOrder.orderInvoiceId.price.currency} ${getPrice(currentOrder.orderInvoiceId.total)}
         </h1>
      </div>
   </body>
   </html>
    `;
};