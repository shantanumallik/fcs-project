// models/Property.js
class Property {
    constructor(title, description, price, sellerId, images = []) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.sellerId = sellerId; // The user who listed the property
        this.images = images;     // An array of image URLs
    }
}
module.exports = Property;
