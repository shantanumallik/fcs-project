import { loginUser } from '../models/UserModel';

export const handleLogin = async (username, password, setUser, setMessage, setRedirectTo) => {
    try {
        const userData = await loginUser(username, password);
        setUser(userData);
        setMessage('Login successful!');
        
        switch(userData.user.userType) {
            case 'seller_renter':
                setRedirectTo('/list-property');
                break;
            case 'admin':
                setRedirectTo('/admin-dashboard');
                break;
            default:
                setRedirectTo('/properties');
                break;
        }
    } catch (error) {
        setMessage('Login failed.');
    }
};
