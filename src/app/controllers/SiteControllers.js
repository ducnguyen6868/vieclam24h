
const User = require('../models/User')
const Post = require('../models/Post')
const { multipleMongoosetoObject } = require('../../util/mongoose')
const { MongoosetoObject } = require('../../util/mongoose')
class SiteControllers {
    async home(req, res, next) {
        let username = req.session.username;
        let userposition = req.session.userposition;
        let username_sign = req.session.username_sign;
        let avatarpath = "uploads/logo.png";
        console.log(username);
        if (username == null || userposition == null) {
            username = "Profile";
            userposition = "Position";
        }
        console.log(username_sign);
        try {
            const avatar = await User.findOne(
                { username_sign: username_sign },
            )
            avatarpath = avatar.avatar;
            console.log(avatarpath);
        } catch (err) {
            console.log(err)
        } finally {
            Post.find().then(posts => {
                posts = posts.reverse();
                res.render('home', { username, userposition, avatarpath, posts: multipleMongoosetoObject(posts) })
            })
                .catch(next)
        }
    }

    async option_management(req, res, next) {
        const username = req.session.username;
        const userposition = req.session.userposition;
        User.find().then(users => {
            res.render('management/user_management', { username, userposition, users: multipleMongoosetoObject(users) })
        }).catch(next)
    }
    async delete(req, res) {
        const userId = req.body.itemId
        User.findOneAndDelete({ _id: userId })
            .then(user => {
                res.redirect('/user_management')
            }).catch(err => {
                console.log(err)
            });
    }
    async insert_user(req, res, next) {
        res.render('users/insert_user')
    }
    async insert_new_user(req, res, next) {
        //Lấy các giá trị trong form người dùng gửi lên ( sử dụng body-parser)
        const userPosition = req.body.userposition;
        const userName = req.body.username;
        const userNameSign = req.body.username_sign;
        const userEmail = req.body.useremail;
        const userPassword = req.body.userpassword;
        const confirm_UserPassord = req.body.confirm_userpassword;
        //Thêm thông tin người dùng vào database
        insert_NewUser();
        async function insert_NewUser() {
            const user = await User.find({
                username_sign: userNameSign
            })

            if (user.length === 0) {
                const newUser = new User({
                    userposition: userPosition,
                    useremail: userEmail,
                    username: userName,
                    username_sign: userNameSign,
                    userpassword: userPassword,
                    confirmpassword: confirm_UserPassord
                })
                await newUser.save()
                console.log("Add new user successfully !!!")
                res.redirect('user_management')
            } else {
                res.send("Tên đăng nhập đã tồn tại !")
            }

        }
    }
    logout(req, res) {
        req.session.username = 'Profile';
        req.session.userposition = 'Position';
        req.session.username_sign = "$$$";
        res.redirect('/')

    }
    async searching(req, res, next) {
        const job = req.query.job;
        const location = req.query.location;
        const smallest = req.query.smallest_salary;
        const highest = req.query.highest_salary;
        console.log(job, location, smallest, highest);
        const posts = await Post.find({
            job: job,
            location: location
        })
        let username_sign;
        let username;
        let userposition;
        let avatarpath;
        try {
            username_sign = req.session.username_sign;
            const user = await User.findOne({
                username_sign: username_sign
            })
            username = user.username;
            userposition = user.userposition;
            avatarpath=user.avatar;
            console.log(avatarpath);
            if(avatarpath==undefined){
                avatarpath="logo.png";
            }
        }catch(err){
            username='Profile';
            userposition='Position';
            avatarpath='logo.png';
        }
        
        console.log(posts)
        console.log(posts.length)
        if (posts == 0) {
            res.redirect('/')
        } else {
            res.render('home', { username, userposition,avatarpath, posts: multipleMongoosetoObject(posts) })
        }
    }

}

module.exports = new SiteControllers();
