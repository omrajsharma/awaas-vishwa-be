const jwt = require('jsonwebtoken');
const PropertyAd = require('../model/PropertyAd');
const UserModel  = require('../model/UserModel');

const getProfile = async (req, res) => {

    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({error: 'Invalid User'})
        return
    }
    
    try {
        jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
            if (err) {
                res.status(401).json({error: "token expired"})
                return
            }

            const userDoc = await UserModel.findById(userInfo.id)
            const adList = await PropertyAd.find({author: userDoc._id});

            let adListResponse = [];
            for (const adItem of adList) {
                adListResponse.push({
                    id: adItem._id,
                    title: adItem.title,
                    location: adItem.location,
                    listType: adItem.listType,
                    price: adItem.price,
                    img: adItem.imgList[0]
                })
            }
            
            res.status(200).json({
                data: {
                    profileDetail: {
                        name: userDoc.name,
                        email: userDoc.email,
                        phone: userDoc.phone
                    },
                    adList: adListResponse
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {getProfile}