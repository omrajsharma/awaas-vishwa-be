const jwt = require('jsonwebtoken');
const PropertyAd = require('../model/PropertyAd');
const UserModel  = require('../model/UserModel');
const EnquiryMailModel = require('../model/EnquiryMailModel');
const sendEmail = require('../utility/email/email')
const {getBuyerEnquiryEmailBody} = require('../utility/email/emailTemplates')

const createItem = async (req, res) => {

    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({error: 'Invalid User'})
        return
    }

    const {title, location, price, description, imgList, listType} = req.body;

    if (title.length < 5 || title.length > 100) {
        res.status(400).json({error: 'title length should be greater than equals to 5 and less equals to 100 characters'})
        return
    }
    if (location.length < 3 || location.length > 100) {
        res.status(400).json({error: 'location length should be greater than equals to 3 and less equals to 100 characters'})
        return
    }
    if (price < 0 || price > 1000000000) {
        res.status(400).json({error: 'price should be greater than 0 and less than 100,00,00,000'})
        return
    }
    if (description.length > 1000) {
        res.status(400).json({error: 'description length should be less than 1000 characters'})
        return
    }
    if (imgList.length > 10) {
        res.status(400).json({error: 'maximum 10 images allowed to be uploaded'})
        return
    }
    if (!listType) {
        res.status(400).json({error: 'please select the list type'})
        return
    }

    try {
        const tokenInfo = jwt.verify(token, process.env.JWT_SECRET);
        const propertyAdDoc = await PropertyAd.create({
            title, 
            location, 
            price, 
            description, 
            imgList, 
            listType,
            author: tokenInfo.id
        })
        res.status(201).json({
            success: "Ad Created",
            data: propertyAdDoc
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const getItems = async (req, res) => {
    const pageNo = req.query.page;
    const pageSize = 10;
    const skips = (pageNo -1) * pageSize;
    const propertyAdList = await PropertyAd.find().skip(skips).limit(pageSize);
    let propertyAdListResponse = []

    for (const propertyAdItem of propertyAdList ) {
        propertyAdListResponse.push({
            title: propertyAdItem.title,
            location: propertyAdItem.location,
            price: propertyAdItem.price,
            listType: propertyAdItem.listType,
            imgList: propertyAdItem.imgList,
            createdAt: propertyAdItem.createdAt,
            id: propertyAdItem._id,
        })
    }

    res.status(200).json({
        data: propertyAdListResponse
    })
}

const getItemDetails = async (req, res) => {
    const {itemId} = req.params;
    if (itemId == null || itemId == undefined || itemId.length == 0) {
        res.status(400).json({error: 'invalid item id'})
        return
    }
    try {
        const propertyAdDoc = await PropertyAd.findById(itemId)
                                    .populate('author', ['name']);
        res.status(200).json({
            data: propertyAdDoc
        });
    } catch (err) {
        res.status(400).json({error: 'something went wrong'})
        return
    }
}

const postLead = async (req, res) => {
    const token = req.cookies.token;
    const {itemId} = req.body;

    if (!token) {
        res.status(401).json({error: 'Invalid User'})
        return
    }
    if (!itemId) {
        res.status(400).json({error: 'Invalid ItemId'})
        return
    }

    try {
        const tokenInfo = jwt.verify(token, process.env.JWT_SECRET);
        const senderUserDoc = await UserModel.findById(tokenInfo.id);
        
        const propertyAdDoc = await PropertyAd.findById(itemId);
        const receiverDocId = propertyAdDoc.author.toString();
        const receiverUserDoc = await UserModel.findById(receiverDocId);

        const enquiryMailDoc = await EnquiryMailModel.findOne({
            propertyAdId: itemId,
            sendersId: senderUserDoc._id,
            receiverId: receiverUserDoc._id
        })

        if (enquiryMailDoc) {
            res.status(400).json({error: 'Already sent interest'})
            return
        }

        sendEmail(
            receiverUserDoc.email,
            `An interested Lead for your property - Awaas Vishwa`,
            getBuyerEnquiryEmailBody(receiverUserDoc.name, itemId, senderUserDoc.name, senderUserDoc.email, senderUserDoc.phone)
        )

        const enquiryMailDocNew = await EnquiryMailModel.create({
            propertyAdId: itemId,
            sendersId: senderUserDoc._id,
            receiverId: receiverUserDoc._id
        })

        res.status(201).json({success: "Interest shared with the owner"})
    } catch (err) {
        res.status(500).json({error: 'Something went wrong'})
    }
}

module.exports = { createItem, getItems, getItemDetails, postLead };