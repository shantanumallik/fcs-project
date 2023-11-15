import { listProperty } from '../models/PropertyModel';

export const handleListProperty = async (
    title, description, price, location, amenities, availabilityDate, propertyType, sellerId, image, setMessage
) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('location', location); // Existing attribute
    formData.append('amenities', JSON.stringify(amenities)); // JSON stringifying the object
    formData.append('availabilityDate', availabilityDate); // Existing attribute
    formData.append('type', propertyType); // New attribute for property type
    formData.append('sellerId', sellerId);
    if (image) formData.append('image', image, image.name);

    try {
        const message = await listProperty(formData);
        setMessage(message);
    } catch (error) {
        setMessage(error.message);
    }
};

export const handleFileChange = (event, setImage) => {
    const file = event.target.files[0];
    if (file) setImage(file);
};
