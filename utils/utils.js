// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: content,
        showCancel: false
    })
}

// 动态设置导航栏标题文字内容
var setTitle = title => wx.setNavigationBarTitle({
    title: title
})

module.exports = {
    showBusy,
    showSuccess,
    showModel,
    setTitle
}
