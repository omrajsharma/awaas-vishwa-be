const getBuyerEnquiryEmailBody = (recieverName, itemId, senderName, senderEmail, senderPhone) => {
return `<div>
<p> Hi <strong>${recieverName}</strong>,</p>
<p> You have a lead for the property post -  ${process.env.FE_BASE_URL + '/item/' + itemId}</p>
<p> <b>Name: </b> ${senderName}</p>
<p> <b>Email: </b> ${senderEmail}</p>
<p> <b>Phone: </b> <a href="tel:${senderPhone}">${senderPhone}</a></p>
</div>
`
}

module.exports = {getBuyerEnquiryEmailBody}