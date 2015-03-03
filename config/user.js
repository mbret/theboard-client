/**
 * Created by Maxime on 3/1/2015.
 */
module.exports.user = {
    default: {
        avatar: 'avatar.jpg',
        banner: 'user_banner.jpg',
        backgroundImages: [ 'bg-sample (1).jpg', 'bg-sample (2).jpg', 'bg-sample (3).jpg' ],
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