const jwt = require('jsonwebtoken');
const PropertyAd = require('../model/PropertyAd');

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

module.exports = { createItem, getItems };