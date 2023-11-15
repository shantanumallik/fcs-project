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
        contractUrl,
        type = 'rent', // 'rent' or 'sale'
        owner = '',    // New field for owner
        tenant = ''    // New field for tenant
    ) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.sellerId = sellerId;
        this.imageUrl = imageUrl;
        this.location = location;
        this.availabilityDate = availabilityDate;
        this.amenities = amenities;
        this.contractUrl = contractUrl;
        this.status = 'available'; // 'available', 'rented', 'sold'
        this.type = type;
        this.owner = owner;    // Assign owner
        this.tenant = tenant;  // Assign tenant
    }
}

module.exports = Property;
