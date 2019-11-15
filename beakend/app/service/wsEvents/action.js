module.exports = () => {
    return {
        event: 'action-confirm',
        fun: (data, next) => {

            next('on-action-confirm', data)

        }
    }
};
