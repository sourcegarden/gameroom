/**
 * Created by jackiezhang on 15/7/14.
 */

exports.form = function(req, res, next) {
    var room = req.params.room;
    res.render('client');
}