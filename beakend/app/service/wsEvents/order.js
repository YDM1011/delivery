module.exports = () => {
    return {
        event: 'order-confirm',
        fun: (data, next) => {

            next('on-order-confirm', data)

        }
    }
};
