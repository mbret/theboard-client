/**
 * Created by Maxime on 3/1/2015.
 */
module.exports.user = {
    default: {
        avatar: 'avatar.jpg',
        banner: 'user_banner.jpg',
        backgroundImages: [ 'board_wall_default.jpg', 'board_wall1_default.jpg', 'board_wall2_default.jpg' ],
        settings: {
            widgetsBorders: false,
            backgroundImagesInterval: 5000
        }
    },
    settings: {
        widgetsBorders: {
            type: 'boolean'
        },
        backgroundImagesInterval: {
            type: 'integer'
        }
    }
};