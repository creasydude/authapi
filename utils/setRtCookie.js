const setRtCookie = (res, refreshToken) => {
    let options = {
        maxAge: 1000 * 60 * 60 * 24 * 30, // would expire after 1month
        httpOnly: true,
        secure: false,
        signed: true
    };
    res.cookie('rt', refreshToken, options);
}

export default setRtCookie;