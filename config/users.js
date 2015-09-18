/**
 * Created by Maxime on 3/1/2015.
 */
module.exports.users = {

    defaultAttributes: {
        avatar: 'sample-user-avatar.jpg',
        banner: 'sample-user-banner.jpg',
    },

    // These default settings will be automatically applied for every new profile created
    // The logic is handle back end while web app just ask for user settings and doesn't care about null / default settings
    defaultSettings: {
        widgetsBorders: {
            type: 'boolean',
            value: false
        },
        backgroundImagesInterval: {
            type: 'integer',
            value: 5000
        },
        backgroundImages: {
            type: 'array',
            value: ['bg-sample (1).jpg', 'bg-sample (2).jpg', 'bg-sample (3).jpg']
        }
    }
};