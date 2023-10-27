// models/Property.js
class Property {
    constructor(
        title, 
        description, 
        price, 
        sellerId, 
        imageUrl, 
        location,           // new attribute
        availabilityDate,   // new attribute
        amenities = {}      // new attribute
    ) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.sellerId = sellerId; // The user who listed the property
        this.imageUrl = imageUrl; // image URLs
        this.location = location; // Property location
        this.availabilityDate = availabilityDate; // Date from which the property is available
        this.amenities = amenities; // Amenities object {pool: boolean, gym: boolean, wifi: boolean}
    }
}

module.exports = Property;
