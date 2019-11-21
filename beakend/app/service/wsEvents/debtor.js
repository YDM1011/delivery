module.exports = () => {
    return {
        event: 'debtor-confirm',
        fun: (data, next) => {

            next('on-debtor-confirm', data)

        }
    }
};
