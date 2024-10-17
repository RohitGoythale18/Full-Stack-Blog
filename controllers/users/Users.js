const bcrypt = require("bcryptjs");
const Users = require("../../models/users/Users");
const appErr = require("../../utils/AppErr");

const registerCtrl = async (req, res, next) => {
    const { fullName, email, password } = req.body;

    //Check all fields is not empty
    if (!fullName || !email || !password) {
        return next(appErr('All fields are required...!'));
    }

    try {
        //Check user is exists
        const userFound = await Users.findOne({ email });
        //Throw an error
        if (userFound) {
            return next(appErr('User already exists...!'));
        }
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //Register user
        const user = await Users.create({
            fullName,
            email,
            password: hashedPassword,
        });

        res.json({
            status: 'success',
            user: 'User registered...!',
        });
    } catch (error) {
        res.json(error.message);
    }
};

const loginCtrl = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(appErr('All fields are required...!'));
    }

    try {
        const userFound = await Users.findOne({ email });

        if (!userFound) {
            if (userFound) {
                return next(appErr('Invalid login credentials...!'));
            }
        }

        //Verify password
        const isPasswordValid = await bcrypt.compare(password, userFound.password);

        if (!isPasswordValid) {
            if (userFound) {
                return next(appErr('Invalid login credentials...!'));
            }
        }

        //Save the user into session
        req.session.userAuth = userFound._id;
        console.log(req.session);

        res.json({
            status: 'success',
            data: `Hello ${userFound.fullName}, welcome to your profile...!`,
        });
    } catch (error) {
        res.json(error.message);
    }
};

const fetchUserCtrl = async (req, res) => {
    //Get userID from params
    const userID = req.params.id;
    //Find the user
    const userFound = await Users.findById(userID);
    try {
        res.json({
            status: 'success',
            data: userFound,
        });
    } catch (error) {
        res.json(error.message);
    }
};

const updateUserCtrl = async (req, res, next) => {
    const { fullName, email } = req.body;

    try {
        //Check if email is not taken
        if (email) {
            const emailTaken = await Users.findOne({ email });
            if (emailTaken) {
                return next(appErr('Email is taken...!', 400));
            }
        }
        //Update user
        const updatedUser = await Users.findByIdAndUpdate(req.params.id, {
            fullName,
            email,
        }, {
            new: true,
        });
        res.json({
            status: 'success',
            data: updatedUser,
        });
    } catch (error) {
        return next(appErr(error.message));
    }
}

const profileCtrl = async (req, res) => {
    //Get the login user
    const userID = req.session.userAuth;
    //Find the user
    const userFound = await Users.findById(userID).populate('posts').populate('comments');
    try {
        res.json({
            status: 'success',
            data: userFound,
        });
    } catch (error) {
        res.json(error.message);
    }
};

const profilePhotoCtrl = async (req, res, next) => {
    //Find the user to be updated
    const user = req.session.userAuth;
    const userFound = await Users.findById(user);

    //Check if user is not found
    if (!userFound) {
        return next(appErr('User not found...!', 403));
    }

    //Update profile photo
    await Users.findByIdAndUpdate(user, {
        profileImage: req.file.path,
    }, {
        new: true,
    });

    try {
        res.json({
            status: 'success',
            data: 'Profile photo updated...!',
        });
    } catch (error) {
        next(appErr(err.message));
    }
};

const coverPhotoCtrl = async (req, res, next) => {
    const user = req.session.userAuth;
    const userFound = await Users.findById(user);

    if (!userFound) {
        return next(appErr('User not found...!', 403));
    }

    await Users.findByIdAndUpdate(user, {
        coverImage: req.file.path,
    }, {
        new: true,
    });

    try {
        res.json({
            status: 'success',
            data: 'Cover photo updated...!',
        });
    } catch (error) {
        next(appErr('User not found...!', 403));
    }
};

const updatePasswordCtrl = async (req, res, next) => {
    const { password } = req.body;
    //Check if user is updating password
    if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //Update password
        await Users.findByIdAndUpdate(req.params.id, {
            password: hashedPassword,
        }, {
            new: true,
        });
        try {
            res.json({
                status: 'success',
                data: 'Password updated...!',
            });
        } catch (error) {
            return next(appErr('Please enter password...!'));
        }
    }
};

const logoutCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            user: 'User logged out...!',
        });
    } catch (error) {
        res.json(error.message);
    }
};

module.exports = {
    registerCtrl,
    loginCtrl,
    fetchUserCtrl,
    updateUserCtrl,
    profileCtrl,
    profilePhotoCtrl,
    coverPhotoCtrl,
    updatePasswordCtrl,
    logoutCtrl,
};