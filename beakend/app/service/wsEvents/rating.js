module.exports = () => {
    return {
        event: 'rating-confirm',
        fun: (data, next) => {

            next('on-rating-confirm', data)

        }
    }
};
