module.exports = () => {
    return {
        event: 'form-notification',
        fun: (data, next) => {

            next('on-notification', data)

        }
    }
};