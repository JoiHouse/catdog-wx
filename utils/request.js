const app = getApp();
const baseURL = app.globalData.apiHost;
/**
 * 请求
 * @param option url、method、data、timeout
 */
const Request = function request(option) {
    return new Promise(function (resolve, reject) {
        let header = {
            'content-type': 'application/json',
            "token": wx.getStorageSync('token')
        };
        wx.request({
            url: baseURL + option.url,
            method: option.method || 'GET',
            data: option.data === undefined ? '' : JSON.stringify(option.data),
            header: header,
            timeout: option.timeout || 5000,
            success(res) {
                if (res.data.code === 200) {
                    resolve(res.data);
                } else if (res.data.code === 401) {
                    wx.setStorageSync('token', '')
                    reject('登录失效');
                } else {
                    reject('未知错误');
                }
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

module.exports = Request