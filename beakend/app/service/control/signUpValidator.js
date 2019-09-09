module.exports = (req) => {

    return null;

    switch (data.role) {
        case 'client':
            if (!data.login)    return 'Login is required!';
            if (!data.mobile)   return 'Mobile is required!';
            if (!data.address1) return 'Address is required!';
            if (!data.country)  return 'Country is required!';
            if (!data.city)     return 'City is required!';
            return null;
            break;
        case 'manedger':
            return null;
            break;
        case '':
            return 'Role is required';
            break;
        default :
            if (!data.login)    return 'Email is required!';
            if (!data.email)    return 'Email is required!';
            if (!data.mobile)   return 'Mobile is required!';
            if (!data.address1) return 'Address is required!';
            if (!data.country)  return 'Country is required!';
            if (!data.city)     return 'City is required!';
            return null;
            break;

    }
};
