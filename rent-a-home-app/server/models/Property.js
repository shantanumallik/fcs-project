class Property {
    constructor(
        title, 
        description, 
        price, 
        sellerId, 
        imageUrl, 
        location,
        availabilityDate,
        amenities = {},
        type = 'rent' // 'rent' or 'sale'
    ) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.sellerId = sellerId;
        this.imageUrl = imageUrl;
        this.location = location;
        this.availabilityDate = availabilityDate;
        this.amenities = amenities;
        this.status = 'available'; // 'available', 'rented', 'sold'
        this.type = type;
    }
}

module.exports = Property;
