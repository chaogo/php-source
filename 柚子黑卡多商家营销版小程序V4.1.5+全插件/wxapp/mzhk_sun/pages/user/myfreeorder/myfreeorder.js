var app = getApp();

Page({
    data: {
        navTile: "我的订单",
        curIndex: 0,
        nav: [ "全部", "未中奖", "已中奖未使用", "已中奖已使用" ],
        status: [ 0, 2, 20, 22 ],
        orderlist: [],
        url: "",
        page: [ 1, 1, 1, 1 ]
    },
    onLoad: function(t) {
        var a = this;
        wx.setNavigationBarTitle({
            title: a.data.navTile
        });
        var e = app.getSiteUrl();
        e ? (a.setData({
            url: e
        }), app.editTabBar(e)) : app.util.request({
            url: "entry/wxapp/Url",
            cachetime: "30",
            success: function(t) {
                wx.setStorageSync("url", t.data), e = t.data, app.editTabBar(e), a.setData({
                    url: e
                });
            }
        }), wx.setNavigationBarColor({
            frontColor: wx.getStorageSync("System").fontcolor ? wx.getStorageSync("System").fontcolor : "",
            backgroundColor: wx.getStorageSync("System").color ? wx.getStorageSync("System").color : "",
            animation: {
                duration: 0,
                timingFunc: "easeIn"
            }
        });
        var o = t.tab ? t.tab : 0, r = a.data.status[o], n = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/getjkOrder",
            cachetime: "30",
            data: {
                orderstatus: r,
                openid: n,
                showtype: 6
            },
            success: function(t) {
                console.log("进入免单页面"), console.log(t.data), 2 == t.data ? a.setData({
                    orderlist: [],
                    curIndex: o
                }) : a.setData({
                    orderlist: t.data,
                    curIndex: o
                });
            }
        });
    },
    bargainTap: function(t) {
        var a = this, e = parseInt(t.currentTarget.dataset.index), o = a.data.status[e], r = wx.getStorageSync("openid"), n = [ 1, 1, 1, 1 ];
        app.util.request({
            url: "entry/wxapp/getjkOrder",
            cachetime: "10",
            data: {
                orderstatus: o,
                openid: r,
                showtype: 6
            },
            success: function(t) {
                2 == t.data ? a.setData({
                    orderlist: []
                }) : a.setData({
                    orderlist: t.data,
                    page: n
                });
            }
        }), this.setData({
            curIndex: e
        });
    },
    toPay: function(t) {
        var a = wx.getStorageSync("openid"), e = t.currentTarget.dataset.order_id;
        this.data.orderlist;
        app.util.request({
            url: "entry/wxapp/Orderarr",
            data: {
                openid: a,
                order_id: e
            },
            success: function(t) {
                wx.requestPayment({
                    timeStamp: t.data.timeStamp,
                    nonceStr: t.data.nonceStr,
                    package: t.data.package,
                    signType: t.data.signType,
                    paySign: t.data.paySign,
                    success: function(t) {
                        wx.showToast({
                            title: "支付成功",
                            icon: "success",
                            duration: 2e3
                        }), console.log(e + "-----2"), app.util.request({
                            url: "entry/wxapp/PayqgOrder",
                            cachetime: "0",
                            data: {
                                order_id: e
                            },
                            success: function(t) {
                                wx.navigateTo({
                                    url: "/mzhk_sun/pages/user/myorder/myorder"
                                });
                            }
                        });
                    },
                    fail: function(t) {
                        wx.showToast({
                            title: "支付失败",
                            icon: "none",
                            duration: 2e3
                        });
                    }
                });
            }
        });
    },
    toChange: function(t) {
        var a = this, e = t.currentTarget.dataset.order_id, o = t.currentTarget.dataset.f_index, r = a.data.orderlist;
        wx.showModal({
            title: "提示",
            content: "确认领取吗",
            showCancel: !0,
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/SetOrderStatus",
                    data: {
                        order_id: e,
                        status: 2,
                        ordertype: 3
                    },
                    success: function(t) {
                        console.log("进入订单页面"), console.log(t.data), 2 == t.data ? wx.showToast({
                            title: "确认领取失败！",
                            icon: "none",
                            duration: 2e3
                        }) : (wx.showToast({
                            title: "确认领取成功！",
                            icon: "success",
                            duration: 500
                        }), r[o].status = 2, console.log(r), a.setData({
                            orderlist: r
                        }));
                    }
                });
            },
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    toOrderder: function(t) {
        var a = t.currentTarget.dataset.order_id;
        wx.navigateTo({
            url: "../orderdet/orderdet?order_id=" + a + "&ordertype=6"
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var e = this, o = e.data.curIndex, t = (e.data.status[o], wx.getStorageSync("openid")), r = e.data.orderlist, n = e.data.page, s = n[o];
        console.log(e.data), app.util.request({
            url: "entry/wxapp/getjkOrder",
            data: {
                openid: t,
                showtype: 6,
                page: s
            },
            success: function(t) {
                if (2 == t.data) wx.showToast({
                    title: "已经没有内容了哦！！！",
                    icon: "none"
                }); else {
                    var a = t.data;
                    r = r.concat(a), console.log(r), n[o] = s + 1, e.setData({
                        orderlist: r,
                        page: n
                    });
                }
            }
        });
    }
});