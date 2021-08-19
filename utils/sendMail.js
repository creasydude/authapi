const sendMail = async (url, route, data, next) => {
    const URL = url + route + data
    //For Development
    console.log(URL);
    try {
        //SendMail LOGIC
    } catch (error) {
        next(error);
    }

}

export default sendMail;