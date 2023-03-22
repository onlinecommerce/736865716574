const User = require("./../models/user-m");
const catchAsync = require("./../utils/catchAsync");

const bcrypt = require("bcryptjs");

exports.searchUser = catchAsync(async (req, res, next) => {
    let user = await User.find({
        userName: {
            $regex: req.query.userName,
            $options: 'i'
        }
    }).select("-id");
    res.status(200).json({
        status: 'success',
        user
    })
});


exports.delUser = catchAsync(async (req, res, next) => {
    let user_id = req.query.user_id;

    let user = await User.deleteOne({
        _id: user_id
    });

    res.status(200).json({
        status: 'success',
        data: user
    })
})


exports.changeRole = catchAsync(async (req, res, next) => {
    let user_id = req.query.user_id;
    let role = req.query.role;
    let user = await User.updateOne({
        _id: user_id
    }, {
        $set: {
            role
        }
    });
    res.status(200).json({
        status: 'success',
        data: user
    })
})

exports.updateUser = catchAsync(async (req, res, next) => {
    let {
        password
    } = req.query;

    let usr = await User.findById({
        _id: req.query.id
    }).select("+password");

    const correct = usr ?
        await usr.correctPassword(password, usr.password) :
        false;

    if (!correct) {
        return res.status(404).json({
            status: 'noAccount',
            message: 'Incorrect Password'
        })
    }

    let userName = req.body.userName ? req.body.userName.toLowerCase() : req.body.userName;

    let data = {
        name: req.body.name,
        userName: userName,
        phoneNumber: req.body.phoneNumber,
        password,
        role: usr.role,
        address: req.body.address,
    }

    let user = await User.updateOne({
        _id: req.query.id
    }, data);

    res.status(200).json({
        status: 'success',
        data: user
    })
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    let {
        oldPassword,
        newPassword,
        newPasswordConfirm
    } = req.body;

    let usr = await User.findById({
        _id: req.query.id
    }).select("+password");

    const correct = usr ?
        await usr.correctPassword(oldPassword, usr.password) :
        false;

    if (!correct) {
        return res.status(404).json({
            status: 'noAccount',
            message: 'Incorrect Password'
        })
    }

    if (newPassword !== newPasswordConfirm) {
        return res.status(404).json({
            status: 'noAccount',
            message: 'Passwords didn\'t match'
        })
    }

    newPassword = await bcrypt.hash(newPassword, 12);

    usr = await User.updateOne({
        _id: usr.id
    }, {
        $set: {
            password: newPassword
        }
    })

    res.status(200).json({
        status: 'success',
        data: usr
    })
});

exports.checkUsername = catchAsync(async (req, res, next) => {
    let user = await User.findOne({
        userName: req.query.userName
    });

    res.status(200).json({
        status: 'success',
        data: user
    })
})