const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildVehicleDetail = function (item) {
  if (!item) return "";
    const title = `${item.inv_year} ${item.inv_make} ${item.inv_model}`;
    const alt   = title;
    const price = Number(item.inv_price).toLocaleString("en-US", { style: "currency", currency: "USD" });
    const miles = Number(item.inv_miles).toLocaleString("en-US");


  const html = `
  <article class="vehicle-detail">
    <figure class="vehicle-media">
      <img src="${item.inv_image}" alt="${item.inv_year} ${item.inv_make} ${item.inv_model}" loading="eager" width="600" height="400" />
   </figure>

    <section class="vehicle-meta">
      <h2 class="sr-only">${item.inv_year} ${item.inv_make} ${item.inv_model}</h2>

      <p class="price">${price}</p>

      <dl class="specs">
        <dt>Year</dt><dd>${item.inv_year}</dd>
        <dt>Make</dt><dd>${item.inv_make}</dd>
        <dt>Model</dt><dd>${item.inv_model}</dd>
        <dt>Mileage</dt><dd>${miles} miles</dd>
        <dt>Color</dt><dd>${item.inv_color}</dd>
      </dl>

      <p class="description">${item.inv_description}</p>
    </section>
  </article>`;
  return html;

};


