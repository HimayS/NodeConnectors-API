import * as UserService from '../Services/user.service.js';


const register = async (req, res) => {
    let username, email, password, confirmpassword;
    try {
        ({ username, email, password, confirmpassword } = req.body);

        // Basic validation
        if (!username || !email || !password || !confirmpassword) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        // Email validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }
        // check if passwords are same
        if (password !== confirmpassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }
    } catch (error) {
        console.error('Invalid Registartion Request:', error);
        return res.status(400).json({ success: false, message: 'Invalid Registartion Request' });
    }

    try {
        const result = await UserService.registerUser(username, email, password);
        // registration failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // registration succeeded
        return res.status(201).json({ success: true, message: result.message });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const login = async (req, res) => {
    let username, email, password;
    try {
         ({ username, email, password } = req.body);

         // Basic validation
         if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        // Email validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }
    } catch (error) {
        console.error('Invalid Login Request:', error);
        return res.status(400).json({ success: false, message: 'Invalid Login Request' });
    }

    try {
        const result = await UserService.loginUser(username, email, password);
        // login failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // login successfull 
        return res.status(200).json({ success: true, message: result.message, token: result.token });
    } catch (error) {
        console.error('Error logging user:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export { register, login }