! function(exports, global) {
    function getProductById(e) {
        for (var i in prices)
            if (prices[i].product == e) return prices[i]
    }

    function newOdChildFrame(e, i, t, o) {
        o ? odChildFrame = {
            newWindow: window.open(e)
        } : (odChildFrame = document.createElement("iframe"), odChildFrame.src = e, odChildFrame.width = odChildFrame.height = "100%", odChildFrame.frameBorder = "0", odChildFrame.style.position = "absolute", odChildFrame.style.top = odChildFrame.style.left = "0px", odChildFrame.style["background-color"] = "white", odChildFrame.style["z-index"] = 100, document.body.appendChild(odChildFrame)), odChildFrameSuccess = i, odChildFrameFail = t
    }

    function inOfficialGroup(e) {
        FAPI.Client.call({
            method: "group.getUserGroupsByIds",
            group_id: groupId,
            uids: viewerId
        }, function(i, t, o) {
            reloadIfExpired(o);
            var s = !1;
            t.length > 0 && "PASSIVE" != t[0].status && "UNKNOWN" != t[0].status && (s = !0), e(s)
        })
    }

    function listFriendsNotInAppIds() {
        if (!friendsNotInAppIds) {
            friendsNotInAppIds = [];
            for (var e = 0; e < allFriendsIds.length; e++) users[allFriendsIds[e]] && !users[allFriendsIds[e]].inapp && friendsNotInAppIds.push(allFriendsIds[e] + "")
        }
        return friendsNotInAppIds
    }

    function askRequest(e, i, t, o, s, n) {
        if (window.mobile) {
            if ("string" == typeof t && (t = [t]), !t.length) return;
            var a = !1,
                r = function(i) {
                    if (!i.length) return n && n(), void 0;
                    var t = i.pop();
                    FAPI.Client.call({
                        method: "notifications.sendFromUser",
                        to_uid: t,
                        text: e
                    }, function(e, t, o) {
                        "ok" === e ? (a = !0, 0 === i.length ? s && s() : r(i)) : (reloadIfExpired(o), o && console.log(o), a ? s && s() : n && n())
                    })
                };
            new OdkConfirmRequestWindow({
                userIds: t,
                message: e,
                selectedByDefault: !0,
                onConfirm: r,
                onCancel: n,
                urgent: !0
            })
        } else {
            if (window.odRequestSuccess = s, window.odRequestCancel = n, void 0 === o) o = "";
            else {
                var l = [];
                for (var d in o) l.push(d + "_" + o[d]);
                o = "___" + l.join("__") + "___"
            }
            if (socialNetwork.trigger("openSocialWindow"), void 0 === t) return FAPI.UI.showNotification(e, o), void 0;
            if ("object" == typeof t) {
                if (0 == t.length) return;
                t = t.slice(0, Math.min(20, t.length)).join(";")
            }
            FAPI.UI.showNotification(e, o, t)
        }
    }

    function odHasPermission(e, i) {
        FAPI.Client.call({
            method: "users.hasAppPermission",
            ext_perm: e
        }, function(e, t, o) {
            reloadIfExpired(o), i(t)
        })
    }

    function checkAlbum(e, i) {
        FAPI.Client.call({
            method: "photos.getAlbumInfo",
            aid: e
        }, function(e, t, o) {
            reloadIfExpired(o), i(null === t ? !1 : !0)
        })
    }

    function mediaTopicPost(e, i, t, o) {
        Log.error("Method is deprecated"), o && o()
    }

    function checkPromo2() {
        return !1
    }

    function promo2(e) {
        promo1(e)
    }

    function checkPromo1(e) {
        e(!1)
    }

    function promo1(e) {
        var i = messages.bonusPublicationMessage;
        doPublication(RANDOM(i), messages.bonusPublicationImage, messages.bonusPublicationCaption[0], null, e)
    }

    function setStatus(e, i) {
        Log.error("Method is deprecated"), i && i()
    }

    function getStatus(e) {
        FAPI.Client.call({
            method: "users.getInfo",
            uids: viewerId,
            fields: "current_status"
        }, function(i, t, o) {
            reloadIfExpired(o), void 0 !== t && null !== t && 1 == t.length && t[0].current_status || e(""), e(t[0].current_status)
        })
    }

    function odBuyGift(e, i) {
        socialNetwork.trigger("openSocialWindow"), lastPromoProduct = {
            userId: i,
            giftId: e
        }, FAPI.UI.showPromoPayment(i, e)
    }

    function odUploadPhoto(e, i, t) {
        odHasPermission("PHOTO CONTENT", function(o) {
            if (!o) return socialNetwork.trigger("openSocialWindow"), FAPI.UI.showPermissions("['PHOTO CONTENT']"), window.lastNoPermissionProcess = function() {
                odUploadPhoto(e, i, t)
            }, void 0;
            var s = {
                method: "photosV2.getUploadUrl"
            };
            void 0 !== t && (s.aid = t), FAPI.Client.call(s, function(t, o, s) {
                reloadIfExpired(s), null !== o && callService("../../../common/odnoklassniki/uploadimage.php", function() {}, function() {}, {
                    uploadUrl: o.upload_url,
                    imageUrl: e,
                    text: i
                })
            })
        })
    }

    function createPhotoAlbum(e, i, t) {
        odHasPermission("PHOTO CONTENT", function(o) {
            return o ? (void 0 === t && (t = "public"), FAPI.Client.call({
                method: "photos.createAlbum",
                title: e,
                type: t
            }, function(e, t, o) {
                reloadIfExpired(o), i(t)
            }), void 0) : (socialNetwork.trigger("openSocialWindow"), FAPI.UI.showPermissions("['PHOTO CONTENT']"), window.lastNoPermissionProcess = function() {
                createPhotoAlbum(e, i, t)
            }, void 0)
        })
    }

    function showBuy(e) {
        if (!odShowBuyNow)
            if (odShowBuyNow = !0, setTimeout(function() {
                    odShowBuyNow = !1
                }, 500), window.mobile === !0) {
                params = {}, params.application_key = window.applicationKey, params.session_key = window.sessionKey, params.name = e.desc.product, params.price = e.price, params.code = "mobile_" + e.product;
                var i = new Array;
                for (var t in params) i.push(t);
                i.sort(function(e, i) {
                    return e == i ? 0 : i > e ? -1 : 1
                });
                for (var o = "", t = 0; t < i.length; t++) o += i[t] + "=" + params[i[t]];
                o += window.sessionSecretKey, params.sig = hexMD5(o);
                var s = new Array;
                for (var t in params) s.push(encodeURIComponent(t) + "=" + encodeURIComponent(params[t]));
                var n = "http://m.odnoklassniki.ru/api/show_payment?" + s.join("&");
                newOdChildFrame(n, function() {
                    callService("../../../levelbase/src/services/getcoins.php", function(e) {
                        user.set({
                            coins: new ObscureNumber(e)
                        }, {
                            notSave: !0
                        })
                    }, fail)
                }, function() {}, !0)
            } else socialNetwork.trigger("openSocialWindow"), lastProduct = e, FAPI.UI.showPayment(e.desc.product, e.desc.product, e.product, e.price, null, "[]", "ok", "true")
    }

    function sendNotification(e, i) {
        "object" != typeof e && (e = [e]), i.length > 100 && (i = i.substr(0, 97) + "...");
        for (var t = 0; t < e.length; t++) {
            var o = e[t];
            ("505543558913" == o || "119119200269" == o || "113858779965" == o) && (Log.error("sending to " + e[t]), Log.error(i)), FAPI.Client.call({
                method: "notifications.sendSimple",
                uid: e[t],
                text: i
            }, function(e, t, s) {
                reloadIfExpired(s), ("505543558913" == o || "119119200269" == o || "113858779965" == o) && (Log.error(i), Log.error(e), Log.error(t), Log.error(s))
            })
        }
    }

    function doPublication(e, i, t, o, s, n, a) {
        var r = messages.odnoklassniki_public_link,
            l = {
                media: [{
                    type: "text",
                    text: e
                }, {
                    type: "app",
                    text: " ",
                    images: [{
                        url: publicationBaseUrl + i,
                        title: RANDOM(r),
                        mark: "media"
                    }]
                }]
            };
        o && l.media.push({
            type: "link",
            url: o
        }), window.mobile ? newOdChildFrame("mediatopicpost.php?attachment=" + encodeURIComponent(JSON.stringify(l)), s) : (socialNetwork.trigger("openSocialWindow"), window.odPostMediatopicSuccess = s, window.odPostMediatopicCancel = a, FAPI.UI.postMediatopic(l, !0))
    }

    function generateFieldsString(e) {
        var i = "uid";
        return "first_name" in e && (i += ",first_name"), "last_name" in e && (i += ",last_name"), "gender" in e && (i += ",gender"), "photo" in e && (i += ",pic_1"), "bigPhoto" in e && (i += ",pic_3"), "profile" in e && (i += ",url_profile"), "bthdate" in e && (i += ",birthday"), "online" in e && (i += ",online"), "last_online" in e && (i += ",last_online"), "country" in e && (i += ",location"), i
    }

    function addLoadedUser(e, i) {
        var t = e.uid + "";
        if (void 0 === users[t] && (users[t] = {}), "first_name" in i) {
            var o = e.first_name;
            if (null === o) return users[t] = void 0, void 0;
            o = o.replace("<", ""), o = o.replace(">", ""), users[t].first_name = o
        }
        if ("last_name" in i) {
            var o = e.last_name;
            o = o.replace("<", ""), o = o.replace(">", ""), users[t].last_name = o
        }
        if ("gender" in i && (users[t].ok_gender = e.gender, users[t].gender = "female" == e.gender ? 1 : 0), "photo" in i && (users[t].photo = e.pic_1, users[t].existphoto = e.pic_1.indexOf("stub") >= 0 || !e.pic_1 ? !1 : !0), "bigPhoto" in i && (users[t].bigPhoto = e.pic_3 || e.pic_1.replace("photoType=4", "photoType=5")), "profile" in i && (users[t].profile = e.url_profile), "bthdate" in i && (users[t].bthdate = !1, "birthday" in e)) {
            var s = e.birthday.split("-");
            3 == s.length && (users[t].bthdate = s[0] + "-" + ((s[1] + "").length < 2 ? "0" + s[1] : s[1]) + "-" + ((s[2] + "").length < 2 ? "0" + s[2] : s[2]))
        }
        "last_online" in i && (users[t].last_online = e.last_online.substr(0, e.last_online.indexOf(" "))), "online" in i && (users[t].online = 0, e.online && (users[t].online = 1)), "country" in i && (users[t].country = 0, e.location && (users[t].ok_location = _.clone(e.location), "RU" == e.location.countryCode && (users[t].country = 1)))
    }

    function loadUsers(e, i, t, o) {
        void 0 === o && (o = 0), o < e.length ? FAPI.Client.call({
            method: "users.getInfo",
            uids: e.slice(o, Math.min(o + 100, e.length)).join(","),
            fields: generateFieldsString(i)
        }, function(s, n, a) {
            reloadIfExpired(a), (void 0 === n || null === n) && (n = []), "undefined" == typeof n.push && (n = []);
            for (var r = 0; r < n.length; r++) addLoadedUser(n[r], i);
            loadUsers(e, i, t, o + 100)
        }) : t()
    }

    function reloadIfExpired(e) {
        return e && console.log(e, e.msg), e && 102 == e.error_code ? (location.href = gameUrl, void 0) : void 0
    }

    function loadMeAndAllFriends(e, i) {
        try {
            FAPI.Client.call({
                method: "friends.get"
            }, function(t, o, s) {
                if (reloadIfExpired(s), allFriendsIds = [], (void 0 === o || null === o) && (o = []), "undefined" != typeof o.push)
                    for (var n = 0; n < o.length; n++) allFriendsIds.push(o[n] + "");
                else o = [];
                o.push(viewerId), "inapp" in e ? FAPI.Client.call({
                    method: "friends.getAppUsers"
                }, function(t, s, n) {
                    reloadIfExpired(n), (void 0 === s || null === s) && (s = {}), (void 0 === s.uids || null === s.uids) && (s.uids = []), "undefined" == typeof s.uids.push && (s.uids = []), friendsInAppIds = [];
                    for (var a = 0; a < s.uids.length; a++) friendsInAppIds.push(s.uids[a] + "");
                    loadUsers(o, e, function() {
                        for (var e = 0; e < allFriendsIds.length; e++) void 0 !== users[allFriendsIds[e]] && (users[allFriendsIds[e]].inapp = 0);
                        for (var e = 0; e < friendsInAppIds.length; e++) void 0 !== users[friendsInAppIds[e]] && (users[friendsInAppIds[e]].inapp = 1);
                        void 0 === users[viewerId] && (users[viewerId] = {}), users[viewerId].inapp = 1, deleteUnloadedUsersFromFriendsInAppIds(), deleteUnloadedUsersFromAllFriendsIds(), i()
                    })
                }) : loadUsers(o, e, function() {
                    deleteUnloadedUsersFromAllFriendsIds(), i()
                })
            })
        } catch (t) {
            console.log("Error in load friends from OD"), console.log(t), users = {}, allFriendsIds = [], friendsInAppIds = [], friendsNotInAppIds = [], loadUsers([viewerId], e, i)
        }
    }

    function loadMeAndAllFriendsInApp(e, i) {
        FAPI.Client.call({
            method: "friends.getAppUsers"
        }, function(t, o, s) {
            reloadIfExpired(s), (void 0 === o || null === o) && (o = {}), (void 0 === o.uids || null === o.uids) && (o.uids = []), "undefined" == typeof o.uids.push && (o.uids = []), friendsInAppIds = new Array;
            for (var n = 0; n < o.uids.length; n++) friendsInAppIds.push(o.uids[n] + "");
            o.uids.push(viewerId), loadUsers(o.uids, e, function() {
                deleteUnloadedUsersFromFriendsInAppIds(), i()
            })
        })
    }

    function callPushApi(e, i) {
        if (Config.pushNotificationsSender) {
            var t = [];
            for (var o in i) t.push(encodeURIComponent(o) + "=" + encodeURIComponent(i[o]));
            var s = document.createElement("script");
            s.src = Config.pushNotificationsSender + e + "?" + t.join("&"), s.async = !0, document.head.appendChild(s)
        } else console.log("Config.pushNotificationsSender not set!")
    }

    function changePushGCMId(e) {
        e || (e = user.pick("userId", "GCMid", "deviceType")), callPushApi("changegcmid.php", {
            userId: e.userId,
            GCMId: e.GCMId,
            deviceType: e.deviceType,
            locale: locale,
            project: project
        })
    }

    function deletePushGCMId(e) {
        e || (e = user.pick("userId", "GCMid", "deviceType")), callPushApi("deletegcmid.php", {
            userId: e.userId,
            project: project,
            deviceType: e.deviceType
        })
    }

    function addPushTask(e, i, t) {
        t || (t = user.pick("userId", "GCMid", "deviceType")), callPushApi("addpushtask.php", {
            userId: t.userId,
            messageType: e,
            GCMId: t.GCMId,
            deviceType: t.deviceType,
            locale: locale,
            sendTime: i,
            project: project
        })
    }

    function deletePushTask(e, i) {
        i || (i = user.pick("userId", "GCMid", "deviceType")), callPushApi("deletepushtask.php", {
            userId: i.userId,
            messageType: e,
            deviceType: i.deviceType,
            project: project
        })
    }

    function recentlyBirthday(e) {
        if (void 0 === e) return !1;
        var i = e.bthdate;
        if (!i) return !1;
        if (i = i.split("-"), 3 != i.length) return !1;
        for (var t = -1; 1 >= t; t++) {
            var o = new Date((new Date).getFullYear() + t + "-" + i[1] + "-" + i[2]).getTime() - (new Date).getTime();
            if (o > -1728e5 && 0 >= o) return !0
        }
        return !1
    }

    function deleteUnloadedUsersFromFriendsInAppIds() {
        for (var e = [], i = 0; i < friendsInAppIds.length; i++) void 0 !== users[friendsInAppIds[i]] && e.push(friendsInAppIds[i]);
        friendsInAppIds = e
    }

    function deleteUnloadedUsersFromAllFriendsIds() {
        for (var e = [], i = 0; i < allFriendsIds.length; i++) void 0 !== users[allFriendsIds[i]] && e.push(allFriendsIds[i]);
        allFriendsIds = e
    }

    function checkLocalStorage() {
        if (void 0 !== localStorageEnabled) return localStorageEnabled;
        try {
            return localStorage.setItem("test", "est"), localStorage.removeItem("test"), localStorageEnabled = !0
        } catch (e) {
            return localStorageEnabled = !1
        }
    }

    function setLocalStorage(e, i, t) {
        if (checkLocalStorage()) try {
            var o = {},
                s = project;
            if (t || (s += "_" + viewerId), void 0 !== localStorage[s] && (o = JSON.parse(localStorage[s])), null === o) return;
            o[e] = i, localStorage[s] = JSON.stringify(o)
        } catch (n) {
            console.log(n)
        }
    }

    function getLocalStorage(e, i, t) {
        if (checkLocalStorage()) {
            var o = project;
            if (t || (o += "_" + viewerId), void 0 !== localStorage[o]) {
                var s = JSON.parse(localStorage[o]);
                if (null !== s && void 0 !== s[e]) return s[e]
            }
        }
        return i
    }

    function setCookie(e, i, t) {
        if ("undefined" != typeof deviceType && 1 == deviceType) return localStorage["ie11_cookie_" + e] = i, void 0;
        var o = [];
        o.push(e + "=" + escape(i)), o.push("path=" + window.location.pathname), void 0 === t && (t = new Date((new Date).getTime() + 5184e6).toUTCString()), o.push("expires=" + t), o = o.join("; "), document.cookie = o
    }

    function getCookie(e) {
        if ("undefined" != typeof deviceType && 1 == deviceType) return localStorage["ie11_cookie_" + e];
        var i = document.cookie;
        i = i.split("; ");
        for (var t = 0; t < i.length; t++) {
            var o = i[t].split("=");
            if (o[0] == e) return parseInt(o[1])
        }
        return void 0
    }

    function calcAmountDaysAfterDate(e) {
        var i = (new Date).getTime() - new Date(e).getTime();
        return 0 > i && (i = 0), Math.floor(i / 864e5)
    }

    function calcAge(e) {
        if (!e) return 0;
        var i = e.split("-");
        if (3 != i.length) return 0;
        var t = new Date,
            o = t.getFullYear() - i[0] - 1,
            s = t.getMonth() + 1 + "",
            n = t.getDate() + "";
        return s.length < 2 && (s = "0" + s), n.length < 2 && (n = "0" + n), (i[1] < s || i[1] == s && i[2] <= n) && o++, o
    }

    function formatTime(e, i) {
        var t = i % 60;
        10 > t && (t = "0" + t), i = Math.floor(i / 60);
        var o = i % 60;
        10 > o && (o = "0" + o), i = Math.floor(i / 60);
        var s = i;
        10 > s && (s = "0" + s);
        var n = i % 24,
            a = n;
        10 > a && (a = "0" + a);
        var r = Math.floor(i / 24),
            l = r;
        return 10 > l && (l = "0" + l), e = e.replace(/%s/g, t), e = e.replace(/%i/g, o), e = e.replace(/%F/g, s), e = e.replace(/%H/g, a), e = e.replace(/%G/g, n), e = e.replace(/%d/g, l), e = e.replace(/%j/g, r)
    }

    function loopMusic(e) {
        if (sounds[e].loaded) sounds[e].play(!0);
        else {
            for (var i in sounds) sounds[i].loaded || (sounds[i].onload = !1);
            sounds[e].onload = function() {
                sounds[e].play(!0)
            }
        }
    }

    function removeSelection() {
        try {
            if (document.activeElement && ("TEXTAREA" == document.activeElement.tagName || "INPUT" == document.activeElement.tagName)) return
        } catch (e) {}
        return "IE" === application.system.browser ? (document.selection && document.selection.empty(), void 0) : (window.getSelection ? window.getSelection().removeAllRanges() : document.selection && document.selection.clear && document.selection.clear(), void 0)
    }

    function needWord(e, i) {
        return e % 100 >= 11 && 14 >= e % 100 ? i[0] : e % 10 == 1 ? i[1] : e % 10 >= 2 && 4 >= e % 10 ? i[2] : i[0]
    }

    function plural(e, i) {
        var t;
        switch (locale) {
            case "ru":
                t = i % 10 == 1 && i % 100 != 11 ? 0 : i % 10 >= 2 && 4 >= i % 10 && (10 > i % 100 || i % 100 >= 20) ? 1 : 2;
                break;
            case "br":
            case "en":
                t = Number(1 != i);
                break;
            case "jp":
                t = 0;
                break;
            case "lv":
                t = i % 10 == 1 && i % 100 != 11 ? 0 : 0 != i ? 1 : 2;
                break;
            case "pl":
                t = 1 == i ? 0 : i % 10 >= 2 && 4 >= i % 10 && (10 > i % 100 || i % 100 >= 20) ? 1 : 2
        }
        if (void 0 === t) console.log("Unknown locale");
        else {
            if (void 0 !== e[t]) return e[t];
            console.log("Missing required word form for n = " + i + " (" + JSON.stringify(e) + ")")
        }
        return ""
    }

    function calcSig(e) {
        var i = [];
        for (key in e)("string" == typeof e[key] || "number" == typeof e[key] && e[key] % 1 === 0) && i.push(key);
        i.sort();
        for (var t = "", o = 0; o < i.length; o++) t += (e[i[o]] + "").trim();
        var s = network;
        return "phonegap" == s && (s = window.phonegapNetwork), {
            keys: i,
            sig: hexMD5(s + t + (sessionId + 1 << 5))
        }
    }

    function callService(e, i, t, o, s, n, a) {
        void 0 === o && (o = {}), void 0 === s && (s = 2), void 0 === n && (n = 1e4);
        var r = {};
        for (var l in o) r[l] = o[l];
        var d = calcSig(r);
        return r.mysig = d.sig, r.mysigparams = d.keys.join("|") || "none", r.script = e, "phonegap" == network ? (r.network = window.phonegapNetwork, r.notUseSession = 1) : r.network = network, r.sessionid = sessionId, r.doublePointsBeforeLetter = 1, window.mobile && (r.isMobile = 1), "facebook" === network && void 0 !== window.signedRequest && (r.signed_request = window.signedRequest), "spmobage" === network && (r.code_token = clientData.code), $.ajax({
            url: window.callServiceUrl,
            dataType: "json",
            type: "POST",
            success: function(e) {
                return void 0 !== e.error ? (e.text && window.Log.error(e.text), void 0 !== t && t(e.error), void 0) : (e = recursiveReplaceDoublePointsBeforeLetter(e), void 0 !== i && i(e), void 0)
            },
            timeout: n,
            data: r,
            error: function() {
                s > 1 ? callService(e, i, t, o, s - 1, n, a) : void 0 !== a ? a() : void 0 !== t && t()
            }
        }), {
            url: window.callServiceUrl,
            sendParams: r
        }
    }

    function callServiceAddInQueue(e, i) {
        var t = callService(e, function() {}, fail, i, 1, 5e3, function() {
            application.serviceQueue.add(t)
        })
    }

    function callServiceOrLocalStorage(e, i, t, o, s) {
        callService(e, function(e) {
            setLocalStorage(o, e, !0), i(e)
        }, function() {
            var e = getLocalStorage(o, s, !0);
            i(e)
        }, t, 1, 2e4)
    }

    function changeLocalStorageValue(e, i, t, o) {
        var s = getLocalStorage(e, i, !0);
        void 0 === o ? s = t : s[o] = t, setLocalStorage(e, s, !0)
    }

    function tuneImage(e) {
        return ' style="border:0; visibility: hidden;" onload="tuneImageSize.call(this,' + e + ')" '
    }

    function makeImg(e, i) {
        return e && "" !== e || (e = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs="), '<img src="' + e + '"' + tuneImage(i) + "/>"
    }

    function numberWithSeparator(e) {
        var i = e.toString().split(".");
        return i[0] = i[0].replace(/\B(?=(\d{3})+(?!\d))/g, " "), i.join(".")
    }

    function deleteAllCookies() {
        for (var e = document.cookie.split(";"), i = 0; i < e.length; i++) {
            var t = e[i],
                o = t.indexOf("="),
                s = o > -1 ? t.substr(0, o) : t;
            document.cookie = s + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT", document.cookie = s + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=" + window.location.pathname
        }
    }

    function MySound(e) {
        "undefined" != typeof deviceType ? 1 == deviceType && null == winDesktop && (SM_FAILED = !0) : /IEMobile[\/\s](\d+\.\d+)/.test(navigator.userAgent) && (SM_FAILED = !0), this.url = e.url, this.onload = e.onload, this.loaded = !1, this.instance = !1, this.lastPalyedTime = 0, this.muted = !1, this.setMute(), SM_FAILED ? this.onload && (this.onload(), this.onload = !1) : setTimeout(_.bind(function() {
            this.onload && (this.onload(), this.onload = !1)
        }, this), 1e4)
    }

    function soundManagerFailed() {
        SM_FAILED || (window.Log.write("SoundManager failed"), SM_FAILED = !0, Settings.set({
            musicEffects: !1,
            soundEffects: !1
        }, {
            notSave: !0
        }))
    }

    function fail(e) {
        new ConnectionLostWindow({
            error: e
        })
    }

    function getRandomInt(e, i) {
        return Math.floor(Math.random() * (i - e + 1)) + e
    }

    function pad(e, i, t) {
        return t = t || "0", e += "", e.length >= i ? e : new Array(i - e.length + 1).join(t) + e
    }

    function checkNoNumberAsString(e, i) {
        if (!_.isObject(e)) throw new Error("Argument is not an object, source: " + i);
        for (var t = _.keys(e), o = 0; o < t.length; o++) {
            var s = t[o],
                n = e[s];
            if (_.isString(n) && n === (+n).toString()) throw new Error('Numeric value for "' + s + '" is string "' + n + '", source: ' + i);
            _.isObject(n) && checkNoNumberAsString(n, i)
        }
        return !0
    }

    function extend(e, i) {
        var t = function() {};
        t.prototype = i.prototype, e.prototype = new t, e.prototype.constructor = e, e.superclass = i.prototype
    }

    function FieldController() {
        Game.on("prepared", function() {
            FieldController.onPrepared();
            for (var e = 0; e < Game.field.length; e++)
                for (var i = 0; i < Game.field[e].length; i++) null !== Game.field[e][i] && Game.field[e][i].createDiv()
        }), Game.on("explodeSimpleCell", FieldController.explodeSimpleCell)
    }

    function MovesController() {
        Game.on("change:moves", function(e, i) {
            i = i.get(), i > Config.lessMovesAmount || !Game.get("fullRunning") ? $("#moves").removeClass("lessAmount") : $("#moves").addClass("lessAmount"), $("#moves").html(i)
        })
    }

    function FloorController() {
        var e = function(e, i, t) {
            var o = createByTemplate(".invisible .floorLevel");
            return o.addClass("floorLevel" + t), o.attr("id", "floor_" + e + "_" + i), o.setCoords(getItemCoords({
                x: i,
                y: e
            })), o
        };
        Game.on("prepared", function() {
            Figure.find("#floor").empty();
            for (var i = 0; i < Game.floor.length; i++)
                for (var t = 0; t < Game.floor[i].length; t++)
                    if (Game.floor[i][t] > 0) {
                        var o = e(i, t, Game.floor[i][t]);
                        Figure.find("#floor").append(o)
                    }
        }), Game.on("createFloor", function(i, t) {
            var o = Figure.find("#floor_" + i.y + "_" + i.x);
            o.length && o.removeAttr("id");
            var s = e(i.y, i.x, Game.floor[i.y][i.x]);
            s.hide(), Figure.find("#floor").append(s), s.fadeIn(300, function() {
                o.length && o.remove(), t()
            })
        }), Game.on("changeFloor", function(e, i, t) {
            var o = Figure.find("#floor_" + e.y + "_" + e.x),
                s = createByTemplate(".invisible .emptyTemplate").addClass("floorLevelAnimation" + t);
            Figure.blockedAnimations.append(s), s.alignTo(o), s.delay(350).queue(function(e) {
                e(), this.remove()
            }), o.addClass("floorLevelBetween" + i + "and" + t).delay(200).queue(function(e) {
                this.removeClass("floorLevel" + t).removeClass("floorLevelBetween" + i + "and" + t).addClass("floorLevel" + i), e()
            })
        })
    }

    function BrightStat(e) {
        function i(e) {
            var i = "//brightstat.freetopay.ru/inp/checkAvailability.php?branding_id=" + n.brandingId + "&user_id=" + n.userId + "&user_data=null&jsonp=afterAvailableBrightStat";
            window.afterAvailableBrightStat = function(i) {
                "status" in i && i.status ? (s = !0, e(!0)) : (s = !1, e(!1))
            }, $.getScript(i)
        }

        function t(e) {
            if (e = e || function() {}, o) return e(), void 0;
            var i = "//brightstat.freetopay.ru/inp/init.php?branding_id=" + n.brandingId + "&user_id=" + n.userId + "&age=" + n.age + "&sex=" + n.sex + "&country=" + n.country + "&city=" + n.city + "&friends_count=" + n.friendsCount + "&jsonp=afterInitBrightStat";
            window.afterInitBrightStat = function(i) {
                i && (o = !0, e())
            }, $.getScript(i)
        }
        var o, s, n = {
            brandingId: e,
            userId: user.get("userId"),
            age: calcAge(users[user.get("userId")].bthdate),
            friendsCount: allFriendsIds.length
        };
        if ("odnoklassniki" === network) {
            n.sex = users[user.get("userId")].ok_gender || 0;
            var a = users[user.get("userId")].ok_location;
            a ? (n.country = a.countryName, n.city = a.city) : (n.country = "", n.city = "")
        } else "vkontakte" === network && (n.country = users[user.get("userId")].country || 0, n.city = users[user.get("userId")].city || 0, n.sex = users[user.get("userId")].sex || 0);
        this.checkAvailability = function(e) {
            return s === !0 ? (e(!0), void 0) : s === !1 ? (e(!1), void 0) : (o ? i(e) : t(function() {
                i(e)
            }), void 0)
        }, this.eventComplete = function(e) {
            if (o && s) {
                var i = "//brightstat.freetopay.ru/inp/event_complete.php?branding_id=" + n.brandingId + "&event_id=" + e + "&user_id=" + n.userId + "&user_data=null&jsonp=afterEventBrightStat";
                window.afterEventBrightStat = function() {}, $.getScript(i)
            }
        }, this.getRedirectUrl = function(e) {
            if (!o || !s) return "#";
            var i = "//brightstat.freetopay.ru/inp/event_redirect.php?branding_id=" + n.brandingId + "&event_id=" + e + "&user_id=" + n.userId + "&user_data=null";
            return i
        }
    }
    global.exports = exports;
    var SocialAdapterBase = Backbone.Model.extend({
            invite: function(e, i) {
                this.finalInvite(e, i)
            },
            initialize: function() {
                this.on("openSocialWindow", function() {
                    application.get("view") && application.get("view").isFullScreen() && application.get("view").exitFullScreen()
                })
            },
            uploadCanvas: function(e, i, t) {
                e.toBlob(_.bind(function(e) {
                    this.upload(e, i, t)
                }, this))
            },
            upload: function() {
                alert("not implemented")
            },
            createAlbumIfNotExist: function(e, i, t) {
                e ? this.checkExistAlbum(e, _.bind(function(o) {
                    o ? t(e) : this.createAlbum(i, t)
                }, this)) : this.createAlbum(i, t)
            },
            checkExistAlbum: function() {
                alert("not implemented")
            },
            createAlbum: function() {
                alert("not implemented")
            },
            finalInvite: function(e, i) {
                var t = function(e) {
                    e && e.length && (InviteKeeper.markInvited(e), i && i(e))
                };
                this._showInvite(e, t)
            },
            inviteWithCustomWindow: function(e, i, t) {
                var o = this;
                e || (e = listFriendsNotInAppIds()), new SelectFriendWindow({
                    massCallback: function(e) {
                        o.finalInvite(e)
                    },
                    callback: function(e) {
                        o.finalInvite([e])
                    },
                    type: "inviteFriendsByRequest",
                    userIds: _.map(e, function(e) {
                        return e + ""
                    }),
                    urgent: !t
                })
            },
            _showInvite: function() {
                throw "Not implemented"
            },
            sendRequest: function(e) {
                e = new Object(e), e.success = e.success || function() {}, e.cancel = e.cancel || function() {}, e.veryImportant = !!e.veryImportant, Array.isArray(e.userIds) || (e.userIds = [e.userIds])
            },
            publication: function(e) {
                e = e || {};
                var i = e.type,
                    t = e.success || function() {},
                    o = e.image || messages[i + "Image"],
                    s = e.message || RANDOM(messages[i + "Message"]),
                    n = e.caption || messages[i + "Caption"],
                    a = user.get("gender") || 0;
                _.isArray(n) && (n = n[a]), _.isArray(s) && (s = s[a]), doPublication(s, o, n, void 0, t, i)
            },
            showPromo: function() {}
        }),
        UndefinedSocialAdapter = SocialAdapterBase.extend({
            invite: function() {
                throw "Social adapter is not initialized for current network"
            }
        }),
        socialNetwork = new UndefinedSocialAdapter,
        OdnoklassnikiSocialAdapter = SocialAdapterBase.extend({
            invite: function(e, i, t) {
                window.mobile ? this.inviteWithCustomWindow(e, i, t) : this.finalInvite(e, i, t)
            },
            upload: function(e, i, t) {
                FAPI.Client.call({
                    method: "photosV2.getUploadUrl",
                    aid: i
                }, function(i, o, s) {
                    reloadIfExpired(s);
                    var n = o.upload_url,
                        a = new FormData;
                    a.append("inputdata", e, "pic1"), $.ajax({
                        type: "POST",
                        url: n,
                        data: a,
                        dataType: "json",
                        cache: !1,
                        processData: !1,
                        contentType: !1,
                        success: function(e) {
                            var i = e.photos,
                                o = _.first(_.keys(i)),
                                s = i[o].token;
                            FAPI.Client.call({
                                method: "photosV2.commit",
                                photo_id: o,
                                token: s,
                                comment: t.comment
                            }, function(e, i, t) {
                                reloadIfExpired(t)
                            })
                        }
                    })
                })
            },
            createAlbumIfNotExist: function(e, i, t) {
                odHasPermission("PHOTO CONTENT", _.bind(function(o) {
                    return o ? (SocialAdapterBase.prototype.createAlbumIfNotExist.call(this, e, i, t), void 0) : (socialNetwork.trigger("openSocialWindow"), FAPI.UI.showPermissions("['PHOTO CONTENT']"), window.lastNoPermissionProcess = _.bind(function() {
                        this.createAlbumIfNotExist.call(this, e, i, t)
                    }, this), void 0)
                }, this))
            },
            checkExistAlbum: function(e, i) {
                FAPI.Client.call({
                    method: "photos.getAlbumInfo",
                    aid: e
                }, function(e, t, o) {
                    t ? i(!0) : (reloadIfExpired(o), i(!1))
                })
            },
            createAlbum: function(e, i) {
                FAPI.Client.call({
                    method: "photos.createAlbum",
                    type: "public",
                    title: e.title,
                    description: e.description
                }, function(e, t, o) {
                    reloadIfExpired(o), i(t)
                })
            },
            _showInvite: function(e, i) {
                var t = messages.odnoklassniki_invite;
                "object" != typeof t && (t = [t]);
                var o = RANDOM(t);
                if (window.mobile) {
                    if (void 0 !== e) {
                        var s = function() {
                            FAPI.Client.call({
                                method: "friends.appInvite",
                                uids: e.join(","),
                                text: o,
                                devices: "IOS, ANDROID, WEB"
                            }, function(e, t, o) {
                                reloadIfExpired(o), "ok" === e && i ? i() : o && console.log(o)
                            })
                        };
                        odHasPermission("APP_INVITE", function(e) {
                            if (e) s();
                            else {
                                var i = location.href;
                                i = encodeURIComponent(i.substr(0, i.indexOf("site/") + 5) + "odnoklassniki/askpermissions.html"), newOdChildFrame("http://www.odnoklassniki.ru/oauth/authorize/session?scope=APP_INVITE&response_type=result&redirect_uri=" + i + "&st.layout=m&client_id=" + appId + "&session_key=" + window.sessionKey, s)
                            }
                        })
                    }
                } else void 0 === e ? (this.trigger("openSocialWindow"), window.odInviteSuccess = i, FAPI.UI.showInvite(o)) : this.sendRequest({
                    message: o,
                    userIds: e,
                    success: i
                })
            },
            sendRequest: function(e) {
                SocialAdapterBase.prototype.sendRequest.call(this, e), askRequest(e.message, void 0, e.userIds, void 0, e.success, e.cancel)
            }
        });
    socialNetwork = new OdnoklassnikiSocialAdapter;
    var users = {},
        allFriendsIds, friendsInAppIds, friendsNotInAppIds, lastProduct = !1,
        lastPromoProduct = !1,
        odChildFrame = !1,
        odChildFrameSuccess, odChildFrameFail;
    window.addEventListener("message", function(e) {
        odChildFrame !== !1 && (e.origin.indexOf("ok.ru") > 0 && "loaded" != e.data ? (odChildFrame.newWindow ? odChildFrame.newWindow.close() : odChildFrame.remove(), odChildFrame = !1, e.data.indexOf("error") > 0 ? odChildFrameFail && odChildFrameFail() : odChildFrameSuccess && odChildFrameSuccess()) : ("od_frame_success" == e.data && (odChildFrame.newWindow ? odChildFrame.newWindow.close() : odChildFrame.remove(), odChildFrame = !1, odChildFrameSuccess && odChildFrameSuccess()), "od_frame_fail" == e.data && (odChildFrame.newWindow ? odChildFrame.newWindow.close() : odChildFrame.remove(), odChildFrame = !1, odChildFrameFail && odChildFrameFail())))
    });
    var odShowBuyNow = !1;
    window.getMobileWidgets = function(e) {
        function i(e) {
            var i, t, o, s, n, a, r, l, d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                c = 0,
                u = 0,
                h = "",
                p = [];
            if (!e) return e;
            e += "";
            do s = d.indexOf(e.charAt(c++)), n = d.indexOf(e.charAt(c++)), a = d.indexOf(e.charAt(c++)), r = d.indexOf(e.charAt(c++)), l = s << 18 | n << 12 | a << 6 | r, i = l >> 16 & 255, t = l >> 8 & 255, o = 255 & l, p[u++] = 64 == a ? String.fromCharCode(i) : 64 == r ? String.fromCharCode(i, t) : String.fromCharCode(i, t, o); while (c < e.length);
            return h = p.join("")
        }
        FAPI.Client.call({
            method: "widget.getWidgetContent",
            wid: "mobile-header-small"
        }, function(t, o, s) {
            if (reloadIfExpired(s), null === o) return e(!1), void 0;
            var n = decodeURIComponent(escape(i(o)));
            e(n)
        })
    }, window.API_callback = function(e, i, t) {
        return "showInvite" == e && "ok" == i ? (void 0 !== window.odInviteSuccess && window.odInviteSuccess(t.split(",")), void 0) : "showNotification" == e ? ("ok" == i ? void 0 !== window.odRequestSuccess && window.odRequestSuccess(t.split(",")) : void 0 !== window.odRequestCancel && window.odRequestCancel(), void 0) : "showPayment" == e && "ok" == i ? (lastProduct !== !1 && (socialNetwork.trigger("success_payment", lastProduct), lastProduct = !1), void 0) : "showPromoPayment" == e && "ok" == i ? (lastPromoProduct !== !1 && (socialNetwork.trigger("success_odGiftPayment", lastPromoProduct), lastPromoProduct = !1), void 0) : "showConfirmation" == e && "ok" == i ? (lastPublishObject.resig = t, FAPI.Client.call(lastPublishObject, function(e, i, t) {
            reloadIfExpired(t), "ok" == e && void 0 !== window.odPublicationSuccess && window.odPublicationSuccess()
        }), void 0) : "showPermissions" == e && "ok" == i ? (lastNoPermissionProcess(), void 0) : "postMediatopic" == e ? ("ok" == i ? void 0 !== window.odPostMediatopicSuccess && window.odPostMediatopicSuccess() : void 0 !== window.odPostMediatopicCancel && window.odPostMediatopicCancel(), void 0) : "ok" != i ? (console.log(e, i, t), void 0) : (console.log("wrong arguments"), console.log(e, i, t), void 0)
    }, window.console || (window.console = {}), window.console.log || (window.console.log = function() {}), window.Log = {
        write: function() {
            void 0 === window.production && (window.production = 1), production || window.console.log.apply && window.console.log.apply(window.console, arguments)
        },
        error: function() {
            window.console.log.apply(window.console, arguments)
        },
        server: function() {
            if (errorReporting) {
                for (var e = [], i = 0; i < arguments.length; i++) "string" == typeof arguments[i] ? e.push(arguments[i]) : e.push(JSON.stringify(arguments[i]));
                var t = "../service/logger.php" + ("?message=" + encodeURIComponent(e.join(" ")) + "&viewerId=" + ("undefined" != typeof viewerId ? viewerId : "") + "&ua=" + encodeURIComponent(navigator.userAgent) + "&network=" + network);
                "phonegap" == network && (t = t + "&phonegapNetwork=" + phonegapNetwork), (new Image).src = t, this.error.apply(this, arguments)
            }
        }
    };
    var updateOrientationTimeout = !1;
    window.orientationChange = function() {
        $("#popMenuBlock").removeClass("transitionPopMenu"), $("body").css({
            width: "100%",
            height: "100%"
        }), updateOrientationTimeout !== !1 && clearTimeout(updateOrientationTimeout), updateOrientationTimeout = setTimeout(function() {
            updateOrientationTimeout = !1, updateOrientation()
        }, 300)
    };
    var localStorageEnabled = void 0,
        hexMD5 = function(e) {
            function i(e, i) {
                return e << i | e >>> 32 - i
            }

            function t(e, i) {
                var t, o, s, n, a;
                return s = 2147483648 & e, n = 2147483648 & i, t = 1073741824 & e, o = 1073741824 & i, a = (1073741823 & e) + (1073741823 & i), t & o ? 2147483648 ^ a ^ s ^ n : t | o ? 1073741824 & a ? 3221225472 ^ a ^ s ^ n : 1073741824 ^ a ^ s ^ n : a ^ s ^ n
            }

            function o(e, i, t) {
                return e & i | ~e & t
            }

            function s(e, i, t) {
                return e & t | i & ~t
            }

            function n(e, i, t) {
                return e ^ i ^ t
            }

            function a(e, i, t) {
                return i ^ (e | ~t)
            }

            function r(e, s, n, a, r, l, d) {
                return e = t(e, t(t(o(s, n, a), r), d)), t(i(e, l), s)
            }

            function l(e, o, n, a, r, l, d) {
                return e = t(e, t(t(s(o, n, a), r), d)), t(i(e, l), o)
            }

            function d(e, o, s, a, r, l, d) {
                return e = t(e, t(t(n(o, s, a), r), d)), t(i(e, l), o)
            }

            function c(e, o, s, n, r, l, d) {
                return e = t(e, t(t(a(o, s, n), r), d)), t(i(e, l), o)
            }

            function u(e) {
                for (var i, t = e.length, o = t + 8, s = (o - o % 64) / 64, n = 16 * (s + 1), a = Array(n - 1), r = 0, l = 0; t > l;) i = (l - l % 4) / 4, r = l % 4 * 8, a[i] = a[i] | e.charCodeAt(l) << r, l++;
                return i = (l - l % 4) / 4, r = l % 4 * 8, a[i] = a[i] | 128 << r, a[n - 2] = t << 3, a[n - 1] = t >>> 29, a
            }

            function h(e) {
                var i, t, o = "",
                    s = "";
                for (t = 0; 3 >= t; t++) i = e >>> 8 * t & 255, s = "0" + i.toString(16), o += s.substr(s.length - 2, 2);
                return o
            }

            function p(e) {
                e = e.replace(/\r\n/g, "\n");
                for (var i = "", t = 0; t < e.length; t++) {
                    var o = e.charCodeAt(t);
                    128 > o ? i += String.fromCharCode(o) : o > 127 && 2048 > o ? (i += String.fromCharCode(o >> 6 | 192), i += String.fromCharCode(63 & o | 128)) : (i += String.fromCharCode(o >> 12 | 224), i += String.fromCharCode(o >> 6 & 63 | 128), i += String.fromCharCode(63 & o | 128))
                }
                return i
            }
            var g, f, m, v, w, C, b, y, k, F = Array(),
                S = 7,
                T = 12,
                x = 17,
                A = 22,
                P = 5,
                $ = 9,
                W = 14,
                B = 20,
                I = 4,
                M = 11,
                _ = 16,
                R = 23,
                L = 6,
                G = 10,
                O = 15,
                E = 21;
            for (e = p(e), F = u(e), C = 1732584193, b = 4023233417, y = 2562383102, k = 271733878, g = 0; g < F.length; g += 16) f = C, m = b, v = y, w = k, C = r(C, b, y, k, F[g + 0], S, 3614090360), k = r(k, C, b, y, F[g + 1], T, 3905402710), y = r(y, k, C, b, F[g + 2], x, 606105819), b = r(b, y, k, C, F[g + 3], A, 3250441966), C = r(C, b, y, k, F[g + 4], S, 4118548399), k = r(k, C, b, y, F[g + 5], T, 1200080426), y = r(y, k, C, b, F[g + 6], x, 2821735955), b = r(b, y, k, C, F[g + 7], A, 4249261313), C = r(C, b, y, k, F[g + 8], S, 1770035416), k = r(k, C, b, y, F[g + 9], T, 2336552879), y = r(y, k, C, b, F[g + 10], x, 4294925233), b = r(b, y, k, C, F[g + 11], A, 2304563134), C = r(C, b, y, k, F[g + 12], S, 1804603682), k = r(k, C, b, y, F[g + 13], T, 4254626195), y = r(y, k, C, b, F[g + 14], x, 2792965006), b = r(b, y, k, C, F[g + 15], A, 1236535329), C = l(C, b, y, k, F[g + 1], P, 4129170786), k = l(k, C, b, y, F[g + 6], $, 3225465664), y = l(y, k, C, b, F[g + 11], W, 643717713), b = l(b, y, k, C, F[g + 0], B, 3921069994), C = l(C, b, y, k, F[g + 5], P, 3593408605), k = l(k, C, b, y, F[g + 10], $, 38016083), y = l(y, k, C, b, F[g + 15], W, 3634488961), b = l(b, y, k, C, F[g + 4], B, 3889429448), C = l(C, b, y, k, F[g + 9], P, 568446438), k = l(k, C, b, y, F[g + 14], $, 3275163606), y = l(y, k, C, b, F[g + 3], W, 4107603335), b = l(b, y, k, C, F[g + 8], B, 1163531501), C = l(C, b, y, k, F[g + 13], P, 2850285829), k = l(k, C, b, y, F[g + 2], $, 4243563512), y = l(y, k, C, b, F[g + 7], W, 1735328473), b = l(b, y, k, C, F[g + 12], B, 2368359562), C = d(C, b, y, k, F[g + 5], I, 4294588738), k = d(k, C, b, y, F[g + 8], M, 2272392833), y = d(y, k, C, b, F[g + 11], _, 1839030562), b = d(b, y, k, C, F[g + 14], R, 4259657740), C = d(C, b, y, k, F[g + 1], I, 2763975236), k = d(k, C, b, y, F[g + 4], M, 1272893353), y = d(y, k, C, b, F[g + 7], _, 4139469664), b = d(b, y, k, C, F[g + 10], R, 3200236656), C = d(C, b, y, k, F[g + 13], I, 681279174), k = d(k, C, b, y, F[g + 0], M, 3936430074), y = d(y, k, C, b, F[g + 3], _, 3572445317), b = d(b, y, k, C, F[g + 6], R, 76029189), C = d(C, b, y, k, F[g + 9], I, 3654602809), k = d(k, C, b, y, F[g + 12], M, 3873151461), y = d(y, k, C, b, F[g + 15], _, 530742520), b = d(b, y, k, C, F[g + 2], R, 3299628645), C = c(C, b, y, k, F[g + 0], L, 4096336452), k = c(k, C, b, y, F[g + 7], G, 1126891415), y = c(y, k, C, b, F[g + 14], O, 2878612391), b = c(b, y, k, C, F[g + 5], E, 4237533241), C = c(C, b, y, k, F[g + 12], L, 1700485571), k = c(k, C, b, y, F[g + 3], G, 2399980690), y = c(y, k, C, b, F[g + 10], O, 4293915773), b = c(b, y, k, C, F[g + 1], E, 2240044497), C = c(C, b, y, k, F[g + 8], L, 1873313359), k = c(k, C, b, y, F[g + 15], G, 4264355552), y = c(y, k, C, b, F[g + 6], O, 2734768916), b = c(b, y, k, C, F[g + 13], E, 1309151649), C = c(C, b, y, k, F[g + 4], L, 4149444226), k = c(k, C, b, y, F[g + 11], G, 3174756917), y = c(y, k, C, b, F[g + 2], O, 718787259), b = c(b, y, k, C, F[g + 9], E, 3951481745), C = t(C, f), b = t(b, m), y = t(y, v), k = t(k, w);
            var N = h(C) + h(b) + h(y) + h(k);
            return N.toLowerCase()
        },
        recursiveReplaceDoublePointsBeforeLetter = function(e) {
            if ("object" == typeof e)
                for (var i in e) e[i] = recursiveReplaceDoublePointsBeforeLetter(e[i]);
            else if ("string" == typeof e)
                for (var t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", i = 0; i < t.length; i++) {
                    var o = new RegExp("\\.\\." + t.charAt(i), "g");
                    e = e.replace(o, "." + t.charAt(i))
                }
            return e
        };
    void 0 === window.callServiceUrl && (window.callServiceUrl = "../service/service.php" + location.search);
    var tuneSizeImages = {};
    window.tuneImageSize = function(e) {
        if (!this.width || !this.height) {
            var i = this;
            return setTimeout(function() {
                tuneImageSize.call(i, e)
            }, 500), void 0
        }
        void 0 === tuneSizeImages[this.src] && (tuneSizeImages[this.src] = [this.width, this.height]);
        var t = tuneSizeImages[this.src][0],
            o = tuneSizeImages[this.src][1];
        o > t ? (this.height = e * o / t, this.width = e) : (this.width = e * t / o, this.height = e), this.style.visibility = "visible"
    }, window.parseQueryString = function(e) {
        "?" === e.charAt(0) && (e = e.substring(1));
        for (var i = e.split("&"), t = {}, o = 0; o < i.length; o++) {
            var s = i[o].split("=");
            s && 2 === s.length && (t[decodeURIComponent(s[0])] = decodeURIComponent(s[1]))
        }
        return t
    }, jQuery.easing.jswing = jQuery.easing.swing, jQuery.extend(jQuery.easing, {
        def: "easeOutQuad",
        swing: function(e, i, t, o, s) {
            return jQuery.easing[jQuery.easing.def](e, i, t, o, s)
        },
        easeInQuad: function(e, i, t, o, s) {
            return o * (i /= s) * i + t
        },
        easeOutQuad: function(e, i, t, o, s) {
            return -o * (i /= s) * (i - 2) + t
        },
        easeInOutQuad: function(e, i, t, o, s) {
            return (i /= s / 2) < 1 ? o / 2 * i * i + t : -o / 2 * (--i * (i - 2) - 1) + t
        },
        easeInCubic: function(e, i, t, o, s) {
            return o * (i /= s) * i * i + t
        },
        easeOutCubic: function(e, i, t, o, s) {
            return o * ((i = i / s - 1) * i * i + 1) + t
        },
        easeInOutCubic: function(e, i, t, o, s) {
            return (i /= s / 2) < 1 ? o / 2 * i * i * i + t : o / 2 * ((i -= 2) * i * i + 2) + t
        },
        easeInQuart: function(e, i, t, o, s) {
            return o * (i /= s) * i * i * i + t
        },
        easeOutQuart: function(e, i, t, o, s) {
            return -o * ((i = i / s - 1) * i * i * i - 1) + t
        },
        easeInOutQuart: function(e, i, t, o, s) {
            return (i /= s / 2) < 1 ? o / 2 * i * i * i * i + t : -o / 2 * ((i -= 2) * i * i * i - 2) + t
        },
        easeInQuint: function(e, i, t, o, s) {
            return o * (i /= s) * i * i * i * i + t
        },
        easeOutQuint: function(e, i, t, o, s) {
            return o * ((i = i / s - 1) * i * i * i * i + 1) + t
        },
        easeInOutQuint: function(e, i, t, o, s) {
            return (i /= s / 2) < 1 ? o / 2 * i * i * i * i * i + t : o / 2 * ((i -= 2) * i * i * i * i + 2) + t
        },
        easeInSine: function(e, i, t, o, s) {
            return -o * Math.cos(i / s * (Math.PI / 2)) + o + t
        },
        easeOutSine: function(e, i, t, o, s) {
            return o * Math.sin(i / s * (Math.PI / 2)) + t
        },
        easeInOutSine: function(e, i, t, o, s) {
            return -o / 2 * (Math.cos(Math.PI * i / s) - 1) + t
        },
        easeInExpo: function(e, i, t, o, s) {
            return 0 == i ? t : o * Math.pow(2, 10 * (i / s - 1)) + t
        },
        easeOutExpo: function(e, i, t, o, s) {
            return i == s ? t + o : o * (-Math.pow(2, -10 * i / s) + 1) + t
        },
        easeInOutExpo: function(e, i, t, o, s) {
            return 0 == i ? t : i == s ? t + o : (i /= s / 2) < 1 ? o / 2 * Math.pow(2, 10 * (i - 1)) + t : o / 2 * (-Math.pow(2, -10 * --i) + 2) + t
        },
        easeInCirc: function(e, i, t, o, s) {
            return -o * (Math.sqrt(1 - (i /= s) * i) - 1) + t
        },
        easeOutCirc: function(e, i, t, o, s) {
            return o * Math.sqrt(1 - (i = i / s - 1) * i) + t
        },
        easeInOutCirc: function(e, i, t, o, s) {
            return (i /= s / 2) < 1 ? -o / 2 * (Math.sqrt(1 - i * i) - 1) + t : o / 2 * (Math.sqrt(1 - (i -= 2) * i) + 1) + t
        },
        easeInElastic: function(e, i, t, o, s) {
            var n = 1.70158,
                a = 0,
                r = o;
            if (0 == i) return t;
            if (1 == (i /= s)) return t + o;
            if (a || (a = .3 * s), r < Math.abs(o)) {
                r = o;
                var n = a / 4
            } else var n = a / (2 * Math.PI) * Math.asin(o / r);
            return -(r * Math.pow(2, 10 * (i -= 1)) * Math.sin(2 * (i * s - n) * Math.PI / a)) + t
        },
        easeOutElastic: function(e, i, t, o, s) {
            var n = 1.70158,
                a = 0,
                r = o;
            if (0 == i) return t;
            if (1 == (i /= s)) return t + o;
            if (a || (a = .3 * s), r < Math.abs(o)) {
                r = o;
                var n = a / 4
            } else var n = a / (2 * Math.PI) * Math.asin(o / r);
            return r * Math.pow(2, -10 * i) * Math.sin(2 * (i * s - n) * Math.PI / a) + o + t
        },
        easeInOutElastic: function(e, i, t, o, s) {
            var n = 1.70158,
                a = 0,
                r = o;
            if (0 == i) return t;
            if (2 == (i /= s / 2)) return t + o;
            if (a || (a = .3 * s * 1.5), r < Math.abs(o)) {
                r = o;
                var n = a / 4
            } else var n = a / (2 * Math.PI) * Math.asin(o / r);
            return 1 > i ? -.5 * r * Math.pow(2, 10 * (i -= 1)) * Math.sin(2 * (i * s - n) * Math.PI / a) + t : r * Math.pow(2, -10 * (i -= 1)) * Math.sin(2 * (i * s - n) * Math.PI / a) * .5 + o + t
        },
        easeInBack: function(e, i, t, o, s, n) {
            return void 0 == n && (n = 1.70158), o * (i /= s) * i * ((n + 1) * i - n) + t
        },
        easeOutBack: function(e, i, t, o, s, n) {
            return void 0 == n && (n = 1.70158), o * ((i = i / s - 1) * i * ((n + 1) * i + n) + 1) + t
        },
        easeInOutBack: function(e, i, t, o, s, n) {
            return void 0 == n && (n = 1.70158), (i /= s / 2) < 1 ? o / 2 * i * i * (((n *= 1.525) + 1) * i - n) + t : o / 2 * ((i -= 2) * i * (((n *= 1.525) + 1) * i + n) + 2) + t
        },
        easeInBounce: function(e, i, t, o, s) {
            return o - jQuery.easing.easeOutBounce(e, s - i, 0, o, s) + t
        },
        easeOutBounce: function(e, i, t, o, s) {
            return (i /= s) < 1 / 2.75 ? 7.5625 * o * i * i + t : 2 / 2.75 > i ? o * (7.5625 * (i -= 1.5 / 2.75) * i + .75) + t : 2.5 / 2.75 > i ? o * (7.5625 * (i -= 2.25 / 2.75) * i + .9375) + t : o * (7.5625 * (i -= 2.625 / 2.75) * i + .984375) + t
        },
        easeInOutBounce: function(e, i, t, o, s) {
            return s / 2 > i ? .5 * jQuery.easing.easeInBounce(e, 2 * i, 0, o, s) + t : .5 * jQuery.easing.easeOutBounce(e, 2 * i - s, 0, o, s) + .5 * o + t
        }
    });
    var Settings = new(Backbone.Model.extend({
        defaults: {
            soundEffects: !0,
            musicEffects: !0
        },
        initialize: function() {
            for (var e = this.keys(), i = 0; i < e.length; i++) {
                var t = e[i],
                    o = getCookie(t);
                void 0 !== o && this.set(t, o)
            }
            this.on("change", function(e, i) {
                i && i.notSave === !0 || this.save()
            }, this)
        },
        save: function() {
            for (var e = this.keys(), i = 0; i < e.length; i++) {
                var t = e[i],
                    o = this.get(t);
                setCookie(t, Number(o))
            }
        },
        toggle: function(e) {
            this.set(e, !this.get(e))
        }
    }));
    MySound.prototype.safeProcess = function(e) {
        if (!SM_FAILED && this.loaded) try {
            e.call(this)
        } catch (i) {
            console.log("muscic error ", i), i instanceof TypeError ? soundManagerFailed() : function() {
                throw i
            }()
        }
    }, MySound.prototype.onLoad = function() {
        this.loaded || (this.loaded = !0, this.onload && (this.onload(), this.onload = !1))
    }, MySound.prototype.setMute = function() {
        var e = this.url;
        "object" == typeof e && (e = e[0]), e.split("/").pop().indexOf("music") < 0 ? Settings.get("soundEffects") || this.mute() : Settings.get("musicEffects") || this.mute()
    }, MySound.prototype.play = function(e) {
        this.loaded && this.safeProcess(function() {
            var i = (new Date).getTime();
            this.lastPalyedTime < i - 50 && (this.lastPalyedTime = i, this.instance = createjs.Sound.play(this.url), e && this.instance.on("complete", function() {
                this.play(!0)
            }, this), this.muted && this.mute())
        })
    }, MySound.prototype.stop = function() {
        this.safeProcess(function() {
            this.instance && this.instance.stop()
        })
    }, MySound.prototype.setVolume = function(e) {
        this.safeProcess(function() {
            this.instance && this.instance.setVolume(e)
        })
    }, MySound.prototype.setPosition = function(e) {
        this.safeProcess(function() {
            this.instance && this.instance.setPosition(e)
        })
    }, MySound.prototype.mute = function() {
        this.muted = !0, this.instance && this.instance.setMute(!0)
    }, MySound.prototype.unmute = function() {
        this.muted = !1, this.instance && this.instance.setMute(!1)
    };
    var SM_FAILED = !1;
    window.soundManager = {}, soundManager.stopAllSounds = function() {
        for (var e in sounds) sounds[e].stop()
    }, soundManager.restartSounds = function() {
        application.playPageSound()
    }, Settings.on("change:soundEffects", function(e, i) {
        for (var t in sounds) - 1 === t.indexOf("music") && (i ? sounds[t].unmute() : sounds[t].mute())
    }), Settings.on("change:musicEffects", function(e, i) {
        for (var t in sounds) t.indexOf("music") > -1 && (i ? sounds[t].unmute() : sounds[t].mute())
    }), window.unload = function() {
        soundManager.stopAllSounds()
    };
    var application, nua = window.navigator.userAgent,
        is_android_browser = nua.indexOf("Mozilla/5.0") > -1 && nua.indexOf("Android ") > -1 && nua.indexOf("AppleWebKit") > -1 && !(nua.indexOf("Chrome") > -1);
    is_android_browser && ($(".network_" + network).css("overflow", "visible"), $("#game").css("overflow", "visible"));
    var RANDOM = function(e) {
        return e[Math.floor(Math.random() * e.length)]
    };
    window.init = function() {
        if (void 0 !== Application.started) return console.log("window.init second call"), void 0;
        if (Application.started = !0, $("#templates").html(templates), templates = void 0, window.mobile) {
            var e, i = !1,
                t = 0,
                o = function() {
                    var o = i;
                    if (t = $("body").width() > $("body").height() ? 90 : 0, t % 180 != 0) {
                        Application.horizontalOrientation = !0, $("body").addClass("horizontalOrientation").removeClass("verticalOrientation");
                        var s = $("body").height(),
                            n = $("body").width() - Config.calcFieldUpBlock() - Config.calcFieldDownBlock();
                        i = n > s ? s : n
                    } else {
                        Application.horizontalOrientation = !1, $("body").removeClass("horizontalOrientation").addClass("verticalOrientation");
                        var s = $("body").width(),
                            n = $("body").height() - Config.calcFieldUpBlock() - Config.calcFieldDownBlock();
                        window.mobile && "gems" == Config.project && (n -= $("#powerUps").height()), i = n > s ? s : n
                    }
                    if (window.mobile && "gems" == Config.project ? (i = Math.floor(i / Config.rows), 40 > i && (i = 40), i > 120 && (i = 120)) : (i = Math.floor(i / Config.rows), 40 > i && (i = 40), i > 80 && (i = 80)), Config.cellWidth = i, Config.cellHeight = i, e = o, e !== !1 && e != i) {
                        var a = i / e;
                        for (var r in FigureRules)
                            if ("object" == typeof FigureRules[r])
                                for (var l = 0; l < FigureRules[r].length; l++) void 0 !== FigureRules[r][l].params.width && (FigureRules[r][l].params.width *= a), void 0 !== FigureRules[r][l].params.height && (FigureRules[r][l].params.height *= a), void 0 !== FigureRules[r][l].params["margin-left"] && (FigureRules[r][l].params["margin-left"] *= a), void 0 !== FigureRules[r][l].params["margin-top"] && (FigureRules[r][l].params["margin-top"] *= a), void 0 !== FigureRules[r][l].params["text-left"] && (FigureRules[r][l].params["text-left"] *= a), void 0 !== FigureRules[r][l].params["text-top"] && (FigureRules[r][l].params["text-top"] *= a);
                        canvas.running && canvas.layer.multipleKoef(a)
                    }
                };
            o(), window.updateOrientation = function() {
                o();
                var e = $("body").height();
                e < i * Config.rows && (e = i * Config.rows, $("body").css("height", e + "px"));
                var s = $("body").width();
                s < i * Config.cols && (s = i * Config.cols, $("body").css("width", s + "px")), is_android_browser || $("#canvas").css({
                    height: e + "px",
                    width: s + "px"
                });
                var n = function(e, t, o) {
                    var s = t - i * Config.rows;
                    s = 0 > s ? 0 : Math.floor(s / 2);
                    var n = Config.calcFieldUpBlock(),
                        a = Config.calcFieldDownBlock(),
                        r = Math.floor((o - n - a - i * e) / 2);
                    return 0 > r && (r = 0), r += n, {
                        left: r + "px",
                        top: s + "px"
                    }
                };
                if ($("#popMenuBlock").removeClass("transitionPopMenu"), t % 180 != 0) {
                    var a = n(Config.rows, e, s);
                    $("#game .holder").css({
                        left: a.left,
                        top: a.top
                    })
                } else {
                    var a = n(Config.cols, s, e);
                    $("#game .holder").css({
                        left: a.top,
                        top: a.left
                    })
                }
                if (setTimeout(function() {
                        $("#popMenuBlock").addClass("transitionPopMenu")
                    }, 100), canvas.running) {
                    for (;;) {
                        var a = Figure.blockedAnimations.find(".fieldDisabled");
                        if (!a.length) break;
                        a.remove()
                    }
                    Figure.blockedAnimations.find(".fieldDisabledArrow").remove();
                    for (var r in Game.field)
                        for (var l in Game.field[r]) Game.field[r][l] && (Game.field[r][l].forceDisabled = void 0);
                    $("#force").remove(), Game.set("fullRunning", !0);
                    var d = !1;
                    $("#game").hasClass("forceNow") && (d = !0), $("#game").removeClass("forceNow"), $(".wrapper").removeClass("gameForceNow"), d && Game.trigger("showMessage", messages.forceEnd), canvas.init(), FieldController.onPrepared(), gameView.fieldOffset = Figure.field.offset(), Game.unset("suggestSwitch"), Game.set("suggestSwitch", !0), gameView.drawProgressLine()
                }
                window.friendsPanelOrientation && window.friendsPanelOrientation()
            }, $(window).on("orientationchange", orientationChange), updateOrientation()
        }
        if ("undefined" != typeof figureRulesProcess && figureRulesProcess.process(), Config.requiredModernizrTests)
            for (var s = 0; s < Config.requiredModernizrTests.length; s++)
                if (!Modernizr[Config.requiredModernizrTests[s]]) return $("#badBrowserWindow").show(), void 0;
        $("body").on("mousemove touchmove", removeSelection), $("body").on("mousedown touchstart", function() {
            setTimeout(removeSelection, 0)
        }), $("body").on("mouseup touchend", removeSelection), application = new Application, application.afterInit(), void 0 === window.MapEditor || window.editor || (window.editor = new MapEditor), void 0 !== Config.actions && new CPView({
            actions: Config.actions
        })
    }, $.fn.fadeIn = function(e, i) {
        return this.css({
            opacity: 0
        }).show(), this.ourAnimate({
            opacity: 1
        }, e, void 0, i)
    }, $.fn.fadeOut = function(e, i) {
        return this.ourAnimate({
            opacity: 0
        }, e, void 0, function() {
            $(this).hide(), i && i.call(this)
        })
    }, $.fn.distanceTo = function(e) {
        var i = this.offset(),
            t = e.offset();
        return Math.sqrt((i.left - t.left) * (i.left - t.left) + (i.top - t.top) * (i.top - t.top))
    }, $.fn.alignTo = function(e, i) {
        var t = _.isNumber(e.left) ? e : e.offset(),
            o = this.parent().offset();
        return i && i.useMargin && (t.left -= parseInt(this.css("margin-left")), t.top -= parseInt(this.css("margin-top"))), i && i.ajust && (t.left += i.ajust.left, t.top += i.ajust.top), Modernizr.csstransforms3d && this.css({
            left: "0px",
            top: "0px"
        }), i && i.css ? this.css({
            left: t.left - o.left + "px",
            top: t.top - o.top + "px"
        }) : this.setCoords({
            left: t.left - o.left + "px",
            top: t.top - o.top + "px"
        }), this
    }, $.fn.getRealOffset = function() {
        var e = this.offset(),
            i = this.parent().offset();
        return {
            left: e.left - i.left,
            top: e.top - i.top
        }
    }, $.fn.spriteAnimate = function(e, i) {
        var t = $(":first-child", this),
            o = parseInt(this.css("width")),
            s = parseInt(t.css("width")),
            n = s / o,
            a = 0,
            r = 1;
        window.mobile && (r = 2);
        var l = function(s) {
            t.delay(e * r / n).queue(function(e) {
                t.setCoords({
                    left: -s * o + "px",
                    top: "0px"
                }), s >= n && i(), e()
            })
        };
        for (t.setCoords({
            left: "0px",
            top: "0px"
        }); n > a;) a += r, l(a)
    }, $.fn.setTransform = function(e, i, t, o) {
        if (Modernizr.csstransforms3d) void 0 !== e ? (e = _.isString(e) && 0 === e.indexOf("+=") ? this.getData("translateX") + parseFloat(e.substr(2)) : parseFloat(e), this.setData("translateX", e)) : e = this.getData("translateX"), void 0 !== i ? (i = _.isString(i) && 0 === i.indexOf("+=") ? this.getData("translateY") + parseFloat(i.substr(2)) : parseFloat(i), this.setData("translateY", i)) : i = this.getData("translateY"), void 0 !== t ? (t = parseFloat(t), this.setData("rotateZ", t)) : t = this.getData("rotateZ"), void 0 !== o ? this.setData("scale", o) : o = this.getData("scale"), this.css(generateTransform(e, i, t, o));
        else {
            if (void 0 !== e || void 0 !== i) {
                var s = {};
                void 0 !== e && (s.left = e), void 0 !== i && (s.top = i), this.css(s)
            }
            void 0 !== t && this.rotate(t), void 0 !== o && this.scale(o)
        }
        return this
    }, $.fn.setCoords = function(e) {
        return this.setTransform(e.left, e.top)
    }, $.fn.setAngle = function(e) {
        return this.setTransform(void 0, void 0, e)
    }, $.fn.setScale = function(e) {
        return this.setTransform(void 0, void 0, void 0, e)
    }, $.fn.getData = function(e) {
        var i = this.data(e);
        return void 0 === i && (i = "scale" == e ? 1 : 0), i
    }, $.fn.setData = function(e, i) {
        "scale" == e && 1 == i || "scale" != e && 0 == i ? this.removeData(e) : this.data(e, i)
    }, $.fn.classForTime = function(e, i) {
        return this.addClass(e).delay(i).queue(function() {
            $(this).removeClass(e), $(this).dequeue()
        })
    };
    var calcFinishCssValue = function(e, i) {
            if (void 0 === i) return e;
            if ("string" == typeof i) {
                if (0 === i.indexOf("+=")) return e + parseFloat(i.substr(2));
                if (0 === i.indexOf("-=")) return e - parseFloat(i.substr(2))
            }
            return parseFloat(i)
        },
        generateTransform = function(e, i, t, o) {
            var s = "translateZ(0)";
            return 0 != e && (s += "translateX(" + e + "px)"), 0 != i && (s += "translateY(" + i + "px)"), 0 != t && (s += "rotateZ(" + t + "deg)"), 1 != o && (s += "scale(" + o + "," + o + ")"), {
                transform: s,
                "-webkit-transform": s,
                "-o-transform": s,
                "-ms-transform": s,
                "-moz-transform": s
            }
        };
    $.fn.cssSpriteAnimation = function(e, i, t, o) {
        var s = e + " " + i + "ms steps(" + t + ") forwards",
            n = $(":first-child", this);
        n.css({
            animation: s,
            "-webkit-animation": s
        }), this.css({
            opacity: 1
        }), setTimeout(_.bind(function() {
            n.css({
                animation: "",
                "-webkit-animation": ""
            }), this.css({
                opacity: 0
            }), o && o()
        }, this), i)
    }, $.fn.ourAnimate = function(e, i, t, o) {
        if (!this.length) return this;
        if (e.target) {
            var s = e.target.offset(),
                n = this.parent().offset();
            void 0 === e.ajust && (e.ajust = {
                left: 0,
                top: 0
            }), e.left = s.left - n.left + e.ajust.left + "px", e.top = s.top - n.top + e.ajust.top + "px", delete e.target
        }
        if (e.animation) {
            var a, r = this;
            return this.queue(function(i) {
                a = r.getRealOffset(), e.options.difX = parseFloat(e.left) - a.left, e.options.difY = parseFloat(e.top) - a.top, i()
            }), this.animate({}, i, t, o, _.bind(function(i) {
                var t = e.animation(i, e.options);
                this.css({
                    left: a.left + t.left + "px",
                    top: a.top + t.top + "px",
                    rotate: t.rotate + "deg",
                    scale: t.scale
                })
            }, this)), void 0
        }
        return this.ourAnimate2.call(this, e, i, t, o)
    }, $.fn.ourAnimate2 = function(e, i, t, o) {
        if (Modernizr.csstransforms3d) {
            if (void 0 !== e.left || void 0 !== e.top || void 0 !== e.rotate || void 0 !== e.scale) {
                var s = {},
                    n = {},
                    a = this;
                if (a.queue(function(i) {
                        s.translateX = a.getData("translateX"), n.translateX = calcFinishCssValue(s.translateX, e.left), s.translateY = a.getData("translateY"), n.translateY = calcFinishCssValue(s.translateY, e.top), s.rotateZ = a.getData("rotateZ"), n.rotateZ = calcFinishCssValue(s.rotateZ, e.rotate), s.scale = a.getData("scale"), n.scale = calcFinishCssValue(s.scale, e.scale);
                        for (var t in e) "left" != t && "top" != t && "rotate" != t && "scale" != t && (s[t] = parseFloat(a.css(t)), n[t] = calcFinishCssValue(s[t], e[t]));
                        a.setData("translateX", n.translateX), a.setData("translateY", n.translateY), a.setData("rotateZ", n.rotateZ), a.setData("scale", n.scale), i()
                    }), window.mobile) "function" == typeof t && (o = t, t = void 0), a.queue(function(e) {
                    i = Math.round(100 * i) / 100, a.css({
                        "-webkit-transition": "opacity " + i + "ms, -webkit-transform " + i + "ms",
                        transition: "opacity " + i + "ms, transform " + i + "ms",
                        "-webkit-transition-timing-function": "linear",
                        "transition-timing-function": "linear"
                    }), a.setTransform(n.translateX, n.translateY, n.rotateZ, n.scale), void 0 !== n.opacity && a.css({
                        opacity: n.opacity
                    }), setTimeout(_.bind(function() {
                        a.css({
                            "-webkit-transition": "",
                            transition: ""
                        }), o && o.call(this), e()
                    }, this), i)
                });
                else {
                    var r = function() {
                        this.css = function(i) {
                            i = 1 - i;
                            var t = generateTransform(s.translateX + (n.translateX - s.translateX) * i, s.translateY + (n.translateY - s.translateY) * i, s.rotateZ + (n.rotateZ - s.rotateZ) * i, s.scale + (n.scale - s.scale) * i);
                            for (var o in e) "left" != o && "top" != o && "rotate" != o && "scale" != o && (t[o] = s[o] + (n[o] - s[o]) * i);
                            return a.css(t), {}
                        }
                    };
                    a.animate({
                        path: new r
                    }, i, t, o)
                }
            } else this.css(generateTransform(this.getData("translateX"), this.getData("translateY"), this.getData("rotateZ"), this.getData("scale"))), this.animate(e, i, t, o);
            return this
        }
        return this.animate(e, i, t, o)
    }, window.fixOperaAnimation = function() {}, -1 !== navigator.userAgent.toLowerCase().indexOf("opera") && -1 !== navigator.userAgent.toLowerCase().indexOf("version/12") && (window.fixOperaAnimation = function() {
        $("#mainAppWrapper").addClass("fixOperaAnimation").removeClass("fixOperaAnimation"), setTimeout(function() {
            $("#mainAppWrapper").addClass("fixOperaAnimation").removeClass("fixOperaAnimation")
        }, 2e3)
    });
    var Library = {
            collectFly: function(e, i) {
                return i.easing && (e = i.easing(e)), {
                    left: i.difX * e,
                    top: (i.difY + i.vy) * e * e - i.vy * e,
                    scale: 1 - (1 - i.targetScale) * e,
                    rotate: i.rotate ? i.rotate * e : 0
                }
            },
            linearFly: function(e, i) {
                return i.easing && (e = i.easing(e)), {
                    left: i.difX * e,
                    top: i.difY * e,
                    scale: 1 - (1 - i.targetScale) * e,
                    rotate: i.rotate ? i.rotate * e : 0
                }
            },
            quadEasing: function(e) {
                return (e * e + e * e * e) / 2
            },
            linearEasing: function(e) {
                return e
            }
        },
        ObscureNumber = function(e) {
            this.set(e)
        };
    ObscureNumber.prototype.get = function() {
        return this.a1 ^ this.a2
    }, ObscureNumber.prototype.set = function(e) {
        return this.a1 && this.a2 && (this.a1 ^ this.a2) !== e ? Math.random() > .5 ? this.a1 = this.a2 ^ e : this.a2 = this.a1 ^ e : (this.a1 = Math.floor(5e3 * Math.random()) + 1e3, this.a2 = e ^ this.a1), e
    }, ObscureNumber.prototype.valueOf = ObscureNumber.prototype.get;
    var LifeKeeper = {
            askSendLifes: function() {
                var e = allFriendsIds;
                ("facebook" === network || "draugiem" === network || "phonegap" == network && "facebook" == window.phonegapNetwork || "spmobage" === network) && (e = friendsInAppIds), new SelectFriendWindow({
                    massCallback: function(e) {
                        LifeKeeper.askSendLifesFromSelectedFriends(e)
                    },
                    callback: function(e) {
                        LifeKeeper.askSendLifesFromSelectedFriends([e])
                    },
                    type: "askLifes",
                    userIds: _.map(e, function(e) {
                        return e + ""
                    })
                })
            },
            askSendLifesFromSelectedFriends: function(e) {
                function i(e) {
                    0 != e.length && socialNetwork.sendRequest({
                        type: "askSendLife",
                        verb: "askfor",
                        ogobject: "life",
                        userIds: e,
                        message: RANDOM(messages.askLife)
                    })
                }
                callService("../../../levelbase/src/services/asklife.php", i, function() {}, {
                    userIds: e.join(",")
                })
            },
            checkCanFriendSendLife: function(e) {
                return void 0 === window.friendSendedLifeTime[e] ? !0 : window.friendSendedLifeTime[e] < application.getCurrentServerTime() - this.getLifeAskInterval()
            },
            checkMeSendLifeToFriend: function(e) {
                return void 0 === window.meSendedLifeTime[e] ? !0 : window.meSendedLifeTime[e] < application.getCurrentServerTime() - this.getLifeAskInterval()
            },
            getLifeAskInterval: function() {
                return "undefined" != typeof askLiveInterval ? askLiveInterval : 86400
            },
            setMeSendedLifeToFriend: function(e) {
                _.each(e, function(e) {
                    window.meSendedLifeTime[e] = application.getCurrentServerTime()
                }), setLocalStorage("meSendedLifeTime", window.meSendedLifeTime)
            },
            setFriendSendedLifeTime: function(e) {
                _.each(e, function(e) {
                    window.friendSendedLifeTime[e] = application.getCurrentServerTime()
                }), setLocalStorage("friendSendedLifeTime", window.friendSendedLifeTime)
            },
            load: function() {
                window.friendSendedLifeTime = getLocalStorage("friendSendedLifeTime"), void 0 === window.friendSendedLifeTime && (window.friendSendedLifeTime = {}), window.meSendedLifeTime = getLocalStorage("meSendedLifeTime"), void 0 === window.meSendedLifeTime && (window.meSendedLifeTime = {})
            }
        },
        InviteKeeper = {
            markInvited: function(e) {
                for (var i = 0; i < e.length; i++) window.friendsInvitedTimes[e[i]] ? window.friendsInvitedTimes[e[i]]++ : window.friendsInvitedTimes[e[i]] = 1;
                setLocalStorage("friendsInvitedTimes", window.friendsInvitedTimes)
            },
            load: function() {
                window.friendsInvitedTimes = getLocalStorage("friendsInvitedTimes"), void 0 === window.friendsInvitedTimes && (window.friendsInvitedTimes = {})
            }
        },
        BaseUser = Backbone.Model.extend({
            defaults: {
                photo: !1,
                name: !1,
                gender: !1,
                bthdate: !1,
                online: !1,
                last_online: !1,
                inapp: !1
            },
            initialize: function() {},
            calcWeight: function() {
                var e = 0,
                    i = calcAge(this.get("bthdate"));
                18 > i && (e += 3), i >= 18 && 28 > i && (e += 8), i >= 28 && 36 > i && (e += 14), i >= 36 && 46 > i && (e += 18), i >= 46 && (e += 15), this.get("gender") && (e *= 2), this.get("online") && (e += 30);
                var t = calcAmountDaysAfterDate(this.get("last_online"));
                return 7 > t && (e += 2), 31 > t && (e += 3), t > 180 && (e -= 100), this.get("inapp") ? e += 100 : window.friendsInvitedTimes[this.id] && (e -= 20 * window.friendsInvitedTimes[this.id]), e
            }
        }),
        Users = Backbone.Collection.extend({
            model: BaseUser,
            comparator: function(e) {
                return -e.calcWeight()
            },
            getBestForInvite: function() {
                for (var e = listFriendsNotInAppIds(), i = [], t = 0; t < e.length; t++) i.push({
                    id: e[t],
                    weight: Math.random() * this.get(e[t]).calcWeight()
                });
                i.sort(function(e, i) {
                    return i.weight - e.weight
                }), e = [];
                for (var t = 0; t < i.length; t++) e.push(i[t].id);
                return e
            }
        }, {
            create: function(e) {
                var i = new Users;
                return _.each(e, function(e, t) {
                    i.add(_.extend({
                        id: t
                    }, e))
                }, this), i
            }
        }),
        User = Backbone.Model.extend({
            initialize: function() {
                user = this;
                var e = application.AUTHORIZATION_DATA;
                if (void 0 !== e.coins && (e.coins = new ObscureNumber(e.coins)), this.set(e), this.set("photo", application.USERS[this.get("userId")].photo), this.set("name", application.USERS[this.get("userId")].first_name), this.set("gender", application.USERS[this.get("userId")].gender), this.set("usedPowerUps", {}), this.updateLocalStorageProgress(), window.gcmIdToChange && changeGCMId(window.gcmIdToChange), this.get("firstTime") && this.sendPushToBelka(), this.on("change:episode", function() {
                        this.calcAvailables(), this.updateLocalStorageProgress()
                    }, this), this.on("change:level", function() {
                        this.calcAvailables(), this.updateLocalStorageProgress(), this.sendPushToBelka(), "vkontakte" == network && setUserLevel(episode.absoluteLevelNumber(this.get("level")))
                    }, this), this.get("GCMId") && Config.pushNotificationsSender) {
                    var i = !1;
                    this.on("change:lives", function(e, t) {
                        0 == t ? (addPushTask(0, Config.lifeRestoreTime * Config.maxLives), i = !1) : i || (deletePushTask(0), i = !0)
                    })
                }
                this.serverAttributes = ["episode", "level", "lives", "livesLastRestored", "coins", "strip", "powerUps", "collectAction", "amountCollectCoinsFromFriends", "shownForces", "bonusLevelPlayTime", "bonusLevelDoneEpisode", "everydayBonusSeria", "everydayBonusCollected", "withoutLoseSeria", "todayGachaPlayTimes", "achievements", "gifts"], (Config.useStatistics && !window.mobile || Config.useMobileStatistics && window.mobile) && (this.serverAttributes.push("actionName"), this.serverAttributes.push("actionEpisode"), this.serverAttributes.push("actionLevel"), this.serverAttributes.push("actionPrice")), this.on("change", this.changeListener, this), window.collectCoinsFriendTime = getLocalStorage("collectCoinsFriendTime"), void 0 === window.collectCoinsFriendTime && (window.collectCoinsFriendTime = {});
                for (var t = {}, o = this.get("powerUps"), s = 0; s < Config.powerUpIdsOrder.length; s++) t[Config.powerUpIdsOrder[s]] = o % 100, o = Math.floor(o / 100);
                this.set("powerUpsAmount", t), Config.autoUnlockEpisodeTime && (this.serverAttributes.push("keyLastUnlocked"), this.serverAttributes.push("keyLastUnlockedEpisode")), this.on("buyBonusLevelTime", function() {
                    Game.set({
                        timeout: 1e3 * Config.bonusLevelBuyTimeAmount,
                        buyedTime: 1,
                        running: !0,
                        fullRunning: !0
                    }), new BonusLevelTimeAddWindow
                }), this.on("buyBonusLevelRefresh", function() {
                    user.set({
                        bonusLevelPlayTime: 0
                    }, {
                        notSave: !0
                    }), episode.bonusLevel.play()
                }), Application.on("ready", function() {
                    this.updateMaxLives(), this.livesIntervalFunction(), setInterval(_.bind(this.livesIntervalFunction, this), 1e3)
                }, this)
            },
            updateMaxLives: function() {
                this.get("lives") > Config.maxLives && this.set("lives", Config.maxLives)
            },
            updateLocalStorageProgress: function() {
                if ("phonegap" == network) {
                    var e = getLocalStorage("mu", {
                        episode: 1,
                        level: 1
                    }, !0);
                    (this.get("episode") > e.episode || this.get("episode") == e.episode && this.get("level") > e.level) && (e.episode = this.get("episode"), e.level = this.get("level"), setLocalStorage("mu", e, !0))
                }
            },
            changeListener: function(e, i) {
                if (!i || i.notSave !== !0) {
                    if (e.hasChanged("episode")) return this.get("keysBought") || callServiceAddInQueue("../../../levelbase/src/services/nextepisode.php", {
                        episode: e.get("episode")
                    }), setTimeout(function() {
                        user.set({
                            level: 1,
                            receivedKeys: [],
                            keysBought: !1,
                            friendsHelpSended: 0
                        }, {
                            notSave: !0
                        })
                    }, 0), void 0;
                    var t = _.intersection(_.keys(e.changedAttributes()), e.serverAttributes);
                    if (t.length > 0) {
                        var o = {};
                        _.each(t, function(i) {
                            var t = e.get(i);
                            o[i] = void 0 === t.get ? t : t.get()
                        }), void 0 !== o.lives && (o.livesLastRestored = e.get("livesLastRestored")), void 0 !== o.livesLastRestored && (o.lives = e.get("lives")), o.server_time = application.getCurrentServerTime(), callServiceAddInQueue("../../../levelbase/src/services/updateuser.php", o), (Config.useStatistics && !window.mobile || Config.useMobileStatistics && window.mobile) && o.actionName && setTimeout(function() {
                            user.set({
                                actionName: !1,
                                actionEpisode: !1,
                                actionLevel: !1,
                                actionPrice: !1
                            }, {
                                notSave: !0
                            })
                        }, 0)
                    }
                }
            },
            initAchievements: function() {
                if (Config.achievementsOrder) {
                    this.achievements = new Achievements;
                    for (var e = this.get("achievements"), i = 0; i < Config.achievementsOrder.length; i++) {
                        var t = Config.achievementsOrder[i];
                        this.achievements.add(new t({
                            level: e % 10,
                            order: i
                        })), e = Math.floor(e / 10)
                    }
                }
            },
            calcChangedAchievements: function(e, i) {
                for (var t = [], o = this.get("achievements"), s = 0; s < Config.achievementsOrder.length; s++) t.push(o % 10), o = Math.floor(o / 10);
                t[e] = i, o = 0;
                for (var s = Config.achievementsOrder.length - 1; s >= 0; s--) o = 10 * o + t[s];
                return o
            },
            changeAchievement: function(e, i) {
                this.set("achievements", this.calcChangedAchievements(e, i))
            },
            needForceNow: function() {
                return episode.get("about").force && episode.get("about").force[application.level.num] && !application.playedLevels[episode.absoluteLevelNumber(application.level.num)] && (!episode.scores.findWhere({
                        level: application.level.num
                    }) || !production)
            },
            getRandomFriendForGift: function() {
                if (0 == this.selectedForGifts.length) return !1;
                var e = this.selectedForGifts.shift();
                return this.selectedForGifts.push(e), void 0 === users[e] ? !1 : e
            },
            calcPowerUps: function() {
                for (var e = this.get("powerUpsAmount"), i = 0, t = Config.powerUpIdsOrder.length - 1; t >= 0; t--) i = 100 * i + e[Config.powerUpIdsOrder[t]];
                return i
            },
            defaultPublication: function(e, i) {
                var t = RANDOM(messages[e + "Message"]);
                doPublication(t, messages[e + "Image"], messages[e + "Caption"][this.get("gender")], void 0, i, e)
            },
            setPowerUpAmount: function(e, i, t) {
                var o = this.get("powerUpsAmount");
                o[e] = 100 > i ? i : 99, this.set("powerUpsAmount", o), t || this.set("powerUps", this.calcPowerUps())
            },
            getPowerUpAmount: function(e) {
                var i = this.get("powerUpsAmount");
                return i[e]
            },
            wantUsePowerUp: function(e) {
                if (!(episode.absoluteLevelNumber(application.level.num) < e.get("available") && !episode.isBonusWorld() || !Game.get("fullRunning") && application.forcePowerUp !== e.id)) {
                    var i = this.get("powerUpsAmount");
                    return i[e.id] > 0 ? (Game.set("selectedPowerUp", e), void 0) : window.mobile ? (new BuyPowerUpsWindow({
                        powerUp: e
                    }), void 0) : this.get("coins").get() >= e.get("price") ? (Game.set("selectedPowerUp", e), void 0) : (this.buyPowerUp(e), void 0)
                }
            },
            buyPowerUp: function(e) {
                this.set({
                    coins: new ObscureNumber(this.get("coins").get() - e.get("price"))
                }, {
                    validate: !0
                })
            },
            usePowerUp: function(e) {
                var i = this.get("powerUpsAmount"),
                    t = this.get("usedPowerUps"),
                    o = {};
                for (var s in t) o[s] = t[s];
                return void 0 === o[e.id] && (o[e.id] = 0), o[e.id]++, this.set("usedPowerUps", o), i[e.id] > 0 ? (this.setPowerUpAmount(e.id, i[e.id] - 1), Game.trigger("powerAmountChanged"), void 0) : (this.set({
                    coins: new ObscureNumber(this.get("coins").get() - e.get("price")),
                    actionName: e.id,
                    actionEpisode: episode.get("num"),
                    actionLevel: application.level.num,
                    actionPrice: e.get("price")
                }, {
                    validate: !0
                }), void 0)
            },
            getLifes: function(e) {
                if (0 != e.length) {
                    var i = this.get("lives");
                    i += e.length, i > Config.maxLives && (i = Config.maxLives), this.set({
                        lives: i
                    }, {
                        notSave: !0
                    })
                }
            },
            checkCanCollectCoinsFromFriend: function(e) {
                return void 0 === window.collectCoinsFriendTime[e] ? !0 : window.collectCoinsFriendTime[e] < window.dayBeginTime
            },
            checkNeedHelpFriends: function() {
                return 0 == needHelpFriends.length || this.get("level") < 10 && 1 == this.get("episode") ? !1 : !0
            },
            neverPlayedBefore: function() {
                return 1 == this.get("episode") && 1 == this.get("level")
            },
            inviteBestFriends: function() {
                socialNetwork.invite(allUsers.getBestForInvite())
            },
            tryOpenShopRecommendedWindow: function() {
                if (application.canOpenNotMatterWindow() && Config.shopRecommened && !(user.get("episode") < Config.shopRecommened.episode || user.get("episode") == Config.shopRecommened.episode && user.get("level") < Config.shopRecommened.level)) {
                    var e = getLocalStorage("lastShopRecommendedWindow");
                    if (void 0 === e && (e = 0), !(e > application.getCurrentServerTime() - 86400 * Config.shopRecommened.interval)) {
                        var i = [];
                        _.each(Config.shopRecommened.types, function(e) {
                            "good" == e.type && goods.checkProduct(e.name) || i.push(e)
                        }), i.length > 0 && (setLocalStorage("lastShopRecommendedWindow", application.getCurrentServerTime()), new ShopRecommendedWindow({
                            type: RANDOM(i)
                        }))
                    }
                }
            },
            getRealLevel: function() {
                return this.get("level") + (this.get("episode") - 1) * Config.levelsInEpisode
            },
            sendPushToBelka: function() {
                if ("vkontakte" === network || "test" === network) {
                    var e = this.getRealLevel();
                    if (!(1 != e && e != Config.belkaSendLevel || 0 !== this.get("refPlace").indexOf("ad_belka_") && 0 !== this.get("refPlace").indexOf("belka_"))) {
                        var i = $("<img/>");
                        i.attr("src", "http://bor.belkatechnologies.com/BOR/external?userId=" + this.get("userId") + "&appName=" + Config.belkaAppName + "&level=" + e + "&ref=" + this.get("refPlace")), $("#preload").append(i)
                    }
                }
            },
            calcAvailables: function() {
                this.calcShopAvailable(), this.calcMyAchievmentsAvailable(), this.calcBonusWorldAvailable(), this.calcGachaAvailable(), this.calcAdditionalLivesAvailable()
            },
            calcShopAvailable: function() {
                return Config.shopAvailable === !1 ? (this.set("shopAvailable", !1), void 0) : (this.get("episode") > Config.shopAvailable.episode || this.get("episode") == Config.shopAvailable.episode && this.get("level") >= Config.shopAvailable.level ? this.set("shopAvailable", !0) : this.set("shopAvailable", !1), void 0)
            },
            calcMyAchievmentsAvailable: function() {
                return Config.myAchievmentsAvailable === !1 || void 0 === Config.myAchievmentsAvailable ? (this.set("myAchievmentsAvailable", !1), void 0) : (this.get("episode") > Config.myAchievmentsAvailable.episode || this.get("episode") == Config.myAchievmentsAvailable.episode && this.get("level") >= Config.myAchievmentsAvailable.level ? this.set("myAchievmentsAvailable", !0) : this.set("myAchievmentsAvailable", !1), void 0)
            },
            calcBonusWorldAvailable: function() {
                var e = !1;
                if (Config.bonusWorlds)
                    for (var i = 0; i < Config.bonusWorlds.length; i++) {
                        if (e = !0, Config.bonusWorld = Config.bonusWorlds[i], window.bonusWorldFinishTime = !1, window.bonusWorldFinishTimes[Config.bonusWorld.name] && (window.bonusWorldFinishTime = window.bonusWorldFinishTimes[Config.bonusWorld.name]), (this.get("episode") < Config.bonusWorld.available.episode || this.get("episode") == Config.bonusWorld.available.episode && this.get("level") < Config.bonusWorld.available.level) && (e = !1), void 0 !== Config.bonusWorld.available.networks && e && (e = !1, _.each(Config.bonusWorld.available.networks, function(i) {
                                i == network && (e = !0)
                            })), void 0 !== Config.bonusWorld.available.uids && e && (e = !1, _.each(Config.bonusWorld.available.uids, function(i) {
                                i == viewerId && (e = !0)
                            })), void 0 !== Config.bonusWorld.available.gender && Config.bonusWorld.available.gender != this.get("gender") && (e = !1), void 0 !== Config.bonusWorld.available.age) {
                            var t = calcAge(users[this.get("userId")].bthdate);
                            (!t || t < Config.bonusWorld.available.age[0] || t > Config.bonusWorld.available.age[1]) && (e = !1)
                        }
                        if (void 0 !== Config.bonusWorld.available.country && users[this.get("userId")].country != Config.bonusWorld.available.country && (e = !1), Config.bonusWorld.available.checkFunction && e) return Config.bonusWorld.available.checkFunction(_.bind(function(e) {
                            this.set("bonusWorldAvailable", e), e && ("undefined" == typeof BonusWorldIntroduceWindow || user.get("shownForces") & 1 << Config.bonusWorld.forceId || Config.bonusWorld.withoutInnerWindow !== !0 || (!Config.bonusWorld.available.minEpisodeToEnter || user.get("episode") > Config.bonusWorld.available.minEpisodeToEnter || user.get("episode") == Config.bonusWorld.available.minEpisodeToEnter && user.get("level") >= Config.bonusWorld.available.minLevelToEnter) && (user.set("shownForces", user.get("shownForces") & 1 << Config.bonusWorld.forceId), setTimeout(function() {
                                var e = new BonusWorldIntroduceWindow;
                                e.forceId = Config.bonusWorld.forceId
                            }, 800)))
                        }, this)), void 0
                    } else e = !1;
                this.set("bonusWorldAvailable", e)
            },
            calcGachaAvailable: function() {
                return Config.gacha ? Config.gacha.episode && Config.gacha.level ? (this.get("episode") > Config.gacha.episode || this.get("episode") == Config.gacha.episode && this.get("level") >= Config.gacha.level ? this.set("gachaAvailable", !0) : this.set("gachaAvailable", !1), void 0) : (this.set("gachaAvailable", !1), void 0) : (this.set("gachaAvailable", !1), void 0)
            },
            calcAdditionalLivesAvailable: function() {
                return Config.goods ? Config.goods.additionalLifes ? this.getRealLevel() < Config.goods.additionalLifes.available ? (this.set("additionalLivesAvailable", !1), void 0) : (this.set("additionalLivesAvailable", !0), void 0) : (this.set("additionalLivesAvailable", !1), void 0) : (this.set("additionalLivesAvailable", !1), void 0)
            },
            validate: function(e) {
                return e.coins < 0 ? "nocoins" : e.lives < 0 ? "nolives" : void 0
            },
            getAmountKeys: function() {
                if (this.get("episode") == Config.episodesAmount) return 0;
                var e = user.get("receivedKeys").length;
                return (e > 3 || user.get("keysBought")) && (e = 3), e
            },
            refillLives: function() {
                return this.set({
                    coins: new ObscureNumber(this.get("coins") - Config.lifeRefillPrice),
                    lives: Config.maxLives,
                    actionName: "refill lifes",
                    actionEpisode: this.get("episode"),
                    actionLevel: this.get("level"),
                    actionPrice: Config.lifeRefillPrice
                }, {
                    validate: !0
                })
            },
            livesIntervalFunction: function() {
                this.get("lives") < Config.maxLives ? (this.set("timeToNextLife", this.get("livesLastRestored") + Config.lifeRestoreTime - application.getCurrentServerTime(), {
                    notSave: !0
                }), this.get("timeToNextLife") < 0 && (this.set({
                    lives: this.get("lives") + 1,
                    livesLastRestored: this.get("livesLastRestored") + Config.lifeRestoreTime
                }, {
                    notSave: !0
                }), this.livesIntervalFunction())) : this.set("timeToNextLife", -1)
            },
            nextLevel: function() {
                this.get("level") <= Config.levelsInEpisode && this.set({
                    level: this.get("level") + 1,
                    receivedKeys: [],
                    keysBought: !1,
                    friendsHelpSended: 0
                }, {
                    notSave: !0
                })
            },
            addLifeOnWin: function() {
                goods.checkProduct("unlimitedLifes") || this.get("lives") < Config.maxLives && this.set("lives", this.get("lives") + 1)
            },
            addAndRemoveLifeOnLoseGame: function() {
                var e = {
                    actionName: "lose game",
                    actionEpisode: episode.get("num"),
                    actionLevel: application.level.num,
                    actionPrice: 0,
                    lives: this.get("lives"),
                    livesLastRestored: this.get("livesLastRestored"),
                    withoutLoseSeria: 0
                };
                return goods.checkProduct("unlimitedLifes") ? (this.set(e), void 0) : (e.lives < Config.maxLives && e.lives++, e.lives == Config.maxLives && (e.livesLastRestored = application.getCurrentServerTime()), e.lives--, this.set(e, {
                    validate: !0
                }), void 0)
            },
            removeLifeOnStartGame: function() {
                var e = {
                    actionName: "start game",
                    actionEpisode: episode.get("num"),
                    actionLevel: application.level.num,
                    actionPrice: 0
                };
                return goods.checkProduct("unlimitedLifes") ? (this.set(e), !0) : (this.get("lives") == Config.maxLives ? (e.livesLastRestored = application.getCurrentServerTime(), e.lives = this.get("lives") - 1) : e.lives = this.get("lives") - 1, this.set(e, {
                    validate: !0
                }))
            },
            askSendKeys: function() {
                var e = allFriendsIds;
                ("facebook" === network || "phonegap" == network && "facebook" == window.phonegapNetwork) && (e = friendsInAppIds), new SelectFriendWindow({
                    massCallback: function(e) {
                        user.askSendKeysFromSelectedFriends(e)
                    },
                    callback: function(e) {
                        user.askSendKeysFromSelectedFriends([e])
                    },
                    type: "askKeys",
                    onClose: function() {
                        new EpisodeLockedWindow
                    },
                    userIds: _.map(e, function(e) {
                        return e + ""
                    })
                })
            },
            askSendKeysFromSelectedFriends: function(e) {
                socialNetwork.sendRequest({
                    type: "askSendKey",
                    verb: "askfor",
                    ogobject: "key",
                    userIds: e,
                    message: RANDOM(messages.askKey)
                }), callService("../../../levelbase/src/services/askkey.php", function() {}, function() {}, {
                    userIds: e.join(",")
                })
            },
            buyKeys: function() {
                if (this.set({
                        coins: new ObscureNumber(this.get("coins") - Config.unlockEpisodePrice)
                    }, {
                        validate: !0,
                        notSave: !0
                    })) {
                    this.set("keysBought", !0, {
                        notSave: !0
                    });
                    var e = {
                        coins: this.get("coins").get(),
                        episode: this.get("episode"),
                        level: this.get("level")
                    };
                    return (Config.useStatistics && !window.mobile || Config.useMobileStatistics && window.mobile) && (e.price = Config.unlockEpisodePrice), callServiceAddInQueue("../../../levelbase/src/services/buykeys.php", e), !0
                }
                return !1
            },
            unlockEpisode: function() {
                var e = _.bind(function() {
                    this.set({
                        episode: episode.get("num") + 1,
                        level: 1,
                        friendsHelpSended: 0
                    })
                }, this);
                Config.changeEpisodeAnimation ? Config.changeEpisodeAnimation(e) : e()
            }
        }),
        UserView = Backbone.View.extend({
            el: "#user",
            initialize: function() {
                this.$(".mapAva").html(makeImg(user.get("photo"), Config.basePhotoSize)), this.renderUser(), episode.scores.on("add", this.renderUser, this), episode.on("backToFirstLevel", function() {
                    application.once("main", function() {
                        this.backToFirstLevelTimeout = setTimeout(_.bind(function() {
                            this.backToFirstLevelTimeout = !1;
                            var e = parseInt($("#level1").css("left")),
                                i = parseInt($("#level1").css("top"));
                            $("#main").addClass("levelFailedGoBack"), $(".levels .level").removeClass("levelNow"), $(".wayPieces .wayPiece").removeClass("wayPieceOpen"), episode.backToFirstLevelSound && sounds[episode.backToFirstLevelSound].play(), this.$el.delay(500).animate({
                                left: e + "px",
                                top: i + "px"
                            }, 1500, "linear", _.bind(function() {
                                episode.backToFirstLevelSound && sounds[episode.backToFirstLevelSound].stop(), $("#main").removeClass("levelFailedGoBack"), $("#level1").addClass("levelNow"), $(".outerLevelAnimation").css({
                                    left: this.$el.css("left"),
                                    top: this.$el.css("top")
                                })
                            }, this))
                        }, this), 500)
                    }, this)
                }, this), episode.on("episodeLoaded", this.renderUser, this), episode.on("episodeStartLoad", this.stopEpisodeAnimation, this)
            },
            stopEpisodeAnimation: function() {
                this.backToFirstLevelTimeout && clearTimeout(this.backToFirstLevelTimeout), this.$el.clearQueue().stop(), episode.backToFirstLevelSound && sounds[episode.backToFirstLevelSound].stop()
            },
            renderUser: function() {
                if ($(".levels .level").removeClass("levelNow"), $(".wayPieces .wayPiece").removeClass("wayPieceOpen"), this.$el.hide(), $("#ship").hide(), $(".outerLevelAnimation").removeClass("currentEpisodeLevelAnimation"), $("#main").removeClass("episodeFinished"), $("#main").removeClass("episodeAllRumRecieved"), $(".finalPoint").removeClass("finished"), $("#ship").removeClass("userOnShipNow"), (user.get("episode") > episode.get("num") || 3 === EpisodeLockedWindow.amountKeys()) && $("#main").addClass("episodeAllRumRecieved"), user.get("episode") > episode.get("num") && !episode.isBonusWorld() && ($(".wayPieces .wayPiece").addClass("wayPieceOpen"), $("#main").addClass("episodeFinished"), $(".finalPoint").addClass("finished")), user.get("episode") === episode.get("num") || episode.isBonusWorld()) {
                    var e = user.get("level");
                    episode.isBonusWorld() && (e = episode.scores.length + 1), $(".wayPieces .wayPiece").slice(0, e - 1).addClass("wayPieceOpen"), episode.isBonusWorld() || $("#ship").show(), $("#level" + e).addClass("levelNow"), this.$el.addClass("level" + e), this.$el.show(), $(".outerLevelAnimation").addClass("currentEpisodeLevelAnimation");
                    var i = parseInt($("#level" + e).css("left")),
                        t = parseInt($("#level" + e).css("top"));
                    episode.scores.length == episode.levelsInEpisode() ? ($("#main").addClass("episodeFinished"), $(".finalPoint").addClass("finished"), i = parseInt($("#ship").css("left")), t = parseInt($("#ship").css("top")), this.$el.addClass("userOnShip"), user.get("episode") === episode.get("num") && $("#ship").addClass("userOnShipNow"), episode.isBonusWorld() && this.$el.hide()) : this.$el.removeClass("userOnShip"), this.adjustUserPosition(i, t), $(".outerLevelAnimation").css({
                        left: this.$el.css("left"),
                        top: this.$el.css("top")
                    })
                }
            },
            adjustUserPosition: function(e, i) {
                this.$el.css({
                    left: e + "px",
                    top: i + "px"
                })
            }
        }),
        ServiceQueue = Backbone.Model.extend({
            processOneByOne: function(e) {
                if (0 == this.queue.length) $("body").removeClass("offline").addClass("online"), e();
                else {
                    var i = _.bind(function() {
                        this.queue.shift(), setLocalStorage("sq", this.queue, !0), this.processOneByOne(e)
                    }, this);
                    this.queue[0].sendParams.notUseSession = 1, this.queue[0].sendParams.syncQueue = 1, $.ajax({
                        url: this.queue[0].url,
                        dataType: "json",
                        type: "POST",
                        success: i,
                        timeout: 5e3,
                        data: this.queue[0].sendParams,
                        error: _.bind(function() {
                            callService("../../../levelbase/src/services/checkconnect.php", i, e)
                        }, this)
                    })
                }
            },
            process: function(e) {
                this.queue.length > 0 ? this.processOneByOne(_.bind(function() {
                    this.queue.length > 0 && setTimeout(_.bind(this.process, this), 6e4), void 0 !== e && e()
                }, this)) : void 0 !== e && e()
            },
            initialize: function() {
                this.queue = getLocalStorage("sq", [], !0), this.queue.length > 0 && $("body").removeClass("online").addClass("offline")
            },
            add: function(e) {
                $("body").removeClass("online").addClass("offline"), this.queue.push(e);
                var i = this.queue.length;
                setLocalStorage("sq", this.queue, !0), this.queue = getLocalStorage("sq", [], !0), this.queue.length !== i ? fail() : 1 == this.queue.length && setTimeout(_.bind(this.process, this), 6e4)
            }
        }),
        ApplicationBase = Backbone.Model.extend({
            initialize: function() {
                this.windows = new Windows, this.preloader = new Preloader, this.preloader.on("complete", _.bind(function() {
                    return void 0 !== Application.run ? (console.log("Application.run second call"), void 0) : (Application.run = !0, this.run(), Application.trigger("ready", this), void 0)
                }, this)), this.system = {
                    os: platform.os.toString(),
                    browser: platform.name,
                    version: isNaN(parseFloat(platform.version)) ? 0 : parseFloat(platform.version),
                    isMobile: function() {
                        var e = ["android", "webos", "iphone", "ipad", "blackberry"];
                        for (var i in e)
                            if (navigator.userAgent.match(new RegExp(e[i], "i"))) return !0;
                        return !1
                    }()
                }, this.system.isMobile && $("html").addClass("isMobile"), "IE" === this.system.browser && $("html").addClass("ie"), this.on("change:page", function(e, i) {
                    this.trigger(i)
                }, this), setInterval(_.bind(this.getCurrentServerTime, this), 6e4)
            },
            getPageSound: function() {
                return this.get("page") + "music"
            },
            canOpenNotMatterWindow: function() {
                for (var e = 0; e < this.windows.views.length; e++)
                    if (!("undefined" != typeof MessageCenterWindow && this.windows.views[e] instanceof MessageCenterWindow || "undefined" != typeof EverydayBonusWindow && this.windows.views[e] instanceof EverydayBonusWindow)) return !1;
                return !0
            },
            inviteFriendsWindow: function() {
                var e = allUsers.getBestForInvite();
                if (e.length > 0 && application.canOpenNotMatterWindow()) {
                    var i = getLocalStorage("inviteFriendsByRequestTime");
                    if (void 0 === i || i < (new Date).getTime() - 864e5)
                        if (setLocalStorage("inviteFriendsByRequestTime", (new Date).getTime()), "facebook" === network || window.mobile) socialNetwork.invite(e, void 0, !0);
                        else {
                            var t = function(e) {
                                socialNetwork.sendRequest({
                                    type: "invite",
                                    userIds: e,
                                    message: RANDOM(messages.odnoklassniki_invite),
                                    success: InviteKeeper.markInvited
                                })
                            };
                            new SelectFriendWindow({
                                massCallback: t,
                                type: "inviteFriendsByRequest",
                                userIds: e
                            })
                        }
                }
            },
            giftLivesWindow: function() {
                if (friendsInAppIds.length > 0 && application.canOpenNotMatterWindow() && "wizq" !== network) {
                    var e = getLocalStorage("lastGiftLifesTime");
                    (void 0 === e || e < (new Date).getTime() - 864e5) && (setLocalStorage("lastGiftLifesTime", (new Date).getTime()), new SelectFriendWindow({
                        massCallback: function(e) {
                            messageCenter.askedLifesProcess(e)
                        },
                        type: "giftLifes",
                        userIds: friendsInAppIds
                    }))
                }
            },
            playSound: function(e, i) {
                if (e !== !1 && Config.sounds) {
                    if (Config.sounds[e] === !1) return;
                    if (Config.sounds[e]) {
                        var t = Config.sounds[e];
                        return sounds[t] ? sounds[t].play() : console.log(t + " sound is not exist"), void 0
                    }
                    if (sounds[e]) return sounds[e].play(), void 0;
                    i || console.log("sound for " + e + " event is not exist")
                }
            },
            stopSound: function(e) {
                if (sounds[e]) return sounds[e].stop(), void 0;
                if (Config.sounds) {
                    var i = Config.sounds[e];
                    if (sounds[i]) return sounds[i].stop(), void 0
                }
            },
            playPageSound: function() {
                soundManager.stopAllSounds(), sounds[this.getPageSound()] && loopMusic(this.getPageSound())
            },
            getCurrentServerTime: function() {
                var e = Math.floor((new Date).getTime() / 1e3) + window.phpAndJsTimeDiff;
                return void 0 !== this.prevServerTime && (this.prevServerTime > e + 60 || this.prevServerTime + 600 < e) ? (this.reloadServerTime(), this.prevServerTime) : (this.prevServerTime = e, e)
            },
            reloadServerTime: function() {
                function e() {
                    setTimeout(_.bind(this.reloadServerTime, this), 1e4)
                }

                function i(e) {
                    e && (window.phpAndJsTimeDiff = e.serverTime - Math.floor((new Date).getTime() / 1e3), this.prevServerTime = e.serverTime)
                }
                callService("../../../base/src/services/getservertime.php", _.bind(i, this), _.bind(e, this), {}, 1)
            },
            checkAuthDataSig: function(e) {
                var i = e.mysig;
                return delete e.mysig, i === calcSig(e).sig
            }
        });
    _.extend(ApplicationBase, Backbone.Events);
    var user, friends, goods, messageCenter, episode, episodeView, Application = ApplicationBase.extend({
            initialize: function() {
                production && (Config.episodesAmount = Config.episodesAvailable), this.levelResultsCache = new AsyncCache, this.playedLevels = {}, ApplicationBase.prototype.initialize.call(this)
            },
            getPageSound: function() {
                return "main" == this.get("page") && episode.get("about").mainmusic ? episode.get("about").mainmusic : ApplicationBase.prototype.getPageSound.call(this)
            },
            afterInit: function() {
                "phonegap" == network && (this.socialLogin = new SocialLogin), this.set("view", new ApplicationView);
                var e = new PreloadTask({
                    name: "serviceQueue",
                    task: function(e) {
                        application.serviceQueue = new ServiceQueue, application.serviceQueue.process(e)
                    }
                });
                this.preloader.add(e);
                var i = e;
                "phonegap" == network && (i = new PreloadTask({
                    name: "phonegapSync",
                    parent: e,
                    task: function(e) {
                        application.phonegapSync = new PhonegapSync, application.phonegapSync.sync(e, !0)
                    }
                }), this.preloader.add(i));
                var t = new PreloadTask({
                    name: "authorization",
                    parent: i,
                    task: function(e) {
                        callService("../../../levelbase/src/services/authorization.php", function(i) {
                            window.sessionId = i.sessionId, i && i.userId && application.checkAuthDataSig(i) ? (MessageCenter.Messages = i.messages, delete i.messages, application.AUTHORIZATION_DATA = i, window.viewerId = i.userId, window.phpAndJsTimeDiff = i.serverTime - Math.floor((new Date).getTime() / 1e3), window.dayBeginTime = i.dayBeginTime, InviteKeeper.load(), LifeKeeper.load(), e()) : Log.error("Authorization failed")
                        }, function() {
                            "phonegap" == network && "phonegap" != phonegapNetwork && application.socialLogin.showSocialLoginWindow(), Log.error("Authorization failed")
                        }, {
                            adsRef: window.adsRef,
                            userInviter: window.userInviter || "",
                            os: application.system.os,
                            browser: application.system.browser,
                            version: application.system.version
                        })
                    }
                });
                this.preloader.add(t);
                var o = new PreloadTask({
                    name: "loadFriendsData",
                    parent: t,
                    task: function(e) {
                        loadMeAndAllFriends({
                            first_name: 1,
                            last_name: 1,
                            photo: 1,
                            bigPhoto: 1,
                            gender: 1,
                            inapp: 1,
                            online: 1,
                            bthdate: 1,
                            last_online: 1,
                            country: 1,
                            city: 1
                        }, function() {
                            application.USERS = users, user = new User, allUsers = new Users.create(application.USERS), application.get("view").listenToUser(), friendsInAppIds = friendsInAppIds.slice(0, Math.min(friendsInAppIds.length, 300)), e()
                        })
                    }
                });
                this.preloader.add(o);
                var s = new PreloadTask({
                    name: "loadFriends",
                    parent: o,
                    task: function(e) {
                        var i = function(i) {
                            i.push({
                                id: user.get("userId"),
                                episode: user.get("episode"),
                                level: user.get("level"),
                                gifts: user.get("gifts"),
                                needHelp: !1,
                                canSentGift: !1,
                                GCMId: !1,
                                deviceType: !1
                            }), friends = new Friends(i);
                            var t = friends.length - 1;
                            t > Config.collectCoinsFromFriendDayAmount && (t = Config.collectCoinsFromFriendDayAmount), t -= user.get("amountCollectCoinsFromFriends"), friends.each(function(e) {
                                e.id != user.get("userId") && user.checkCanCollectCoinsFromFriend(e.id) && t > 0 && (t--, e.set("canCollectCoins", !0))
                            }), window.needHelpFriends = friends.where({
                                needHelp: !0
                            });
                            var o = Config.maxHelpFriends || 4;
                            window.needHelpFriends.length > o && (window.needHelpFriends = window.needHelpFriends.slice(0, o)), e()
                        };
                        friendsInAppIds.length > 0 ? callService("../../../levelbase/src/services/friendsdata.php", i, function() {
                            i([])
                        }, {
                            friends: friendsInAppIds.join(",")
                        }) : i([])
                    }
                });
                this.preloader.add(s), this.preloader.add(new PreloadTask({
                    name: "loadEpisode",
                    parent: s,
                    task: function(e) {
                        user.get("episode") > Config.episodesAmount && user.set({
                            episode: Config.episodesAmount,
                            level: Config.levelsInEpisode + 1
                        }, {
                            notSave: !0
                        }), episode = new Episode, episodeView = new EpisodeView;
                        var i = user.get("episode");
                        window.mobile && "gems" == Config.project && 21 == user.get("level") && user.get("episode") + 1 < Config.episodesAmount && i++, episode.load(i, function() {
                            e()
                        })
                    }
                })), this.preloader.add(new PreloadTask({
                    name: "selectFriendsForGifts",
                    parent: s,
                    task: function(e) {
                        var i = [];
                        if (user.selectedForGifts = [], _.each(friends.where({
                                canSentGift: !0
                            }), function(e) {
                                i.push(e.id)
                            }), i = _.shuffle(i), i = i.slice(0, 8), "facebook" !== network && ("phonegap" !== network || "facebook" !== phonegapNetwork)) {
                            var t = allUsers.getBestForInvite();
                            _.each(t, function(e) {
                                i.length < 15 && i.push(e)
                            })
                        }
                        0 == i.length ? e() : (i = _.shuffle(i), callService("../../../levelbase/src/services/listsentgifts.php", function(t) {
                            user.selectedForGifts = user.selectedForGifts.concat(t), user.selectedForGifts.length > 0 || i.length < 15 ? e() : (i = listFriendsNotInAppIds(), 0 == i.length ? e() : (i = _.shuffle(i).slice(0, 15), callService("../../../levelbase/src/services/listsentgifts.php", function(i) {
                                user.selectedForGifts = user.selectedForGifts.concat(i), e()
                            }, e, {
                                friends: i.join(",")
                            })))
                        }, e, {
                            friends: i.join(",")
                        }))
                    }
                })), "phonegap" == network ? this.socialLogin.preloadNetworkScripts(_.bind(function() {
                    this.preloader.run()
                }, this)) : this.preloader.run()
            },
            notAllow: function() {
                this.trigger("notAllow")
            },
            getCurrentServerDay: function() {
                var e = this.getCurrentServerTime() - user.get("beginTime"),
                    i = 86400;
                return {
                    dayNumber: Math.floor(e / i),
                    untilDayEnd: i - e % i
                }
            },
            canOpenNotMatterWindow: function() {
                return episode.isBonusWorld() ? !1 : ApplicationBase.prototype.canOpenNotMatterWindow.call(this)
            },
            removeForcesInWindowQueue: function() {
                for (var e = 1; e < this.windows.views.length; e++)
                    if (this.windows.views[e] instanceof BaseForceView) return this.windows.views = this.windows.views.slice(e, 1), this.removeForcesInWindowQueue(), void 0
            },
            run: function() {
                messageCenter = new MessageCenter(MessageCenter.Messages), Config.initialize(), user.initAchievements(), application.strip = new Strip, new StripView({
                    strip: application.strip
                }), _.each(Config.forces, function(e) {
                    new e
                }), window.mobile || _.each(Config.bonusWorldsForces, function(e) {
                    new e
                }), 1 == user.get("episode") && 1 == user.get("level") && 0 == episode.scores.length ? ("vkontakte" == network && setUserLevel(1), application.set("page", "main"), new NewEpisodeWindow) : application.set("page", "main");
                var e = getLocalStorage("happyBirthdayTime");
                if (recentlyBirthday(application.USERS[user.get("userId")]) && (!e || e < (new Date).getTime() - 2592e6) && !window.mobile && new HappyBirthdayWindow, "undefined" != typeof OffersView && new OffersView, user.on("change:episode", this.removeForcesInWindowQueue, this), !user.get("everydayBonusCollected") && Config.everydayBonus && (user.get("episode") > Config.everydayBonus.episode || user.get("episode") == Config.everydayBonus.episode && user.get("level") >= Config.everydayBonus.level) && new EverydayBonusWindow({
                        seria: user.get("everydayBonusSeria")
                    }), "mobage" !== network && "spmobage" !== network || !user.get("expiredCoins") || "undefined" == typeof CoinsExpiredWindow || new CoinsExpiredWindow, user.getRealLevel() > 30 && "wizq" !== network && "facebook" !== network && "mobage" !== network && "draugiem" !== network && "spmobage" !== network && ("phonegap" !== network || "facebook" !== phonegapNetwork && "phonegap" !== phonegapNetwork) && (this.inviteFriendsWindow(), this.giftLivesWindow()), goods = new Goods(user.get("goods")), "vkontakte" == network) {
                    var i = [];
                    _.each(user.selectedForGifts, function(e) {
                        users[e].inapp || i.push(e)
                    }), user.selectedForGifts = _.difference(user.selectedForGifts, i)
                }
                application.once("game", function() {
                    application.once("main", function() {
                        !window.mobile && application.canOpenNotMatterWindow() && !user.get("paid") && !getCookie("superoffer") && SuperOfferWindow.getSuperOfferProduct() && (user.get("episode") > Config.superOffer.episode || user.get("episode") == Config.superOffer.episode && user.get("level") >= Config.superOffer.level) && new SuperOfferWindow, application.canOpenNotMatterWindow() && user.get("canGetCoinsForInvite") && user.get("episode") > 1 && !window.mobile && new GetCoinsForInviteWindow
                    })
                }), this.trigger("run"), setTimeout(function() {
                    application.strip.calcActive(), user.calcAvailables(), application.canOpenNotMatterWindow() && user.checkNeedHelpFriends() && !getCookie("helpfriendswindow") && new HelpFriendsWindow, "gems" !== Config.project && "phonegap" !== network && "spmobage" !== network && "yahoo" !== network && application.canOpenNotMatterWindow() && (user.get("level") > 5 || user.get("episode") > 1) && user.get("prizePublication") && !getCookie("notPublish") && ("odnoklassniki" === network ? checkPromo1(function(e) {
                        e || new PublicationForBonusWindow
                    }) : new PublicationForBonusWindow)
                }, 50), "undefined" != typeof BoringWindow && BoringWindow.process()
            }
        }),
        Score = Backbone.Model.extend({
            defaults: {
                level: 0,
                score: 0,
                stars: 0
            },
            calcStars: function() {
                if (window.testRun) return 0;
                var e = episode.get("levels")[this.get("level")].score;
                return application.level && "game" == application.get("page") && application.level.num === this.get("level") && (e = application.level.score), this.get("score") < .5 * e ? 0 : this.get("score") < .75 * e ? 1 : this.get("score") < e ? 2 : 3
            },
            initialize: function() {
                this.set("stars", this.calcStars()), this.on("change:score", function() {
                    this.set("stars", this.calcStars())
                }, this)
            }
        }),
        Scores = Backbone.Collection.extend({
            model: Score,
            initialize: function() {
                this.on("add", function(e) {
                    void 0 !== Config.withoutLoseSeriaCalc && (user.get("episode") > Config.withoutLoseSeriaCalc.episode || user.get("episode") == Config.withoutLoseSeriaCalc.episode && user.get("level") >= Config.withoutLoseSeriaCalc.level) && user.set("withoutLoseSeria", user.get("withoutLoseSeria") + 1, {
                        notSave: !0
                    }), episode.isBonusWorld() ? callServiceAddInQueue("../../../levelbase/src/services/addscore.php", {
                        episode: episode.get("num"),
                        level: e.get("level"),
                        score: e.get("score"),
                        bonusWorld: !0,
                        withoutLoseSeria: user.get("withoutLoseSeria")
                    }) : (user.nextLevel(), callServiceAddInQueue("../../../levelbase/src/services/addscore.php", {
                        episode: episode.get("num"),
                        level: e.get("level"),
                        userLevel: user.get("level"),
                        score: e.get("score"),
                        withoutLoseSeria: user.get("withoutLoseSeria")
                    }))
                }), this.on("change:score", function(e) {
                    callServiceAddInQueue("../../../levelbase/src/services/changescore.php", {
                        episode: episode.get("num"),
                        level: e.get("level"),
                        score: e.get("score")
                    })
                }), this.once("reset", function() {
                    user.get("level") <= this.length && user.set("level", this.length + 1)
                }, this)
            },
            addOrUpdateScore: function(e, i) {
                var t = this.findWhere({
                    level: e
                });
                t ? t.get("score") < i && t.set("score", i) : this.add({
                    level: e,
                    score: i
                });
                for (var o = getLocalStorage("myr_" + episode.get("num"), {
                    scores: [],
                    bonusLevelFinished: 0
                }, !0), s = !1, n = 0; n < o.scores.length; n++)
                    if (o.scores[n].level == e) {
                        s = n;
                        break
                    }
                s === !1 ? o.scores.push({
                    level: e,
                    score: i
                }) : o.scores[s].score < i && (o.scores[s].score = i), setLocalStorage("myr_" + episode.get("num"), o, !0)
            }
        }),
        Prize = Backbone.Model.extend({
            defaults: {
                actualStars: 0,
                requiredStars: 0,
                coins: [100, 200],
                done: !1
            },
            execute: function() {
                var e = new ObscureNumber(user.get("coins") + this.get("coins"));
                if (this.get("addPrize") && ("powerUp" == this.get("addPrize").type && user.setPowerUpAmount(this.get("addPrize").name, user.getPowerUpAmount(this.get("addPrize").name) + this.get("addPrize").amount, !0), "good" == this.get("addPrize").type)) {
                    var i = _.where(prices, {
                        goodName: this.get("addPrize").name
                    })[0];
                    goods.goodBuyed(i.goodType), callService("../../../levelbase/src/services/giftaction.php", function() {}, function() {}, {
                        goodName: i.goodName
                    })
                }
                user.set({
                    powerUps: user.calcPowerUps(),
                    coins: e
                }), "game" == application.get("page") && Game && Game.trigger("powerAmountChanged")
            },
            selectOneOfThree: function(e) {
                this.set("coins", this.get("variants")[e].coins || 0), this.get("variants")[e].powerUp ? this.set("addPrize", {
                    type: "powerUp",
                    name: this.get("variants")[e].powerUp,
                    amount: this.get("variants")[e].powerUpAmount
                }) : this.get("variants")[e].good && this.set("addPrize", {
                    type: "good",
                    name: this.get("variants")[e].good,
                    amount: this.get("variants")[e].goodHours
                })
            },
            initialize: function() {
                if (this.has("oneOfThreeGame")) this.set("variants", _.shuffle(this.get("variants")));
                else if (this.set("coins", this.get("coins")[0] + 100 * Math.floor((this.get("coins")[1] - this.get("coins")[0] + 50) * Math.random() / 100)), this.get("addition")) {
                    for (var e = [], i = 0; i < this.get("addition").length; i++) this.get("addition")[i].available && (user.get("episode") - 1) * Config.levelsInEpisode + user.get("level") < this.get("addition")[i].available || e.push(this.get("addition")[i]);
                    if (e.length > 0) {
                        var t = {},
                            o = Math.floor(Math.random() * e.length);
                        for (var i in e[o]) t[i] = e[o][i];
                        var s = t.amount[0] + Math.floor((t.amount[1] - t.amount[0] + 1) * Math.random());
                        t.amount[1] > 100 && (s = 100 * Math.floor((s + 50) / 100)), t.amount = s, "coins" == t.type ? this.set("coins", this.get("coins") + t.amount) : this.set("addPrize", t)
                    }
                }
                this.on("change:actualStars", function(e, i) {
                    i >= this.get("requiredStars") && (this.set("actualStars", this.get("requiredStars")), this.set("done", !0))
                }), episode.scores.each(function(e) {
                    this.set("actualStars", this.get("actualStars") + e.get("stars"))
                }, this), episode.scores.on("change", function(e) {
                    this.set("actualStars", this.get("actualStars") + e.get("stars") - e.previous("stars"))
                }, this), episode.scores.on("add", function(e) {
                    this.set("actualStars", this.get("actualStars") + e.get("stars"))
                }, this)
            }
        }),
        Prizes = Backbone.Collection.extend({
            model: Prize,
            initialize: function() {
                this.on("reset", function() {
                    episode.isBonusWorld() || _.each(Config.prizes, function(e) {
                        this.add(e)
                    }, this)
                }, this)
            }
        }),
        MapBonusLevel = Backbone.Model.extend({
            defaults: {
                refreshInterval: !1,
                removed: !1
            },
            play: function() {
                return this.get("opened") ? this.get("finished") ? (new BonusLevelInfoWindow({
                    type: "finished"
                }), void 0) : this.get("refreshed") ? (user.set({
                    bonusLevelPlayTime: application.getCurrentServerTime()
                }), gameView.start("bonus"), void 0) : (new BonusLevelInfoWindow({
                    type: "notRefreshed"
                }), void 0) : (new BonusLevelInfoWindow({
                    type: "notOpened"
                }), void 0)
            },
            stopRefreshInterval: function() {
                this.get("refreshInterval") !== !1 && (clearInterval(this.get("refreshInterval")), this.set("refreshInterval", !1))
            },
            finish: function() {
                this.set("finished", !0), application.set("page", "main");
                var e = user.get("coins"),
                    i = episode.bonusLevel.get("prize");
                _.each(i, _.bind(function(i) {
                    "coins" == i.type && (e = new ObscureNumber(e.get() + i.amount)), "powerUp" == i.type && user.setPowerUpAmount(i.name, user.getPowerUpAmount(i.name) + i.amount, !0)
                }, this)), user.set({
                    powerUps: user.calcPowerUps(),
                    coins: e,
                    bonusLevelPlayTime: 0,
                    bonusLevelDoneEpisode: episode.get("num"),
                    actionName: "bonusLevelDone",
                    actionEpisode: episode.get("num"),
                    actionLevel: 0,
                    actionPrice: 0
                })
            },
            runRefreshInterval: function() {
                this.get("removed") || (this.stopRefreshInterval(), this.set({
                    refreshed: !1,
                    refreshTimeout: 1
                }), !this.get("finished") && this.get("opened") && "main" === application.get("page") && (this.set("refreshInterval", setInterval(_.bind(function() {
                    this.set("refreshTimeout", user.get("bonusLevelPlayTime") + Config.bonusLevelRefreshTime - application.getCurrentServerTime())
                }, this), 1e3)), this.set("refreshTimeout", user.get("bonusLevelPlayTime") + Config.bonusLevelRefreshTime - application.getCurrentServerTime())))
            },
            init: function(e) {
                if (void 0 === e) return $("#mapBonusLevelBlock").hide(), void 0;
                $("#mapBonusLevelBlock").show(), this.on("change:actualStars", function(e, i) {
                    i >= this.get("requiredStars") && (this.set("actualStars", this.get("requiredStars")), this.set("opened", !0))
                }, this), this.on("change:refreshTimeout", function(e, i) {
                    0 >= i && (this.set("refreshed", !0), this.stopRefreshInterval())
                }, this), user.on("change:bonusLevelPlayTime", this.runRefreshInterval, this), application.on("change:page", this.runRefreshInterval, this), episode.scores.on("change", function(e) {
                    this.set("actualStars", this.get("actualStars") + e.get("stars") - e.previous("stars"))
                }, this), episode.scores.on("add", function(e) {
                    this.set("actualStars", this.get("actualStars") + e.get("stars"))
                }, this);
                var i = new MapBonusLevelView({
                    model: this
                });
                this.set({
                    opened: !1,
                    requiredStars: Config.bonusLevelStars,
                    prize: e.prize
                }), e.finished ? this.set("finished", !0) : this.set("finished", !1), this.set("actualStars", 0), episode.scores.each(function(e) {
                    this.set("actualStars", this.get("actualStars") + e.get("stars"))
                }, this), this.on("change:opened", function() {
                    user.set({
                        bonusLevelPlayTime: 0
                    }), application.once("main", function() {
                        new BonusLevelInfoWindow({
                            type: "nowOpened"
                        })
                    }, this)
                }, this), this.runRefreshInterval(), episode.once("change:num", function() {
                    this.set("removed", !0), this.off(), i.clear(), this.stopRefreshInterval()
                }, this)
            }
        }),
        Windows = function() {
            this.views = []
        };
    Windows.prototype.add = function(e, i) {
        if (i.onTop) this.views.unshift(e), this.up();
        else if (i.urgent)
            if (this.views.length) {
                if (this.views[0].closed) {
                    for (var t = this.views.length - 1; t >= 1; t--) this.views[t + 1] = this.views[t];
                    return this.views[1] = e, void 0
                }
                this.blocked = !0, this.views[0].hide(_.bind(function() {
                    this.views.unshift(e), this.blocked = !1, this.up()
                }, this))
            } else this.views.push(e), this.up();
        else i.firstPriority && this.views.length >= 1 ? this.views.splice(1, 0, e) : this.views.push(e), this.up()
    }, Windows.prototype.closeAll = function() {
        this.anyWindowOpen() && (this.closeRest(), this.views[0].close())
    }, Windows.prototype.closeRest = function() {
        this.anyWindowOpen() && (this.views = this.views.slice(0, 1))
    }, Windows.prototype.remove = function() {
        this.views.shift(), this.views.length ? this.up() : application.trigger("windowsClosed")
    }, Windows.prototype.isOpen = function(e) {
        return 0 == this.views.length ? !1 : this.views[0] instanceof e
    }, Windows.prototype.anyWindowOpen = function() {
        return this.views.length > 0
    }, Windows.prototype.anyVisibleWindow = function() {
        return _.any(this.views, function(e) {
            return e.shown && !e.closed
        })
    }, Windows.prototype.up = function() {
        if (!this.blocked) {
            for (; this.views.length && !this.views[0].canOpenNow();) this.views.shift();
            this.views.length && (this.views[0].trigger("open"), this.views[0].shown || this.views[0].show())
        }
    }, Windows.prototype.runAfterCloseAllWindows = function(e) {
        this.anyWindowOpen() ? application.once("windowsClosed", e) : e()
    };
    var PreloadTask = Backbone.Model.extend({
            defaults: {
                parent: null,
                runned: !1,
                preloaded: 0,
                preloadAmount: 1,
                finish: !1
            },
            run: function() {
                void 0 == this.get("task") && console.log(this), 0 == this.get("preloadAmount") ? this.done() : this.get("task")(_.bind(this.doneSimpleTask, this))
            },
            doneSimpleTask: function() {
                this.get("preloaded") < this.get("preloadAmount") && (this.set("preloaded", this.get("preloaded") + 1), this.get("preloaded") == this.get("preloadAmount") && this.done())
            },
            done: function() {
                this.trigger("done", this)
            }
        }),
        Preloader = Backbone.Collection.extend({
            model: PreloadTask,
            closePrePreloader: function() {
                clearInterval(window.prepreloadInterval), $("#prePreloadPage").remove()
            },
            calcPercent: function() {
                var e = 0,
                    i = 0;
                this.each(function(t) {
                    e += t.get("preloadAmount"), i += t.get("preloaded")
                }), this.trigger("percent", Math.floor(i / e * 100))
            },
            preloadCss: function(e, i) {
                var t = "stylesheet",
                    o = $('<link rel="' + t + '" type="text/css" href="' + e + '" />'),
                    s = _.once(i);
                o.load(s).error(function() {
                    s()
                }), $("head").append(o), "stylesheet" != t ? s() : setTimeout(s, 5e3)
            },
            updateCss: function() {},
            loadSounds: function(e, i, t) {
                var o = function(e) {
                        var i = e.substr(e.lastIndexOf("/") + 1);
                        return i.substr(0, i.indexOf("."))
                    },
                    s = {};
                _.each(i, function(e) {
                    s[o(e)] = [e]
                }), _.each(e, function(e) {
                    s[o(e)].push(e)
                });
                var n = [];
                _.each(s, function(e, i) {
                    var o = e[0];
                    e[1].indexOf(".ogg") >= 0 && (o = e[1]), n.push({
                        id: i,
                        src: o
                    }), sounds[i] = new MySound({
                        url: o,
                        onload: t
                    })
                }), createjs.Sound.registerManifest(n)
            },
            preloadJs: function(e, i) {
                var t = document.createElement("script"),
                    o = !1;
                t.src = e, t.async = !0, t.onload = t.onreadystatechange = function() {
                    o || this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (o = !0, t.onload = t.onreadystatechange = null, t && t.parentNode && (t.parentNode.removeChild(t), i()))
                }, document.head.appendChild(t)
            },
            preloadImage: function(e, i) {
                if (void 0 === e) return i(), void 0;
                var t = $("<img></img>");
                t.load(i).error(function() {
                    console.log("Can't load resource: '" + e + "'"), i()
                }).attr("src", e), $("#preload").append(t)
            },
            run: function() {
                var e = _.bind(function() {
                    this.process()
                }, this);
                if ("undefined" != typeof deviceType && 1 == deviceType && null == winDesktop) return e(), void 0;
                var i = [];
                if (createjs.FlashPlugin.swfPath = "wizq" === network ? baseUrl + "../../base/site/soundmanager/createjs/" : "../../../base/site/soundmanager/createjs/", createjs.Sound.alternateExtensions = ["mp3"], i = "Firefox" === platform.name && platform.version.indexOf("3.6") > -1 ? [createjs.FlashPlugin] : [createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashPlugin], createjs.Sound.registerPlugins(i), createjs.Sound.addEventListener("fileload", function(e) {
                        sounds[e.id] && sounds[e.id].onLoad()
                    }), null === createjs.Sound.activePlugin && soundManagerFailed(), createjs.Sound.activePlugin instanceof createjs.FlashPlugin) {
                    var t = function() {
                        createjs.Sound.activePlugin.flashReady ? e() : setTimeout(t, 100)
                    };
                    t()
                } else e()
            },
            process: function() {
                this.on("change:preloaded", this.calcPercent, this), this.on("done", function(e) {
                    e.set("finish", !0);
                    var i = this.where({
                        parent: e
                    });
                    _.each(i, function(e) {
                        e.set("parent", null)
                    }), 0 == this.where({
                        finish: !1
                    }).length ? this.trigger("complete") : this.runTasks()
                }, this);
                var preloadPageTask = new PreloadTask({
                    name: "preloadPage"
                });
                preloadPageTask.set("task", _.bind(function(e) {
                    for (var i = 0; i < preloadImages.length; i++) application.preloader.preloadImage(preloadImages[i], e);
                    application.preloader.loadSounds(preloadSounds.mp3, preloadSounds.ogg, e)
                }, preloadPageTask)), preloadPageTask.on("done", function() {
                    window.mobile ? "phonegap" == network || navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/Chrome/i) || (application.set("page", "clickToPreloadPage"), application.preloader.closePrePreloader()) : (application.preloader.trigger("loaded"), application.preloader.closePrePreloader())
                }), preloadPageTask.set("preloadAmount", preloadImages.length + preloadSounds.ogg.length), this.add(preloadPageTask);
                var resourcesParentTask = preloadPageTask;
                if (window.mobile) {
                    var touchTask = new PreloadTask({
                        name: "touchTask"
                    });
                    touchTask.set("task", _.bind(function(e) {
                        var i = function() {
                            $("#clickToPreloadPage").off(), application.preloader.trigger("loaded"), window.hideSplashScreen && window.hideSplashScreen(), e(), new MenuSettingsView, production || $("#fpsTest").show()
                        };
                        "phonegap" == network || navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/Chrome/i) ? preloadPageTask.on("done", function() {
                            application.preloader.closePrePreloader(), i()
                        }) : ($("#clickToPreloadPage").hide(), $("#preloadPage").show(), $("#clickToPreloadPage").on("touchstart click", function() {
                            setTimeout(function() {
                                i()
                            }, 100)
                        }))
                    }, touchTask)), this.add(touchTask), resourcesParentTask = touchTask
                }
                var resourcesTask = new PreloadTask({
                        name: "resources",
                        parent: resourcesParentTask
                    }),
                    countJewels = 0;
                resourcesTask.set("task", _.bind(function(e) {
                    for (var i = 0; i < imagesToPreload.length; i++) application.preloader.preloadImage(imagesToPreload[i], e);
                    if (window.jewelryToPreload)
                        for (var i = 0; i < window.jewelryToPreload.length; i++) window.jewelryToPreload[i].indexOf(Config.gemSize) + 1 && (application.preloader.preloadImage(window.jewelryToPreload[i], e), countJewels++);
                    application.preloader.loadSounds(soundsToPreload.mp3, soundsToPreload.ogg, e)
                }, resourcesTask)), resourcesTask.set("preloadAmount", imagesToPreload.length + soundsToPreload.ogg.length + countJewels), this.add(resourcesTask), "undefined" != typeof Config && void 0 !== Config.preloadTasks && _.each(Config.preloadTasks, function(preloadTaskClassName) {
                    var classObj = eval(preloadTaskClassName),
                        task = new classObj;
                    task.get("parentName") && task.set("parent", this.findWhere({
                        name: task.get("parentName")
                    })), this.add(task)
                }, this), this.runTasks()
            },
            runTasks: function() {
                var e = this.where({
                    parent: null,
                    runned: !1
                });
                _.each(e, function(e) {
                    e.set("runned", !0)
                }), _.each(e, function(e) {
                    e.run()
                })
            }
        }),
        AsyncCache = function(e) {
            this.loader = e, this.cache = {}
        };
    AsyncCache.prototype.get = function(e, i, t) {
        return void 0 !== this.cache[e] ? (i(this.cache[e]), !1) : (this.loader(e, _.bind(function(t) {
            this.cache[e] = t, i(this.cache[e])
        }, this), t), !0)
    }, AsyncCache.prototype.set = function(e, i) {
        this.cache[e] = i
    }, AsyncCache.prototype.inCache = function(e) {
        return void 0 !== this.cache[e]
    }, AsyncCache.prototype.changeSubValue = function(e, i, t) {
        this.cache[e][i] = t
    };
    var Result = Backbone.Model.extend({
            initialize: function() {
                this.set("photo", application.USERS[this.id].photo), this.set("name", application.USERS[this.id].first_name)
            }
        }),
        Bot = Result.extend({
            initialize: function() {}
        }),
        Results = Backbone.Collection.extend({
            model: Result,
            addBots: function() {
                _.each(Bots, function(e) {
                    this.add(new Bot(e))
                }, this)
            },
            comparator: function(e) {
                return -e.get("score")
            }
        }),
        StripModelItem = Backbone.Model.extend({
            defaults: {
                id: "",
                checked: !1,
                action: function() {},
                update: function() {},
                processed: !1
            },
            initialize: function() {
                this.get("update").call(this);
                var e = setInterval(_.bind(function() {
                    return this.get("checked") ? (clearInterval(e), void 0) : (!this.get("processed") && application.windows.isOpen(StripWindow) && this.get("update").call(this), void 0)
                }, this), 3e3)
            }
        }),
        StripModel = Backbone.Collection.extend({
            Model: StripModelItem,
            initialize: function() {
                this.revarded = !1, this.on("change:checked", function() {
                    this.isCompleted() && this.trigger("complete")
                }, this)
            },
            getRevard: function() {
                if (this.isCompleted() && !this.revarded) {
                    this.revarded = !0;
                    var e = user.get("strip");
                    return user.set({
                        stripRevard: !0,
                        strip: e + 1,
                        coins: new ObscureNumber(user.get("coins") + Config.stripBonus[e]),
                        actionName: "strip" + (e + 1) + " complete",
                        actionEpisode: user.get("episode"),
                        actionLevel: user.get("level"),
                        actionPrice: 0
                    }), !0
                }
                return !1
            },
            isCompleted: function() {
                return this.every(function(e) {
                    return e.get("checked")
                })
            },
            getCompleteCount: function() {
                return this.where({
                    checked: !0
                }).length
            }
        }),
        stripModel1 = function() {
            return [new StripModelItem({
                id: "install",
                update: function() {
                    this.set("checked", !0)
                }
            }), new StripModelItem({
                id: "status",
                action: function() {
                    promo1(_.bind(function() {
                        this.set("checked", !0)
                    }, this))
                },
                update: function() {
                    checkPromo1(_.bind(function(e) {
                        e && this.set("checked", !0)
                    }, this))
                }
            }), new StripModelItem({
                id: "group",
                action: function(e) {
                    "wizq" !== network && "facebook" !== network && "mobage" !== network && "yahoo" !== network || "A" !== e.target.tagName || this.set("checked", !0)
                },
                editHtml: function() {
                    this.$("a").attr("href", officialGroupUrl)
                },
                update: function() {
                    this.set("processed", !0), inOfficialGroup(_.bind(function(e) {
                        this.set("processed", !1), this.set("checked", e)
                    }, this))
                }
            }), new StripModelItem({
                id: "friend",
                action: function() {
                    user.inviteBestFriends()
                },
                update: function() {
                    friends.length >= 2 && this.set("checked", !0)
                }
            })]
        },
        stripModel2 = function() {
            return [new StripModelItem({
                id: "episode1done",
                update: function() {
                    this.set("checked", !0)
                }
            }), new StripModelItem({
                id: "gifttofriend",
                action: function() {
                    var e = user.getRandomFriendForGift();
                    if (e !== !1) {
                        var i = RANDOM(messages.sendGift),
                            t = function() {
                                user.selectedForGifts = _.without(user.selectedForGifts, e), user.set("sometimeMakeAGift", 1), callService("../../../levelbase/src/services/sendgifts.php", function() {}, function() {}, {
                                    userIds: e,
                                    fromAddMoves: 1
                                }), this.set("checked", !0)
                            };
                        socialNetwork.sendRequest({
                            type: "giftSent",
                            userIds: e,
                            message: i[user.get("gender")],
                            success: _.bind(t, this),
                            veryImportant: !0
                        })
                    }
                },
                update: function() {
                    (user.get("sometimeMakeAGift") || 0 == user.selectedForGifts.length) && this.set("checked", !0)
                }
            }), new StripModelItem({
                id: "shareadlink",
                action: function() {
                    promo2(_.bind(function() {
                        this.set("checked", !0)
                    }, this))
                },
                update: function() {
                    checkPromo2(_.bind(function() {
                        this.set("checked", !0)
                    }, this))
                }
            }), new StripModelItem({
                id: "fivefriends",
                action: function() {
                    user.inviteBestFriends()
                },
                update: function() {
                    friends.length >= 5 && this.set("checked", !0)
                }
            })]
        },
        TWindow = Backbone.View.extend({
            events: {
                "click .close": "close"
            },
            canOpenNow: function() {
                return !0
            },
            onOpenSound: "showwindow",
            fadeDuration: 200,
            initialize: function() {
                (!application.beforeGameStart || this.ignoreBeforeGameStart) && (this.closed = this.shown = !1, this.once("open", this.open, this), application.windows.add(this, this.options))
            },
            onOpen: function() {
                void 0 !== this.options.onOpen && this.options.onOpen.call(this)
            },
            shadowOpenAnimation: function() {
                window.mobile ? $("#windowShadow").show() : $("#windowShadow").is(":visible") ? $("#windowShadow").stop().clearQueue().ourAnimate({
                    opacity: 1
                }, this.fadeDuration) : $("#windowShadow").stop().clearQueue().fadeIn(this.fadeDuration)
            },
            shadowCloseOpenAnimation: function() {
                application.windows.anyVisibleWindow() || (window.mobile ? $("#windowShadow").hide() : $("#windowShadow").stop().clearQueue().fadeOut(this.fadeDuration))
            },
            openAnimation: function() {
                window.mobile ? this.$el.show() : this.$el.fadeIn(this.fadeDuration)
            },
            closeAnimation: function(e) {
                window.mobile ? (this.$el.hide(), setTimeout(e, 0)) : this.$el.fadeOut(this.fadeDuration, e)
            },
            open: function() {
                this.options.templateClass && (this.templateClass = this.options.templateClass);
                var e = $(this.templateClass);
                if (0 == e.length) throw new Error("Template " + this.templateClass + " not found.");
                this.setElement($(e.html())), $(".wrapper").append(this.$el), this.onOpen(), this.show()
            },
            show: function() {
                this.shown || (application.playSound(this.onOpenSound), this.onOpenSound && application.playSound(this.onOpenSound), this.shadowOpenAnimation(), this.shown = !0, this.$el.css({
                    "margin-left": -this.$el.outerWidth() / 2,
                    "margin-top": -this.$el.outerHeight() / 2
                }), this.openAnimation())
            },
            hide: function(e) {
                this.shown && (this.shown = !1, this.closeAnimation(_.bind(function() {
                    this.shadowCloseOpenAnimation(), e && e()
                }, this)))
            },
            close: function() {
                this.closed || (this.closed = !0, this.stopListening(), this.undelegateEvents(), this.shown ? this.closeAnimation(_.bind(function() {
                    this.shadowCloseOpenAnimation(), application.windows.remove(this), this.onClose(), this.$el.remove()
                }, this)) : (application.windows.remove(this), this.onClose(), this.$el.remove()))
            },
            onClose: function() {
                void 0 !== this.options.onClose && this.options.onClose()
            }
        }),
        createByTemplate = function(e) {
            return $($(e).html())
        },
        Episode = Backbone.Model.extend({
            initialize: function() {
                user.on("change:bonusLevelDoneEpisode", function(e, i) {
                    i == this.get("num") && (changeLocalStorageValue("myr_" + i, {
                        scores: [],
                        bonusLevelFinished: 0
                    }, 1, "bonusLevelFinished"), this.cachedEpisodes.get(this.get("num"), _.bind(function(e) {
                        e.about.bonusLevel.finished = !0, this.cachedEpisodes.changeSubValue(this.get("num"), "about", e.about)
                    }, this)))
                }, this), this.cachedEpisodes = new AsyncCache(function(e, i, t) {
                    var o = {},
                        s = function() {
                            var t = function() {
                                var t;
                                t = window.mobile && void 0 !== o.about.mobileResources && o.about.mobileResources.length > 0 ? o.about.mobileResources : o.about.resources;
                                var s = [],
                                    n = {
                                        mp3: [],
                                        ogg: []
                                    },
                                    a = function() {
                                        var i = [];
                                        if (Config.bonusWorld && Config.bonusWorld.name === e) {
                                            for (var t = 1; t <= Config.bonusWorld.available.episode; t++) i.push(t);
                                            return i.push(e), i
                                        }
                                        for (var t = 1; e >= t; t++) i.push(t);
                                        return i
                                    };
                                _.each(a(), function(e) {
                                    if (snowball["episode" + e] && (t = t.concat(snowball["episode" + e]), snowball["episode" + e] = void 0), _.isNumber(e)) {
                                        var i = 10 * Math.floor(e / 10) + "-" + (10 * (Math.floor(e / 10) + 1) - 1);
                                        csssnowball["episodes" + i] && (s.push(csssnowball["episodes" + i]), csssnowball["episodes" + i] = void 0)
                                    } else csssnowball["episode" + e] && (s.push(csssnowball["episode" + e]), csssnowball["episode" + e] = void 0);
                                    soundssnowball["episode" + e] && (n.mp3 = n.mp3.concat(soundssnowball["episode" + e].mp3), n.ogg = n.ogg.concat(soundssnowball["episode" + e].ogg), soundssnowball["episode" + e] = void 0)
                                }), Episode.cacheResources(t, s, n, function() {
                                    var t = function(t) {
                                            var s = Config.levelsInEpisode;
                                            Config.bonusWorld && Config.bonusWorld.name === e && Config.bonusWorld.levelsInEpisode && (s = Config.bonusWorld.levelsInEpisode);
                                            for (var n = 1; s >= n; n++) t[n] ? application.levelResultsCache.set(e + "_" + n, t[n]) : application.levelResultsCache.set(e + "_" + n, []);
                                            i(o)
                                        },
                                        s = friends.filter(function(i) {
                                            return i.id != user.get("userId") && (_.isString(e) || i.get("episode") >= e) ? !0 : !1
                                        }),
                                        n = _.pluck(s, "id");
                                    n = n.slice(0, Math.min(n.length, 100)), n.length > 0 ? callServiceOrLocalStorage("../../../levelbase/src/services/episoderesults.php", t, {
                                        friends: n.join(","),
                                        episode: e
                                    }, "fr_" + e, []) : t([])
                                })
                            };
                            if (o.scores = [], "string" == typeof e || e < user.get("episode") || e == user.get("episode") && user.get("level") > 1) {
                                var s = 0;
                                void 0 !== o.about.bonusLevel && (s = 1), callServiceOrLocalStorage("../../../levelbase/src/services/loadmyepisodescores.php", function(e) {
                                    e.bonusLevelFinished && (o.about.bonusLevel.finished = !0), o.scores = e.scores, t()
                                }, {
                                    episode: e,
                                    checkBonusLevel: s
                                }, "myr_" + e, {
                                    scores: [],
                                    bonusLevelFinished: 0
                                })
                            } else t()
                        },
                        n = function(i, o) {
                            var s = function() {
                                e == user.get("episode") ? fail() : (new ConnectionLostWindow({
                                    close: !0
                                }), t())
                            };
                            application.system && "IE" === application.system.browser && "phonegap" != network ? callService("../../../levelbase/src/services/loadjson.php", o, s, {
                                path: i.substring(i.indexOf("levels") + 7)
                            }) : $.ajax({
                                url: i,
                                dataType: "json",
                                type: "GET",
                                success: o,
                                timeout: 1e4,
                                error: s
                            })
                        };
                    n(episodesData[e].about, function(i) {
                        n(episodesData[e].levels, function(e) {
                            o.about = i, o.levels = e, s()
                        })
                    })
                }), this.scores = new Scores, this.prizes = new Prizes, this.scores.on("change:score", this.updateScoresInCache, this), this.scores.on("reset", this.updateScoresInCache, this), this.scores.on("add", this.updateScoresInCache, this)
            },
            backToFirstLevel: function() {
                this.trigger("backToFirstLevel"), this.scores.reset()
            },
            levelsInEpisode: function() {
                return this.isBonusWorld() && Config.bonusWorld.levelsInEpisode ? Config.bonusWorld.levelsInEpisode : Config.levelsInEpisode
            },
            updateScoresInCache: function() {
                setTimeout(_.bind(function() {
                    this.cachedEpisodes.changeSubValue(this.get("num"), "scores", this.scores.toJSON())
                }, this), 0)
            },
            absoluteLevelNumber: function(e) {
                return this.isBonusWorld() ? e : (this.get("num") - 1) * Config.levelsInEpisode + e
            },
            loaded: function(e) {
                return this.cachedEpisodes.inCache(e)
            },
            isBonusWorld: function() {
                return Config.bonusWorld ? Config.bonusWorld.name === this.get("num") : !1
            },
            load: function(e, i, t) {
                return this.trigger("episodeStartLoad"), this.cachedEpisodes.get(e, _.bind(function(t) {
                    if (this.set({
                            num: e,
                            levels: t.levels,
                            about: t.about
                        }), this.backToFirstLevelSound = void 0, this.isBonusWorld() && Config.bonusWorld.backToFirstLevelAfterFail) {
                        this.backToFirstLevelSound = Config.bonusWorld.backToFirstLevelSound;
                        for (var o = 0; o < t.scores.length; o++)
                            if (0 === t.scores[o].score) {
                                callServiceAddInQueue("../../../levelbase/src/services/removescores.php", {
                                    episode: e
                                }), t.scores = [];
                                break
                            }
                    }
                    if (user.get("episode") >= e && !this.isBonusWorld()) {
                        var s = Config.levelsInEpisode;
                        user.get("episode") == e && (s = user.get("level") - 1);
                        for (var o = 0; o < t.scores.length; o++) t.scores[o].level > s && (s = t.scores[o].level);
                        for (var n = 1; s >= n; n++) {
                            for (var a = !1, o = 0; o < t.scores.length; o++)
                                if (t.scores[o].level == n) {
                                    a = !0;
                                    break
                                }
                            a || t.scores.push({
                                level: n,
                                score: 50
                            })
                        }
                    }
                    this.scores.reset(t.scores), this.prizes.reset(), "undefined" != typeof MapBonusLevel && (this.bonusLevel = new MapBonusLevel, this.bonusLevel.init(t.about.bonusLevel)), fixOperaAnimation(), void 0 !== i && (i(), this.trigger("episodeLoaded"))
                }, this), _.bind(function() {
                    void 0 !== t && t()
                }, this))
            }
        }, {
            cacheResources: function(e, i, t, o) {
                var s = _.after(e.length + t.ogg.length + i.length, function() {
                    application.preloader.updateCss(), o()
                });
                _.each(e, function(e) {
                    application.preloader.preloadImage(e, s)
                }), application.preloader.loadSounds(t.mp3, t.ogg, s), _.each(i, function(e) {
                    application.preloader.preloadCss(e, s)
                })
            }
        }),
        Friend = Backbone.Model.extend({
            defaults: {
                canCollectCoins: !1
            },
            initialize: function() {
                this.set("photo", application.USERS[this.id].photo), this.set("name", application.USERS[this.id].first_name), this.set("gender", application.USERS[this.id].gender), this.set("fullLevel", this.calcFullLevel()), this.on("change:level", function() {
                    this.set("fullLevel", this.calcFullLevel())
                }), this.on("change:canCollectCoins", function() {
                    this.get("canCollectCoins") || (window.collectCoinsFriendTime[this.id] = application.getCurrentServerTime(), setLocalStorage("collectCoinsFriendTime", window.collectCoinsFriendTime))
                }, this)
            },
            calcFullLevel: function() {
                return this.get("level") + Config.levelsInEpisode * (this.get("episode") - 1)
            }
        }),
        Friends = Backbone.Collection.extend({
            model: Friend,
            initialize: function() {
                user.on("change:level", this.updateUser, this)
            },
            upFriendsOnLevelWindow: function() {
                if (1 != user.get("level") && "main" != application.get("page")) {
                    var e = this.get(user.get("userId")).calcFullLevel() - 1;
                    if (!(void 0 !== Config.upFriendsNotifMinLevel && e < Config.upFriendsNotifMinLevel)) {
                        for (var i = this.where({
                            fullLevel: e
                        }), t = [], o = 0; o < i.length; o++) i[o].id !== user.get("userId") && t.push(i[o].id);
                        t.length > 0 && application.once("main", function() {
                            new LevelOvertakenWindow({
                                uids: t
                            })
                        })
                    }
                }
            },
            updateUser: function() {
                this.get(user.get("userId")).set({
                    level: user.get("level"),
                    episode: user.get("episode")
                }), this.upFriendsOnLevelWindow(), this.sort()
            },
            comparator: function(e) {
                return -e.get("fullLevel")
            }
        }),
        InviteFriend = Friend.extend({
            initialize: function() {}
        }),
        FriendsOnPanel = Backbone.Collection.extend({
            model: Friend,
            initialize: function() {
                this.offset = 0, this.size = void 0 === Config.friendsPanelSize ? 6 : Config.friendsPanelSize, this.numElements = Math.max(friends.length + 1, this.size), window.mobile && this.size < this.numElements && (this.size = this.numElements), this.animation = !1, this.frindsForInvite = allUsers.getBestForInvite(), friends.on("sort", this.update, this)
            },
            update: function() {
                this.reset();
                for (var e = 0; e < this.size; e++) this.add(this.getFriendById(e + this.offset));
                this.trigger("update")
            },
            getFriendById: function(e) {
                return e < friends.length ? friends.at(e) : this.makeInvitaion(e - friends.length)
            },
            makeInvitaion: function(e) {
                var i;
                return i = 0 === this.frindsForInvite.length ? null : e < this.frindsForInvite.length ? allUsers.get(this.frindsForInvite[e]) : allUsers.get(RANDOM(this.frindsForInvite)), new InviteFriend({
                    friend: i
                })
            },
            stop: function() {
                this.run = !1
            },
            left: function() {
                this.offset > 0 && !this.animation && (this.run = !0, this.animation = !0, this.offset--, this.pop(), this.unshift(this.getFriendById(this.offset)), this.trigger("left", _.bind(function() {
                    this.animation = !1, this.run && this.left()
                }, this)))
            },
            right: function() {
                this.offset + this.size < this.numElements && !this.animation && (this.run = !0, this.animation = !0, this.offset++, this.shift(), this.push(this.getFriendById(this.offset + this.size - 1)), this.trigger("right", _.bind(function() {
                    this.animation = !1, this.run && this.right()
                }, this)))
            }
        }),
        Strip = Backbone.Model.extend({
            defaults: {
                active: !1
            },
            calcActive: function() {
                if ("phonegap" == network) return 2 == user.get("strip") && "phonegap" != phonegapNetwork && Config.mobilePromo && new MobilePromoDoneWindow, void 0;
                if ((!user.get("stripRevard") || Config.renderStripAfterComplete === !0) && "spmobage" !== network) switch (user.get("strip")) {
                    case 0:
                        if (user.get("level") >= 11 || user.get("episode") > 1) return this.set("active", 1), void 0;
                    case 1:
                        if (user.get("episode") > 1) return this.set("active", 2), void 0;
                    case 2:
                        if (user.get("episode") > 2 && Config.mobilePromo && !window.mobile && ("vkontakte" == network || "odnoklassniki" == network || "test" == network || "facebook" == network)) return this.set("active", 3), void 0
                }
                this.set("active", !1)
            },
            initialize: function() {
                user.on("change:level", this.calcActive, this), user.on("change:strip", this.calcActive, this)
            }
        }),
        oldTWindowOnOpen = TWindow.prototype.onOpen;
    TWindow.prototype.onOpen = function() {
        oldTWindowOnOpen.call(this), "undefined" != typeof episode && this.$el.addClass(episode.get("num") % 2 == 0 ? "evenEpisode" : "oddEpisode")
    };
    var WaitWindow = Backbone.View.extend({
            el: "#waitWindow",
            initialize: function() {
                this.options.decrease ? this.$el.addClass("decrease") : this.$el.removeClass("decrease"), this.$el.fadeIn(300, _.bind(function() {
                    var e = this.options.operation;
                    e && e.call(this, _.bind(this.close, this))
                }, this))
            },
            close: function() {
                this.$el.fadeOut(300)
            }
        }),
        OutOfMovesWindow = TWindow.extend({
            templateClass: ".outOfMovesWindow_template",
            events: {
                "click .outOfMovesBuy": "buy",
                "click .outOfMovesForFriends": "addMovesByFriendGift",
                "click .close": "close"
            },
            onOpenSound: "losegame",
            renderFriend: function() {
                if (gameView.selectedFriendForAddMoves !== !0 && gameView.selectedFriendForAddMoves !== !1) {
                    var e = Config.friendsPanelAvatarSize || Config.basePhotoSize;
                    this.$(".outOfMovesPhoto").html(makeImg(users[gameView.selectedFriendForAddMoves].photo, e)).attr("title", users[gameView.selectedFriendForAddMoves].first_name)
                } else this.$el.removeClass("haveFriendForMoves")
            },
            onOpen: function() {
                gameView.selectedFriendForAddMoves === !0 && (gameView.selectedFriendForAddMoves = user.getRandomFriendForGift()), gameView.selectedFriendForAddMoves !== !1 ? (this.$el.addClass("haveFriendForMoves"), this.renderFriend(), this.$(".addMovesByInviteAmount").html(Config.amountMovesByInviteFriend)) : this.$el.removeClass("haveFriendForMoves"), Game.set("fullRunning", !1), Config.outOfMoves.product ? (this.$(".outOfMovesPrice").html(prices[Config.outOfMoves.product].desc.price), this.$(".inlineCoinBuy").remove(), user.on("buyAddMoves", this.onBuyMovesByMoney, this)) : this.$(".outOfMovesPrice").html(Config.outOfMoves.price + Config.outOfMoves.upPrice * Game.get("buyedMoves")), this.$(".outOfMovesMoves").html(Config.outOfMoves.moves), this.$el.addClass("withoutCounter"), TWindow.prototype.onOpen.call(this)
            },
            addMovesByFriendGift: function() {
                gameView.addMoves(_.bind(function() {
                    TWindow.prototype.close.call(this), Game.set({
                        fullRunning: !0
                    })
                }, this), _.bind(function() {
                    this.renderFriend()
                }, this))
            },
            buyedOperation: function() {
                Game.set("moves", new ObscureNumber(Config.outOfMoves.moves))
            },
            onBuyMovesByMoney: function() {
                this.clear(), TWindow.prototype.close.call(this), this.onBuyMoves()
            },
            onBuyMoves: function() {
                this.buyedOperation(), Game.set({
                    fullRunning: !0,
                    buyedMoves: Game.get("buyedMoves") + 1
                }), Game.trigger("addMoves"), application.playSound("buyMoves")
            },
            clear: function() {
                Config.outOfMoves.product && user.off("buyAddMoves", this.onBuyMovesByMoney)
            },
            buy: function() {
                Config.outOfMoves.product ? showBuy(prices[Config.outOfMoves.product]) : (TWindow.prototype.close.call(this), user.set({
                    coins: new ObscureNumber(user.get("coins") - (Config.outOfMoves.price + Config.outOfMoves.upPrice * Game.get("buyedMoves"))),
                    actionName: "add moves" + (Game.get("buyedMoves") ? Game.get("buyedMoves") : ""),
                    actionEpisode: episode.get("num"),
                    actionLevel: application.level.num,
                    actionPrice: Config.outOfMoves.price + Config.outOfMoves.upPrice * Game.get("buyedMoves")
                }, {
                    validate: !0
                }) ? this.onBuyMoves() : new this.constructor)
            },
            close: function() {
                this.clear(), Game.exit(), TWindow.prototype.close.call(this)
            }
        }),
        BombExplodeWindow = TWindow.extend({
            templateClass: ".bombExplodeWindow_template",
            events: {
                "click .bombExplodeBuy": "buy",
                "click .bombExplodeBuyForFriends": "addBombMovesByFriendGift",
                "click .close": "close"
            },
            onOpenSound: "losegame",
            addBombMovesByFriendGift: function() {
                gameView.addBombMoves(_.bind(function() {
                    TWindow.prototype.close.call(this), Game.set({
                        running: !0,
                        fullRunning: !0
                    })
                }, this), _.bind(function() {
                    this.renderFriend()
                }, this))
            },
            renderFriend: function() {
                this.$(".bombExplodePhoto").html(makeImg(users[gameView.selectedFriendForAddBombMoves].photo, Config.basePhotoSize)).attr("title", users[gameView.selectedFriendForAddBombMoves].first_name)
            },
            onOpen: function() {
                gameView.selectedFriendForAddBombMoves === !0 && (gameView.selectedFriendForAddBombMoves = user.getRandomFriendForGift()), gameView.selectedFriendForAddBombMoves !== !1 ? (this.$el.addClass("haveFriendForBombs"), this.renderFriend()) : this.$el.removeClass("haveFriendForBombs"), Game.has("buyedBombsMoves") || Game.set("buyedBombsMoves", 0), this.$(".bombExplodePrice").html(Config.bombExplode.price + Config.bombExplode.upPrice * Game.get("buyedBombsMoves")), this.$(".bombExplodeMoves").html(Config.bombExplode.moves), this.options.color && this.$el.addClass("color_" + this.options.color), TWindow.prototype.onOpen.call(this)
            },
            buy: function() {
                TWindow.prototype.close.call(this), user.set({
                    coins: new ObscureNumber(user.get("coins") - (Config.bombExplode.price + Config.bombExplode.upPrice * Game.get("buyedBombsMoves"))),
                    actionName: "add bombs" + (Game.get("buyedBombsMoves") ? Game.get("buyedBombsMoves") : ""),
                    actionEpisode: episode.get("num"),
                    actionLevel: application.level.num,
                    actionPrice: Config.bombExplode.price + Config.bombExplode.upPrice * Game.get("buyedBombsMoves")
                }, {
                    validate: !0
                }) ? (BombCell.addBombMoves(Config.bombExplode.moves), Game.set({
                    running: !0,
                    fullRunning: !0,
                    buyedBombsMoves: Game.get("buyedBombsMoves") + 1
                }), application.playSound("buyBombMoves")) : new BombExplodeWindow({
                    color: this.options.color
                })
            },
            close: function() {
                BombCell.explodeBomb(function() {
                    Game.exit()
                }), TWindow.prototype.close.call(this)
            }
        }),
        StatisticWindow = TWindow.extend({
            templateClass: ".statisticWindow_template",
            share: function() {
                if (("facebook" === network || "phonegap" == network && "facebook" == window.phonegapNetwork) && Config.openGraphEnabled && openGraph.levelPassed && !episode.isBonusWorld()) {
                    var e = {};
                    e[openGraph.levelPassed.type] = sprintf(openGraph.levelPassed.url, {
                        level: episode.absoluteLevelNumber(this.score.get("level")),
                        score: this.score.get("score")
                    }), publishStory(openGraph.levelPassed.action, e), this.close()
                } else {
                    var i = messages.levelPassedImage,
                        t = RANDOM(messages.levelPassedMessage);
                    episode.isBonusWorld() && (t = RANDOM(messages[Config.bonusWorld.name + "LevelPassedBonusWorldMessage"]), i = messages[Config.bonusWorld.name + "LevelPassedBonusWorldImage"]);
                    var o = messages.levelPassedCaption[user.get("gender")],
                        s = sprintf(t[user.get("gender")], {
                            score: this.options.score,
                            scoreWord: needWord(this.options.score, messages.scores),
                            level: episode.absoluteLevelNumber(this.score.get("level"))
                        }),
                        n = _.bind(function() {
                            this.close()
                        }, this);
                    doPublication(s, i, o, void 0, n)
                }
            },
            onOpen: function() {
                this.$el.removeClass("levelPassed").removeClass("overtaken").removeClass("highscore").removeClass("vs"), this.score = new Score({
                    level: this.options.level,
                    score: this.options.score
                }), this.$(".statisticLevel").html(episode.absoluteLevelNumber(this.score.get("level"))), this.$(".statisticScore").html(this.score.get("score")), window.mobile && "gems" == Config.project && ($(".statisticScore").attr("data-text", this.score.get("score")), $(".statisticHighscore").attr("data-text", this.score.get("score"))), "phonegap" == network && "facebook" == window.phonegapNetwork && (this.$(".noShareOption.close").hide(), this.$(".publicStatistic.oneWindowBtn").attr("style", "display: block !important"), this.$(".publicStatistic.oneWindowBtn").css("visibility", "visible")), application.levelResultsCache.get(episode.get("num") + "_" + this.options.level, _.bind(function(e) {
                    this.displayResults(e), TWindow.prototype.onOpen.call(this)
                }, this))
            },
            displayResults: function(e) {
                var i = new Results(e);
                i.addBots();
                var t = episode.scores.findWhere({
                    level: this.options.level
                });
                i.add({
                    id: user.get("userId"),
                    score: t.get("score")
                }), this.$("#friendsScoresList").empty();
                var o = i.indexOf(i.get(user.get("userId"))),
                    s = 4,
                    n = s >= o ? s : s - 1,
                    a = 0;
                i.each(function(e, i) {
                    s > a && (e.id === user.get("userId") || n > i) && (this.renderResult(e, i), a++)
                }, this), this.tune(i)
            },
            renderResult: function(e, i) {
                var t = this.$(".invisible .scoresCard").clone();
                e.get("id") == viewerId && t.addClass("self"), t.addClass(i % 2 === 0 ? "odd" : "even"), t.find(".scoresCardPlace").html(i + 1), t.find(".scoresCardPhoto").html(makeImg(e.get("photo"), Config.basePhotoSize)), t.find(".scoresCardName").html(e.get("name")), t.addClass("resultNumber" + (i + 1)), 3 > i && t.find(".scoresCardCup").addClass("cup" + (i + 1)), t.find(".scoresCardScoreBlock").html(e.get("score") + " " + needWord(e.get("score"), messages.scores)), this.$("#friendsScoresList").append(t)
            }
        }),
        StatisticBeforeWindow = StatisticWindow.extend({
            events: {
                "click .close": "close",
                "click .statisticPlayGame": "play"
            },
            play: function() {
                this.onClose = function() {
                    gameView.start(this.options.level) || application.once("windowsClosed", function() {
                        new StatisticBeforeWindow(this.options)
                    }, this)
                }, this.close()
            },
            tune: function(e) {
                application.prev = {
                    place: e.indexOf(e.get(user.get("userId"))),
                    level: this.options.level
                }, this.$(".statisticStarOn").removeClass("statisticStarOn");
                for (var i = 1; i <= this.score.get("stars"); i++) this.$("#statisticStar" + i).addClass("statisticStarOn");
                if (Config.cantPlayOnOldLevels) return this.$el.addClass("levelPassed"), void 0;
                var t = e.first();
                if (t.id === user.get("userId")) this.$el.addClass("highscore"), this.$(".statisticHighscore").html(episode.scores.findWhere({
                    level: this.options.level
                }).get("score"));
                else {
                    this.$el.addClass("vs"), window.results = e;
                    var o = this.$(".statisticMyCard");
                    o.find(".vsCardName").html(user.get("name")), o.find(".vsCardScore").html(this.options.score), o.find(".vsCardPhoto").html(makeImg(user.get("photo"), Config.basePhotoSize)), o = this.$(".statisticFriendCard"), o.find(".vsCardName").html(t.get("name")), o.find(".vsCardScore").text(t.get("score")), o.find(".vsCardPhoto").html(makeImg(t.get("photo"), Config.basePhotoSize))
                }
            }
        }),
        StatisticAfterWindow = StatisticWindow.extend({
            events: {
                "click .close": "close",
                "click .publicStatistic": "share",
                "click .nextLevelStatistic": "playNextLevel"
            },
            backToMain: function() {
                application.set("page", "main")
            },
            onOpen: function() {
                StatisticWindow.prototype.onOpen.call(this);
                var e = this.options.level + 1;
                episode.get("levels")[e] && !episode.scores.findWhere({
                    level: e
                }) ? this.$el.removeClass("alreadyPassed") : this.$el.addClass("alreadyPassed")
            },
            onClose: function() {
                var e = function(e) {
                    return -1 !== e && -2 !== e && -3 !== e
                };
                if (void 0 === Config.overtakenAndChampionWindowsMinLevel || episode.absoluteLevelNumber(this.score.get("level")) >= Config.overtakenAndChampionWindowsMinLevel) {
                    if (0 === this.newPlace && 0 !== this.prevPlace && (e(this.secondPlace.id) || e(this.thirdPlace.id))) return new ChampionWindow({
                        level: this.score.get("level"),
                        places: [this.firstPlace, this.secondPlace, this.thirdPlace],
                        backToMain: this.backToMain
                    }), void 0;
                    if (this.prevUser && e(this.prevUser.id)) return new OvertakenWindow({
                        level: this.score.get("level"),
                        score: this.options.score,
                        overtakenFriend: this.prevUser,
                        myPlace: this.newPlace + 1,
                        friendPlace: this.newPlace + 2,
                        backToMain: this.backToMain
                    }), void 0
                }
                this.backToMain()
            },
            close: function() {
                _.times(this.score.get("stars"), function(e) {
                    this.$("#statisticStar" + (e + 1)).stop().clearQueue().setScale(1).css("z-index", 0)
                }), StatisticWindow.prototype.close.call(this)
            },
            onOpenSound: "finishwindow",
            tune: function(e) {
                application.prev || (application.prev = {}), this.prevPlace = application.prev.place, (void 0 === this.prevPlace || application.prev.level != this.options.level) && (this.prevPlace = e.length - 1), this.$(".statisticStarOn").removeClass("statisticStarOn"), this.starsAnimation(), this.prevUser = !1, this.newPlace = e.indexOf(e.get(user.get("userId"))), this.newPlace < this.prevPlace && (this.prevUser = e.at(e.indexOf(e.get(user.get("userId"))) + 1)), 0 === this.newPlace && (this.firstPlace = e.at(0), this.secondPlace = e.at(1), this.thirdPlace = e.at(2)), this.$el.addClass("levelPassed")
            },
            starsAnimation: function() {
                _.times(this.score.get("stars"), function(e) {
                    this.$("#statisticStar" + (e + 1)).delay(700 * e + 1700).queue(function(i) {
                        application.playSound("star" + (e + 1)), window.mobile && "gems" == Config.project ? $(this).css("z-index", 2).addClass("statisticStarOn") : ($(this).css("z-index", 2).addClass("statisticStarOn").ourAnimate({
                            scale: 4
                        }, 0).ourAnimate({
                            scale: 1
                        }, 300, function() {
                            $(this).css("z-index", "auto")
                        }), i())
                    })
                })
            },
            playNextLevel: function() {
                var e = this.options.level + 1;
                episode.get("levels")[e] && !episode.scores.findWhere({
                    level: e
                }) && (this.backToMain = function() {
                    application.trigger("main");
                    var i = function() {
                        gameView.start(e) && void 0 !== sounds.gamemusic && loopMusic("gamemusic")
                    };
                    application.windows.anyWindowOpen() ? application.once("windowsClosed", i) : i()
                }), this.close()
            }
        });
    StatisticAfterWindow.prototype.tune = function(e) {
        application.prev || (application.prev = {}), this.prevPlace = application.prev.place, (void 0 === this.prevPlace || application.prev.level != this.options.level) && (this.prevPlace = e.length - 1), this.$(".statisticWindowPercentNumber").text(this.score.get("score")), this.$(".statisticStarOn").removeClass("statisticStarOn"), _.times(this.score.get("stars"), function(e) {
            this.$("#statisticStar" + (e + 1)).delay(700 * e + 1200).queue(function(i) {
                application.playSound("star" + (e + 1)), $(this).css("z-index", 2).addClass("statisticStarOn").ourAnimate({
                    scale: 4
                }, 0).ourAnimate({
                    scale: 1
                }, 300, function() {
                    $(this).find(".shine").addClass("animate").delay(600).queue(function(e) {
                        $(this).removeClass("animate"), e()
                    }), $(this).css("z-index", "auto")
                }), i()
            })
        }), this.prevUser = !1, this.newPlace = e.indexOf(e.get(user.get("userId"))), this.newPlace < this.prevPlace && (this.prevUser = e.at(e.indexOf(e.get(user.get("userId"))) + 1)), 0 === this.newPlace && (this.firstPlace = e.at(0), this.secondPlace = e.at(1), this.thirdPlace = e.at(2)), this.$el.addClass("levelPassed")
    };
    var NewEpisodeWindow = TWindow.extend({
            templateClass: ".newEpisodeWindow_template",
            events: {
                "click .close": "close",
                "click #newEpisodeWindowStart": "close"
            },
            close: function() {
                1 === episode.get("num") && application.once("windowsClosed", function() {
                    Config.saveBeginStats && callService("../../../levelbase/src/services/updatebeginstats.php", function() {}, function() {}, {
                        step: "ok_startgame"
                    }), $("#level1").click()
                }), episode.isBonusWorld() && Config.bonusWorld.onClickBonusWorldTutorial && Config.bonusWorld.onClickBonusWorldTutorial(), TWindow.prototype.close.call(this)
            },
            onOpen: function() {
                1 === episode.get("num") && Config.saveBeginStats && callService("../../../levelbase/src/services/updatebeginstats.php", function() {}, function() {}, {
                    step: "tutorial"
                }), this.$el.removeClass().addClass("window"), episode.isBonusWorld() ? (this.$el.addClass("bonusWorldEpisode"), this.$el.addClass("episode_" + episode.get("num")), this.$(".newEpisodeName").html(messages[episode.get("num") + "NewBonusWorldName"]), this.$(".newEpisodeText").html(messages[episode.get("num") + "NewBonusWorldText"]), Config.bonusWorld.onShowBonusWorldTutorial && Config.bonusWorld.onShowBonusWorldTutorial()) : (this.$el.addClass("episode" + user.get("episode")), this.$(".newEpisodeName").html(messages.newEpisodeName[user.get("episode") - 1]), this.$(".newEpisodeText").html(messages.newEpisodeText[user.get("episode") - 1])), TWindow.prototype.onOpen.call(this)
            }
        }),
        FailedWindow = TWindow.extend({
            templateClass: ".failedWindow_template",
            events: {
                "click .close": "close",
                "click .closeBtn": "close",
                "click #replay": "play"
            },
            onOpen: function() {
                void 0 !== sounds.gamemusic && sounds.gamemusic.stop(), this.$("#replay").show(), this.$(".closeBtn").hide(), episode.isBonusWorld() && Config.bonusWorld.backToFirstLevelAfterFail && this.options.level > 1 && (episode.backToFirstLevel(), this.$("#replay").hide(), this.$(".closeBtn").show()), this.$el.addClass("withLifes"), this.options.noAnimation ? this.$(".brokenHeart").addClass("alreadyBroken").removeClass("broken") : this.$(".brokenHeart").removeClass("alreadyBroken").removeClass("broken").delay(700).queue(function(e) {
                    application.playSound("failedWindowLostLife"), $(this).addClass("broken"), e()
                }), TWindow.prototype.onOpen.call(this)
            },
            onClose: function() {
                application.set("page", "main"), user.tryOpenShopRecommendedWindow()
            },
            play: function() {
                this.onClose = function() {
                    gameView.start(this.options.level, application.level.startParams) ? void 0 !== sounds.gamemusic && loopMusic("gamemusic") : application.once("windowsClosed", function() {
                        var e = this.options;
                        e = _.extend(e, {
                            noAnimation: !0
                        }), new FailedWindow(e)
                    }, this)
                }, this.close()
            }
        }),
        PrizeDoneWindow = TWindow.extend({
            templateClass: ".boxOpenedWindow_template",
            events: {
                "click #boxOpenedPublic": "close",
                "click .needPublicCheckbox": "togglePublicCheckbox"
            },
            offPublicCheckbox: function() {
                this.needPublic = !1, this.$(".needPublicCheckbox").removeClass("checkboxOn").addClass("checkboxOff")
            },
            onPublicCheckbox: function() {
                this.needPublic = !0, this.$(".needPublicCheckbox").removeClass("checkboxOff").addClass("checkboxOn")
            },
            togglePublicCheckbox: function() {
                this.needPublic ? this.offPublicCheckbox() : this.onPublicCheckbox()
            },
            initialize: function() {
                return this.options.prize.has("oneOfThreeGame") ? (new PrizeDoneOneOfThreeWindow(this.options), void 0) : (TWindow.prototype.initialize.call(this), void 0)
            },
            onClose: function() {
                if (this.options.prize.execute(), this.needPublic && "spmobage" !== network)
                    if ("facebook" === network && Config.openGraphEnabled && openGraph.prizeDone) {
                        var e = {};
                        e[openGraph.prizeDone.type] = openGraph.prizeDone.url, publishStory(openGraph.prizeDone.action, e)
                    } else user.defaultPublication("pizeDonePublication")
            },
            onOpen: function() {
                this.$(".prizes").empty();
                var e = this.$(".invisible .boxOpenedOnePrize").clone();
                if (e.addClass("boxOpenedWindowCoins"), e.find(".amount").html(this.options.prize.get("coins")), this.$(".prizes").append(e), this.options.prize.get("addPrize")) {
                    var i = this.$(".invisible .boxOpenedOnePrize").clone();
                    i.addClass("boxOpenedWindow" + this.options.prize.get("addPrize").name), i.find(".amount").html(this.options.prize.get("addPrize").amount), this.$(".prizes").append(i)
                }
                this.$("#boxOpenedCoins").html(this.options.prize.get("coins")), this.$(".openBox").removeClass("openBoxAnimation").removeClass("blinkBoxAnimation").removeClass("openBoxAnimationDone"), this.$(".actualStars, .requiredStars").html(this.options.prize.get("requiredStars")), this.onPublicCheckbox(), setTimeout(_.bind(function() {
                    this.$(".openBox").addClass("openBoxAnimation"), setTimeout(_.bind(function() {
                        this.$(".openBox").addClass("openBoxAnimationDone").removeClass("openBoxAnimation").addClass("blinkBoxAnimation")
                    }, this), 750)
                }, this), 500), TWindow.prototype.onOpen.call(this)
            }
        }),
        PrizeDoneOneOfThreeWindow = TWindow.extend({
            templateClass: ".boxOpenedChoiceWindow_template",
            onOpenSound: !1,
            events: {
                "click .box_0": "selectOne",
                "click .box_1": "selectTwo",
                "click .box_2": "selectThree",
                "click .getBoxPrize": "getPrize",
                "click .close": "close",
                "click .needPublicCheckbox": "togglePublicCheckbox"
            },
            offPublicCheckbox: function() {
                this.needPublic = !1, this.$(".needPublicCheckbox").removeClass("checkboxOn").addClass("checkboxOff")
            },
            onPublicCheckbox: function() {
                this.needPublic = !0, this.$(".needPublicCheckbox").removeClass("checkboxOff").addClass("checkboxOn")
            },
            isPowerUpAvalible: function(e) {
                return e.powerUp ? user.getRealLevel() < e.available ? !1 : !0 : !1
            },
            togglePublicCheckbox: function() {
                this.needPublic ? this.offPublicCheckbox() : this.onPublicCheckbox()
            },
            onClose: function() {
                if (this.needPublic && ("spmobage" !== network || "phonegap" == network && "facebook" == window.phonegapNetwork))
                    if (("facebook" === network || "facebook" == window.phonegapNetwork) && Config.openGraphEnabled && openGraph.prizeDone) {
                        var e = {};
                        e[openGraph.prizeDone.type] = openGraph.prizeDone.url, publishStory(openGraph.prizeDone.action, e)
                    } else user.defaultPublication("pizeDonePublication")
            },
            getPrize: function() {
                if (this.selected !== !1 && !this.prizeGetted) {
                    this.prizeGetted = !0, this.options.prize.execute(), this.$(".box_" + this.selected).addClass("disabled"), application.playSound("oneOfThreeBoxOpen");
                    for (var e = 0; 3 > e; e++) this.selected != e && (this.$(".box_" + e).removeClass("disabled").addClass("animated"), this.isPowerUpAvalible(this.options.prize.get("variants")[e]) && this.$(".box_" + e).addClass(this.options.prize.get("variants")[e].powerUp));
                    setTimeout(_.bind(function() {
                        this.$el.removeClass("prizeIsChosen").addClass("otherPrizes");
                        for (var e = 0; 3 > e; e++) this.selected != e && this.$(".box_" + e).removeClass("animated").addClass("opened");
                        "phonegap" == network && "facebook" == window.phonegapNetwork && (this.$(".needPublicBlock").attr("style", "display: block !important"), this.$(".needPublicBlock").css("visibility", "visible"))
                    }, this), this.options.prize.get("openAnimationTimeout"))
                }
            },
            getSelectedPrize: function() {
                return this.options.prize.get("variants")[this.selected]
            },
            setSelected: function(e) {
                if (this.selected === !1) {
                    this.selected = e, this.options.prize.selectOneOfThree(e), this.$(".box_" + this.selected).addClass("animated"), application.playSound("oneOfThreeBoxOpen"), this.isPowerUpAvalible(this.getSelectedPrize()) && this.$(".box_" + this.selected).addClass(this.getSelectedPrize().powerUp);
                    for (var i = 0; 3 > i; i++) this.selected != i && this.$(".box_" + i).addClass("disabled");
                    setTimeout(_.bind(function() {
                        if (this.$(".box_" + this.selected).removeClass("animated").addClass("opened"), this.$(".textPrizeIsChosen .coins").html(this.getSelectedPrize().coins), this.isPowerUpAvalible(this.getSelectedPrize())) {
                            var e = $(".invisible .boxChoicePowerUp").clone();
                            e.find(".amount").html(this.getSelectedPrize().powerUpAmount), e.addClass(this.getSelectedPrize().powerUp), this.$(".textPrizeIsChosen .powerUps").append(e)
                        }
                        for (var i = 0; 3 > i; i++)
                            if (this.$(".box_" + i + " .coins").html(this.options.prize.get("variants")[i].coins), this.isPowerUpAvalible(this.options.prize.get("variants")[i])) {
                                var e = $(".invisible .boxChoicePowerUp").clone();
                                e.find(".amount").html(this.options.prize.get("variants")[i].powerUpAmount), e.addClass(this.options.prize.get("variants")[i].powerUp), this.$(".box_" + i + " .powerUps").append(e)
                            }
                        this.$el.removeClass("prizeNotChosen").addClass("prizeIsChosen"), application.playSound("oneOfThreeBoxOpened")
                    }, this), this.options.prize.get("openAnimationTimeout"))
                }
            },
            selectOne: function() {
                this.setSelected(0)
            },
            selectTwo: function() {
                this.setSelected(1)
            },
            selectThree: function() {
                this.setSelected(2)
            },
            onOpen: function() {
                this.selected = !1, this.onPublicCheckbox(), setTimeout(function() {
                    application.playSound("oneOfThreeWindowOpen")
                }, 0)
            }
        }),
        PrizeClosedWindow = TWindow.extend({
            templateClass: ".boxClosedWindow_template",
            onOpen: function() {
                var e = this.options.prize;
                this.$(".actualStars").text(e.get("actualStars")), this.$(".requiredStars").text(e.get("requiredStars")), this.$(".notEnoughStarsAmount").text(e.get("requiredStars") - e.get("actualStars")), TWindow.prototype.onOpen.apply(this, arguments)
            }
        }),
        ThimbleGameWindow = TWindow.extend({
            templateClass: ".thimbleGameWindow_template",
            onOpenSound: !1,
            events: {
                "click .box_0": "selectOne",
                "click .box_1": "selectTwo",
                "click .box_2": "selectThree",
                "click .takePrize": "takePrize",
                "click .start": "start"
            },
            onClose: function() {},
            start: function() {
                this.options.prize.set("variants", _.shuffle(this.options.prize.get("variants"))), this.$el.removeClass("invite").addClass("shuffle"), this.$(".thimbleGameChoicePrize").addClass("opened"), setTimeout(_.bind(function() {
                    this.$(".thimbleGameChoicePrize").removeClass("opened").addClass("animated"), this.$(".prizesBlock").addClass("animated"), setTimeout(_.bind(function() {
                        this.$(".thimbleGameChoicePrize").removeClass("animated"), this.$(".prizesBlock").removeClass("animated"), this.$el.removeClass("shuffle").addClass("prizeNotChosen")
                    }, this), 600)
                }, this), 600)
            },
            takePrize: function() {
                this.options.prize.execute(), this.close()
            },
            getSelectedPrize: function() {
                return this.options.prize.get("variants")[this.selected]
            },
            applyBoxContent: function() {
                for (var e = 0; 3 > e; e++) {
                    this.$(".box_" + e).removeCalss;
                    var i = this.options.prize.get("variants")[e],
                        t = i.powerUp || i.good || "coins";
                    this.$(".box_" + e).attr("data-prize", t)
                }
            },
            setSelected: function(e) {
                this.selected === !1 && this.$el.hasClass("prizeNotChosen") && (this.applyBoxContent(), this.selected = e, this.options.prize.selectOneOfThree(e), this.$(".box_" + this.selected).addClass("animated"), application.playSound("oneOfThreeBoxOpen"), setTimeout(_.bind(this.afterSelectPrize, this), this.options.prize.get("openAnimationTimeout")))
            },
            afterSelectPrize: function() {
                this.$(".box_" + this.selected).removeClass("animated").addClass("opened");
                var e = this.options.prize.get("coins"),
                    i = "coins",
                    t = this.options.prize.get("addPrize");
                if (t && (i = t.name), this.$(".prize .name").html(messages.thimbleGamePrizes[i]), this.$(".prize .amount").html(e > 0 ? e : ""), this.$(".prize").addClass(i), t) {
                    var o = t.amount || "",
                        s = $(".invisible .boxChoicePowerUp").clone();
                    s.find(".amount").html(o), s.addClass(t.name), this.$(".textPrizeIsChosen .powerUps").append(s)
                }
                this.$el.removeClass("prizeNotChosen").addClass("prizeIsChosen"), application.playSound("oneOfThreeBoxOpened")
            },
            selectOne: function() {
                this.setSelected(0)
            },
            selectTwo: function() {
                this.setSelected(1)
            },
            selectThree: function() {
                this.setSelected(2)
            },
            onOpen: function() {
                this.selected = !1, this.applyBoxContent(), setTimeout(function() {
                    application.playSound("oneOfThreeWindowOpen")
                }, 0)
            }
        }),
        HappyBirthdayWindow = TWindow.extend({
            templateClass: ".happyBirthdayWindow_template",
            onOpenSound: "happybirthday",
            events: {
                "click .thankyou": "close",
                "click .close": "close"
            },
            onClose: function() {
                setLocalStorage("happyBirthdayTime", (new Date).getTime())
            }
        }),
        AreYouSureExitWindow = TWindow.extend({
            templateClass: ".areYouSureExit_template",
            events: {
                "click .close, #continueGame": "close",
                "click #exitGame": "exit"
            },
            onOpen: function() {
                TWindow.prototype.onOpen.call(this)
            },
            exit: function() {
                this.options.onExit(), this.close()
            }
        }),
        HelpFriendsWindow = TWindow.extend({
            templateClass: ".helpFriendsWindow_template",
            events: {
                "click .close": "close",
                "click .helpAllFriends": "helpAllFriends"
            },
            onOpen: function() {
                this.render(), setCookie("helpfriendswindow", 1, new Date((new Date).getTime() + 2592e5).toUTCString()), TWindow.prototype.onOpen.call(this)
            },
            helpAllFriends: function() {
                var e = [];
                _.each(needHelpFriends, _.bind(function(i) {
                    i.get("needHelp") && e.push(i.id)
                }, this)), this.helpTo(e)
            },
            sendHelp: function(e) {
                if (e.length > 0) {
                    for (var i = 0; i < e.length; i++) _.each(needHelpFriends, function(t) {
                        t.id == e[i] && t.set("needHelp", !1)
                    });
                    callService("../../../levelbase/src/services/sendhelp.php", function() {}, function() {}, {
                        userIds: e.join(",")
                    }), this.render()
                }
            },
            helpTo: function(e) {
                if (e.length > 0) {
                    ("mailru" === network || "odnoklassniki" === network || "wizq" === network || "mobage" === network || "spmobage" === network || "facebook" === network || "nk" === network || "phonegap" == network && "facebook" == window.phonegapNetwork || "phonegap" == network && "odnoklassniki" == window.phonegapNetwork) && this.sendHelp(e);
                    var i = RANDOM(messages.helpToFriend),
                        t = _.bind(function(e) {
                            "mailru" === network || "odnoklassniki" === network || "wizq" === network || "mobage" === network || "spmobage" === network || "facebook" === network || "nk" === network || "phonegap" == network && "facebook" == window.phonegapNetwork || "phonegap" == network || "odnoklassniki" == window.phonegapNetwork || this.sendHelp(e), application.playSound("helpFriendsWindowSend")
                        }, this);
                    socialNetwork.sendRequest({
                        type: "helpSent",
                        verb: "send",
                        ogobject: "help",
                        userIds: e,
                        message: i[user.get("gender")],
                        success: t
                    })
                }
            },
            render: function() {
                var e = !1;
                this.$(".friendsNeedHelpList").empty(), _.each(needHelpFriends, _.bind(function(i) {
                    var t = $(".invisible .friendNeedHelp").clone();
                    t.find(".photo").attr("title", i.get("name")).html(makeImg(i.get("photo"), Config.basePhotoSize)), "wizq" !== network && t.find(".needHelpText").html(messages.needHelpText[i.get("gender")]), t.find(".needHelpLevel").html(i.get("fullLevel")), i.get("needHelp") ? e = !0 : t.addClass("helpSended"), t.find(".helpFriend").on("click touchend", _.bind(function() {
                        return i.get("needHelp") && this.helpTo([i.id]), !1
                    }, this)), this.$(".friendsNeedHelpList").append(t)
                }, this)), e ? this.$(".helpAllFriends").removeClass("disabled") : (this.$(".helpAllFriends").addClass("disabled"), $(".helpFriends").fadeOut(500), setTimeout(_.bind(function() {
                    this.close()
                }, this), 1e3))
            }
        }),
        BonusWorldFinishedWindow = TWindow.extend({
            templateClass: ".bonusWorldFinishedWindow_template",
            onOpenSound: !1,
            events: {
                "click .needPublicCheckbox": "togglePublicCheckbox",
                "click .backToMainWorld": "backToMainWorld"
            },
            offPublicCheckbox: function() {
                this.needPublic = !1, this.$(".needPublicCheckbox").removeClass("checkboxOn").addClass("checkboxOff")
            },
            onPublicCheckbox: function() {
                this.needPublic = !0, this.$(".needPublicCheckbox").removeClass("checkboxOff").addClass("checkboxOn")
            },
            togglePublicCheckbox: function() {
                this.needPublic ? this.offPublicCheckbox() : this.onPublicCheckbox()
            },
            backToMainWorld: function() {
                Config.bonusWorld.onBonusWorldBackToMainWorld && Config.bonusWorld.onBonusWorldBackToMainWorld(), this.needPublic && ("middlePrize" == this.options.type ? user.defaultPublication(Config.bonusWorld.name + "BonusWorldPrizeOnLevel" + this.options.level + "Publication") : user.defaultPublication(Config.bonusWorld.name + "BonusWorldDonePublication")), this.close(), "middlePrize" != this.options.type && episodeView.gotoBonusWorld()
            },
            onClose: function() {
                var e = user.get("coins");
                _.each(this.prize, _.bind(function(i) {
                    if ("coins" == i.type && (e = new ObscureNumber(e.get() + i.amount)), "powerUp" == i.type && (user.setPowerUpAmount(i.name, user.getPowerUpAmount(i.name) + i.amount, !0), Game && Game.trigger("powerAmountChanged")), "good" == i.type)
                        for (var t in prices)
                            if ("good" === prices[t].type && prices[t].goodName == i.name) {
                                var o = prices[t];
                                if (goods.isAlreadyBetter(o.goodType, i.amount)) break;
                                goods.goodBuyed(o.goodType, i.amount), callService("../../../levelbase/src/services/giftaction.php", function() {}, function() {}, {
                                    goodName: o.goodName,
                                    workDays: i.amount
                                });
                                var s = ["addThreeMoves", "starInField", "unlimitedKeys"].indexOf(o.goodName);
                                s >= 0 && new ShopWindow({
                                    page: s
                                });
                                break
                            }
                }, this)), user.set({
                    powerUps: user.calcPowerUps(),
                    coins: e,
                    actionName: episode.get("num") + "WorldDone",
                    actionEpisode: 0,
                    actionLevel: 0,
                    actionPrice: 0
                }), Config.bonusWorld.onBonusWorldTakePrize && !this.options.type && Config.bonusWorld.onBonusWorldTakePrize()
            },
            onOpen: function() {
                this.onPublicCheckbox(), "middlePrize" == this.options.type ? (this.prize = this.options.prize, this.$el.addClass("middlePrizeOnLevel_" + this.options.level)) : this.prize = episode.get("about").prize, this.$(".endText").html(messages[Config.bonusWorld.name + "EndBonusWorldText"]), this.$(".windowTitle1").html(messages[episode.get("num") + "BonusWorldPrizeTitle"]), this.$(".windowTitle2").html(messages[episode.get("num") + "BonusWorldFinishedTitle"]), TWindow.prototype.onOpen.call(this), this.$el.addClass("episode_" + episode.get("num")), this.$(".prizes").empty(), _.each(this.prize, _.bind(function(e) {
                    var i = this.$(".invisible .bonusWorldOnePrize").clone();
                    i.find(".amount").html(e.amount), i.addClass(e.cssClass), this.$(".prizes").append(i)
                }, this)), this.options.finished && this.$el.addClass("finished")
            }
        }),
        BonusWorldGroupWindow = TWindow.extend({
            templateClass: ".bonusWorldGroupWindow_template",
            events: {
                "click .close": "close",
                "click .success": "success"
            },
            success: function() {
                if (Config.bonusWorld.withoutWorld === !0) {
                    var e = Config.bonusWorld.suffix || "",
                        i = 1 == getCookie("groupwindow_" + Config.bonusWorld.name + e) ? !0 : !1;
                    i || setCookie("groupwindow_" + Config.bonusWorld.name + e, 1, new Date((new Date).getTime() + 2592e5).toUTCString())
                }
                this.close(), Config.bonusWorld.available.complete(), this.options.success()
            },
            close: function() {
                TWindow.prototype.close.call(this), clearInterval(this.checkInterval)
            },
            onOpen: function() {
                TWindow.prototype.onOpen.call(this), messages[Config.bonusWorld.name + "BonusWorldGroupBtnText"] && this.$(".bonusWorldGroup").html(messages[Config.bonusWorld.name + "BonusWorldGroupBtnText"]), this.$(".bonusWorldGroupText").html(messages[Config.bonusWorld.name + "BonusWorldGroupText"]), this.$(".bonusWorldGroupTitle").html(messages[Config.bonusWorld.name + "BonusWorldGroupTitle"]), Config.bonusWorld.onShowBonusWorldGroupWindow && Config.bonusWorld.onShowBonusWorldGroupWindow(), this.$el.addClass("episode_" + Config.bonusWorld.name), this.$(".bonusWorldGroup").attr("href", Config.bonusWorld.available.groupUrl()), Config.bonusWorld.onClickBonusWorldGroupWindow && this.$(".bonusWorldGroup").click(Config.bonusWorld.onClickBonusWorldGroupWindow), this.checkInterval = setInterval(_.bind(function() {
                    this.options.checkFunction(_.bind(function(e) {
                        e && this.success()
                    }, this))
                }, this), 2e3)
            }
        }),
        BonusWorldCompletedWindow = TWindow.extend({
            templateClass: ".bonusWorldCompletedWindow_template",
            events: {
                "click .close": "close"
            },
            onOpen: function() {
                TWindow.prototype.onOpen.apply(this, arguments), this.$(".title").html(messages[Config.bonusWorld.name + "BonusWorldCompletedTitle"]), this.$(".completedText").html(messages[Config.bonusWorld.name + "BonusWorldCompletedText"]), this.options.link && (this.$(".more").attr("href", this.options.link).html(messages[Config.bonusWorld.name + "BonusWorldCompletedBtnText"]), Config.bonusWorld.onClickBonusWorldCompletedWindow && this.$(".more").click(Config.bonusWorld.onClickBonusWorldCompletedWindow)), Config.bonusWorld.onShowBonusWorldCompletedWindow && Config.bonusWorld.onShowBonusWorldCompletedWindow()
            }
        }),
        BonusWorldMoreInfoWindow = TWindow.extend({
            templateClass: ".bonusWorldMoreInfoWindow_template",
            events: {
                "click .close": "close"
            },
            onOpen: function() {
                TWindow.prototype.onOpen.apply(this, arguments);
                var e = this.options.level;
                this.$(".title").html(messages[Config.bonusWorld.name + "BonusWorldMoreInfoTitle"]), this.$(".infoText").html(messages[Config.bonusWorld.name + "BonusWorldMoreInfoTexts"][e - 1]), this.options.link && (this.$(".more").attr("href", this.options.link).html(messages[Config.bonusWorld.name + "BonusWorldMoreInfoBtnText"]), Config.bonusWorld.onClickBonusWorldMoreInfoWindow && this.$(".more").click(function() {
                    Config.bonusWorld.onClickBonusWorldMoreInfoWindow(e)
                })), Config.bonusWorld.onShowBonusWorldMoreInfoWindow && Config.bonusWorld.onShowBonusWorldMoreInfoWindow(e)
            }
        }),
        LevelOvertakenWindow = TWindow.extend({
            templateClass: ".levelOvertakenWindow_template",
            events: {
                "click .public": "publicAndClose",
                "click .close": "close"
            },
            onOpenSound: "championwindow",
            publicAndClose: function() {
                var e = this.options.uids,
                    i = RANDOM(messages.upFriends),
                    t = episode.absoluteLevelNumber(user.get("level") - 1);
                i = sprintf(i[user.get("gender")], {
                    levelNum: t
                }), "vkontakte" === network && (e = e[0]), socialNetwork.sendRequest({
                    type: "levelOvertaking",
                    userIds: e,
                    message: i,
                    success: _.bind(this.close, this)
                })
            },
            onClose: function() {
                this.$el.removeClass("levelOvertakenAnimation")
            },
            onOpen: function() {
                var e = this.options.uids,
                    i = friends.get(e[0]),
                    t = episode.absoluteLevelNumber(user.get("level") - 1);
                this.$(".myCard .name").html(user.get("name")), this.$(".myCard .photo").html(makeImg(user.get("photo"), Config.basePhotoSize)), this.$(".friendCard .name").html(i.get("name")), this.$(".friendCard .photo").html(makeImg(i.get("photo"), Config.basePhotoSize));
                var o = episode.scores.findWhere({
                    level: user.get("level") - 1
                }).get("stars");
                this.$(".levelPassedOvertaken").removeClass("levelPassed0").removeClass("levelPassed1").removeClass("levelPassed2").removeClass("levelPassed3").addClass("levelPassed" + o).find(".levelNumber").html(t), this.$(".levelNowOvertaken").removeClass("levelNow").find(".levelNumber").html(t + 1), setTimeout(_.bind(function() {
                    this.$el.addClass("levelOvertakenAnimation")
                }, this), 300), TWindow.prototype.onOpen.call(this)
            }
        }),
        AchievementDoneWindow = TWindow.extend({
            templateClass: ".achievmentOpenedWindow_template",
            onOpenSound: "championwindow",
            events: {
                "click #achievmentOpenedPublic": "close",
                "click .needPublicCheckbox": "togglePublicCheckbox"
            },
            offPublicCheckbox: function() {
                this.needPublic = !1, this.$(".needPublicCheckbox").removeClass("checkboxOn").addClass("checkboxOff")
            },
            onPublicCheckbox: function() {
                this.needPublic = !0, this.$(".needPublicCheckbox").removeClass("checkboxOff").addClass("checkboxOn")
            },
            togglePublicCheckbox: function() {
                this.needPublic ? this.offPublicCheckbox() : this.onPublicCheckbox()
            },
            close: function() {
                var e = Config.achievementsParams[this.options.name],
                    i = (new ObscureNumber(user.get("coins") + e[this.options.level].prize), user.achievements.findWhere({
                        name: this.options.name
                    }));
                if (i.set("level", this.options.level + 1), i.isCurrentLevelDone() || window.mobile || new AchievmentsWindow({
                        name: i.get("name"),
                        firstPriority: !0
                    }), this.needPublic && ("spmobage" !== network || "phonegap" == network && "facebook" == window.phonegapNetwork)) {
                    var t = messages[this.options.name + this.options.level + "_achievementDonePublicationMessage"],
                        o = messages[this.options.name + this.options.level + "_achievementDonePublicationImage"],
                        s = messages[this.options.name + this.options.level + "_achievementDonePublicationCaption"];
                    "facebook" !== network && "facebook" != window.phonegapNetwork || !Config.openGraphEnabled ? "yahoo" === network ? publishAchievement(this.options.name + this.options.level) : doPublication(t, o, s) : publishAchievement(sprintf(openGraph.achievement, {
                        type: this.options.name,
                        level: this.options.level + 1
                    }))
                }
                TWindow.prototype.close.call(this)
            },
            onOpen: function() {
                this.onPublicCheckbox();
                var e = Config.achievementsParams[this.options.name];
                this.$(".achievmentImage").removeClass().addClass("achievmentImage").addClass(this.options.name + (this.options.level + 1)), this.$(".achievmentName").html(messages.achievmentTitles[this.options.name][this.options.level]), this.$(".achievmentDescription").html(messages.achievmentNoties[this.options.name][this.options.level]), this.$(".achievmentPrizeAmount").html(e[this.options.level].prize), TWindow.prototype.onOpen.call(this);
                var e = Config.achievementsParams[this.options.name],
                    i = new ObscureNumber(user.get("coins") + e[this.options.level].prize),
                    t = user.achievements.findWhere({
                        name: this.options.name
                    });
                t.set("level", this.options.level + 1), user.set({
                    coins: i,
                    achievements: user.calcChangedAchievements(t.get("order"), t.get("level"))
                }), "phonegap" == network && "facebook" == window.phonegapNetwork && (this.$(".needPublicBlock").attr("style", "display: block !important"), this.$(".needPublicBlock").css("visibility", "visible"), this.$("#achievmentOpenedPublic").css("margin-right", "2%"))
            }
        }),
        NoCoinsWindow = TWindow.extend({
            templateClass: ".notenoughcoinswindow_template",
            events: {
                "click .notEnoughCoinsYesBtn": "buyCoins",
                "click .notEnoughCoinsNoBtn": "close",
                "click .close": "close"
            },
            onOpen: function() {
                this.options.cantAddCoins ? this.$el.addClass("cantAddCoins") : this.$el.removeClass("cantAddCoins")
            },
            buyCoins: function() {
                new AddCoinsWindow({
                    firstPriority: !0
                }), this.close()
            }
        }),
        CoinsExpiredWindow = TWindow.extend({
            templateClass: ".coinsExpiredWindow_template",
            onOpen: function() {
                this.$(".amount").text(user.get("expiredCoins")), TWindow.prototype.onOpen.call(this)
            },
            onClose: function() {
                user.set("coins", new ObscureNumber(Math.max(0, user.get("coins") - user.get("expiredCoins"))), {
                    validate: !0
                }), TWindow.prototype.onClose.call(this)
            }
        }),
        BonusWorldNotAvailableWindow = TWindow.extend({
            templateClass: ".bonusWorldNotAvailableWindow_template",
            events: {
                "click .close": "close",
                "click .closeAndPlay": "close"
            },
            onOpen: function() {
                TWindow.prototype.onOpen.call(this);
                var e = (Config.bonusWorld.available.minEpisodeToEnter - 1) * Config.levelsInEpisode + Config.bonusWorld.available.minLevelToEnter;
                this.$el.find(".bonusWorldMinLevel").html(e)
            }
        }),
        ApplicationBaseView = Backbone.View.extend({
            el: ".wrapper",
            events: {
                "click #coinsBlock": "showAddCoinsWindow",
                "click #menu .sound": "toggleSound",
                "click #menu .music": "toggleMusic",
                "click .fullScreen": "fullScreen",
                "click .exitFullScreen": "exitFullScreen"
            },
            isFullScreen: function() {
                var e = this.fullScreenPrefix();
                if (e !== !1) {
                    if (check = "" == e ? "isFullScreen" : e + "IsFullScreen", void 0 !== document[check]) return document[check];
                    if (check = "" == e ? "fullScreen" : e + "FullScreen", void 0 !== document[check]) return document[check]
                }
                return !1
            },
            fullScreenPrefix: function() {
                if (window.mobile && "odnoklassniki" != network) return !1;
                if (void 0 == document.getElementById("container")) var e = "mainAppWrapper";
                else var e = "container";
                return document.getElementById(e).requestFullScreen ? "" : document.getElementById(e).webkitRequestFullScreen ? "webkit" : document.getElementById(e).mozRequestFullScreen ? "moz" : document.getElementById(e).oRequestFullScreen ? "o" : document.getElementById(e).msRequestFullScreen ? "ms" : !1
            },
            fullScreen: function() {
                var e = this.fullScreenPrefix();
                if (e !== !1) {
                    if (e += "" == e ? "requestFullScreen" : "RequestFullScreen", void 0 == document.getElementById("container")) var i = "mainAppWrapper";
                    else var i = "container";
                    var t = document.getElementById(i)[e];
                    t.call(document.getElementById(i))
                }
            },
            exitFullScreen: function() {
                var e = this.fullScreenPrefix();
                if (e !== !1) {
                    e += "" == e ? "cancelFullScreen" : "CancelFullScreen";
                    var i = document[e];
                    i.call(document)
                }
            },
            toggleSound: function() {
                Settings.toggle("soundEffects")
            },
            toggleMusic: function() {
                Settings.toggle("musicEffects")
            },
            appendBottomMenu: function() {},
            initialize: function() {
                application.on("change:page", function(e, i) {
                    void 0 !== application.previous("page") && $("#" + application.previous("page")).hide(), application.playPageSound(), $("#" + i).show()
                }, this), this.fullScreenPrefix() === !1 ? $(".fullScreen").addClass("disabled") : $(window).resize(function() {
                    "undefined" != typeof canvas && canvas.init && canvas.init(), "undefined" != typeof gameView && gameView.fieldOffset && (gameView.fieldOffset = Figure.field.offset())
                }), new PreloaderView({
                    preloader: application.preloader
                }), Settings.on("change:soundEffects", this.renderSndBtn, this), Settings.on("change:musicEffects", this.renderMusicBtn, this), this.renderSndBtn(Settings, Settings.get("soundEffects")), this.renderMusicBtn(Settings, Settings.get("musicEffects")), this.appendBottomMenu(), $("body").toggleClass("dev", !production)
            },
            renderSndBtn: function(e, i) {
                i ? $(".sound").removeClass("soundOff").addClass("soundOn") : $(".sound").removeClass("soundOn").addClass("soundOff")
            },
            renderMusicBtn: function(e, i) {
                i ? $(".music").removeClass("musicOff").addClass("musicOn") : $(".music").removeClass("musicOn").addClass("musicOff")
            },
            listenToUser: function() {
                this.renderCoins(), user.on("change:coins", function() {
                    this.renderCoins(), void 0 !== user.previous("coins") && user.previous("coins").get() < user.get("coins").get() && application.playSound("buyCoins")
                }, this), user.on("invalid", function(e, i) {
                    switch (i) {
                        case "nocoins":
                            "undefined" != typeof NoCoinsWindow ? new NoCoinsWindow({
                                firstPriority: !0
                            }) : new AddCoinsWindow;
                            break;
                        case "nolives":
                            this.showAddLivesWindow()
                    }
                }, this)
            },
            showAddNoMatterCoinsWindow: function() {
                application.canOpenNotMatterWindow() && new AddCoinsWindow
            },
            showAddCoinsWindow: function() {
                this.$("#coinsBlock").hasClass("disabled") || new AddCoinsWindow
            },
            renderCoins: function() {
                $("#coins").html(user.get("coins").get()), $(".userCoins").html(user.get("coins").get())
            }
        }),
        gameView, ApplicationView = ApplicationBaseView.extend({
            events: {
                "click #coinsBlock": "showAddCoinsWindow",
                "click #livesBlock": "showAddLivesWindow",
                "click #menu .sound": "toggleSound",
                "click #menu .music": "toggleMusic",
                "click #menu .fullScreen": "fullScreen",
                "click #menu .exitFullScreen": "exitFullScreen",
                "click .level": "startLevel",
                "click #ship": "showNextEpisodeWindow",
                "click .shop": "showShopWindow",
                "click .gacha": "showGachaWindow",
                "click #menu .myAchievmentsBtn": "showAchievmentsWindow"
            },
            keyAction: function(e) {
                var i = e.keyCode || e.which;
                if (27 == i) {
                    var t = application.windows.views[application.windows.views.length - 1];
                    t && t.close()
                }
            },
            showNextEpisodeWindow: function() {
                episode.get("num") >= user.get("episode") && new EpisodeLockedWindow
            },
            showShopWindow: function() {
                new ShopWindow
            },
            showGachaWindow: function() {
                new GachaWindow
            },
            showAchievmentsWindow: function() {
                new AchievmentsWindow
            },
            startLevel: function(e) {
                function i(e) {
                    var i = episode.scores.findWhere({
                        level: e
                    });
                    i ? new StatisticBeforeWindow({
                        level: e,
                        score: i.get("score")
                    }) : gameView.start(e)
                }
                var t = parseInt($(e.target).attr("data-level"));
                if (episode.isBonusWorld()) {
                    if (t > episode.levelsInEpisode()) return !1;
                    if (t > episode.scores.length + 1) return !1;
                    if (Config.bonusWorld.levelCheckAvailable) return Config.bonusWorld.levelCheckAvailable(t, i), !1
                } else if (episode.get("num") > user.get("episode") || episode.get("num") == user.get("episode") && t > user.get("level")) return !1;
                i(t)
            },
            initialize: function() {
                ApplicationBaseView.prototype.initialize.call(this), $(".levels").empty();
                for (var e = 1; e <= Config.levelsInEpisode; e++) {
                    var i = $(".invisible .level").clone();
                    i.attr("id", "level" + e), i.attr("data-level", e), i.find(".levelNum").html(e), $(".levels").append(i), i.find(".levelNum").attr("data-level", e), i.find(".levelNowAnimation").attr("data-level", e), i.find(".animationSprite").attr("data-level", e)
                }
                application.once("main", function() {
                    if ($(".viewerId").show().on("click touchend", function() {
                            prompt("User ID:", viewerId)
                        }), $("#menu").show(), new UserView, gameView = new Config.gameViewClass, application.friendsView = new FriendsView, application.friendsPanelView = new FriendsPanelView, $("#addFriendsBonus").on("click touchend", function() {
                            return user.inviteBestFriends(), !1
                        }), $("#addFriendsBonus").addClass("showAddBonus"), user.checkNeedHelpFriends() ? $(".helpFriends").on("click touchend", function() {
                            return new HelpFriendsWindow, !1
                        }) : $(".helpFriends").addClass("disabled"), Config.advertisingNetworks && Config.advertisingNetworks.indexOf(network) > -1 && Config.advertising && Config.advertising.length && _.each(Config.advertising, function(e) {
                            $("." + e + "Advertising").addClass("available").addClass("v" + (Math.floor(2 * Math.random()) + 1));
                            var i = function() {
                                $("." + e + "Advertising").removeClass("blink").addClass("blink").delay(5e3).queue(function(i) {
                                    $("." + e + "Advertising").removeClass("blink"), i()
                                })
                            };
                            i(), setInterval(i, 2e4)
                        }), $(".svyaznoy_quest").length) {
                        var e = !1;
                        if (e && "undefined" != typeof SvyaznoyGroupWindow) {
                            var i = function() {
                                var e = 1 == getCookie("groupwindow_svyaznoy4") ? !0 : !1;
                                e || (setCookie("groupwindow_svyaznoy4", 1, new Date((new Date).getTime() + 2592e5).toUTCString()), new SvyaznoyGroupWindow)
                            };
                            if ("test" == network && ($(".svyaznoy_quest").addClass("available"), i()), "vkontakte" == network) {
                                VK.api("groups.isMember", {
                                    group_id: "11445015",
                                    user_id: viewerId
                                }, function(e) {
                                    1 == e.response && ($(".svyaznoy_quest").addClass("available"), i())
                                }), window.initBrightStat = function() {
                                    window.availableBrightStat = function() {}, $.getScript("//brightstat.freetopay.ru/inp/checkAvailability.php?branding_id=vk_sokrovisha_svyaznoy&user_id=" + user.get("userId") + "&user_data=null&jsonp=availableBrightStat")
                                };
                                var t = calcAge(users[user.get("userId")].bthdate);
                                $.getScript("//brightstat.freetopay.ru/inp/init.php?branding_id=vk_sokrovisha_svyaznoy&user_id=" + user.get("userId") + "&age=" + t + "&sex=" + users[user.get("userId")].sex + "&country=" + users[user.get("userId")].country + "&city=" + users[user.get("userId")].city + "&friends_count=" + allFriendsIds.length + "&jsonp=initBrightStat")
                            }
                            $(".svyaznoy_quest").click(function() {
                                new SvyaznoyGroupWindow
                            })
                        }
                    }
                }), production || $(document).bind("keydown", this.keyAction)
            },
            listenToUser: function() {
                ApplicationBaseView.prototype.listenToUser.call(this), this.renderLives(), user.on("change:showOneMoreLive", this.renderLives, this), user.on("change:lives", this.renderLives, this), user.on("change:timeToNextLife", this.renderLives, this), user.on("createNewGame", this.renderLives, this), user.on("change:shopAvailable", this.renderShopAvailable, this), user.on("change:gachaAvailable", this.renderGachaAvailable, this), user.on("change:additionalLivesAvailable", this.renderAdditionalLivesAvailable, this), user.on("change:myAchievmentsAvailable", this.renderMyAchievmentsAvailable, this)
            },
            renderAdditionalLivesAvailable: function() {
                user.get("additionalLivesAvailable") ? $(".livesAmulet").show() : $(".livesAmulet").hide()
            },
            renderShopAvailable: function() {
                user.get("shopAvailable") ? $(".shopBlock").show().addClass("shopBlockAppear") : $(".shopBlock").hide()
            },
            renderMyAchievmentsAvailable: function() {
                user.get("myAchievmentsAvailable") ? $(".myAchievmentsBlock").show() : $(".myAchievmentsBlock").hide()
            },
            renderGachaAvailable: function() {
                user.get("gachaAvailable") ? $(".gachaBlock").show().addClass("gachaBlockAppear") : $(".gachaBlock").hide()
            },
            renderLives: function() {
                if (!(window.mobile && Game && Game.get("isPlaying"))) {
                    var e = user.get("lives");
                    (Game && Game.get("isPlaying") && "bonus" !== application.level.num || user.get("showOneMoreLive")) && e++, this.$(".lifeProgress").css("width", 100 * e / Config.maxLives + "%"), this.$(".lifesBlockIco").html(e), 0 == e ? $("#addLifesBuy").removeClass("disabled") : $("#addLifesBuy").addClass("disabled"), e < Config.maxLives && user.get("timeToNextLife") >= 0 ? ($("#addLivesTimer").html(formatTime("%i:%s", user.get("timeToNextLife"))), $("#addLivesTimerBlock").removeClass("fullLivesTimer"), $("#addLivesTimerBlock").show(), $("#livesBlock").addClass("timerOn")) : ($("#addLivesTimerBlock").hide(), $("#addLivesTimerBlock").addClass("fullLivesTimer"), $("#addLivesTimer").html(messages.fullLivesTimer), $("#livesBlock").removeClass("timerOn"))
                }
            },
            showAddLivesWindow: function() {
                new AddLivesWindow
            }
        }),
        Game, GameBaseView = Backbone.View.extend({
            el: "#game",
            events: {
                "click #exit": "exit"
            },
            exit: function() {
                new AreYouSureExitWindow({
                    onExit: function() {
                        Game.exit()
                    }
                })
            },
            getCell: function(e) {
                e.originalEvent && e.originalEvent.touches && (e = e.originalEvent.touches[0]);
                var i = e.pageX - this.fieldOffset.left;
                i = Math.floor(i / Config.cellWidth);
                var t = e.pageY - this.fieldOffset.top;
                return t = Math.floor(t / Config.cellHeight), Game.inField(i, t) ? Game.field[t][i].forceDisabled ? !1 : Game.field[t][i] : !1
            },
            onWin: function() {
                this.clear(), Config.noLifesInGame || "bonus" === application.level.num || user.addLifeOnWin(), "bonus" !== application.level.num ? (episode.scores.addOrUpdateScore(application.level.num, Game.get("score")), new StatisticAfterWindow({
                    level: application.level.num,
                    score: Game.get("score")
                })) : new BonusLevelDoneWindow, application.once("change:page", function() {
                    setTimeout(function() {
                        "undefined" != typeof LikeWindow && LikeWindow.shouldBeOpened() && application.canOpenNotMatterWindow() && new LikeWindow
                    }, 0)
                })
            },
            onFail: function() {
                this.clear(), Config.noLifesInGame ? Config.noLifesInGame && application.set("page", "main") : "bonus" !== application.level.num ? (user.addAndRemoveLifeOnLoseGame(), new FailedWindow({
                    level: application.level.num
                })) : new BonusLevelFailWindow
            },
            clear: function() {
                canvas.stop(), sounds.gamemusic && (sounds.gamemusic.stop(), this.prevGameSound && (sounds.gamemusic = this.prevGameSound, this.prevGameSound = !1)), Game.off(), application.playRPG || user.set("usedPowerUps", {})
            },
            beforeStart: function() {
                "bonus" === application.level.num && sounds.bonuslevelmusic && (this.prevGameSound = sounds.gamemusic, sounds.gamemusic = sounds.bonuslevelmusic), void 0 !== episode.get("about").music && (this.prevGameSound = sounds.gamemusic, "string" == typeof episode.get("about").music ? sounds.gamemusic = sounds[episode.get("about").music] : void 0 !== episode.get("about").music[application.level.num] && (sounds.gamemusic = sounds[episode.get("about").music[application.level.num]])), application.set("page", "game")
            },
            afterStart: function() {
                canvas.start(), this.listenToGame(), Game.on("start", fixOperaAnimation), Game.on("win", this.onWin, this), Game.on("fail", this.onFail, this)
            },
            start: function(e, i) {
                if (application.level = episode.get("levels")[e], application.level.num = e, void 0 === i && (i = {}), application.level.startParams = i, user.set("usedPowerUps", {}), !Config.noLifesInGame && "bonus" !== application.level.num && !user.removeLifeOnStartGame()) return !1;
                var t = _.bind(function() {
                    this.beforeStart(), Game = new Config.gameClass, this.afterStart()
                }, this);
                return episode.isBonusWorld() && (Config.bonusWorld.onStartBonusWorldLevel && Config.bonusWorld.onStartBonusWorldLevel(e), Config.bonusWorld.backToFirstLevelAfterFail && e > 1 && callServiceAddInQueue("../../../levelbase/src/services/changescore.php", {
                    episode: episode.get("num"),
                    level: e,
                    score: 0
                }), Config.bonusWorld.eachLevelRandom) ? (new SelectRandomLevelWindow({
                    callback: t,
                    startLevel: e
                }), void 0) : (t(), !0)
            },
            listenToGame: function() {}
        }),
        ThreeInRowBaseView = GameBaseView.extend({
            events: {
                "click #exit": "exit",
                "click .punish": "punishWindow",
                "click .addMoves": "clickAddMoves"
            },
            punishWindow: function() {
                Game.get("fullRunning") && !Game.get("animations") && new PunishWindow
            },
            clickAddMoves: function() {
                this.addMoves(void 0, _.bind(function() {
                    this.renderAddMoves()
                }, this))
            },
            addMoves: function(e, i) {
                function t() {
                    this.addMovesInProcess = !1, Game.set("moves", new ObscureNumber(Game.get("moves").get() + Config.amountMovesByInviteFriend)), application.playSound("addMoves"), callService("../../../levelbase/src/services/sendgifts.php", function() {}, function() {}, {
                        userIds: this.selectedFriendForAddMoves,
                        fromAddMoves: 1
                    }), user.set("sometimeMakeAGift", 1), user.selectedForGifts = _.without(user.selectedForGifts, this.selectedFriendForAddMoves), this.selectedFriendForAddMoves = !1, e && e()
                }

                function o() {
                    this.addMovesInProcess = !1, this.selectedFriendForAddMoves === !0 && (this.selectedFriendForAddMoves = user.getRandomFriendForGift()), i()
                }
                this.addMovesInProcess || (this.addMovesInProcess = !0, this.$(".addMoves").hide(), this.selectedFriendForAddMoves !== !1 && socialNetwork.sendRequest({
                    type: "addMovesThanks",
                    userIds: this.selectedFriendForAddMoves,
                    message: RANDOM(messages.thanksForAddMoves),
                    success: _.bind(t, this),
                    cancel: _.bind(o, this),
                    veryImportant: !0
                }))
            },
            addBombMoves: function(e, i) {
                function t() {
                    this.addBombsInProcess = !1, BombCell.addBombMoves(Config.amountBombMovesByInviteFriend), application.playSound("addBombMoves"), callService("../../../levelbase/src/services/sendgifts.php", function() {}, function() {}, {
                        userIds: this.selectedFriendForAddBombMoves,
                        fromAddMoves: 1
                    }), user.set("sometimeMakeAGift", 1), user.selectedForGifts = _.without(user.selectedForGifts, this.selectedFriendForAddBombMoves), this.selectedFriendForAddBombMoves = !1, e && e()
                }

                function o() {
                    this.addBombsInProcess = !1, this.selectedFriendForAddBombMoves = user.getRandomFriendForGift(), i()
                }
                this.addBombsInProcess || (this.addBombsInProcess = !0, this.selectedFriendForAddBombMoves !== !1 && socialNetwork.sendRequest({
                    type: "addMovesThanks",
                    userIds: this.selectedFriendForAddBombMoves,
                    message: RANDOM(messages.thanksForAddMoves),
                    success: _.bind(t, this),
                    cancel: _.bind(o, this),
                    veryImportant: !0
                }))
            },
            fallDownExplodePiece: function(e) {
                var i, t, o = e.getRealOffset();
                i = 300 - Math.floor(600 * Math.random()), t = Math.floor(400 * Math.random() + 300);
                var s = 1;
                0 > i && (s = -1), e.animate({}, Math.floor(400 * Math.random() + 800), "linear", function() {
                    e.remove()
                }, function(n) {
                    e.css({
                        left: o.left + i * n,
                        top: o.top - t * n + 1500 * n * n,
                        rotate: (200 * n + 600 * n * n) * s
                    })
                })
            },
            createFallDownExplodePiece: function(e, i) {
                var t = createByTemplate(".invisible .fallDownPieceTemplate");
                return t.addClass(e), i && t.addClass(i), Figure.blockedAnimations.append(t), t
            },
            fallDownExplode: function(e, i, t) {
                if (e.length) {
                    for (var o = 1; i >= o; o++) {
                        var s = this.createFallDownExplodePiece(t + o, t);
                        s.alignTo(e), this.fallDownExplodePiece(s), window.mobile && o++
                    }
                    e.remove(), setTimeout(Game.animate(function() {}, Game), 3 * Game.get("speed"))
                }
            },
            clear: function() {
                GameBaseView.prototype.clear.call(this), Game.set("isPlaying", !1), void 0 !== this.powerUpsView && this.powerUpsView.off(), this.tasksView.off()
            },
            beforeStart: function() {
                var e = application.level.num;
                if (GameBaseView.prototype.beforeStart.call(this), application.playRPG || episode.get("about").stack && episode.get("about").stack[e] && (application.level.stack = episode.get("about").stack[e]), "bonus" != e && !application.playRPG) {
                    var i = episode.absoluteLevelNumber(application.level.num);
                    this.$("#currentLevel").text(i).attr("class", function(e, i) {
                        return i.replace(/\bsize\d+\b/g, "")
                    }).addClass("size" + String(i).length)
                }
            },
            initialize: function() {
                this.gameMessageView = new GameMessageView, application.on("change:page", function() {
                    Application.horizontalOrientation ? $("#gameProgressLine").css("height", "0%") : $("#gameProgressLine").css("width", "0%"), $(".scoreMark").removeClass("complete")
                })
            },
            renderExit: function() {
                Game.get("fullRunning") ? $("#exit").show() : $("#exit").hide()
            },
            renderAddMoves: function() {
                this.selectedFriendForAddMoves !== !0 && this.selectedFriendForAddMoves !== !1 ? (this.$(".addMoves").show().find(".friend").attr("title", users[this.selectedFriendForAddMoves].first_name).find(".friendFace").html('<img src="' + users[this.selectedFriendForAddMoves].photo + '"' + tuneImage(Config.basePhotoSize) + "/>"), this.$(".addMoves").find(".amountMoves").html(Config.amountMovesByInviteFriend)) : this.$(".addMoves").hide()
            },
            showAddMoves: function() {
                var e = Game.get("moves").get(),
                    i = Config.addMovesLevel || 0,
                    t = application.level.num + (episode.get("num") - 1) * Config.levelsInEpisode;
                10 > e && Game.get("fullRunning") && t >= i && this.selectedFriendForAddMoves !== !1 && (this.selectedFriendForAddMoves === !0 && (this.selectedFriendForAddMoves = user.getRandomFriendForGift()), Game.once("endTurn", function() {
                    Game.get("fullRunning") && (this.renderAddMoves(), Game.once("change:fullRunning", function() {
                        this.$(".addMoves").hide()
                    }, this))
                }, this), Game.off("change:moves", this.showAddMoves, this))
            },
            createFieldBackground: function() {
                Figure.find("#fieldBlock").empty(), Game.on("createFieldBackground", function(e, i, t) {
                    var o = createByTemplate(".invisible .cellBgTemplate");
                    o.addClass("cellBg_" + (e + i) % 2).setCoords(getItemCoords({
                        x: i,
                        y: e
                    })), t.right && o.addClass("cellBGLastHor"), t.down && o.addClass("cellBGLastVer"), Figure.find("#fieldBlock").append(o)
                })
            },
            createControllers: function() {
                MovesController(), FloorController(), FieldController()
            },
            clearAndHideForNewGame: function() {
                Application.horizontalOrientation ? $("#gameProgressLine").css("height", "0%") : $("#gameProgressLine").css("width", "0%"), $("#gameScore").text(0), $(".scoreMark").removeClass("complete"), this.$(".addMoves").hide(), Game.set("coinsOnFieldProb", 0), $("#game .holder").css({
                    opacity: 0
                }), is_android_browser ? Figure.find("#fieldContainer").css({
                    opacity: 0
                }) : $("#canvas").css({
                    opacity: 0
                }), $("#tasksBlock").hide(), user.trigger("createNewGame")
            },
            createTasks: function() {
                this.tasksView = new TasksView({
                    tasks: new Tasks
                })
            },
            preparePowerUps: function() {
                var e = application.level.num;
                application.playRPG || user.needForceNow() && episode.get("about").force[e][0].powerUpForce && user.setPowerUpAmount(episode.get("about").force[e][0].powerUpForce, 3), this.powerUpsView = new PowerUpsView
            },
            addMovesFromFriendWithoutAnimationIfNeeded: function() {
                2 === user.get("friendsHelpSended") && user.get("level") == application.level.num && user.get("episode") == episode.get("num") && Game.set("moves", new ObscureNumber(Game.get("moves") + Config.friendsHelpMoves))
            },
            addMovesFromFriendAnimationIfNeeded: function(e) {
                if (1 === user.get("friendsHelpSended") && user.get("level") == application.level.num && user.get("episode") == episode.get("num")) {
                    user.set("friendsHelpSended", 2);
                    var i = $(".invisible .plus3MessageBlock").clone();
                    $(".blockedAnimations").append(i), application.playSound("addMovesFromFriend"), i.hide().fadeIn(300).delay(500).queue(function(e) {
                        i.addClass("gameMessageBlockAnimation"), e()
                    }).delay(1e3).queue(function(e) {
                        Game.set("moves", new ObscureNumber(Game.get("moves") + Config.friendsHelpMoves)), e()
                    }).fadeOut(300, function() {
                        i.remove(), e()
                    })
                } else e()
            },
            appearTasks: function(e) {
                var i = this.tasksView.options.tasks,
                    t = $("#tasksBlock");
                t.show().delay(300).queue(function(t) {
                    t(), i.each(_.bind(function(e, i) {
                        e.$div.find(".taskIco").delay(500 * i).queue(function(e) {
                            e(), application.playSound("showTasks")
                        }).ourAnimate({
                            scale: 1.5
                        }, 250).ourAnimate({
                            scale: 1
                        }, 250)
                    }, this)), setTimeout(e, 500 * i.length + 500)
                })
            },
            appearField: function(e) {
                application.playSound("showField"), is_android_browser ? Figure.find("#fieldContainer").ourAnimate({
                    opacity: 1
                }, 1e3, "linear") : $("#canvas").ourAnimate({
                    opacity: 1
                }, 1e3, "linear"), $("#game .holder").ourAnimate({
                    opacity: 1
                }, 1e3, "linear"), setTimeout(e, 1e3)
            },
            forceAndRun: function() {
                user.needForceNow() ? new ForceView({
                    type: episode.get("about").force[application.level.num],
                    step: 1
                }) : (Game.trigger("showMessage", messages.gameStart, "startMessage"), setTimeout(Game.animate(), 1200), Game.set("fullRunning", !0)), application.playedLevels[episode.absoluteLevelNumber(application.level.num)] = !0
            },
            appearSimpleLevel: function() {
                this.createTasks(), this.preparePowerUps(), this.addMovesFromFriendWithoutAnimationIfNeeded(), application.beforeGameStart = !0, this.appearTasks(_.bind(function() {
                    this.appearField(_.bind(function() {
                        this.addMovesFromFriendAnimationIfNeeded(_.bind(this.forceAndRun, this)), Game.start()
                    }, this))
                }, this))
            },
            afterStart: function() {
                GameBaseView.prototype.afterStart.call(this), this.createControllers(), this.clearAndHideForNewGame(), "bonus" === application.level.num && this.prepareBonusLevel(), Game.prepare(), Config.gameControllers(), "bonus" === application.level.num ? this.appearBonusLevel() : this.appearSimpleLevel()
            },
            renderPunish: function() {
                Game.get("moves").get() > Config.punish.showAfterMovesAmount && void 0 !== Config.punish.showAfterMovesAmount || this.showPunish()
            },
            hidePunish: function() {
                Game.punishShowed && ($(".punish").removeClass("appear").removeClass("stable").fadeOut(300), Game.punishAppearTimeout && (clearTimeout(Game.punishAppearTimeout), Game.punishAppearTimeout = !1), Game.punishShowed = !1)
            },
            showPunish: function() {
                Game.punishShowed || (user.get("freePunish") && $(".punish").addClass("free"), $(".punish").css("opacity", 1).show().addClass("appear"), Game.punishAppearTimeout = setTimeout(function() {
                    $(".punish").removeClass("appear"), Game.get("fullRunning") && $(".punish").addClass("stable"), Game.punishAppearTimeout = !1
                }, Config.punish.appearTimeout), Game.punishShowed = !0)
            },
            listenToGame: function() {
                if (application.playRPG ? ($("#game").removeClass().addClass("RPG").addClass("level_" + application.level.num), Figure.field.removeClass().addClass("RPG").addClass("level_" + application.level.num)) : (Figure.blockedAnimations.removeClass("episode_" + episode.get("num")), $("#game").removeClass().addClass("episode_" + episode.get("num")).addClass("level_" + application.level.num), Figure.field.removeClass().addClass("episode_" + episode.get("num")).addClass("level_" + application.level.num), Figure.blockedAnimations.removeClass().addClass("episode_" + episode.get("num")).addClass("level_" + application.level.num)), $(".blockedAnimations").empty(), this.selectedFriendForAddMoves = !0, this.selectedFriendForAddBombMoves = !0, this.gameMessageView.listenToGame(), "undefined" != typeof GameFieldPointsView && new GameFieldPointsView, application.playRPG || Game.on("change:moves", function() {
                        this.showAddMoves()
                    }, this), $(".punish").hide(), void 0 !== Config.punish && (user.get("episode") - 1) * Config.levelsInEpisode + user.get("level") >= Config.punish.minLevel && "bonus" !== application.level.num) {
                    var e = !1;
                    if (Config.punish.disabledNetworks)
                        for (var i = 0; i < Config.punish.disabledNetworks.length; i++)
                            if (network == Config.punish.disabledNetworks[i]) {
                                e = !0;
                                break
                            }
                    e || (Game.on("endTurn", function() {
                        this.renderPunish()
                    }, this), Game.on("change:fullRunning", function() {
                        Game.punishShowed && (Game.get("fullRunning") ? $(".punish").addClass("stable") : $(".punish").removeClass("stable"))
                    }))
                }
                Game.on("change:fullRunning", function() {
                    this.renderExit(), Game.get("fullRunning") ? $("#game").addClass("fullRunningNow") : $("#game").removeClass("fullRunningNow")
                }, this), this.renderExit(), Game.once("change:fullRunning", function() {
                    application.beforeGameStart = !1
                }), Game.on("outOfMoves", function() {
                    new OutOfMovesWindow
                }), this.createFieldBackground(), "bonus" === application.level.num || application.playRPG || (this.scoreObject = new Score({
                    level: application.level.num,
                    score: 0
                }), this.scoreObject.on("change:stars", function(e, i) {
                    for (var t = 1; i >= t; t++) $("#scoreMark" + t).addClass("complete"), t === i && ($("#scoreMark" + t).find(".scoreMarkStars").ourAnimate({
                        scale: 1.5
                    }, 300).ourAnimate({
                        scale: 1
                    }, 300), gameView.lineTimeout = !1, application.playSound("getStar"))
                })), Game.on("vortex", function(e) {
                    application.playSound("vortex");
                    var i = createByTemplate(".invisible .vortexTemplate");
                    Figure.field.append(i), setTimeout(function() {
                        i.fadeOut(200, function() {
                            this.remove(), e()
                        })
                    }, 300)
                })
            }
        }),
        CandyValleyView = ThreeInRowBaseView.extend({
            punish: function() {
                Game.set("suggestSwitch", !1), this.candyGunAnimation(!1, function() {})
            },
            candyGunAnimation: function(e, i) {
                $(".punish").removeClass("stable").addClass("attack"), setTimeout(_.bind(function() {
                    setTimeout(function() {
                        $(".punish").removeClass("attack"), e || $(".punish").addClass("stable")
                    }, 400);
                    var t = (Game.get("moves").get(), []);
                    gameView.tasksView.options.tasks.each(function(e) {
                        e instanceof CollectColor && t.push(e.get("color"))
                    });
                    var o = function(e, i) {
                            return 10 * e + i
                        },
                        s = function(e) {
                            return e instanceof NutCell ? 1 : "none" !== e.getCurrentColor() && t.indexOf(e.color) >= 0 && !e.decorator ? e.coeff + 1 : 0
                        },
                        n = function(e) {
                            for (var i = [], t = []; e > 0;) {
                                for (var n = 0, a = [], r = 0; r < Config.rows; r++)
                                    for (var l = 0; l < Config.cols; l++)
                                        if (!(!Game.inField(l, r) || i.indexOf(o(l, r)) >= 0 || Game.field[r][l].indestructible)) {
                                            for (var d = s(Game.field[r][l]), c = -1; 1 >= c; c++)
                                                for (var u = -1; 1 >= u; u++)
                                                    if (0 !== c || 0 !== u) {
                                                        if (!Game.inField(l + c, r + u) || i.indexOf(o(l + c, r + u)) >= 0) continue;
                                                        d += s(Game.field[r + u][l + c])
                                                    }
                                            d === n ? a.push(Game.field[r][l]) : d > n && (n = d, a = [Game.field[r][l]])
                                        }
                                if (!a.length) return t;
                                var h = _.sample(a);
                                t.push(h), i.push(o(h.x, h.y));
                                for (var c = -1; 1 >= c; c++)
                                    for (var u = -1; 1 >= u; u++)(0 !== c || 0 !== u && Game.inField(h.x + c, h.y + u)) && i.push(o(h.x + c, h.y + u));
                                e--
                            }
                            return t
                        },
                        a = 7,
                        r = n(a);
                    r.length < a && (a = r.length), e && Game.get("moves").get() < a && (a = Game.get("moves").get());
                    _.times(a, function(i) {
                        var t = Game.animate(),
                            o = r[i];
                        e && Game.set("moves", new ObscureNumber(Game.get("moves").get() - 1));
                        var s = createByTemplate(".invisible .fallingCandy");
                        Figure.blockedAnimations.append(s), window.mobile ? s.alignTo($("#moves")) : s.alignTo($(".punish"), {
                            ajust: {
                                left: -48,
                                top: -28
                            }
                        }), s.hide();
                        var n = Math.floor(300 * Math.random() + 200),
                            a = Math.floor(200 * Math.random() + 150);
                        s.delay(100 * i).queue(function(e) {
                            s.show(), application.playSound("leftmovecreate"), e()
                        }).ourAnimate({
                            target: o.$div,
                            animation: Library.collectFly,
                            options: {
                                targetScale: 1,
                                rotate: a,
                                vy: n
                            }
                        }, 800, "linear", function() {
                            this.remove();
                            var e = function(e, i) {
                                    var t = [{
                                        x: 0,
                                        y: 0
                                    }, {
                                        x: 0,
                                        y: 1
                                    }, {
                                        x: 0,
                                        y: -1
                                    }, {
                                        x: 1,
                                        y: 0
                                    }, {
                                        x: -1,
                                        y: 0
                                    }, {
                                        x: 1,
                                        y: 1
                                    }, {
                                        x: 1,
                                        y: -1
                                    }, {
                                        x: -1,
                                        y: 1
                                    }, {
                                        x: -1,
                                        y: -1
                                    }];
                                    _.each(t, function(t) {
                                        var o = e + t.x,
                                            s = i + t.y;
                                        Game.inField(o, s) && Game.inField(o, s).remove()
                                    })
                                },
                                i = createByTemplate(".invisible .leftmoveCandy");
                            Figure.blockedAnimations.append(i), i.alignTo(o.$div), setTimeout(function() {
                                i.addClass("leftMoveExplode").find(".cellStone").addClass("explode"), setTimeout(function() {
                                    i.remove(), application.playSound("leftmoveexplode"), e(o.x, o.y), t()
                                }, 200)
                            }, 400)
                        })
                    }), Game.once("endTurn", i)
                }, this), 500)
            },
            onWin: function() {
                !episode.isBonusWorld() && Config.treasureElementsLevels.indexOf(application.level.num) >= 0 && !episode.scores.findWhere({
                    level: application.level.num
                }) && application.once("main", function() {
                    new EpisodeFoundElementWindow({
                        elementId: Config.treasureElementsLevels.indexOf(application.level.num) + 1
                    })
                }), setTimeout(_.bind(function() {
                    if (0 == Game.get("moves")) setTimeout(_.bind(function() {
                        GameBaseView.prototype.onWin.call(this)
                    }, this), 300);
                    else {
                        var e = _.bind(function() {
                            for (var i = 0, t = 0; t < Config.rows; t++)
                                for (var o = 0; o < Config.cols; o++) Game.field[t][o] && Game.field[t][o].beforeGameFinish() && i++;
                            i ? Game.once("endTurn", function() {
                                e()
                            }) : 0 == Game.get("moves").get() ? setTimeout(_.bind(function() {
                                GameBaseView.prototype.onWin.call(this)
                            }, this), 300) : this.candyGunAnimation(!0, e)
                        }, this);
                        if (!window.mobile) {
                            var i = createByTemplate(".invisible .beforeCandy");
                            Figure.blockedAnimations.append(i.addClass("animated"))
                        }
                        setTimeout(_.bind(function() {
                            window.mobile || i.remove(), Game.punishShowed || window.mobile ? this.candyGunAnimation(!0, e) : (gameView.showPunish(), setTimeout(_.bind(function() {
                                this.candyGunAnimation(!0, e)
                            }, this), Config.punish.appearTimeout))
                        }, this), 600)
                    }
                }, this), 200)
            },
            clear: function() {
                ThreeInRowBaseView.prototype.clear.call(this), clearInterval(this._cellAnimInt), clearInterval(this._pearlWinkInt)
            },
            clearAndHideForNewGame: function() {
                ThreeInRowBaseView.prototype.clearAndHideForNewGame.call(this), window.mobile || $("#gameProgressArrow").setAngle(0)
            },
            afterStart: function() {
                ThreeInRowBaseView.prototype.afterStart.call(this), this.squirrel && delete this.squirrel, application.level.squirrel && (this.squirrel = new Squirrel), this.calculateCandyForRaccoonIfNeeded(), Game.each(function(e) {
                    var i = e.$div.find(".cellStone");
                    i.hasClass("stable") && i.removeClass("stable").addClass("stable")
                })
            },
            drawProgressLine: function() {},
            calculateCandyForRaccoonIfNeeded: function() {
                if ("raccoon" === application.level.bossName) {
                    for (var e = application.level.bossLife, i = 0; i < Config.rows; i++)
                        for (var t = 0; t < Config.cols; t++) "c" == application.level.map[i].charAt(t) && e--;
                    for (var i = 0; e > i; i++) Game.fallDownSpecialCells.push({
                        offset: Math.floor(2 * Math.random() + 1),
                        cellClass: FishCell,
                        type: FishCell.codeToType("c")
                    })
                }
            },
            pearlWink: function() {
                var e = [];
                if (Game.each(function(i) {
                        i instanceof PearlCell && i.life <= 4 && e.push(i)
                    }), e.length > 0) {
                    e = _.shuffle(e);
                    for (var i = e.slice(0, 1), t = 0, o = i.length; o > t; t++) i[t].$div.find(".cellStone").addClass("animated").delay(1e3).queue(function(e) {
                        this.removeClass("animated"), e()
                    })
                }
            },
            listenToGame: function() {
                ThreeInRowBaseView.prototype.listenToGame.call(this), Game.set("cellAnimations", 0), this._pearlWinkInt = setInterval(_.bind(this.pearlWink, this), 1e4), Game.on("change:score", function(e, i) {
                    this.scoreObject.set("score", i);
                    var t = Math.floor(i / application.level.score * 100);
                    if (window.mobile) Application.horizontalOrientation ? $("#gameProgressLine").css({
                        width: "",
                        height: t + "%"
                    }) : $("#gameProgressLine").css({
                        width: t + "%",
                        height: ""
                    });
                    else {
                        var o = 100 >= t ? t : 100;
                        $("#gameProgressLine").css("width", o + "%"), $("#gameProgressArrow").setAngle(Math.floor(-(163 * o / 100) - 17))
                    }
                    $("#gameScore").text(i)
                }, this), Game.off("vortex"), Game.on("vortex", function(e) {
                    if (Game.has("mixer") && Game.get("mixer").isActiveNow) return e(), void 0;
                    application.playSound("shuffle");
                    var i = createByTemplate(".invisible .mixing");
                    Figure.field.append(i), setTimeout(function() {
                        i.fadeOut(100, function() {
                            this.remove(), e()
                        })
                    }, 600)
                }, this)
            }
        }),
        GameMessageView = Backbone.View.extend({
            el: ".wrapper",
            listenToGame: function() {
                Game.on("showMessage", function(e, i) {
                    if (window.mobile && "gems" == Config.project) {
                        $(".gameMessageBlock").remove();
                        var t = $('<div class="gameMessageBlock"><div class="gameMessageBlockBg"></div><span class="gameMessage"></span></div>');
                        return i && t.addClass(i), t.find(".gameMessage").html(e), this.$el.append(t), t.show(), application.playSound("gameMessage"), setTimeout(function() {
                            t.remove()
                        }, 1e3), void 0
                    }
                    $(".gameMessageBlock").remove();
                    var t = $('<div class="gameMessageBlock"><div class="gameMessageBlockBg"></div><span class="gameMessage"></span></div>');
                    i && t.addClass(i), t.find(".gameMessage").html(e), this.$el.append(t), t.hide().fadeIn(300).queue(function(e) {
                        application.playSound("gameMessage"), e()
                    }).delay(700).ourAnimate({
                        opacity: 0
                    }, 300, "linear", function() {
                        $(this).remove()
                    })
                }, this)
            }
        }),
        EpisodeView = Backbone.View.extend({
            el: "#main",
            events: {
                "click #prevMapBtn": "previous",
                "click #nextMapBtn": "next",
                "click #backFromComingSoonEpisode": "backFromComingSoonEpisode",
                "click #myTreasure": "showMyTreasuresWindow",
                "click .livesAmulet": "showAdditionalLivesWindow",
                "click .bonusWorld": "gotoBonusWorld",
                "click .finalPoint": "finalPoint"
            },
            finalPoint: function() {
                episode.isBonusWorld() && new BonusWorldTargetWindow
            },
            showMyTreasuresWindow: function() {
                new MyTreasuresWindow
            },
            showAdditionalLivesWindow: function() {
                new AdditionalLivesWindow
            },
            gotoBonusWorld: function() {
                if (user.get("bonusWorldAvailable"))
                    if (episode.get("num") === Config.bonusWorld.name) this.changeEpisode(this.beforeBonusWorldEpisode);
                    else {
                        Config.bonusWorld.onClickBonusWorldButton && Config.bonusWorld.onClickBonusWorldButton();
                        var e = _.bind(function() {
                            this.beforeBonusWorldEpisode = episode.get("num"), this.changeEpisode(Config.bonusWorld.name, function() {
                                0 == episode.scores.length && Config.bonusWorld.withoutInnerWindow !== !0 && new NewEpisodeWindow
                            })
                        }, this);
                        Config.bonusWorld.available.onEnterCheckFunction ? Config.bonusWorld.available.onEnterCheckFunction(e) : e()
                    }
            },
            initialize: function() {
                episode.on("change", this.render, this), new ScoresView({
                    el: document.getElementById("map")
                }), new PrizesView, user.on("change:bonusWorldAvailable", function() {
                    if (user.get("bonusWorldAvailable")) {
                        if (this.$(".bonusWorldBlock").addClass("available").addClass(Config.bonusWorld.name), $("#main").addClass("bonusWorldShow"), Config.bonusWorld.withoutWorld === !0) {
                            var e = Config.bonusWorld.suffix || "",
                                i = 1 == getCookie("groupwindow_" + Config.bonusWorld.name + e) ? !0 : !1;
                            i || (setCookie("groupwindow_" + Config.bonusWorld.name + e, 1, new Date((new Date).getTime() + 2592e5).toUTCString()), this.$(".bonusWorldBtn").click())
                        }
                    } else this.$(".bonusWorldBlock").removeClass("available"), $("#main").removeClass("bonusWorldShow")
                }, this), user.on("change:episode", function() {
                    this.changeEpisode(user.get("episode"), function() {
                        Config.skipEpisodeWindows || new NewEpisodeWindow
                    })
                }, this)
            },
            render: function() {
                this.$el.removeClass().addClass("episode_" + episode.get("num")), $("#game").removeClass().addClass("episode_" + episode.get("num")), user.get("bonusWorldAvailable") && this.$el.addClass("bonusWorldShow"), episode.isBonusWorld() ? (this.$(".bonusWorldBlock").addClass("inBonusEpisode").removeClass("inMainPage"), Config.bonusWorld.onEnterBonusWorld && Config.bonusWorld.onEnterBonusWorld()) : this.$(".bonusWorldBlock").removeClass("inBonusEpisode").addClass("inMainPage"), 1 != episode.get("num") && !episode.isBonusWorld() || window.mobile ? this.$("#prevMapBtn").show() : this.$("#prevMapBtn").hide(), episode.get("num") == Config.episodesAmount + 1 || episode.isBonusWorld() || window.mobile && episode.get("num") >= user.get("episode") ? this.$("#nextMapBtn").hide() : this.$("#nextMapBtn").show();
                for (var e = 1; e <= episode.levelsInEpisode(); e++) $("#level" + e + " .levelNum").html(episode.absoluteLevelNumber(e));
                this.$el.removeClass("evenEpisode oddEpisode"), episode.get("num") % 2 == 0 ? this.$el.addClass("evenEpisode") : this.$el.addClass("oddEpisode"), this.$(".episodeNumber").text(episode.get("num")), this.$(".episodeTitleOnMain").text(messages.newEpisodeName[episode.get("num") - 1])
            },
            previous: function() {
                this.changeEpisode(episode.get("num") - 1)
            },
            next: function() {
                episode.get("num") < Config.episodesAmount ? this.changeEpisode(episode.get("num") + 1) : this.comingSoonEpisode()
            },
            backFromComingSoonEpisode: function() {
                this.$("#comingSoonEpisode").hide()
            },
            comingSoonEpisode: function() {
                this.$("#comingSoonEpisode").removeClass().show(), (user.get("episode") < Config.episodesAmount || user.get("level") <= Config.levelsInEpisode) && this.$("#comingSoonEpisode").addClass("notAllLevelPassed")
            },
            changeEpisode: function(e, i) {
                var t = !1,
                    o = !1;
                episode.get("about").mainmusic ? o = episode.get("about").mainmusic : sounds.mainmusic && (o = "mainmusic"), episode.get("num") > e && (t = !0);
                var s = _.bind(function() {
                    var e = !1;
                    episode.get("about").mainmusic ? e = episode.get("about").mainmusic : sounds.mainmusic && (e = "mainmusic"), e != o && (o !== !1 && sounds[o].stop(), e !== !1 && loopMusic(e)), this.backFromComingSoonEpisode(), i && i(), this.animation && this.animation()
                }, this);
                if (episode.loaded(e) && !Config.switchEpisodeMinTime) episode.load(e, s);
                else {
                    var n = _.now();
                    new WaitWindow({
                        decrease: t,
                        operation: function() {
                            episode.load(e, _.bind(function() {
                                var e = _.bind(function() {
                                        s(), this.close()
                                    }, this),
                                    i = _.now();
                                !Config.switchEpisodeMinTime || i - n >= Config.switchEpisodeMinTime ? e() : setTimeout(e, Config.switchEpisodeMinTime - (i - n))
                            }, this), _.bind(function() {
                                this.close()
                            }, this))
                        }
                    })
                }
            }
        });
    EpisodeView.prototype._initialize = EpisodeView.prototype.initialize, EpisodeView.prototype.initialize = function() {
        this._initialize.apply(this, arguments);
        for (var e = 0; e < Config.treasureElementsLevels.length; e++) {
            var i = Config.treasureElementsLevels[e];
            this.$(".level#level" + i).addClass("levelWithElement")
        }
    };
    var ForceView = Backbone.View.extend({
            el: "#force",
            addToHolder: function(e) {
                e.hasClass("fieldDisabledCell") ? this.$disabledCellHolder.append(e) : this.$disabledHolder.append(e)
            },
            baseBlackRectangle: function(e, i, t, o) {
                {
                    var s;
                    this.options.type[this.options.step - 1]
                }
                s = createByTemplate(".invisible .forceFieldDisabled"), s.css({
                    width: t + "px",
                    height: o + "px",
                    left: e + "px",
                    top: i + "px"
                }), this.addToHolder(s)
            },
            addPowerUpArrow: function() {
                var e = this.options.type[this.options.step - 1],
                    i = $("#" + e.powerUpForce).offset(),
                    t = $("#game").offset(),
                    o = i.left - t.left,
                    s = i.top - t.top,
                    n = $("#" + e.powerUpForce).width(),
                    a = ($("#" + e.powerUpForce).height(), createByTemplate(".invisible .forceFieldDisabledArrow"));
                a.css({
                    left: o + Math.floor(n / 2) + "px",
                    top: s + "px"
                }), a.addClass(e.powerUpForce + "Arrow"), setTimeout(_.bind(function() {
                    this.addToHolder(a)
                }, this), 0)
            },
            initialize: function() {
                $("#game").addClass("forceNow"), $(".wrapper").addClass("gameForceNow"), this.$disabledHolder = createByTemplate(".invisible .emptyTemplate"), this.$disabledHolder.css({
                    opacity: 0
                }), Figure.blockedAnimations.append(this.$disabledHolder), this.$disabledCellHolder = createByTemplate(".invisible .emptyTemplate"), this.$disabledCellHolder.css({
                    opacity: 0
                }), Figure.blockedAnimations.append(this.$disabledCellHolder), application.windows.closeAll();
                var e = this.options.type[this.options.step - 1];
                this.$el.removeClass().addClass(e.cssClass), this.$(".forceText").html(messages.ForceTexts[e.cssClass]), this.$el.fadeIn(300);
                var i = $("#game .holder").offset(),
                    t = $("#game").offset(),
                    o = i.top - t.top,
                    s = i.left - t.left,
                    n = Config.cellHeight * Config.rows,
                    a = Config.cellWidth * Config.cols;
                this.baseBlackRectangle(0, 0, $("#game").width(), o), this.baseBlackRectangle(0, o + n, $("#game").width(), $("#game").height() - o - n), this.baseBlackRectangle(0, o, s, n), this.baseBlackRectangle(s + a, o, $("#game").width() - s - a, n), e.powerUpForce && this.addPowerUpArrow();
                for (var r = 0; r < Config.rows; r++)
                    for (var l = 0; l < Config.cols; l++) {
                        var d = !1;
                        if (e.cells)
                            for (var c = 0; c < e.cells.length; c++)
                                if (e.cells[c].x == l && e.cells[c].y == r) {
                                    d = !0;
                                    break
                                }
                        if (Game.inField(l, r) && (Game.field[r][l].forceDisabled = void 0), !d || e.powerUpForce) {
                            if (disabledBlock = createByTemplate(".invisible .forceFieldDisabled"), d && e.powerUpForce && disabledBlock.addClass("fieldDisabledCell"), Game.inField(l, r) && !d && (Game.field[r][l].forceDisabled = !0), disabledBlock.css({
                                    width: Config.cellWidth + "px",
                                    height: Config.cellHeight + "px",
                                    left: l * Config.cellWidth + s + "px",
                                    top: r * Config.cellHeight + o + "px"
                                }), e.lightCells) {
                                for (var c = 0; c < e.lightCells.length; c++)
                                    if (e.lightCells[c].x == l && e.lightCells[c].y == r) {
                                        d = !0;
                                        break
                                    }
                                d && disabledBlock.addClass("fieldDisabledNoOpacity")
                            }
                            this.addToHolder(disabledBlock)
                        }
                    }
                var u = function(i) {
                    if (this.options.type.length > this.options.step) new ForceView({
                        type: this.options.type,
                        step: this.options.step + 1
                    });
                    else {
                        for (var t = 0; t < Config.rows; t++)
                            for (var o = 0; o < Config.cols; o++) Game.inField(o, t) && (Game.field[t][o].forceDisabled = void 0);
                        Game.set("fullRunning", !0), $("#game").removeClass("forceNow"), $(".wrapper").removeClass("gameForceNow"), i || Game.trigger("showMessage", messages.forceEnd)
                    }
                    if (e.affectedElements)
                        for (var t = 0; t < e.affectedElements.length; t++) $(e.affectedElements[t]).removeClass("inForce")
                };
                if (!e.cells) {
                    var h = $('<div class="forceButton"></div>'),
                        p = "";
                    p = e.buttonText ? messages.ForceButtonTexts[e.buttonText] : "OK", h.html(p), h.on("click touchend", _.bind(function() {
                        h.off(), $("#game").removeClass("forceNowActive");
                        var e = _.bind(u, this);
                        e(!0), this.$disabledHolder.fadeOut(300, _.bind(function() {
                            this.$disabledHolder.remove()
                        }, this)), this.$disabledCellHolder.fadeOut(300, _.bind(function() {
                            this.$disabledCellHolder.remove()
                        }, this)), this.$el.fadeOut(300)
                    }, this)), this.$(".forceText").append(h)
                }
                if (episode.get("num") % 2 == 0 ? this.$el.addClass("evenEpisode") : this.$el.addClass("oddEpisode"), e.powerUpForce) this.$el.addClass("powerUpForce"), application.forcePowerUp = e.powerUpForce, $("#" + e.powerUpForce).addClass("inForce").addClass("active"), Game.once("change:selectedPowerUp", function() {
                    application.forcePowerUp = !1, $(".fieldDisabledArrow").remove();
                    var i = function() {
                        $(".fieldDisabledArrow").remove(), e.cssClass2 && (this.$el.fadeOut(300), $("#" + e.powerUpForce + " .opacityPowerUpBg").ourAnimate({
                            opacity: 0
                        }, 300, "linear"), this.$disabledHolder.fadeOut(300, _.bind(function() {
                            this.$disabledHolder.remove()
                        }, this)), this.$disabledCellHolder.fadeOut(300, _.bind(function() {
                            this.$disabledCellHolder.remove(), $("#" + e.powerUpForce).removeClass("inForce")
                        }, this))), Game.once("endTurn", u, this)
                    };
                    if (e.cells && e.cssClass2) {
                        var t = e.cells[0],
                            o = Game.field[t.y][t.x].$div.offset(),
                            s = $("#game").offset(),
                            n = o.left - s.left,
                            a = o.top - s.top,
                            r = Config.cellWidth;
                        this.$disabledHolder.find(".fieldDisabledArrow").remove(), disabledBlock = createByTemplate(".invisible .forceFieldDisabledArrow"), disabledBlock.css({
                            left: n + Math.floor(r / 2) + "px",
                            top: a + "px"
                        }), this.addToHolder(disabledBlock), this.$disabledCellHolder.fadeOut(300, _.bind(function() {
                            this.$disabledCellHolder.remove()
                        }, this)), this.$el.removeClass(e.cssClass).addClass(e.cssClass2), this.$(".forceText").html(messages.ForceTexts[e.cssClass2])
                    } else this.$el.fadeOut(300), $("#" + e.powerUpForce + " .opacityPowerUpBg").ourAnimate({
                        opacity: 0
                    }, 300, "linear"), this.$disabledHolder.fadeOut(300, _.bind(function() {
                        this.$disabledHolder.remove()
                    }, this)), this.$disabledCellHolder.fadeOut(300, _.bind(function() {
                        this.$disabledCellHolder.remove(), $("#" + e.powerUpForce).removeClass("inForce")
                    }, this));
                    Game.once("change:selectedPowerUp", i, this)
                }, this);
                else if ($("#game").addClass("forceNowActive"), this.$el.removeClass("powerUpForce"), e.cells) {
                    var g = Game.field[e.cells[0].y][e.cells[0].x],
                        f = Game.field[e.cells[1].y][e.cells[1].x];
                    Game.set("suggest", {
                        first: g,
                        second: f
                    }), Game.once("change:animations", function() {
                        $("#game").removeClass("forceNowActive"), this.$disabledHolder.fadeOut(300, _.bind(function() {
                            this.$disabledHolder.remove()
                        }, this)), this.$disabledCellHolder.fadeOut(300, _.bind(function() {
                            this.$disabledCellHolder.remove()
                        }, this)), this.$el.fadeOut(300), Game.once("endTurn", u, this)
                    }, this)
                }
                if (e.affectedElements)
                    for (var r = 0; r < e.affectedElements.length; r++) $(e.affectedElements[r]).addClass("inForce");
                this.$disabledHolder.fadeIn(300), this.$disabledCellHolder.fadeIn(300)
            }
        }),
        ScoresView = Backbone.View.extend({
            initialize: function() {
                episode.scores.on("reset", function(e) {
                    this.$(".level").removeClass("levelPassed0").removeClass("levelPassed1").removeClass("levelPassed2").removeClass("levelPassed3"), e.each(this.renderScore)
                }, this), episode.scores.on("add", this.renderScore, this), episode.scores.on("change", this.renderScore, this), application.on("run", function() {
                    episode.get("num") == user.get("episode") && episode.scores.length == episode.levelsInEpisode() && (user.get("episode") < Config.episodesAmount ? new EpisodeLockedWindow : episodeView.comingSoonEpisode())
                }, this), episode.scores.on("add", function() {
                    episode.isBonusWorld() ? (Config.bonusWorld.onCompleteBonusWorldLevel && Config.bonusWorld.onCompleteBonusWorldLevel(episode.scores.length), episode.scores.length == episode.levelsInEpisode() && application.once("change:page", function() {
                        Config.bonusWorld.onCompleteBonusWorld()
                    })) : episode.get("num") == user.get("episode") && episode.scores.length == episode.levelsInEpisode() && application.once("change:page", function() {
                        return 2001 === user.getRealLevel() && "undefined" != typeof ThousandthLevelWindow && new ThousandthLevelWindow, episodeView.completeMobile ? (new EpisodeFinishedWindow({
                            onClose: function() {
                                $(".backToMenuMainPage").click(), episodeView.completeMobile()
                            }
                        }), void 0) : (Config.skipEpisodeWindows ? user.get("episode") < Config.episodesAmount ? new EpisodeLockedWindow : episodeView.comingSoonEpisode() : new EpisodeFinishedWindow({
                            onClose: function() {
                                user.get("episode") < Config.episodesAmount ? new EpisodeLockedWindow : episodeView.comingSoonEpisode()
                            }
                        }), void 0)
                    })
                })
            },
            renderScore: function(e) {
                this.$("#level" + e.get("level")).removeClass("levelPassed0").removeClass("levelPassed1").removeClass("levelPassed2").removeClass("levelPassed3").addClass("levelPassed" + e.get("stars"))
            }
        }),
        PrizesView = Backbone.View.extend({
            el: "#main",
            events: {
                "click .box": "clickOnBox"
            },
            initialize: function() {
                episode.prizes.on("change:done", this.done, this), episode.prizes.on("change", this.renderStars, this), episode.prizes.on("reset", function() {
                    episode.isBonusWorld() || (episode.prizes.each(this.render, this), this.renderCurrent())
                }, this)
            },
            done: function(e) {
                application.once("main", function() {
                    this.render(e), this.renderCurrent(), new PrizeDoneWindow({
                        prize: e
                    })
                }, this)
            },
            renderCurrent: function() {
                this.$(".currentBox").removeClass("currentBox");
                var e = !1;
                episode.prizes.each(function(i) {
                    this.$(i.get("cssSelector")).addClass("notCurrentBox"), 0 == e && (e = i), e.get("done") ? i.get("done") ? i.get("requiredStars") > e.get("requiredStars") && (e = i) : e = i : !i.get("done") && i.get("requiredStars") < e.get("requiredStars") && (e = i)
                }, this), this.$(e.get("cssSelector")).removeClass("notCurrentBox").addClass("currentBox")
            },
            renderStars: function(e) {
                this.$(e.get("cssSelector") + " .actualStars").html(e.get("actualStars")), this.$(e.get("cssSelector") + " .requiredStars").html(e.get("requiredStars")), this.$(e.get("cssSelector") + " .boxProgress").css("width", e.get("actualStars") / e.get("requiredStars") * 100 + "%"), Config.prizesNotNeedTitle || (e.get("done") ? this.$(e.get("cssSelector")).attr("title", messages.prizeCollectText) : this.$(e.get("cssSelector")).attr("title", messages.prizeNeedStarsText[0] + e.get("requiredStars") + messages.prizeNeedStarsText[1]))
            },
            render: function(e) {
                e.get("done") ? this.$(e.get("cssSelector")).addClass("done") : this.$(e.get("cssSelector")).removeClass("done"), this.renderStars(e)
            },
            clickOnBox: function(e) {
                if (Config.prizeClosedWindowEnabled) {
                    var i = episode.prizes.findWhere({
                        cssSelector: "#" + e.currentTarget.id
                    });
                    i && !i.get("done") && new PrizeClosedWindow({
                        prize: i
                    })
                }
            }
        }),
        MapBonusLevelView = Backbone.View.extend({
            el: "#mapBonusLevelBlock",
            events: {
                "click .playBonusLevel": "playBonusLevel",
                "click .bonusLevelShine": "playBonusLevel"
            },
            playBonusLevel: function() {
                this.options.model.play()
            },
            clear: function() {
                this.stopListening(), this.undelegateEvents()
            },
            initialize: function() {
                this.options.model.on("change:actualStars", function(e, i) {
                    this.$(".actualStars").html(i)
                }, this), this.options.model.on("change:requiredStars", function(e, i) {
                    this.$(".requiredStars").html(i)
                }, this), this.options.model.on("change:opened", function(e, i) {
                    i ? this.$el.addClass("opened") : this.$el.removeClass("opened")
                }, this), this.options.model.on("change:refreshed", function(e, i) {
                    i ? this.$el.addClass("ready") : this.$el.removeClass("ready")
                }, this), this.options.model.on("change:refreshTimeout", function(e, i) {
                    0 >= i && (i = 0), this.$(".refreshTimeout").html(formatTime("%H:%i:%s", i))
                }, this), this.options.model.on("change:finished", function(e, i) {
                    i ? this.$el.addClass("finished") : this.$el.removeClass("finished")
                }, this)
            }
        }),
        PreloaderView = Backbone.View.extend({
            el: "#preloadPage",
            initialize: function(e) {
                var i = e.preloader;
                i.on("loaded", function() {
                    this.$("#preloadPageText").html(RANDOM(messages.preloadTexts)), application.set("page", "preloadPage")
                }, this), i.on("percent", function(e) {
                    this.render(e)
                }, this), void 0 !== Config.preloaderClasses && this.$el.addClass(Config.preloaderClasses[Math.floor(Math.random() * Config.preloaderClasses.length)])
            },
            render: function(e) {
                window.mobile ? "gems" == Config.project ? this.$("#preloadLineBorder").css("width", e + "%") : this.$("#preloadLineBorder").css("height", e + "%") : this.$("#preloadLine").css("width", e + "%"), this.$("#percent").html(e)
            }
        }),
        FriendsView = Backbone.View.extend({
            el: "#friends",
            initialize: function() {
                this.renderFriends(), episode.on("change", this.renderFriends, this)
            },
            renderFriends: function() {
                var e = friends.where({
                    episode: episode.get("num")
                });
                this.$el.find(".mapPlayerCard").each(function() {
                    friends.trigger("removeMapFriend", $(this))
                }), this.$el.empty();
                var i = {};
                _.each(e, function(e) {
                    e.id === user.get("userId") || e.get("level") > Config.levelsInEpisode || (i[e.get("level")] || (i[e.get("level")] = []), i[e.get("level")].push(e))
                }), _.each(i, function(e) {
                    e.length > 3 && (e = e.slice(0, 3))
                });
                var t = ["firstCard", "secondCard", "thirdCard"];
                _.each(i, function(e, i) {
                    var o = $(".invisible .mapCardBlock").clone(),
                        s = parseInt($("#level" + i).css("left")),
                        n = parseInt($("#level" + i).css("top"));
                    o.css({
                        left: s + "px",
                        top: n + "px"
                    }), o.addClass("level" + i), this.$el.append(o);
                    for (var a = e.length - 1; a >= 0; a--) $friend = $(".invisible .mapPlayerCard").clone(), $friend.addClass(t[a]), $friend.find(".mapAva").html(makeImg(e[a].get("photo"), Config.basePhotoSize)), friends.trigger("addMapFriend", $friend, e[a].id), o.append($friend)
                }, this)
            }
        }),
        FriendsPanelBaseView = Backbone.View.extend({
            el: "#mainFriendsPannel",
            events: {
                "mousedown #prevFriends": "prev",
                "mousedown #nextFriends": "next",
                "mouseout #prevFriends, #nextFriends": "stop",
                "mouseup #prevFriends, #nextFriends": "stop",
                "click .inviteBtn": "inviteFriend"
            },
            prev: function() {
                this.friendsOnPanel.left()
            },
            next: function() {
                this.friendsOnPanel.right()
            },
            stop: function() {
                this.friendsOnPanel.stop()
            },
            inviteFriend: function() {
                socialNetwork.invite()
            },
            initialize: function() {
                var e = this;
                this.cssWidth = Config.friendsPanelViewCssWidth || 100, this.friendsOnPanel = new FriendsOnPanel, this.friendsOnPanel.on("update", this.render, this), this.friendsOnPanel.update(), this.friendsOnPanel.on("left", function(i) {
                    this.renderFriend(this.friendsOnPanel.first(), !0), this.$("#friendList").ourAnimate({
                        left: -this.friendsOnPanel.offset * this.cssWidth + "px"
                    }, 200, "linear", function() {
                        var t = $(this).children().last();
                        e.friendsOnPanel.trigger("removeElement", t), t.remove(), i()
                    })
                }, this), this.friendsOnPanel.on("right", function(i) {
                    this.renderFriend(this.friendsOnPanel.last()), this.$("#friendList").ourAnimate({
                        left: -this.friendsOnPanel.offset * this.cssWidth + "px"
                    }, 200, "linear", function() {
                        var t = $(this).children().first();
                        e.friendsOnPanel.trigger("removeElement", t), t.remove(), i()
                    })
                }, this)
            },
            render: function() {
                this.$("#friendList").empty(), this.friendsOnPanel.each(function(e) {
                    this.renderFriend(e)
                }, this)
            },
            renderFriend: function(e, i) {
                var t, o = this.friendsOnPanel.indexOf(e) + this.friendsOnPanel.offset;
                e instanceof InviteFriend ? (t = this.fillInviteCard(e), this.friendsOnPanel.trigger("renderNewElement", t, void 0)) : (t = this.fillFriendCard(e), this.friendsOnPanel.trigger("renderNewElement", t, e.id)), t.css("left", o * this.cssWidth + "px"), i ? this.$("#friendList").prepend(t) : this.$("#friendList").append(t);
                var s = this.friendsOnPanel.offset > 0,
                    n = this.friendsOnPanel.offset < this.friendsOnPanel.numElements - this.friendsOnPanel.size;
                this.$("#prevFriends").toggleClass("visible", s), this.$("#nextFriends").toggleClass("visible", n)
            },
            fillInviteCard: function() {
                return $(".invisible .friendInviteCard").clone()
            }
        }),
        FriendsPanelView = FriendsPanelBaseView.extend({
            fillFriendCard: function(e) {
                var i = $(".invisible .friendCard").clone(),
                    t = Config.friendsPanelAvatarSize || Config.basePhotoSize;
                if (i.find(".friendCardPhoto").html(makeImg(e.get("photo"), t)), i.find(".friendCardName").html(e.get("name")), i.find(".friendCardLevel").html(e.get("fullLevel")), e.get("fullLevel") > 2e3 ? i.addClass("showMedal2000") : e.get("fullLevel") > 1e3 && i.addClass("showMedal1000"), e.get("canCollectCoins") && Config.collectCoinsAvailable !== !1 && (user.get("episode") > Config.collectCoinsAvailable.episode || user.get("episode") == Config.collectCoinsAvailable.episode && user.get("level") >= Config.collectCoinsAvailable.level)) {
                    var o = function() {
                        o = function() {}, application.playSound("collectCoinsFromFriend"), setTimeout(function() {
                            application.playSound("flightCollectedCoinsFromFriend")
                        }, 500);
                        var t = Config.collectCoinsFromFriend;
                        t > 10 && (t = 10);
                        var s = _.after(t, function() {
                            e.set("canCollectCoins", !1), user.set({
                                coins: new ObscureNumber(user.get("coins") + Config.collectCoinsFromFriend),
                                amountCollectCoinsFromFriends: user.get("amountCollectCoinsFromFriends") + 1
                            })
                        });
                        _.times(t, function() {
                            var e = $(".invisible .flyCollectCoin").clone();
                            $(".blockedAnimations").append(e), e.alignTo(i.find(".collectCoins"), {
                                useMargin: !0
                            }), e.find(".collectCoinsAmount").html(Config.collectCoinsFromFriend);
                            var t = Math.floor(200 * Math.random() - 100),
                                o = Math.floor(200 + 400 * Math.random()),
                                n = Math.floor(1.1 * o),
                                a = function(e) {
                                    return {
                                        top: -o * e + n * e * e,
                                        left: t * e
                                    }
                                },
                                r = 0,
                                l = function() {
                                    this.css = function(i) {
                                        return i = 1 - i, e.setCoords({
                                            top: "+=" + (a(i).top - a(r).top) + "px",
                                            left: "+=" + (a(i).left - a(r).left) + "px"
                                        }), r = i, {}
                                    }
                                };
                            e.animate({
                                path: new l
                            }, 200 * Math.random() + 300, "linear").delay(500 * Math.random()), e.ourAnimate({
                                target: $("#coins")
                            }, 500, "linear", function() {
                                s(), $(this).remove()
                            })
                        }), i.find(".collectCoins").remove()
                    };
                    i.find(".collectCoins").on("click", function(i) {
                        socialNetwork.sendRequest({
                            type: "collectCoinsThanks",
                            userIds: e.id,
                            message: RANDOM(messages.getHelp),
                            success: o
                        }), i.preventDefault()
                    }), user.trigger("canCollectCoins", i.find(".collectCoins"))
                } else i.find(".collectCoins").remove();
                return i
            }
        }),
        MapAnimationsView = Backbone.View.extend({
            el: "#map",
            initialize: function() {
                episode.on("episodeLoaded", this.render, this), application.on("change:page", this.render, this), this.render(), this.runBlinkInterval(), application.on("change:page", this.runBlinkInterval, this), episode.on("episodeLoaded", this.runBlinkInterval, this)
            },
            stopBlinkInterval: function() {
                clearInterval(this.blinkInt)
            },
            runBlinkInterval: function() {
                this.stopBlinkInterval(), "main" == application.get("page") && (this.blinkBox = 0, this.blinkInt = setInterval(_.bind(this.blink, this), 3e3))
            },
            blink: function() {
                $("#box" + (this.blinkBox + 1) + " .boxImg").addClass("boxImgBlink").delay(1e3).queue(function(e) {
                    $(this).removeClass("boxImgBlink"), e()
                }), this.blinkBox = (this.blinkBox + 1) % 3
            },
            render: function() {
                this.$(".mapAnimationsDown").remove(), this.$(".mapAnimationsUp").remove(), "main" == application.get("page") && (this.$el.prepend($(".invisible .mapAnimationsDown").clone()), this.$el.append($(".invisible .mapAnimationsUp").clone()))
            }
        }),
        oldMapAnimationApplicationRun = Application.prototype.run;
    Application.prototype.run = function() {
        oldMapAnimationApplicationRun.call(this), new MapAnimationsView
    };
    var GameFieldPointsView = Backbone.View.extend({
            el: ".blockedAnimations",
            initialize: function() {
                if (!window.mobile) {
                    var e = {},
                        i = {},
                        t = {};
                    Game.on("showFieldPoints", function(o, s, n) {
                        if ("collectTaskElem" != n && o.length > 0) {
                            var a = $('<div class="fieldPoints"></div>');
                            if (this.$el.append(a), a.alignTo(o).css({
                                    opacity: 0
                                }).addClass(n), n.indexOf(" ") > 0 && (n = n.substr(0, n.indexOf(" "))), "damageBoss" == n || "damageBossTask" == n) {
                                var r = n + " " + o.attr("class");
                                void 0 === e[r] && (e[r] = 0, i[r] = 0, t[r] = 0);
                                var l = (new Date).getTime();
                                e[r] > l - 100 ? (i[r] += s, $("." + n + t[r]).remove()) : (i[r] = s, t[r]++), a.addClass(n + t[r]), e[r] = l, a.html("+" + i[r])
                            } else a.html("+" + s);
                            a.ourAnimate({
                                opacity: 1
                            }, 300, "linear").ourAnimate({
                                top: "-=18px"
                            }, 600, "linear").ourAnimate({
                                opacity: 0,
                                top: "-=6px"
                            }, 200, "linear", function() {
                                a.remove()
                            })
                        }
                    }, this)
                }
            }
        }),
        PowerUpsAndCoinsWindowBlock = Backbone.View.extend({
            initialize: function() {
                var e = $('<div class="playerPowerupsItem"></div>');
                e.append($('<div class="playerPowerupItemIco"></div>')), e.append($('<div class="playerPowerupItemAmount amount"></div>')), this.$(".playerPowerupsList").empty();
                for (var i, t = 0; t < Config.powerUpIdsOrder.length; t++) i = e.clone(), i.find(".amount").html(user.getPowerUpAmount(Config.powerUpIdsOrder[t])), i.addClass("player_" + Config.powerUpIdsOrder[t] + "_item"), this.$(".playerPowerupsList").append(i);
                i = e.clone(), i.find(".amount").html(user.get("coins").get()), i.addClass("player_coins_item .amount"), this.$(".playerPowerupsList").append(i), user.on("change:coins", this.changeCoins, this), user.on("change:powerUps", this.changePowerUps, this)
            },
            changeCoins: function() {
                var e = parseInt(this.$(".player_coins_item .amount").html());
                this.changeItemAnimation(".player_coins_item", user.get("coins").get(), user.get("coins").get() - e)
            },
            changePowerUps: function() {
                for (var e = 0; e < Config.powerUpIdsOrder.length; e++) {
                    var i = Config.powerUpIdsOrder[e];
                    if (this.$(".player_" + i + "_item .amount").length) {
                        var t = user.getPowerUpAmount(i),
                            o = parseInt(this.$(".player_" + i + "_item .amount").html());
                        t != o && this.changeItemAnimation(".player_" + i + "_item", t, t - o)
                    }
                }
            },
            close: function() {
                user.off("change:coins", this.changeCoins, this), user.off("change:powerUps", this.changePowerUps, this), this.stopListening()
            },
            changeItemAnimation: function(e, i, t) {
                this.$(e).ourAnimate({
                    scale: 1.3
                }, 300, _.bind(function() {
                    if (this.$(e + " .amount").html(i), !window.mobile) {
                        var o = $('<div class="changeItemDiff"></div>');
                        t > 0 ? t = "+" + t : o.addClass("changeItemDiffTakeMoney"), o.html(t), this.$(e).parent().append(o), o.alignTo(this.$(e)), o.ourAnimate({
                            top: (t > 0 ? "-" : "+") + "=30px",
                            opacity: 0
                        }, 2e3, function() {
                            $(this).remove()
                        })
                    }
                }, this)).ourAnimate({
                    scale: 1
                }, 300)
            }
        }),
        OffersView = Backbone.View.extend({
            findBestOffer: function(e) {
                var i = function(e) {
                    return "test" != network || e.test ? "vkontakte" == network && e.test ? e.testUsers && e.testUsers.indexOf(user.get("userId")) >= 0 ? !0 : !1 : user.get("episode") < e.episode ? !1 : user.get("episode") == e.episode && user.get("level") < e.level ? !1 : void 0 !== e.gender && e.gender != user.get("gender") ? !1 : void 0 !== e.paid && e.paid != user.get("paid") ? !1 : void 0 !== e.country && e.country != users[viewerId].country ? !1 : !0 : !1
                };
                if ("test" == network && !window.mobile) {
                    for (var t = 0; t < Config.offers.length; t++)
                        if (i(Config.offers[t])) return e(Config.offers[t]), void 0;
                    e(!1)
                }
                return "vkontakte" == network ? (VK.api("account.getActiveOffers", {}, function(t) {
                    if (t.response)
                        for (var o = 0; o < Config.offers.length; o++)
                            for (var s = 0; s < t.response.length; s++)
                                if (Config.offers[o].id == t.response[s].id && i(Config.offers[o])) return e(Config.offers[o]), void 0;
                    e(!1)
                }), void 0) : void 0
            },
            showOfferWindow: function() {
                new OfferWindow({
                    offer: this.offer
                }), this.offer.onShowOfferWindow && this.offer.onShowOfferWindow()
            },
            initialize: function() {
                ("vkontakte" === network || "test" === network) && Config.offers && (getCookie("lastCompletedOfferTime") && application.getCurrentServerTime() - getCookie("lastCompletedOfferTime") < 86400 || (this.findBestOffer(_.bind(function(e) {
                    e !== !1 && (this.offer = e, setTimeout(_.bind(function() {
                        application.canOpenNotMatterWindow() && !getCookie("offer_" + e.id) && this.showOfferWindow()
                    }, this), 0), $(".offerButton").addClass("offerButton" + e.name).addClass("active"), $(".offerButton").find(".offerPrize").html("+" + e.prize), $(".offerButton").addClass("offerButton" + e.name).on("click touchend", _.bind(function() {
                        return this.showOfferWindow(), this.offer.onClickOfferButton && this.offer.onClickOfferButton(), !1
                    }, this)), this.offer.onShowOfferButton && this.offer.onShowOfferButton())
                }, this)), user.on("completeOffer", function(e) {
                    $(".offerButton").removeClass("active");
                    for (var i = 0; i < Config.offers.length; i++)
                        if (Config.offers[i].id == e) {
                            new CompleteOfferWindow({
                                offer: Config.offers[i]
                            });
                            break
                        }
                })))
            }
        }),
        StripView = Backbone.View.extend({
            el: "#stripMain",
            events: {
                click: "openWindow"
            },
            openWindow: function() {
                var e = this.options.strip;
                1 == e.get("active") && this.createStripWindow({
                    templateClass: ".stripWindow1_template",
                    strip: e,
                    model: e.get("model1")
                }), 2 == e.get("active") && this.createStripWindow({
                    templateClass: ".stripWindow2_template",
                    strip: e,
                    model: e.get("model2")
                }), 3 == e.get("active") && new Strip3Window({
                    strip: e
                })
            },
            createStripModel: function(e) {
                return new StripModel(e)
            },
            createStripWindow: function(e) {
                return new StripWindow(e)
            },
            render: function() {
                var e = this.options.strip.get("active");
                e ? this.$el.fadeIn(200) : this.$el.fadeOut(200)
            },
            initialize: function() {
                var e = this.options.strip;
                this.$el.hide(), e.on("change:active", function() {
                    var e = this.options.strip;
                    1 == e.get("active") && (e.has("model1") || e.set("model1", this.createStripModel(stripModel1()))), 2 == e.get("active") && (e.has("model2") || e.set("model2", this.createStripModel(stripModel2()))), this.render()
                }, this)
            }
        }),
        StripModelItemView = Backbone.View.extend({
            events: {
                click: "action"
            },
            action: function(e) {
                var i = this.options.item;
                i.get("checked") || i.get("action").call(i, e)
            },
            renderChecked: function() {
                var e = this.options.item;
                e.get("checked") ? (this.$el.addClass("checked"), this.$("a").length && this.$(".description").html(this.$("a").html())) : this.$el.removeClass("checked")
            },
            initialize: function() {
                var e = this.options.item;
                e.get("editHtml") && e.get("editHtml").call(this), e.on("change:checked", this.renderChecked, this), this.renderChecked()
            }
        }),
        Message = Backbone.Model.extend({}),
        MessageCenterBase = Backbone.Collection.extend({
            model: Message,
            constructor: function(e) {
                var i = _.filter(e, function(e) {
                    return void 0 !== application.USERS[e.userFrom]
                });
                Backbone.Collection.call(this, i), this.length > 0 && new MessageCenterWindow({
                    collection: this
                })
            },
            askedLifesProcess: function(e) {
                function i(e) {
                    if (0 != e.length) {
                        LifeKeeper.setMeSendedLifeToFriend(e);
                        var i = RANDOM(messages.sendLife);
                        _.isArray(i) && (i = i[user.get("gender")]), socialNetwork.sendRequest({
                            type: "lifeSent",
                            verb: "send",
                            ogobject: "life",
                            userIds: e,
                            message: i
                        })
                    }
                }
                callService("../../../levelbase/src/services/sendlifes.php", _.bind(i, this), function() {}, {
                    userIds: e.join(",")
                })
            },
            processGift: function(e) {
                var i = Gifts.findGiftByUid(e.get("uid"));
                callService("../../../base/src/services/deletegiftmessage.php", function() {}, function() {}, {
                    transactionId: e.get("transactionId")
                }), Gifts.receiveGift(i), socialNetwork.sendRequest({
                    type: "giftReceived",
                    userIds: e.get("userFrom"),
                    message: messages.gifts.receivedRequest
                }), this.remove(e)
            },
            process: function(e, i) {
                var t = this.listSenders(e);
                this[e + "Process"](t, e, i), this.clear(e), this.remove(this.where({
                    type: e
                }))
            },
            listSenders: function(e) {
                return _.invoke(this.where({
                    type: e
                }), "get", "userFrom")
            },
            clear: function(e) {
                callService("../../../levelbase/src/services/removemessages.php", function() {}, function() {}, {
                    type: e
                })
            }
        }),
        MessageCenter = MessageCenterBase.extend({
            constructor: function(e) {
                if (!user.neverPlayedBefore()) {
                    if (user.get("canMakeAGift") && user.getRealLevel() >= Config.makeGiftLevel) {
                        var i = user.getRandomFriendForGift();
                        i !== !1 && e.push({
                            userTo: window.viewerId,
                            type: "giftsAvailable",
                            userFrom: i
                        })
                    }
                    var t = 0;
                    if ("mobage" != network && "wizq" != network && user.getRealLevel() >= Config.congratesLevel) {
                        var o = getLocalStorage("birthdayCongrateTime");
                        if (!o || o < (new Date).getTime() - 864e5) {
                            window.birthdayCongrates = getLocalStorage("birthdayCongrates"), void 0 === window.birthdayCongrates && (window.birthdayCongrates = {});
                            for (var s = 0; s < allFriendsIds.length && 20 > t; s++) void 0 === window.birthdayCongrates[allFriendsIds[s]] && recentlyBirthday(application.USERS[allFriendsIds[s]]) && (e.push({
                                userTo: window.viewerId,
                                type: "birthdayCongrate",
                                userFrom: allFriendsIds[s]
                            }), t++)
                        }
                    }
                    if (user.has("congrateType") && 0 == t && user.getRealLevel() >= Config.congratesLevel) {
                        var n = getLocalStorage(user.get("congrateType") + "CongrateTime");
                        if (!n || n < (new Date).getTime() - 864e5) {
                            var a = function(e) {
                                return void 0 === application.USERS[e] ? !1 : "march8" == user.get("congrateType") ? 1 === application.USERS[e].gender : !0
                            };
                            window[user.get("congrateType") + "Congrates"] = getLocalStorage(user.get("congrateType") + "Congrates"), void 0 === window[user.get("congrateType") + "Congrates"] && (window[user.get("congrateType") + "Congrates"] = {});
                            for (var r = [], s = 0; s < friendsInAppIds.length; s++) void 0 === window[user.get("congrateType") + "Congrates"][friendsInAppIds[s]] && a(friendsInAppIds[s]) && r.push(friendsInAppIds[s]);
                            r = _.shuffle(r);
                            for (var l = allUsers.getBestForInvite(), d = [], s = 0; s < l.length; s++) void 0 === window[user.get("congrateType") + "Congrates"][l[s]] && a(l[s]) && d.push(l[s]);
                            for (var c = []; r.length || d.length;) r.length && c.push(r.shift()), d.length && c.push(d.shift());
                            for (var s = 0; 20 > s && s < c.length; s++) e.push({
                                userTo: window.viewerId,
                                type: user.get("congrateType") + "Congrate",
                                userFrom: c[s]
                            })
                        }
                    }
                }
                MessageCenterBase.prototype.constructor.call(this, e)
            },
            giftsReceivedProcess: function(e) {
                user.set("coins", new ObscureNumber(user.get("coins") + giftReceivedBonus * e.length)), socialNetwork.sendRequest({
                    type: "giftRecieved",
                    userIds: e,
                    message: RANDOM(messages.getGift)
                })
            },
            giftsAvailableProcess: function(e) {
                var i = RANDOM(messages.sendGift),
                    t = function() {
                        user.selectedForGifts = _.difference(user.selectedForGifts, e), "vkontakte" !== network ? user.set({
                            coins: new ObscureNumber(user.get("coins") + giftSentBonus * e.length),
                            sometimeMakeAGift: 1
                        }, {
                            notSave: !0
                        }) : user.set({
                            sometimeMakeAGift: 1
                        }, {
                            notSave: !0
                        }), callService("../../../levelbase/src/services/sendgifts.php", function() {}, function() {}, {
                            userIds: e.join(",")
                        })
                    };
                socialNetwork.sendRequest({
                    type: "giftSent",
                    verb: "send",
                    ogobject: "gift",
                    userIds: e,
                    message: i[user.get("gender")],
                    success: t
                })
            },
            congrateFriendsWith: function(e) {
                var i = this.listSenders(e + "Congrate");
                _.each(i, function(i) {
                    window[e + "Congrates"][i] = 1
                }), setLocalStorage(e + "Congrates", window[e + "Congrates"]), setLocalStorage(e + "CongrateTime", (new Date).getTime()), socialNetwork.sendRequest({
                    type: "congrates",
                    userIds: i,
                    message: messages[e + "Congrate"]
                }), this.remove(this.where({
                    type: e + "Congrate"
                }))
            },
            helpReceivedProcess: function(e) {
                user.set("friendsHelpSended", 1), socialNetwork.sendRequest({
                    type: "helpReceived",
                    userIds: e,
                    message: RANDOM(messages.getHelp)
                })
            },
            askedKeysProcess: function(e) {
                function i(e) {
                    var i = RANDOM(messages.sendKey);
                    socialNetwork.sendRequest({
                        type: "keySent",
                        verb: "send",
                        ogobject: "key",
                        userIds: e,
                        message: i[user.get("gender")]
                    })
                }
                callService("../../../levelbase/src/services/sendkeys.php", _.bind(i, this), function() {}, {
                    userIds: e.join(",")
                })
            },
            sentLifesProcess: function(e) {
                callService("../../../levelbase/src/services/getlifes.php", _.bind(function(e) {
                    user.getLifes(e), LifeKeeper.setFriendSendedLifeTime(e)
                }, this), function() {}, {
                    userIds: e.join(",")
                })
            }
        }),
        MessageCenterBaseWindow = TWindow.extend({
            templateClass: ".messageCenterWindow_template",
            events: {
                "click .close": "close",
                "click #messageLifes .messageItemBtn": "sendLifes",
                "click #messageGivenLifes .messageItemBtn": "getLifes"
            },
            doMassOperation: function() {
                for (var e in this.selectedActions) this.$("#" + e + " .messageItemBtn").click();
                this.selectedActions = {}
            },
            toggleSelectAllAction: function(e) {
                for (var i in this.selectedActions) this.$("#" + i + " .checkbox").click();
                $(e.currentTarget).hasClass("checkboxOn") ? $(e.currentTarget).removeClass("checkboxOn") : ($(e.currentTarget).addClass("checkboxOn"), this.$(".selectOneCheckbox .checkbox").click())
            },
            toggleSelectOneAction: function(e) {
                var i = $(e.currentTarget).parent().parent().attr("id");
                void 0 === this.selectedActions[i] ? (this.selectedActions[i] = !0, $(e.currentTarget).addClass("checkboxOn")) : (delete this.selectedActions[i], $(e.currentTarget).removeClass("checkboxOn"))
            },
            onOpen: function() {
                this.selectedActions = {}, this.render(), TWindow.prototype.onOpen.call(this), this.collection.on("remove", function() {
                    0 === this.collection.length && this.close()
                }, this)
            },
            onClose: function() {
                this.collection.off("remove")
            },
            sendLifes: function() {
                this.collection.process("askedLifes"), this.$("#messageLifes").hide()
            },
            getLifes: function() {
                this.collection.process("sentLifes"), this.$("#messageGivenLifes").hide()
            },
            renderGifts: function(e) {
                this.collection.where({
                    type: "gift"
                }).length > 0 && "undefined" != typeof Gifts ? (this.$(e).show(), _.each(this.collection.where({
                    type: "gift"
                }), _.bind(function(i, t) {
                    var o = $($("#giftMessageCardTpl").html()),
                        s = application.USERS[i.get("userFrom")];
                    o.find(".messageAva").html(makeImg(s.photo, Config.basePhotoSize)).attr("title", s.first_name), o.find(".giftText").html(messages.giftGender[s.gender]);
                    var n = Gifts.findGiftByUid(i.get("uid"));
                    "money" == n.buyType ? o.find(".giftName").html(prices[n.id].desc.product) : o.find(".giftName").html(messages.gifts[n.id]), o.find(".gift").addClass(n.id), o.addClass("giftNumber_" + t), o.find(".messageItemBtn").on("click", _.bind(function() {
                        this.collection.processGift(i), this.$(e + " .giftsList .giftNumber_" + t).remove(), 0 == this.collection.where({
                            type: "gift"
                        }).length && this.$(e).hide()
                    }, this)), this.$(e + " .giftsList").append(o)
                }, this))) : this.$(e).hide()
            },
            renderGroup: function(e, i) {
                if (this.collection.where({
                        type: e
                    }).length > 0)
                    if (this.$(i).show(), window.mobile) {
                        var t = this.collection.findWhere({
                                type: e
                            }),
                            o = application.USERS[t.get("userFrom")];
                        this.$(i).find(".messageAva").html(makeImg(o.photo, Config.basePhotoSize)).attr("title", o.first_name)
                    } else {
                        this.$(i + " .messageFriendList").empty();
                        var s = 8;
                        Config.messageCenterFriendsAmountInOneLine && (s = Config.messageCenterFriendsAmountInOneLine);
                        var n = this.collection.where({
                            type: e
                        });
                        this.$(i + " .messageFriendList").removeClass().addClass("messageFriendList").addClass("amountRows" + (Math.floor((n.length - 1) / s) + 1)), _.each(n, function(e) {
                            var t = $($("#messagePlayerCardTpl").html()),
                                o = application.USERS[e.get("userFrom")];
                            t.find(".messageAva").html(makeImg(o.photo, Config.basePhotoSize)).attr("title", o.first_name), this.$(i + " .messageFriendList").append(t)
                        })
                    } else this.$(i).hide()
            },
            render: function() {
                this.renderGroup("askedLifes", "#messageLifes"), this.renderGroup("sentLifes", "#messageGivenLifes")
            }
        }),
        MessageCenterWindow = MessageCenterBaseWindow.extend({
            events: _.extend(MessageCenterBaseWindow.prototype.events, {
                "click #messageGifts .messageItemBtn": "sendGifts",
                "click #messageGiftsReceived .messageItemBtn": "getGifts",
                "click #messageAskKey .messageItemBtn": "sendKeys",
                "click #messageHelpReceived .messageItemBtn": "getHelp",
                "click #messageInviteMe .messageItemBtn": "inviteFriends",
                "click #messageNewYearGift .messageItemBtn": "congrateFriendsWithNewYear",
                "click #messageMarch8Gift .messageItemBtn": "congrateFriendsWithMarch8",
                "click #messageMay1Gift .messageItemBtn": "congrateFriendsWithMay1",
                "click #messageBirthdayGift .messageItemBtn": "congrateFriendsWithBirthday",
                "click #messageEasterGift .messageItemBtn": "congrateFriendsWithEaster",
                "click .selectOneCheckbox .checkbox": "toggleSelectOneAction",
                "click .selectAllCheckbox .checkbox": "toggleSelectAllAction",
                "click .messageDoMassOperation": "doMassOperation"
            }),
            getGifts: function() {
                this.collection.process("giftsReceived"), this.$("#messageGiftsReceived").hide()
            },
            inviteFriends: function() {
                this.collection.inviteFriends(), this.$("#messageInviteMe").hide()
            },
            sendGifts: function() {
                this.collection.process("giftsAvailable"), this.$("#messageGifts").hide()
            },
            getHelp: function() {
                this.collection.process("helpReceived"), this.$("#messageHelpReceived").hide()
            },
            congrateFriendsWithNewYear: function() {
                this.collection.congrateFriendsWith("newYear"), this.$("#messageNewYearGift").hide()
            },
            congrateFriendsWithMarch8: function() {
                this.collection.congrateFriendsWith("march8"), this.$("#messageMarch8Gift").hide()
            },
            congrateFriendsWithMay1: function() {
                this.collection.congrateFriendsWith("may1"), this.$("#messageMay1Gift").hide()
            },
            congrateFriendsWithEaster: function() {
                this.collection.congrateFriendsWith("easter"), this.$("#messageEasterGift").hide()
            },
            congrateFriendsWithBirthday: function() {
                this.collection.congrateFriendsWith("birthday"), this.$("#messageBirthdayGift").hide()
            },
            sendKeys: function() {
                this.collection.process("askedKeys"), this.$("#messageAskKey").hide()
            },
            render: function() {
                MessageCenterBaseWindow.prototype.render.call(this), this.$("#giftCoinsAmountMessage").html(giftSentBonus), this.$("#giftCoinsGetMessage").html(giftReceivedBonus), this.renderGifts("#messageGameGifts"), this.renderGroup("giftsAvailable", "#messageGifts"), this.renderGroup("giftsReceived", "#messageGiftsReceived"), this.renderGroup("askedKeys", "#messageAskKey"), this.renderGroup("helpReceived", "#messageHelpReceived"), this.renderGroup("newYearCongrate", "#messageNewYearGift"), this.renderGroup("march8Congrate", "#messageMarch8Gift"), this.renderGroup("may1Congrate", "#messageMay1Gift"), this.renderGroup("easterCongrate", "#messageEasterGift"), this.renderGroup("birthdayCongrate", "#messageBirthdayGift"), this.renderGroup("inviteMe", "#messageInviteMe")
            }
        }),
        AddLivesWindow = TWindow.extend({
            templateClass: ".addLifesWindow_template",
            events: {
                "click #addLifesBuy": "refill",
                "click #askLifePublic": "askLife",
                "click #unlimitedLifesBuy": "buyUnlimitedLifes",
                "click .close": "close"
            },
            onClose: function() {
                user.off("change:lives", this.renderCurrentLife, this), user.off("change:timeToNextLife", this.renderTimeToNextLife, this)
            },
            renderCurrentLife: function() {
                this.$(".currentLife").html(user.get("lives"))
            },
            renderTimeToNextLife: function() {
                user.get("lives") < Config.maxLives ? this.$(".addLivesTimer").show().html(formatTime("%i:%s", user.get("timeToNextLife"))) : this.$(".addLivesTimer").hide()
            },
            onOpen: function() {
                0 != user.get("lives") && this.$("#addLifesBuy").addClass("disabled"), this.$(".maxLife").html(Config.maxLives), this.$(".addLifeIcoTextAmount").html(Config.maxLives), user.on("change:lives", this.renderCurrentLife, this), this.renderCurrentLife(), user.on("change:timeToNextLife", this.renderTimeToNextLife, this), this.renderTimeToNextLife(), this.$("#addLifesPrice").html(Config.lifeRefillPrice), "undefined" != typeof goods && this.$("#unlimitedLifesPrice").html(goods.getGoodProduct("unlimitedLifes").desc.price), TWindow.prototype.onOpen.call(this)
            },
            askLife: function() {
                this.close(), LifeKeeper.askSendLifes()
            },
            buyUnlimitedLifes: function() {
                this.close(), goods.buyGood("unlimitedLifes")
            },
            refill: function() {
                0 == user.get("lives") && (this.close(), user.refillLives() ? (application.playSound("buyLives"), user.trigger("refillLives")) : new AddLivesWindow)
            }
        }),
        EpisodeLockedWindow = TWindow.extend({
            templateClass: ".episodeLockedWindow_template",
            events: {
                "click .close": "close",
                "click #askKeyButton": "askKey",
                "click .askKey": "askKey",
                "click #buyKeysButton": "buyKeys",
                "click #unlockEpisodeButton": "unlockEpisode"
            },
            onOpenSound: !1,
            canOpenNow: function() {
                return "main" == application.get("page")
            },
            onOpen: function() {
                this.render(), user.on("change:keysBought", function() {
                    user.get("keysBought") && (user.off("change:keysBought"), this.render())
                }, this), TWindow.prototype.onOpen.call(this)
            },
            onClose: function() {
                user.off("change:keysBought")
            },
            askKey: function() {
                this.close(), user.askSendKeys()
            },
            buyKeys: function() {
                this.findUnlimitedKeysShopPage() !== !1 ? (this.close(), new ShopWindow({
                    page: this.findUnlimitedKeysShopPage()
                }), new EpisodeLockedWindow) : user.buyKeys() || (this.close(), new EpisodeLockedWindow)
            },
            unlockEpisode: function() {
                this.close(), user.unlockEpisode()
            },
            findUnlimitedKeysShopPage: function() {
                for (var e = 0; e < Config.shopProducts.length; e++)
                    for (var i = 0; i < Config.shopProducts[e].length; i++)
                        if ("unlimitedKeys" == Config.shopProducts[e][i].name) return e;
                return !1
            },
            render: function() {
                episode.scores.length == Config.levelsInEpisode ? (this.$el.removeClass("episodeNotDone"), episode.get("num") == Config.episodesAmount ? (this.$el.addClass("finalEpisode"), application.playSound("episodeLockedWindow")) : this.renderLocked()) : (this.$el.removeClass("finalEpisode").addClass("episodeNotDone"), application.playSound("episodeLockedWindow"))
            },
            renderLocked: function() {
                EpisodeLockedWindow.instance = this, Config.autoUnlockEpisodeTime && user.get("keyLastUnlockedEpisode") !== episode.get("num") && user.set({
                    keyLastUnlocked: application.getCurrentServerTime(),
                    keyLastUnlockedEpisode: episode.get("num")
                });
                var e = user.get("receivedKeys"),
                    i = EpisodeLockedWindow.amountKeys();
                this.$el.removeClass("finalEpisode"), this.$("#buyKeysButtonPrice").text(Config.unlockEpisodePrice), (1 === episode.get("num") || goods.checkProduct("unlimitedKeys") || "gems" == Config.project && window.mobile && 2 === episode.get("num") && 1 === user.get("episode")) && (i = 3), 3 == i ? (application.playSound("episodeLockedWindowKeysCollected"), this.$el.removeClass("episodeClosed").addClass("episodeOpened"), this.$("#episodeClosed").hide(), this.$("#episodeOpened").show(), $("#main").addClass("episodeAllRumRecieved"), $("#autoUnlockEpisodeTimerBlock").removeClass("key1TimerOn key2TimerOn key3TimerOn"), Config.autoUnlockEpisodeTime && user.set("timeToAutoUnlockKey", -1)) : (application.playSound("episodeLockedWindow"), this.$el.removeClass("episodeOpened").addClass("episodeClosed"), this.$("#episodeClosed").show(), this.$("#episodeOpened").hide(), this.findUnlimitedKeysShopPage() !== !1 && this.$("#buyKeysButton").html(messages.buyNow), $("#main").removeClass("episodeAllRumRecieved"), $("#autoUnlockEpisodeTimerBlock").removeClass("key1TimerOn key2TimerOn key3TimerOn").addClass("key" + (i + 1) + "TimerOn"), $(".chargingAnimate").removeClass("chargingAnimate"), $("#key_" + (i + 1)).addClass("chargingAnimate"), Config.autoUnlockEpisodeTime && this.runUnlockTimer());
                for (var t = 0; 3 > t; t++) {
                    var o = this.$("#key_" + (t + 1));
                    if (i > t) {
                        o.removeClass("keySendedByFriend noKey");
                        var s = e[t];
                        users[s] && (o.addClass("keySendedByFriend"), o.find(".keySednedName").text(users[s].first_name), o.find(".keySednedPhoto").html(makeImg(users[s].photo, Config.episodeLockedWindowPhotoSize)))
                    } else o.removeClass("keySendedByFriend").addClass("noKey")
                }
            },
            runUnlockTimer: function() {
                EpisodeLockedWindow.autoUnlockKeyIntervalFunction(), EpisodeLockedWindow.isTimerRunned || (EpisodeLockedWindow.isTimerRunned = !0, EpisodeLockedWindow.unlockKeyTimer = setInterval(EpisodeLockedWindow.autoUnlockKeyIntervalFunction, 1e3))
            }
        }, {
            amountKeys: function() {
                var e = user.getAmountKeys();
                if (!Config.autoUnlockEpisodeTime) return e;
                var i = application.getCurrentServerTime() - user.get("keyLastUnlocked");
                return e += Math.floor(i / Config.autoUnlockEpisodeTime), e > 3 && (e = 3), e
            },
            autoUnlockEpisodeTimer: function() {
                var e = Config.autoUnlockEpisodeTime - (application.getCurrentServerTime() - user.get("keyLastUnlocked")) % Config.autoUnlockEpisodeTime;
                if (e > 0) {
                    var i = formatTime("%H:%i:%s", e);
                    $(".shipWater").html(i), $("#autoUnlockEpisodeTimer").html(i)
                }
            },
            autoUnlockKeyIntervalFunction: function() {
                var e = EpisodeLockedWindow.amountKeys();
                return EpisodeLockedWindow.prevAmountKeys != e && (EpisodeLockedWindow.prevAmountKeys = e, EpisodeLockedWindow.instance.renderLocked()), 3 === e ? (clearInterval(EpisodeLockedWindow.unlockKeyTimer), EpisodeLockedWindow.isTimerRunned = !1, void 0) : (EpisodeLockedWindow.autoUnlockEpisodeTimer(), void 0)
            }
        }),
        SelectFriendWindow = TWindow.extend({
            templateClass: ".SelectFriendWindow_template",
            initialize: function() {
                return "phonegap" == network && "phonegap" == window.phonegapNetwork ? (application.socialLogin.showSocialLoginWindow(), void 0) : (TWindow.prototype.initialize.call(this), void 0)
            },
            events: {
                "click .close": "close",
                "keyup #selectFriendMask": "render",
                "click .friendAsk": "select",
                "click .selectOneCheckbox .checkbox": "toggleSelectOneAction",
                "click .selectAllCheckbox .checkbox": "toggleSelectAllAction",
                "click .selectFriendDoMassOperation": "doMassOperation",
                "click .selectFriendGiveLifeOperation": "doMassOperation",
                "click .closeSelectFriend": "clearSelectFriendMask",
                "click .selectOneFriend": "toggleParentSelectOneAction"
            },
            clearSelectFriendMask: function() {
                "" != this.$("#selectFriendMask").val() && (this.$("#selectFriendMask").val(""), this.render())
            },
            doMassOperation: function() {
                for (var e in this.selectedCheckbox) {
                    var i = e.substr(15);
                    this.selectedIds.push(i)
                }
                this.selectedIds.length > 0 && (this.options.massCallback ? this.options.massCallback(this.selectedIds) : _.each(this.selectedIds, _.bind(function(e) {
                    this.options.callback(e)
                }, this)), this.close())
            },
            toggleSelectAllAction: function(e) {
                for (var i in this.selectedCheckbox) this.$("#" + i + " .checkbox").click();
                $(e.currentTarget).hasClass("checkboxOn") ? $(e.currentTarget).removeClass("checkboxOn") : ($(e.currentTarget).addClass("checkboxOn"), this.$(".selectOneCheckbox .checkbox").click())
            },
            toggleParentSelectOneAction: function(e) {
                window.mobile && "touchend" == e.type && $(e.currentTarget).children(".selectOneCheckbox").children(".checkbox").click()
            },
            toggleSelectOneAction: function(e) {
                var i = $(e.currentTarget).parent().parent();
                if (!i.hasClass("cantSend")) {
                    var t = i.attr("id");
                    if (void 0 === this.selectedCheckbox[t]) {
                        if (this.limitSelect && this.amountSelected() == this.limitSelect) return;
                        this.selectedCheckbox[t] = !0, $(e.currentTarget).addClass("checkboxOn")
                    } else delete this.selectedCheckbox[t], $(e.currentTarget).removeClass("checkboxOn");
                    this.$(".amountSelected").html(this.amountSelected()), this.limitSelect && (this.amountSelected() == this.limitSelect ? this.$(".selectFriendBlock").addClass("friendLimit") : this.$(".selectFriendBlock").removeClass("friendLimit"))
                }
            },
            amountSelected: function() {
                var e = 0;
                for (var i in this.selectedCheckbox) e++;
                return e
            },
            onOpen: function() {
                switch (this.selectOneFriend = !1, ("sendDecor" == this.options.type || this.options.selectOneFriend) && (this.selectOneFriend = !0), this.selectOneFriend || (window.mobile || "test" == network || "facebook" == network) && this.$el.addClass("selectFewFriendWindow"), this.limitSelect = !1, this.options.customCssClass && this.$el.addClass(this.options.customCssClass), this.options.type) {
                    case "inviteFriendsByRequest":
                        this.$el.addClass("callFewFriends"), this.$(".selectFriendDoMassOperation").html(messages.invite), this.$(".amountAll").html(Math.min(Config.maxFriendsInviteOneTime, this.options.userIds.length)), this.limitSelect = Config.maxFriendsInviteOneTime;
                        break;
                    case "giftLifes":
                        this.$el.addClass("giveLifeFriendWindow"), this.$(".amountAll").html(Math.min(Config.maxLifesGiftOneTime, this.options.userIds.length)), this.limitSelect = Config.maxLifesGiftOneTime;
                        break;
                    case "inviteFriends":
                        this.$(".selectFriendDoMassOperation").html(messages.invite), this.$el.addClass("inviteSelectFriendWindow");
                        break;
                    default:
                        this.$(".selectFriendDoMassOperation").html(messages.ask), this.$el.addClass("askSelectFriendWindow"), this.$(".amountAll").html(this.options.userIds.length)
                }
                this.$("#selectFriendMask").val(""), this.selectedCheckbox = {}, this.selectedIds = [], this.userIds = [];
                for (var e = [], i = 0; i < this.options.userIds.length; i++) e.push({
                    id: this.options.userIds[i],
                    weight: Math.random() * allUsers.get(this.options.userIds[i]).calcWeight()
                });
                e.sort(function(e, i) {
                    return i.weight - e.weight
                });
                for (var i = 0; i < e.length; i++) this.userIds.push(e[i].id);
                TWindow.prototype.onOpen.call(this), this.render(), this.limitSelect && this.$(".selectOneCheckbox .checkbox").click()
            },
            select: function(e) {
                var i = $(e.currentTarget).parent(),
                    t = i.attr("id").substr(15);
                this.selectOneFriend || i.hide(), this.selectedIds.push(t), this.options.callback(t), (this.selectedIds.length === this.userIds.length || this.selectOneFriend) && this.close()
            },
            onClose: function() {
                void 0 !== this.options.onClose && this.options.onClose()
            },
            render: function() {
                this.$(".selectFriendBlock").empty(), this.limitSelect || (this.selectedCheckbox = {});
                for (var e = this.$("#selectFriendMask").val().toUpperCase(), i = user.get("receivedKeys"), t = this.userIds, o = 0, s = 0; s < t.length; s++)
                    if (!(this.selectedIds.indexOf(t[s]) >= 0)) {
                        var n = t[s],
                            a = (users[n].first_name + " " + users[n].last_name).toUpperCase(),
                            r = (users[n].last_name + " " + users[n].first_name).toUpperCase();
                        if (a.indexOf(e) >= 0 || r.indexOf(e) >= 0) {
                            var l = $($("#selectOneFriendTpl").html());
                            l.find(".friendPhoto").html(makeImg(users[n].photo, Config.basePhotoSize));
                            var d = users[n].first_name + " " + users[n].last_name;
                            l.find(".friendName").html(d), l.attr("title", d), "sendDecor" == this.options.type && l.find(".friendAsk").html(messages.compliment), "beginGame" == this.options.type && l.find(".friendAsk").html(messages.beginGame), l.attr("id", "selectFriendId_" + n), this.selectedCheckbox["selectFriendId_" + n] && l.find(".checkbox").addClass("checkboxOn");
                            var c = !0;
                            if ("askLifes" != this.options.type || LifeKeeper.checkCanFriendSendLife(n) || (c = !1), "askKeys" == this.options.type && i.indexOf(t[s]) >= 0 && (c = !1), "giftLifes" != this.options.type || LifeKeeper.checkMeSendLifeToFriend(n) || (c = !1), c || (l.find(".friendAsk").remove(), l.append($(".invisible .cantSendLife").clone()), l.addClass("cantSend").attr("title", l.find(".cantSendLife").attr("title"))), this.$(".selectFriendBlock").append(l), o++, o >= 30 && window.mobile || o >= 200) break
                        }
                    }
                this.limitSelect || (this.$(".selectAllCheckbox .checkbox").removeClass("checkboxOn"), ("test" == network || "facebook" == network) && this.$(".selectAllCheckbox .checkbox").click())
            }
        }),
        EpisodeFinishedWindow = TWindow.extend({
            templateClass: ".episodeFinishedWindow_template",
            events: {
                "click .close": "close",
                "click #episodeFinishedPublic": "doPublic",
                "click #episodeFinishedCook": "cook",
                "click #episodeFinishedSwitch": "switch"
            },
            initialize: function() {
                this.episode = this.options.episode || user.get("episode"), TWindow.prototype.initialize.apply(this, arguments)
            },
            doPublic: function() {
                if ("facebook" === network && Config.openGraphEnabled && openGraph.episodeDone) {
                    var e = {};
                    e[openGraph.episodeDone.type] = sprintf(openGraph.episodeDone.url, {
                        episode: user.get("episode")
                    }), publishStory(openGraph.episodeDone.action, e), this.close()
                } else {
                    var i, t, o = messages.episodeDonePublicationMessage,
                        s = RANDOM(o);
                    i = sprintf(s[user.get("gender")], messages.treasureName[this.episode - 1]), t = messages.episodeDonePublicationImage[this.episode - 1];
                    var n = _.bind(function() {
                        this.close()
                    }, this);
                    doPublication(i, t, messages.episodeDonePublicationCaption[user.get("gender")], void 0, n)
                }
            },
            cook: function() {
                if (!this.isCooked) {
                    this.isCooked = !0;
                    var e = this.$(".treasure"),
                        i = e.offset();
                    i.left += e.width() / 2, i.top += e.height() / 2;
                    var t = _.once(_.bind(function() {
                        this.$(".beforeTreasure").addClass("animated").delay(500).queue(function(e) {
                            $(this).removeClass("animated"), e()
                        }), setTimeout(_.bind(function() {
                            this.$el.removeClass("readyToCooking").addClass("candyFinished")
                        }, this), 200), application.playSound("candyCooking")
                    }, this));
                    this.$(".icon").each(function(e, o) {
                        if (window.mobile) t();
                        else {
                            var s = $(o),
                                n = s.offset();
                            s.clone().appendTo(s.parent()).ourAnimate({
                                left: i.left - n.left - s.width() / 2,
                                top: i.top - n.top - s.height() / 2,
                                scale: .8
                            }, 500, "linear").ourAnimate({
                                scale: .1
                            }, 400, "linear", function() {
                                $(this).remove(), t()
                            })
                        }
                    })
                }
            },
            "switch": function() {
                this.close(), episodeView.changeEpisode(this.episode)
            },
            onOpen: function() {
                TWindow.prototype.onOpen.call(this), this.$el.addClass("episode" + this.episode), this.$(".treasureName").html(messages.treasureName[this.episode - 1]);
                for (var e = 0; 3 > e; e++) this.$(".treasureIngredient .name").eq(e).text(messages.treasureElements[this.episode - 1][e]), user.get("episode") > this.episode || user.get("episode") === this.episode && user.get("level") > Config.treasureElementsLevels[e] ? (this.$(".checkboxChecked").eq(e).show(), this.$(".treasureIngredient").eq(e).addClass("collected")) : (this.$(".checkboxChecked").eq(e).hide(), this.$(".treasureIngredient").eq(e).removeClass("collected"));
                this.options.fromMyTreasuresWindow ? this.$el.addClass("fromMyTreasuresWindow") : this.$el.addClass("fromGame"), this.episode !== user.get("episode") ? this.$el.addClass("notCurrentEpisode") : (this.$el.addClass("currentEpisode"), user.get("level") <= Config.treasureElementsLevels[2] ? this.$el.addClass("notEnoughElements") : this.options.fromMyTreasuresWindow ? this.$el.addClass("candyFinished") : this.$el.addClass("readyToCooking"))
            }
        }),
        EpisodeFoundElementWindow = TWindow.extend({
            templateClass: ".episodeFoundElementWindow_template",
            events: {
                "click .close": "close",
                "click .share": "doPublic"
            },
            initialize: function(e) {
                e || (e = {}), this.elementId = e.elementId || 1, TWindow.prototype.initialize.apply(this, arguments)
            },
            doPublic: function() {
                if (("facebook" === network || "phonegap" == network && "facebook" == window.phonegapNetwork) && Config.openGraphEnabled && openGraph.elementFound) {
                    var e = {};
                    e[openGraph.elementFound.type] = sprintf(openGraph.elementFound.url, {
                        episode: episode.get("num"),
                        number: this.elementId
                    }), publishStory(openGraph.elementFound.action, e), this.close()
                } else {
                    var i = messages.episodeFoundElementPublicationMessage;
                    text = RANDOM(i);
                    var t = sprintf(text[user.get("gender")], messages.treasureElements[episode.get("num") - 1][this.elementId - 1]),
                        o = messages.episodeFoundElementPublicationImage[episode.get("num") - 1][this.elementId - 1],
                        s = _.bind(function() {
                            this.close()
                        }, this);
                    doPublication(t, o, messages.episodeFoundElementPublicationCaption[user.get("gender")], void 0, s)
                }
            },
            onOpen: function() {
                this.$el.addClass("elementWindow" + this.elementId), this.$(".treasureName").text(messages.treasureElements[episode.get("num") - 1][this.elementId - 1]), this.$el.addClass("episode" + episode.get("num")), this.$(".beforeTreasure").addClass("animated").delay(500).queue(function(e) {
                    $(this).removeClass("animated"), e()
                }), setTimeout(_.bind(function() {
                    this.$(".treasureElement").show()
                }, this), 200), setTimeout(function() {
                    application.playSound("elementFound")
                }, 0), TWindow.prototype.onOpen.call(this)
            }
        }),
        MyTreasuresWindow = TWindow.extend({
            templateClass: ".myTreasuresWindow_template",
            events: {
                "click .myTreasureArrowLeft": "leftPage",
                "click .myTreasureArrowRight": "rightPage",
                "click .close": "close",
                "click .myTreasure": "goToEpisode",
                "touchend .myTreasure": "goToEpisode"
            },
            leftPage: function() {
                this.$(".myTreasureArrowLeft").hasClass("disabled") || (this.page = this.page - 1, this.render())
            },
            rightPage: function() {
                this.$(".myTreasureArrowRight").hasClass("disabled") || (this.page = this.page + 1, this.render())
            },
            isTreasureFinded: function(e) {
                return user.get("episode") > e || user.get("episode") == e && user.get("level") > Config.levelsInEpisode
            },
            pageData: function() {
                return {
                    treasuresInRow: Config.treasuresInRowInWindow,
                    treasuresRows: Config.treasuresRowsInWindow,
                    treasuresInPage: Config.treasuresInRowInWindow * Config.treasuresRowsInWindow
                }
            },
            goToEpisode: function(e) {
                var i = $(e.currentTarget).data("episode");
                return i && this.isTreasureFinded(i) && "main" == application.get("page") && (this.close(), episodeView.changeEpisode(i)), !1
            },
            render: function() {
                var e = this.pageData();
                this.$("#myTreasures").empty();
                for (var i = _.bind(function(i) {
                    var t = this.page * e.treasuresInPage + i + 1,
                        o = $(".invisible .myTreasure").clone();
                    o.addClass("episode" + t).addClass("row" + (Math.floor(i / e.treasuresInRow) + 1)), o.attr("data-episode", t), t == user.get("episode") && o.addClass("windowTreasureCurrent"), this.isTreasureFinded(t) && (o.addClass("windowTreasureOpened"), o.find(".windowTreasureName").html(messages.treasureName[t - 1])), this.$("#myTreasures").append(o)
                }, this), t = 0; t < e.treasuresInPage; t++) i(t);
                var o = (this.page + 1) * e.treasuresInPage + 1;
                0 != this.page || this.isTreasureFinded(o) ? (this.$(".myTreasureArrowLeft").show(), this.$(".myTreasureArrowRight").show(), 0 == this.page ? this.$(".myTreasureArrowLeft").addClass("disabled") : this.$(".myTreasureArrowLeft").removeClass("disabled"), this.isTreasureFinded(o) ? this.$(".myTreasureArrowRight").removeClass("disabled") : this.$(".myTreasureArrowRight").addClass("disabled")) : (this.$(".myTreasureArrowLeft").hide(), this.$(".myTreasureArrowRight").hide())
            },
            onOpen: function() {
                var e = this.pageData(),
                    i = user.get("episode") - 1;
                user.get("level") > Config.levelsInEpisode && i++, i > 0 && i--, this.page = Math.floor(i / e.treasuresInPage), this.render(), TWindow.prototype.onOpen.call(this)
            }
        });
    MyTreasuresWindow.prototype.goToEpisode = function(e) {
        var i = $(e.currentTarget).data("episode");
        return i && (this.isTreasureFinded(i) || i == user.get("episode")) && "main" == application.get("page") && (this.close(), new EpisodeFinishedWindow({
            episode: i,
            fromMyTreasuresWindow: !0
        })), !1
    };
    var GoodsPromoWindow = TWindow.extend({
            templateClass: ".goodsPromoWindow_template",
            events: {
                "click .close": "close",
                "click .goodsPromoClose": "close",
                "click #buyAgain": "buy"
            },
            onOpen: function() {
                callService("../../../levelbase/src/services/seengoodfinish.php", function() {}, function() {}, {
                    type: this.options.productType
                }), this.$("#goodsInfo").removeClass().addClass(this.options.productName), this.$(".goodsPromoText").html(messages.goodPromoInfo[this.options.productName].text), "additionalLifes" == this.options.productName ? this.$(".goodPrice").html(Config.goods.additionalLifes.coinsPrice) : this.$(".goodPrice").html(goods.getGoodProduct(this.options.productName).desc.price), this.$(".goodsPromoTitle").html(messages.goodPromoInfo[this.options.productName].title), this.$("#buyAgain").html(messages.goodPromoInfo[this.options.productName].buyAgain), TWindow.prototype.onOpen.call(this)
            },
            buy: function() {
                this.close(), "additionalLifes" == this.options.productName ? user.set({
                    coins: new ObscureNumber(user.get("coins").get() - Config.goods.additionalLifes.coinsPrice)
                }, {
                    validate: !0
                }) ? (goods.goodBuyed(Config.goods.additionalLifes.productId, Config.goods.additionalLifes.workDays), callServiceAddInQueue("../../../levelbase/src/services/additionallives.php"), user.set("lives", Config.maxLives), new AdditionalLivesWindow) : (this.close(), new GoodsPromoWindow(this.options)) : goods.buyGood(this.options.productName)
            }
        }),
        ChampionWindow = TWindow.extend({
            templateClass: ".championWindow_template",
            events: {
                "click .share": "share",
                "click .close": "close"
            },
            onClose: function() {
                this.options.backToMain.call(this)
            },
            onOpenSound: "championwindow",
            onOpen: function() {
                this.$(".level").html(episode.absoluteLevelNumber(this.options.level));
                for (var e = 0; 3 > e; e++) window.mobile || (this.$("#placeColumn" + (e + 1)).css({
                    top: "0px"
                }), this.$("#placeColumn" + (e + 1)).setCoords({
                    top: (Config.championWindowColumnsBeginTop || 200) + "px"
                })), this.$("#placeColumn" + (e + 1) + " .photo").html(makeImg(this.options.places[e].get("photo"), Config.basePhotoSize)).attr("title", this.options.places[e].get("name")), this.$(".placeColumnScoreBlock" + (e + 1) + " .score").html(this.options.places[e].get("score"));
                window.mobile || (this.$("#placeColumn1").delay(1300).ourAnimate({
                    top: (Config.championWindowColumnsHeight && Config.championWindowColumnsHeight[0] || 100) + "px"
                }, 1e3, "linear"), this.$("#placeColumn2").delay(800).ourAnimate({
                    top: (Config.championWindowColumnsHeight && Config.championWindowColumnsHeight[1] || 130) + "px"
                }, 1e3, "linear"), this.$("#placeColumn3").delay(300).ourAnimate({
                    top: (Config.championWindowColumnsHeight && Config.championWindowColumnsHeight[2] || 160) + "px"
                }, 1e3, "linear")), "phonegap" == network && "facebook" == window.phonegapNetwork && (this.$(".noShareOption.close").hide(), this.$("#championPublicBtn").attr("style", "display: block !important"), this.$("#championPublicBtn").css("visibility", "visible")), TWindow.prototype.onOpen.call(this)
            },
            share: function() {
                if (("facebook" === network || "phonegap" == network && "facebook" == window.phonegapNetwork) && Config.openGraphEnabled && openGraph.becomeChampion) {
                    var e = {};
                    e[openGraph.becomeChampion.type] = sprintf(openGraph.becomeChampion.url, {
                        level: episode.absoluteLevelNumber(this.options.level)
                    }), publishStory(openGraph.becomeChampion.action, e), this.close()
                } else {
                    var i = RANDOM(messages.championMessage);
                    episode.isBonusWorld() && (i = RANDOM(messages[Config.bonusWorld.name + "ChampionBonusWorldMessage"]));
                    var t = i[0] + episode.absoluteLevelNumber(this.options.level) + i[1],
                        o = messages.championImage,
                        s = messages.championCaption[user.get("gender")];
                    episode.isBonusWorld() && (o = messages[Config.bonusWorld.name + "ChampionBonusWorldImage"]), doPublication(t, o, s, void 0, _.bind(function() {
                        this.close()
                    }, this))
                }
            }
        }),
        OvertakenWindow = TWindow.extend({
            templateClass: ".overtakenWindow_template",
            events: {
                "click #overtakenPublicBtn": "share",
                "click .close": "close"
            },
            onClose: function() {
                this.options.backToMain.call(this)
            },
            onOpenSound: "championwindow",
            onOpen: function() {
                this.$el.removeClass("overtakenWindowStartAnimation"), setTimeout(_.bind(function() {
                    this.$el.addClass("overtakenWindowStartAnimation")
                }, this), 500), this.$(".level").html(episode.absoluteLevelNumber(this.options.level));
                var e = this.$(".overtakenMyCard");
                e.find(".name").html(user.get("name")), e.find(".score").html(this.options.score), e.find(".photo").html(makeImg(user.get("photo"), Config.basePhotoSize)), this.$(".statisticArrowUp").find(".place").html(this.options.myPlace), e = this.$(".overtakenFriendCard"), e.find(".name").html(this.options.overtakenFriend.get("name")), e.find(".score").html(this.options.overtakenFriend.get("score")), e.find(".photo").html(makeImg(this.options.overtakenFriend.get("photo"), Config.basePhotoSize)), this.$(".statisticArrowDown").find(".place").html(this.options.friendPlace), "phonegap" == network && "facebook" == window.phonegapNetwork && (this.$(".noShareOption.close").hide(), this.$("#overtakenPublicBtn").attr("style", "display: block !important"), this.$("#overtakenPublicBtn").css("visibility", "visible")), TWindow.prototype.onOpen.call(this)
            },
            share: function() {
                if (("facebook" === network || "phonegap" == network && "facebook" == window.phonegapNetwork) && Config.openGraphEnabled && openGraph.friendOvertake) {
                    var e = {
                        profile: this.options.overtakenFriend.get("id")
                    };
                    e[openGraph.friendOvertake.type] = sprintf(openGraph.friendOvertake.url, {
                        level: episode.absoluteLevelNumber(this.options.level),
                        score: this.options.score
                    }), publishStory(openGraph.friendOvertake.action, e), this.close()
                } else {
                    var i = RANDOM(messages.upFriendOnLevel);
                    episode.isBonusWorld() && (i = RANDOM(messages[Config.bonusWorld.name + "UpFriendOnLevelBonusWorld"])), i = sprintf(i[user.get("gender")], {
                        levelNum: episode.absoluteLevelNumber(this.options.level)
                    });
                    var t = _.bind(this.close, this);
                    "wizq" == network ? doPublication(this.options.overtakenFriend.get("name") + i, messages.upFriendOnLevelImage, messages.upFriendOnLevelCaption[user.get("gender")], void 0, t) : socialNetwork.sendRequest({
                        type: "scoreOvertaking",
                        userIds: this.options.overtakenFriend.id,
                        message: i,
                        success: t
                    })
                }
            }
        }),
        ShopWindow = TWindow.extend({
            templateClass: ".shopWindow_template",
            events: {
                "click .close": "close",
                "click .shopArrowLeft": "decCurrentPage",
                "click .shopArrowRight": "incCurrentPage"
            },
            decCurrentPage: function() {
                this.page > 0 && (this.page--, this.renderCurrentPage())
            },
            close: function() {
                TWindow.prototype.close.call(this), goods.off("unlimitedKeysBuyed", this.close, this), void 0 !== this.powerUpsAndCoinsWindowBlock && (this.powerUpsAndCoinsWindowBlock.close(), this.powerUpsAndCoinsWindowBlock = void 0)
            },
            incCurrentPage: function() {
                this.page < Config.shopProducts.length - 1 && (this.page++, this.renderCurrentPage())
            },
            renderCurrentPage: function(e) {
                this.$el.prop("className", this.$el.prop("className").replace(/\bpage\d*\b/g, "")).addClass("page" + (this.page + 1)), this.$(".shopPageNow").html(this.page + 1), 0 == this.page ? this.$(".shopArrowLeft").addClass("disabled") : this.$(".shopArrowLeft").removeClass("disabled"), this.page == Config.shopProducts.length - 1 ? this.$(".shopArrowRight").addClass("disabled") : this.$(".shopArrowRight").removeClass("disabled"), this.$(".shopList").empty();
                var i = !1;
                _.each(Config.shopProducts[this.page], _.bind(function(e) {
                    var t = $(".invisible .shopItem." + e.type + "Product").clone();
                    this.$(".shopList").append(t), t.addClass(e.name).addClass("notdisabled");
                    var o;
                    if ("money" == e.type && (o = prices[e.name]), t.find(".shopItemName").html(messages.shopProducts[e.name][0]), "coins" == e.type) i = !0, t.find(".shopItemText1").html(messages.shopProducts[e.name][1]), t.find(".shopItemText2").html(messages.shopProducts[e.name][2]), t.find(".shopItemText3").html(messages.shopProducts[e.name][3]), t.find(".price").html(e.price), "refillKeys" == e.name && (episode.scores.length != Config.levelsInEpisode || 1 === episode.get("num") || episode.get("num") == Config.episodesAmount || goods.checkProduct("unlimitedKeys")) && (window.mobile && "gems" == Config.project && user.get("episode") + 1 == episode.get("num") && 21 == user.get("level") && 3 != EpisodeLockedWindow.amountKeys() || t.removeClass("notdisabled").addClass("disabled")), void 0 !== e.addPowerUps && t.find(".shopItemAmount").html(e.addPowerUpAmount);
                    else if (t.find(".shopItemText").html(messages.shopProducts[e.name][1]), t.find(".price").html(o.desc.price), goods.checkProduct(o.goodName)) {
                        var s = goods.findWhere({
                            name: o.goodName
                        });
                        s.set("timeToFinish", s.get("timeToFinish") + 1), s.refresh(), t.addClass("shopItemDisabled")
                    }
                    e.discount ? t.find(".sale").html(e.discount) : t.find(".discountBlock").remove(), t.find(".shopBuyBtn").on("click touchend", _.bind(function() {
                        return t.hasClass("disabled") || this.closed ? !1 : ("coins" == e.type ? user.get("coins") >= e.price ? (void 0 !== e.addPowerUps && (_.each(e.addPowerUps, _.bind(function(i) {
                            user.setPowerUpAmount(i, user.getPowerUpAmount(i) + e.addPowerUpAmount, !0)
                        }, this)), user.set({
                            powerUps: user.calcPowerUps(),
                            coins: new ObscureNumber(user.get("coins") - e.price),
                            actionName: e.name,
                            actionEpisode: user.get("episode"),
                            actionLevel: user.get("level"),
                            actionPrice: e.price
                        }), application.playSound("buyShopProduct")), "refillKeys" == e.name && (user.buyKeys(), this.close())) : (this.close(), new ShopWindow({
                            page: this.page,
                            firstPriority: !0
                        }), new NoCoinsWindow({
                            firstPriority: !0
                        })) : showBuy(o), !1)
                    }, this))
                }, this)), e ? i ? this.$(".playerPowerupsBlock").css("opacity", 1).show() : this.$(".playerPowerupsBlock").css("opacity", 0).hide() : i ? this.$(".playerPowerupsBlock").show().stop().clearQueue().ourAnimate({
                    opacity: 1
                }, 300) : this.$(".playerPowerupsBlock").hide().stop().clearQueue().ourAnimate({
                    opacity: 0
                }, 300)
            },
            findDiscountProductPage: function() {
                for (var e = 0; e < Config.shopProducts.length; e++)
                    for (var i = Config.shopProducts[e], t = 0; t < i.length; t++) {
                        var o = i[t];
                        if (o.discount) return e
                    }
                return -1
            },
            onOpen: function() {
                this.page = this.options.page ? this.options.page : 0, this.$(".shopPageAmount").html(Config.shopProducts.length), this.renderCurrentPage(!0), this.powerUpsAndCoinsWindowBlock = new PowerUpsAndCoinsWindowBlock({
                    el: this.$(".playerPowerupsBlock")
                }), goods.on("unlimitedKeysBuyed", this.close, this), TWindow.prototype.onOpen.call(this)
            }
        }),
        ShopRecommendedWindow = TWindow.extend({
            templateClass: ".shopRecommendedWindow_template",
            events: {
                "click .close": "close",
                "click .try": "tryProduct"
            },
            tryProduct: function() {
                new ShopWindow({
                    page: this.options.type.page
                }), this.close()
            },
            onOpen: function() {
                this.$el.removeClass().addClass("window").addClass(this.options.type.name + "RecommendedWindow"), this.$(".shopRecommendedTitle").html(messages.shopRecommendedTexts[this.options.type.name].title), this.$(".shopRecommendedText").html(messages.shopRecommendedTexts[this.options.type.name].text), TWindow.prototype.onOpen.call(this)
            }
        }),
        GachaWindow = TWindow.extend({
            templateClass: ".gachaWindow_template",
            initialGachaSize: {
                w: $(".gachaRound").width(),
                h: $(".gachaRound").height()
            },
            events: {
                "click .close": "close",
                "click #closeGacha": "close",
                "click #startGacha": "start",
                "click #againGacha": "start",
                "click #freeGacha": "process"
            },
            close: function() {
                TWindow.prototype.close.call(this), this.$(".gachaRound").clearQueue().stop(), void 0 !== this.powerUpsAndCoinsWindowBlock && (this.powerUpsAndCoinsWindowBlock.close(), this.powerUpsAndCoinsWindowBlock = void 0), $(".gachaBlock").fadeIn(300), window.mobile && ($("#topMenu").css("z-index", 3), $("#coinsBlock").removeClass("disabled").css("z-index", "auto"))
            },
            onOpen: function() {
                $(".gachaBlock").hide(), this.currentSector = 0, this.currentDeg = 0, this.shadow = !1, this.$(".gachaRound").setAngle("0deg"), this.$(".gachaSectors").empty(), this.$(".gachaBlackout").hide(), user.get("freeGacha") ? (this.price = 0, this.$("#startGacha").hide(), this.$("#freeGacha").show()) : (this.price = Config.gacha.price, this.$("#startGacha").show(), this.$("#freeGacha").hide()), this.$("#getGacha").hide(), this.$("#waitGacha").hide(), this.$("#closeGacha").hide(), this.$("#gachaResult").html(messages.gachaText), this.$("#gachaResultBlock").show(), this.$("#againGacha").hide(), this.$(".gachaCharacter").removeClass("gachaCharacterSad gachaCharacterHappy gachaCharacterAnimation"), this.$(".gachaPrice").html(Config.gacha.price);
                for (var e = 0; e < Config.gacha.sectors.length; e++) {
                    var i = $(".invisible .gachaSector").clone();
                    i.addClass("gachaSector" + (e + 1)), i.find(".gachaItem").addClass(Config.gacha.sectors[e].cssClass), this.$(".gachaSectors").append(i)
                }
                this.powerUpsAndCoinsWindowBlock = new PowerUpsAndCoinsWindowBlock({
                    el: this.$(".playerPowerupsBlock")
                }), window.mobile && ($("#topMenu").css("z-index", "auto"), $("#coinsBlock").addClass("disabled").css("z-index", 20)), TWindow.prototype.onOpen.call(this)
            },
            calcWinSector: function() {
                return Math.floor(Math.random() * Config.gacha.sectors.length)
            },
            getPrize: function() {
                switch (Config.gacha.sectors[this.currentSector].type) {
                    case "coins":
                        user.set({
                            coins: new ObscureNumber(user.get("coins") + Config.gacha.sectors[this.currentSector].amount),
                            todayGachaPlayTimes: user.get("todayGachaPlayTimes") + 1,
                            actionName: "wingacha" + this.currentSector,
                            actionEpisode: user.get("episode"),
                            actionLevel: user.get("level"),
                            actionPrice: this.price
                        });
                        break;
                    case "powerUps":
                        var e = Config.gacha.sectors[this.currentSector].amount;
                        _.each(Config.gacha.sectors[this.currentSector].powerUps, _.bind(function(i) {
                            user.setPowerUpAmount(i, user.getPowerUpAmount(i) + e, !0)
                        }, this)), user.set({
                            powerUps: user.calcPowerUps(),
                            todayGachaPlayTimes: user.get("todayGachaPlayTimes") + 1,
                            actionName: "wingacha" + this.currentSector,
                            actionEpisode: user.get("episode"),
                            actionLevel: user.get("level"),
                            actionPrice: this.price
                        }), application.playSound("gachaWindowPowerUpsPrize");
                        break;
                    case "passives":
                        var e = Config.gacha.sectors[this.currentSector].amount;
                        _.each(Config.gacha.sectors[this.currentSector].passives, function(i) {
                            user.setPassiveAmount(i, user.getPassiveAmount(i) + e, !0)
                        }), user.savePassives(), user.set({
                            todayGachaPlayTimes: user.get("todayGachaPlayTimes") + 1,
                            actionName: "wingacha" + this.currentSector,
                            actionEpisode: user.get("episode"),
                            actionLevel: user.get("level"),
                            actionPrice: this.price
                        }), application.playSound("gachaWindowPassivesPrize")
                }
                user.get("gachaAvailable") ? (this.$("#againGacha").fadeIn(300), this.price = Config.gacha.price) : this.$("#closeGacha").fadeIn(300)
            },
            start: function() {
                user.set({
                    coins: new ObscureNumber(user.get("coins") - this.price),
                    actionName: "buygacha",
                    actionEpisode: user.get("episode"),
                    actionLevel: user.get("level"),
                    actionPrice: this.price
                }, {
                    validate: !0
                }) ? this.process() : (this.close(), new GachaWindow)
            },
            process: function() {
                this.$("#startGacha").hide(), this.$("#againGacha").hide(), this.$("#freeGacha").hide(), this.$("#waitGacha").show(), this.$("#gachaResultBlock").fadeOut(300), this.$(".gachaCharacter").removeClass("gachaCharacterSad gachaCharacterHappy").addClass("gachaCharacterAnimation"), this.$(".gachaCenter").removeClass("gachaCenterHappy").addClass("gachaCenterAnimation"), application.playSound("gachaWindowThumbler");
                var e = _.bind(function() {
                    for (var e = 8, i = this.calcWinSector(), t = 1440 + e, o = this.currentDeg; this.currentSector != i;) this.currentSector = (this.currentSector + Config.gacha.sectors.length - 1) % Config.gacha.sectors.length, t += 360 / Config.gacha.sectors.length;
                    var s = this.$(".gachaRound"),
                        n = .2,
                        a = .2,
                        r = .6,
                        l = 2 * t / (n * n + 2 * n * a + 2 * n * r - 4 * n * r / 3),
                        d = l * n / Math.sqrt(r),
                        c = 0,
                        u = function() {
                            this.css = function(e) {
                                e = 1 - e;
                                var i = 0;
                                n > e ? i += l * e * e / 2 : (i += l * n * n / 2, e -= n, a > e ? i += l * n * e : (i += l * n * a, e -= a, i += l * n * e - 2 * d * e * Math.sqrt(e) / 3));
                                var t = Math.round(i * Config.gacha.sectors.length / 360);
                                return t != c && (c = t, application.playSound("gachaWindowWhip")), s.setAngle(o + i + "deg"), {}
                            }
                        };
                    s.animate({
                        path: new u
                    }, 8e3, "linear");
                    var h = _.bind(function() {
                        if (this.currentDeg += t - e, "IE" === platform.name && "8" === platform.version.charAt(0)) {
                            var i = this.currentDeg * Math.PI / 180,
                                o = Math.cos(i),
                                n = Math.sin(i);
                            s.css({
                                zIndex: "0",
                                msFilter: '\'progid:DXImageTransform.Microsoft.Matrix(sizingMethod="auto expand", M11 = ' + o + ", M12 = " + -n + ", M21 = " + n + ", M22 = " + o + ")'"
                            });
                            var a = s.attr("style");
                            s.attr("style", a.replace("msFilter", "-ms-filter"));
                            var r = s.width(),
                                l = s.height();
                            s.css({
                                "margin-left": -Math.round((r - this.initialGachaSize.w) / 2),
                                "margin-top": -Math.round((l - this.initialGachaSize.h) / 2)
                            })
                        }
                        this.$(".gachaCharacter").removeClass("gachaCharacterAnimation"), this.$(".gachaCenter").removeClass("gachaCenterAnimation"), this.$("#waitGacha").fadeOut(300), this.$(".gachaBlackout").fadeIn(300, _.bind(function() {
                            user.get("freeGacha") && user.set("freeGacha", !1), this.shadow = !0, "fail" !== Config.gacha.sectors[this.currentSector].type ? (this.$(".gachaSector" + (this.currentSector + 1)).find(".gachaItem").delay(300).ourAnimate({
                                scale: 1.5
                            }, 300, "linear").ourAnimate({
                                scale: 1
                            }, 300, "linear"), this.$("#gachaResult").html(messages.gachaPrizes[this.currentSector]), application.playSound("gachaWindowWin"), this.$(".gachaCharacter").addClass("gachaCharacterHappy"), this.$(".gachaCenter").addClass("gachaCenterHappy")) : (this.$("#gachaResult").html(messages.gachaFail), application.playSound("gachaWindowLose"), this.$(".gachaCharacter").addClass("gachaCharacterSad")), this.$("#gachaResultBlock").fadeIn(300), setTimeout(_.bind(function() {
                                this.getPrize()
                            }, this), 1300)
                        }, this))
                    }, this);
                    s.ourAnimate({
                        rotate: "-=" + e + "deg"
                    }, 1e3, "easeInOutQuad", h)
                }, this);
                this.shadow ? this.$(".gachaBlackout").fadeOut(300, e) : setTimeout(e, 300)
            }
        }),
        EverydayBonusWindow = TWindow.extend({
            templateClass: ".everydayBonusWindow_template",
            events: {
                "click .getPrize": "getPrize",
                "click .close": "close",
                "click .needPublicCheckbox": "togglePublicCheckbox"
            },
            offPublicCheckbox: function() {
                this.needPublic = !1, this.$(".needPublicCheckbox").removeClass("checkboxOn").addClass("checkboxOff")
            },
            onPublicCheckbox: function() {
                this.needPublic = !0, this.$(".needPublicCheckbox").removeClass("checkboxOff").addClass("checkboxOn")
            },
            togglePublicCheckbox: function() {
                this.needPublic ? this.offPublicCheckbox() : this.onPublicCheckbox()
            },
            findPrizeOnDay: function(e) {
                return Config.everydayBonus.prizes[e]
            },
            processPrizeOrAddInParams: function(e, i) {
                return "coins" == e.type && (i.coins = new ObscureNumber(user.get("coins").get() + e.amount)), i
            },
            getPrize: function() {
                this.options.seria > Config.everydayBonus.prizes.length && (this.options.seria = 0);
                var e = this.findPrizeOnDay(this.options.seria),
                    i = {
                        everydayBonusSeria: (this.options.seria + 1) % Config.everydayBonus.prizes.length,
                        everydayBonusCollected: 1
                    };
                if (this.processPrizeOrAddInParams(e, i), user.set(i), this.needPublic && ("spmobage" !== network || "phonegap" == network && "facebook" == window.phonegapNetwork))
                    if (("facebook" === network || "facebook" == window.phonegapNetwork) && Config.openGraphEnabled && openGraph.everydayBonus) {
                        var t = {};
                        t[openGraph.everydayBonus.type] = openGraph.everydayBonus.url, publishStory(openGraph.everydayBonus.action, t)
                    } else user.defaultPublication("everydayBonusPublication");
                this.close()
            },
            onOpen: function() {
                this.onPublicCheckbox();
                for (var e = 0; e < Config.everydayBonus.prizes.length; e++) {
                    var i = this.findPrizeOnDay(e);
                    "coins" == i.type && this.$(".prizeOnDay_" + e + " .prizeOnDayAmount").html(i.amount), i.name ? this.$(".prizeOnDay_" + e).addClass("everyDayBonusPrize_" + i.name) : this.$(".prizeOnDay_" + e).addClass("everyDayBonusPrize_" + i.type)
                }
                this.$(".collected").removeClass("collected"), this.$(".today").removeClass("today"), this.$(".needPublicBlock").hide(), window.mobile || this.$(".getPrize").hide();
                for (var e = 0; e < this.options.seria; e++) this.$(".prizeOnDay_" + e).addClass("collected");
                this.$(".prizeOnDay_" + this.options.seria).addClass("today"), setTimeout(_.bind(function() {
                    application.playSound("everydayBonusWindow"), window.mobile || this.$(".prizeOnDay_" + this.options.seria + " .prizeCollectedBg").fadeIn(4e3), this.$(".prizeOnDay_" + this.options.seria + " .prizeOnDayImg").delay(500).ourAnimate({
                        scale: 1.3
                    }, 250).ourAnimate({
                        scale: 1
                    }, 250), window.mobile ? (this.$(".needPublicBlock").addClass("needPublicBlockShow"), "phonegap" == network && "facebook" == window.phonegapNetwork && (this.$(".needPublicBlock.needPublicBlockShow").css("visibility", "visible"), this.$(".getPrize").addClass("facebook")), this.$(".getPrize").addClass("getPrizeShow")) : (this.$(".needPublicBlock").fadeIn(1e3), this.$(".getPrize").fadeIn(1e3))
                }, this), 1200), TWindow.prototype.onOpen.call(this)
            }
        });
    EverydayBonusWindow.prototype.findPrizeOnDay = function(e) {
        for (var i = Config.everydayBonus.prizes[e], t = 0; t < i.length; t++)
            if (!(i[t].available && i[t].available > (user.get("episode") - 1) * Config.levelsInEpisode + user.get("level"))) return i[t]
    }, EverydayBonusWindow.prototype.processPrizeOrAddInParams = function(e, i) {
        return "coins" == e.type && (i.coins = new ObscureNumber(user.get("coins").get() + e.amount)), "powerUp" == e.type && (user.setPowerUpAmount(e.name, user.getPowerUpAmount(e.name) + 1, !0), i.powerUps = user.calcPowerUps()), "passive" == e.type && (user.setPassiveAmount(e.name, user.getPassiveAmount(e.name) + 1, !0), user.savePassives()), "gacha" == e.type && (user.set("freeGacha", !0), new GachaWindow({
            firstPriority: !0
        })), i
    };
    var OfferWindow = TWindow.extend({
            events: {
                "click .setupOfferBtn": "start",
                "click .close": "close"
            },
            initialize: function() {
                this.templateClass = ".advWindow" + this.options.offer.name + "_template", TWindow.prototype.initialize.call(this)
            },
            start: function() {
                "vkontakte" == network && (vkLastProduct = !1, VK.callMethod("showOrderBox", {
                    type: "offers",
                    offer_id: this.options.offer.id
                }), this.checkInterval = setInterval(_.bind(this.checkSuccess, this), 1e3)), "test" == network && (this.close(), user.trigger("completeOffer", this.options.offer.id)), this.options.offer.onClickOfferWindow && this.options.offer.onClickOfferWindow()
            },
            checkSuccess: function() {
                callService("../../../levelbase/src/services/checkoffercompleted.php", _.bind(function(e) {
                    "yes" != e || this.closed || (this.close(), user.trigger("completeOffer", this.options.offer.id), setCookie("lastCompletedOfferTime", application.getCurrentServerTime()))
                }, this), function() {}, {
                    offerId: this.options.offer.id
                })
            },
            onOpen: function() {
                this.$el.removeClass("addedToGroup").addClass("notAddedToGroup"), this.checkInterval = !1, TWindow.prototype.onOpen.call(this), "vkontakte" == network && this.checkSuccess()
            },
            close: function() {
                this.checkInterval !== !1 && clearInterval(this.checkInterval), setCookie("offer_" + this.options.offer.id, 1, new Date((new Date).getTime() + 6048e5).toUTCString()), TWindow.prototype.close.call(this)
            }
        }),
        CompleteOfferWindow = TWindow.extend({
            events: {
                "click .setupOfferBtn": "close",
                "click .close": "close"
            },
            initialize: function() {
                this.templateClass = ".advWindow" + this.options.offer.name + "_template", TWindow.prototype.initialize.call(this)
            },
            open: function() {
                TWindow.prototype.open.call(this), user.set("coins", new ObscureNumber(user.get("coins") + this.options.offer.prize), {
                    notSave: !0
                }), this.$el.removeClass("notAddedToGroup").addClass("addedToGroup")
            }
        }),
        PunishWindow = TWindow.extend({
            templateClass: ".punishWindow_template",
            events: {
                "click .close": "close",
                "click .punishNo": "close",
                "click .punishYes": "buyPunish"
            },
            getProduct: function() {
                for (var e in prices)
                    if ("punish" === prices[e].type) return prices[e]
            },
            buyPunish: function() {
                user.get("freePunish") ? (user.unset("freePunish"), $(".punish").removeClass("free"), callServiceAddInQueue("../../../levelbase/src/services/usefreepunish.php"), new PunishNowWindow) : showBuy(this.getProduct()), this.close()
            },
            onOpen: function() {
                user.get("freePunish") && this.$el.addClass("free"), this.$(".punishPrice").html(this.getProduct().desc.price), TWindow.prototype.onOpen.call(this)
            }
        }),
        PunishNowWindow = TWindow.extend({
            templateClass: ".punishNowWindow_template",
            onOpenSound: "finishwindow",
            events: {
                "click .close": "close",
                "click .punishNow": "close",
                "click .punishNowVariant1": "punish1",
                "click .punishNowVariant2": "punish2",
                "click .punishNowVariant3": "punish3"
            },
            onClose: function() {
                gameView.punish(this.punishType)
            },
            onOpen: function() {
                $(".punish").addClass("usingNow"), Game.once("endTurn", function() {
                    $(".punish").removeClass("usingNow")
                })
            },
            punish1: function() {
                this.punishType = 1, this.close()
            },
            punish2: function() {
                this.punishType = 2, this.close()
            },
            punish3: function() {
                this.punishType = 3, this.close()
            }
        }),
        Good = Backbone.Model.extend({
            defaults: {
                type: null,
                buyedTime: null,
                alreadySeen: null,
                name: null,
                active: !0,
                refreshInterval: null,
                timeToFinish: null
            },
            openPromoWindow: function() {
                window.mobile && "unlimitedLifes" != this.get("name") || new GoodsPromoWindow({
                    productType: this.get("type"),
                    productName: this.get("name")
                })
            },
            initialize: function() {
                this.set("name", Goods.NAMES[this.get("type")]), this.get("workDays") || this.set("workDays", Config.goods[this.get("name")].workDays), this.on("change:active", function(e, i) {
                    i || (goods.remove(this), this.get("alreadySeen") || (this.set("alreadySeen", 0), "main" == application.get("page") ? this.openPromoWindow() : application.once("main", this.openPromoWindow, this)))
                }, this), this.set("refreshInterval", setInterval(_.bind(this.refresh, this), 1e3)), setTimeout(_.bind(this.refresh, this), 0), new(eval(Config.goods[this.get("name")].viewClass))({
                    model: this
                })
            },
            refresh: function(e) {
                var i = this.get("buyedTime") + 24 * this.get("workDays") * 3600 - application.getCurrentServerTime();
                0 >= i ? (clearInterval(this.get("refreshInterval")), this.set({
                    active: !1,
                    refreshInterval: null
                })) : (e && this.set("timeToFinish", 0), this.set("timeToFinish", i))
            }
        }),
        Goods = Backbone.Collection.extend({
            model: Good,
            getGoodProduct: function(e) {
                for (var i in prices)
                    if ("good" == prices[i].type && prices[i].goodName == e) return prices[i]
            },
            initialize: function() {
                Goods.NAMES = {};
                for (var e in Config.goods) Goods.NAMES[Config.goods[e].productId] = e
            },
            buyGood: function(e) {
                showBuy(this.getGoodProduct(e))
            },
            isAlreadyBetter: function(e, i) {
                if (!i) return !1;
                var t = 24 * i * 3600;
                return goods.any(function(i) {
                    return i.get("type") === e && i.get("timeToFinish") > t
                })
            },
            goodBuyed: function(e, i) {
                application.playSound("buyGood");
                var t = new Good({
                    type: e,
                    buyedTime: application.getCurrentServerTime(),
                    alreadySeen: 0
                });
                i && (t.set("workDays", i), t.refresh());
                for (var o = goods.where({
                    type: e
                }), s = 0; s < o.length; s++) {
                    var n = o[s];
                    clearInterval(n.get("refreshInterval")), this.remove(n)
                }
                this.add(t), this.trigger(t.get("name") + "Buyed")
            },
            checkProduct: function(e) {
                var i = this.findWhere({
                    name: e
                });
                return i ? i.get("active") : !1
            }
        }),
        Task = Backbone.Model.extend({
            defaults: {
                completed: !1,
                collectedAmount: 0
            },
            initialize: function() {
                this.set("cssClass", Config.tasks[this.get("type")].cssClass), this.set("name", Config.tasks[this.get("type")].name), Game.on(this.get("event"), this.tick, this)
            },
            turnOff: function() {
                return !0
            }
        });
    Task.prototype.tick = function() {
        this.set("collectedAmount", this.get("collectedAmount") + 1), this.get("amount") > 0 && (this.set("amount", this.get("amount") - 1), 0 === this.get("amount") && (this.set("completed", !0), this.turnOff() && Game.off(this.get("event"), this.tick, this)))
    }, Task.prototype.animateCollect = function(e, i, t, o, s) {
        if (!e.length) return t(), void 0;
        var n = e.clone();
        n.removeAttr("id"), Figure.blockedAnimations.append(n), n.alignTo(e), n.find(".arrow").remove(), n.find(".decorator").remove(), void 0 !== o && n.delay(o);
        var a = s || this.$div.find(".taskIco");
        void 0 === this.icoSize && (this.icoSize = parseInt(a.css("width"))), koef = this.icoSize / Config.cellWidth;
        var r = {
            left: -(1 - koef) * Config.cellWidth / 2,
            top: -(1 - koef) * Config.cellHeight / 2
        };
        n.ourAnimate({
            scale: 1.2
        }, 3 * Game.get("speed")).ourAnimate({
            target: a,
            ajust: r,
            scale: .75,
            rotate: this.getAnimateCollectRotation()
        }, 6 * Game.get("speed"), void 0, _.bind(function() {
            Game.set("score", Game.get("score") + i), this.showPoints(n, i)
        }, this)).ourAnimate({
            opacity: 0
        }, 2 * Game.get("speed"), void 0, function() {
            t(), n.remove()
        })
    }, Task.prototype.showPoints = function(e, i) {
        Game.trigger("showFieldPoints", e, i, "collectTaskElem")
    }, Task.prototype.getAnimateCollectRotation = function() {
        return "360deg"
    }, Task.prototype.turnOff = function() {
        return !1
    }, Task.prototype.animateCollect = function(e, i, t, o, s, n, a, r) {
        var l = e.clone();
        l.removeAttr("id"), l.find(".cellStone").removeClass("cellCoeffBlockLight").removeClass("cellCoeffBlockAnimation"), l.find(".cellStone").removeClass("deformateLeft").removeClass("deformateRight").removeClass("deformateUp").removeClass("deformateDown"), l.find(".cellStone").removeClass("deformateClickYes").removeClass("deformateClickNo"), l.find(".decorator").remove(), Figure.blockedAnimations.append(l), l.alignTo(e), Game.set("cellAnimations", Game.get("cellAnimations") + 1), l.addClass("disabledShadow").ourAnimate({
            top: "-=30px"
        }, 3 * Game.get("speed")).delay(i).queue(function(e) {
            o(), e()
        });
        var d, c, u = .6;
        n ? window.mobile ? (c = $("#deleteColorPowerUp"), d = {
            left: 20,
            top: 20
        }) : (c = $(".powerUpCatAnimation"), d = {
            left: 40,
            top: 20
        }) : (c = void 0 !== r ? r : this.$div.find(".taskIco"), void 0 === a && (a = 1), void 0 === this.icoSize && (this.icoSize = parseInt(c.css("width"))), u = this.icoSize / (Config.cellWidth * a), d = {
            left: -(1 - u) * Config.cellWidth * a / 2,
            top: -(1 - u) * Config.cellHeight * a / 2
        }), l.ourAnimate({
            target: c,
            ajust: d,
            animation: Library.collectFly,
            options: {
                targetScale: u,
                vy: 500,
                easing: Library.linearEasing
            }
        }, 800, void 0, function() {
            Game.set("score", Game.get("score") + t)
        }), n || l.ourAnimate({
            opacity: 0
        }, 2 * Game.get("speed")), l.queue(function(e) {
            s(), l.remove(), Game.set("cellAnimations", Game.get("cellAnimations") - 1), e()
        })
    };
    var Tasks = Backbone.Collection.extend({
            model: Task,
            initialize: function() {
                _.each(application.level.task, function(description) {
                    var taskClass = eval(description.type);
                    this.add(new taskClass({
                        description: description
                    }))
                }, this), this.on("change:completed", function() {
                    this.findWhere({
                        completed: !1
                    }) || (Game.set("fullRunning", !1), Game.win())
                })
            }
        }),
        GameClass = Backbone.Model.extend({
            defaults: {
                score: 0,
                isPlaying: !0,
                selectedPowerUp: !1,
                running: !1,
                fullRunning: !1,
                maxSpeed: 80,
                minSpeed: 50,
                buyedMoves: 0,
                buyedTime: 0,
                amountAfterTurnProcess: 1e3,
                useFallDownSpecialCells: !1,
                bonusLevelAnimations: 0
            },
            speedUp: function() {
                this.set("speed", this.get("speed") - 10, {
                    validate: !0
                })
            },
            validate: function(e) {
                return e.speed < this.get("minSpeed") ? (this.set("speed", this.get("minSpeed")), "too low") : void 0
            },
            neighbors: function(e, i) {
                for (var t = [
                    [0, -1],
                    [0, 1],
                    [-1, 0],
                    [1, 0]
                ], o = 0; o < t.length; o++) {
                    var s = e.x + t[o][0],
                        n = e.y + t[o][1];
                    Game.inField(s, n) && i(Game.field[n][s])
                }
            },
            each: function(e, i) {
                for (var t = 0; t < Config.rows; t++)
                    for (var o = 0; o < Config.cols; o++) Game.inField(o, t) && e.call(i, Game.field[t][o])
            },
            initialize: function() {
                this.powerUps = new PowerUps(Config.listPowerUps()), this.fallDownSpecialCells = [], this.createAfterTurnProcessor(), this.on("change:running", function(e, i) {
                    i ? 0 === Game.get("animations") && this.endTurn() : (this.set("fullRunning", !1), this.unset("selected"))
                }, this), this.set("speed", this.get("maxSpeed")), this.on("endTurn", function() {
                    this.set("speed", this.get("maxSpeed"))
                }), this.configureSuggest()
            }
        });
    GameClass.prototype.configureSuggest = function() {
        this.on("change:suggestSwitch", function(e, i) {
            i ? this.set("suggestTimeout", setTimeout(_.bind(function() {
                this.get("suggestFromForce") ? this.set("suggest", this.get("suggestFromForce")) : this.set("suggest", this.findValidMove())
            }, this), Config.suggestTimeout)) : (this.get("suggestTimeout") && clearTimeout(this.get("suggestTimeout")), this.set("suggest", !1))
        }, this), this.on("change:selectedPowerUp", function(e, i) {
            i !== !1 && this.set("suggestSwitch", !1)
        }, this);
        var e = function() {
            Game.get("fullRunning") && (Game.set("suggestSwitch", !1), Game.set("suggestSwitch", !0))
        };
        this.on("change:fullRunning", function(i, t) {
            t ? e() : this.set("suggestSwitch", !1)
        }, this), this.on("validMove", function() {
            this.set("suggestSwitch", !1), this.set("suggest", !1)
        }, this), this.on("invalidMove", e), this.on("addMoves", e), this.on("endTurn", e), this.on("change:selected", function(i, t) {
            t && e()
        }, this)
    }, GameClass.prototype.isValidMove = function() {
        console.log("isValiedMove")
    }, GameClass.prototype.isRealValidMove = function(e) {
        return e.first.isMovable() && e.second.isMovable() && this.isValidMove(e)
    }, GameClass.prototype.makeMove = function() {
        console.log("makeMove")
    }, GameClass.prototype.explode = function() {
        console.log("explode")
    }, GameClass.prototype.existValidMove = function() {
        console.log("exist valid move")
    }, GameClass.prototype.noExistingMove = function() {
        console.log("exist valid move")
    }, window.traces = [], GameClass.prototype.animate = function(e, i) {
        if (!window.mobile && !production) {
            var t = {
                st: (new Error).stack
            };
            window.traces.push(t)
        }
        return this.set("animations", this.get("animations") + 1), _.once(function() {
            window.mobile || production || (window.traces = _.without(window.traces, t)), e && e.call(i), Game.set("animations", Game.get("animations") - 1)
        })
    }, GameClass.prototype.canMove = function() {
        var e = !0;
        return void 0 !== this.get("moves") && (e = this.get("moves").get() > 0), this.isEndTurn() && this.get("selectedPowerUp") === !1 && e && !inChangeProcess
    }, GameClass.prototype.move = function(e) {
        return this.isRealValidMove(e) ? ("move" == this.get("playType") ? this.get("moves").get() > 0 && (this.set("moves", new ObscureNumber(this.get("moves") - 1)), this.trigger("beginUserMove"), this.set("amountAfterTurnProcess", 0), this.get("moves") == Config.lessMovesAmount && this.once("afterEndTurn", function() {
            this.get("running") && !application.windows.anyWindowOpen() && this.trigger("showMessage", sprintf(messages.lessMovesText, {
                numMoves: Config.lessMovesAmount
            }), "lessMovesText")
        }, this)) : this.set("amountAfterTurnProcess", 0), this.trigger("validMove", e, Game.animate(function() {
            this.makeMove(e)
        }, this)), void 0) : (this.trigger("invalidMove", e, Game.animate()), void 0)
    }, GameClass.prototype.triggerEndTurn = function() {
        this.trigger("endTurn"), this.trigger("afterEndTurn")
    }, GameClass.prototype.endTurn = function() {
        this.get("running") && !this.existValidMove() ? this.noExistingMove() : this.triggerEndTurn()
    }, GameClass.prototype.runGameTimer = function() {
        this.set("gameTimer", setInterval(_.bind(function() {
            this.get("running") && this.get("fullRunning") && this.get("timeout") > 0 && !application.windows.anyWindowOpen() && (this.set("timeout", this.get("timeout") - 100), this.get("timeout") <= 0 && (this.get("animations") > 0 ? this.once("endTurn", function() {
                this.get("running") && (this.set("running", !1), this.trigger("outOfTime"))
            }, this) : (this.set("running", !1), this.trigger("outOfTime"))))
        }, this), 100))
    }, GameClass.prototype.stopGameTimer = function() {
        this.has("gameTimer") && (clearInterval(this.get("gameTimer")), this.unset("gameTimer"))
    };
    var inChangeProcess = !1,
        bugHunting = !1;
    GameClass.prototype.prepare = function() {
        if ("bonus" !== application.level.num) {
            var e = application.level.moves;
            this.set({
                moves: new ObscureNumber(e),
                playType: "move"
            }), this.on("endTurn", function() {
                setTimeout(_.bind(function() {
                    0 == this.get("moves").get() && this.get("running") && this.trigger("outOfMoves")
                }, this), 0)
            }, this)
        } else this.set({
            timeout: 1e3 * application.level.moves,
            playType: "time"
        });
        this.set("animations", 0), this.on("change:animations", function(e, i) {
            if (bugHunting) throw console.log(window.traces), console.log(window.traces[0].st), "BUG!!! check console";
            if (0 === i && !inChangeProcess) {
                var t = _.bind(function() {
                    application.stopSound("falldown"), inChangeProcess = !0, this.explode(), 0 === this.get("animations") && (Game.trigger("fallDownStart"), this.fallDown(), this.speedUp(), 0 === this.get("animations") && (this.afterAnimatonProcess(), this.get("running") && 0 === this.get("animations") && this.afterTurnProcess(), 0 === this.get("animations") && this.endTurn())), inChangeProcess = !1
                }, this);
                window.mobile || production ? t() : (bugHunting = !0, setTimeout(function() {
                    bugHunting = !1, t()
                }, 0))
            }
        }, this), this.createField(), this.createFieldBackground(), this.trigger("prepared")
    }, GameClass.prototype.createAfterTurnProcessor = function() {
        this.afterTurnProcessor = new Processor("amountAfterTurnProcess", [])
    }, GameClass.prototype.afterAnimatonProcess = function() {
        ("undefined" == typeof WellCell || (WellCell.process(), 0 === this.get("animations"))) && "undefined" != typeof PalmCell && (PalmCell.process(), 0 !== this.get("animations"))
    }, GameClass.prototype.afterTurnProcess = function() {
        this.afterTurnProcessor.run()
    }, GameClass.prototype.start = function() {
        this.trigger("start"), "time" == this.get("playType") && this.runGameTimer(), this.set("running", !0), this.existValidMove() || this.noExistingMove()
    }, GameClass.prototype.exit = function() {
        this.set("running", !1), "time" == this.get("playType") && this.stopGameTimer(), this.trigger("fail")
    }, GameClass.prototype.win = function() {
        this.set("running", !1), "time" == this.get("playType") && this.stopGameTimer();
        var e = function() {
                for (var i = 0, t = 0; t < Config.rows; t++)
                    for (var o = 0; o < Config.cols; o++) this.field[t][o] && this.field[t][o].beforeGameFinish() && i++;
                0 == i ? this.trigger("win") : this.once("endTurn", e, this)
            },
            i = _.bind(function() {
                "bonus" !== application.level.num ? this.trigger("beforeWin", _.bind(function() {
                    e.call(this)
                }, this)) : Game.get("bonusLevelAnimations") > 0 ? Game.once("change:bonusLevelAnimations", i) : e.call(this)
            }, this);
        this.isEndTurn() ? i() : this.once("endTurn", i)
    }, GameClass.prototype.isEndTurn = function() {
        return 0 == this.get("animations") && !bugHunting
    }, GameClass.prototype.inField = function(e, i) {
        return 0 > e || 0 > i || e >= Config.cols || i >= Config.rows ? !1 : this.field[i][e]
    }, GameClass.prototype.addItem = function(e, i, t) {
        void 0 === t && (t = e.y), this.field[t][e.x] = e, e.onField = !0, i !== !1 && (e.createDiv(), e.y < 0 ? e.$div.css({
            opacity: 0
        }) : e.$div.css({
            opacity: 1
        }))
    }, GameClass.prototype.initCellForFallDown = function(e, i) {
        if (this.fallDownSpecialCells.length > 0 && this.get("useFallDownSpecialCells") && (this.set("useFallDownSpecialCells", !1), this.fallDownSpecialCells[0].offset--, this.fallDownSpecialCells[0].offset < 0)) {
            var t = this.fallDownSpecialCells[0].cellClass,
                o = this.fallDownSpecialCells[0].type;
            return this.fallDownSpecialCells.shift(), new t(e, i, !1, o)
        }
        var s = application.level.colors.charAt(Math.floor(Math.random() * application.level.colors.length)),
            n = CellsRegistry.initCell(s, e, i, !1, s);
        return this.addAttributeForCell(n), n
    }, GameClass.prototype.addAttributeForCell = function() {}, window.lastFallDownSound = 0, GameClass.prototype.fallDown = function() {
        this.set("useFallDownSpecialCells", !0);
        for (var e = !1, i = 0; i < Config.cols; i++) {
            for (var t = 0, o = Config.rows - 1; o >= 0; o--)
                if (this.field[o][i] && this.field[o][i].isMovable())
                    for (var s = Config.rows - 1; s > o; s--)
                        if (void 0 === this.field[s][i]) {
                            this.field[s][i] = this.field[o][i], this.field[o][i] = void 0, this.field[s][i].fallDown(s, t), t++;
                            break
                        }
            for (var n = -1, o = Config.rows - 1; o >= 0; o--) void 0 === this.field[o][i] && (e = !0, this.addItem(this.initCellForFallDown(n, i), !0, o), this.field[o][i].setY(n), this.field[o][i].fallDown(o, t), t++, n--)
        }
        e && application.playSound("fallDown")
    }, GameClass.prototype.createFieldBackground = function() {
        for (var e = 0; e < Config.rows; e++)
            for (var i = 0; i < Config.cols; i++)
                if (" " != application.level.map[e].charAt(i)) {
                    var t = {
                        left: !1,
                        right: !1,
                        up: !1,
                        down: !1
                    };
                    (0 === e || " " == application.level.map[e - 1].charAt(i)) && (t.up = !0), (e === Config.rows - 1 || " " == application.level.map[e + 1].charAt(i)) && (t.down = !0), (0 === i || " " == application.level.map[e].charAt(i - 1)) && (t.left = !0), (i === Config.cols - 1 || " " == application.level.map[e].charAt(i + 1)) && (t.right = !0), this.trigger("createFieldBackground", e, i, t)
                }
    }, GameClass.prototype.createField = function() {
        this.field = [];
        for (var e = 0; e < Config.rows; e++) {
            this.field.push([]);
            for (var i = 0; i < Config.cols; i++) this.field[e].push(null)
        }
        for (var e = 0; e < Config.rows; e++)
            for (var i = 0; i < Config.cols; i++) " " != application.level.map[e].charAt(i) && this.addItem(CellsRegistry.initCell(application.level.map[e].charAt(i), e, i, !0), !1)
    }, GameClass.prototype.endTurn = function() {
        var e = function(i, t) {
            t || (this.off("change:cellAnimations", e, this), this.triggerEndTurn())
        };
        this.get("running") && !this.existValidMove() ? this.noExistingMove() : this.get("cellAnimations") ? this.on("change:cellAnimations", e, this) : this.triggerEndTurn()
    };
    var oldIsEndTurn = GameClass.prototype.isEndTurn;
    GameClass.prototype.isEndTurn = function() {
        return 0 != this.get("cellAnimations") ? !1 : oldIsEndTurn.call(this)
    };
    var PowerUp = Backbone.Model.extend({
            run: function() {
                this.set("runned", !0), this.execute()
            },
            initialize: function() {
                this.on("change:used", function(e, i) {
                    i && user.usePowerUp(e)
                })
            },
            execute: function() {}
        }),
        PowerUps = Backbone.Collection.extend({
            model: PowerUp
        }),
        AchievmentsWindow = TWindow.extend({
            templateClass: ".achievmentswindow_template",
            events: {
                "click .close": "close"
            },
            onOpen: function() {
                setTimeout(_.bind(function() {
                    this.$(".achievmentsBlocks").empty();
                    var e = this.options.name;
                    if (user.achievements.each(function(e) {
                            if (!e.isDisabled()) {
                                var i = this.$(".invisible .achievmentsBlock").clone();
                                i.addClass(e.get("name") + "AchievmentsBlock"), this.$(".achievmentsBlocks").append(i);
                                var t = Config.achievementsParams[e.get("name")];
                                e.isAvailable() || (i.addClass("achievmentsBlockClosed"), i.find(".achievmentsAvailableLevel").html((Config.achievementsAvailable[e.get("name")].episode - 1) * Config.levelsInEpisode + Config.achievementsAvailable[e.get("name")].level));
                                for (var o = 0; o < t.length; o++) {
                                    if ($achivment = this.$(".invisible .achievment").clone(), $achivment.addClass("achievment" + (o + 1)), e.isAvailable()) {
                                        var s = e.get("level");
                                        s > o && $achivment.addClass("achievmentPassed"), o > s && $achivment.addClass("achievmentClosed"), o == s && $achivment.find(".achievmentProgressLine").css("width", e.calcProgress() + "%")
                                    } else $achivment.addClass("achievmentClosed");
                                    $achivment.attr("title", messages.achievmentTitles[e.get("name")][o]), e.isEnd() || $achivment.find(".achievmentProgressBar").attr("title", e.getProgress() + "/" + e.getTotal()), $achivment.find(".achievmentPrizeAmount").html(t[o].prize), $achivment.find(".achievmentName").html(messages.achievmentTitles[e.get("name")][o]), $achivment.find(".achievmentNotice").html(messages.achievmentNoties[e.get("name")][o]), i.find(".achievmentsBlockList").append($achivment)
                                }
                            }
                        }), void 0 !== e) {
                        var i = user.achievements.findWhere({
                                name: e
                            }),
                            t = this.$("." + i.get("name") + "AchievmentsBlock .achievment" + (i.get("level") + 1));
                        t.css("z-index", 1).delay(100).ourAnimate({
                            scale: 1.5
                        }, 350, "linear").ourAnimate({
                            scale: 1
                        }, 350, "linear")
                    }
                    TWindow.prototype.onOpen.call(this)
                }, this), 0)
            }
        }),
        BaseCoinsWindow = TWindow.extend({
            templateClass: ".addCoinsWindow_template",
            events: {
                "click .inviteFriendForBonus": "inviteFriend",
                "click .coinsWindowCoinsBuy": "buyProduct",
                "click .close": "close"
            },
            inviteFriend: function() {
                this.close(), user.inviteBestFriends()
            },
            buyProduct: function(e) {
                var i = $(e.currentTarget).attr("data-priceId");
                this.close(), showBuy(prices[i])
            },
            onOpen: function() {
                this.render(), TWindow.prototype.onOpen.call(this)
            },
            render: function(e) {
                this.$(".bonusForInvite").html(bonusForInvite), this.$(".coinsWindowProducts").empty();
                var i = 0;
                for (var t in prices) {
                    var o = prices[t];
                    if ("coins" === o.type && !o.superOffer && o.action === e) {
                        var s = this.$(".invisible .addCoinsProduct").clone();
                        i++, s.addClass("addCoinsProduct" + i), o.oldAmount && s.find(".oldCoinsAmount").html(o.oldAmount), o.sale && (s.addClass("saleAction" + o.sale), s.find(".sale").text(o.sale)), s.find(".addCoinsAmount").html(o.amount), s.find(".addCoinsPrice").html(o.desc.price), s.find(".coinsWindowCoinsBuy").attr("data-priceId", t), s.attr("data-priceId", t), this.$(".coinsWindowProducts").append(s)
                    }
                }
            }
        }),
        AddCoinsWindow = BaseCoinsWindow.extend(),
        BaseCoinsAction = Backbone.Model.extend({
            checkIsRunningNow: function() {
                return user.get("coinsAction") ? user.get("coinsAction").start > application.getCurrentServerTime() || user.get("coinsAction").end < application.getCurrentServerTime() ? !1 : user.get("coinsAction").networks && user.get("coinsAction").networks.indexOf(network) < 0 ? !1 : !0 : !1
            },
            stop: function() {
                $("#main .coinsAction").off("click").hide()
            },
            openActionWindow: function() {
                new AddCoinsWindow
            },
            runTimer: function() {
                var e = _.bind(function() {
                    var i = user.get("coinsAction").end - application.getCurrentServerTime();
                    0 >= i ? (this.stop(), $("#coinsBlock").removeClass("specialOfferOn"), $("#main .coinsAction").removeClass(user.get("coinsAction").type + "CoinsAction"), clearInterval(e)) : $(".coinsBlockSpecialOffer .timeout").html(formatTime("%F:%i:%s", i))
                }, this);
                updateCoinsActionInterval = setInterval(e, 1e3), e()
            },
            process: function() {
                $("#coinsBlock").addClass("specialOfferOn"), $("#main .coinsAction").addClass(user.get("coinsAction").type + "CoinsAction").show().on("click", this.openActionWindow), this.runTimer(), this.run(), getCookie("coinsActionWindow") || (this.openActionWindow(), setCookie("coinsActionWindow", 1, new Date((new Date).getTime() + 2592e5).toUTCString()))
            },
            initialize: function() {
                this.checkIsRunningNow() && this.process()
            }
        }),
        InfoAction = BaseCoinsAction.extend({
            checkIsRunningNow: function() {
                return BaseCoinsAction.prototype.checkIsRunningNow.call(this) && "info" == user.get("coinsAction").type ? !0 : !1
            },
            stop: function() {
                AddCoinsWindow = this.previousAddCoinsWindow
            },
            run: function() {
                this.previousAddCoinsWindow = AddCoinsWindow, AddCoinsWindow = BaseCoinsWindow.extend({
                    templateClass: ".infoActionCoinsWindow_template"
                })
            }
        });
    Application.on("ready", function() {
        new InfoAction
    });
    var GiftAction = BaseCoinsAction.extend({
            checkIsRunningNow: function() {
                return BaseCoinsAction.prototype.checkIsRunningNow.call(this) && "gift" == user.get("coinsAction").type ? !0 : !1
            },
            stop: function() {
                user.off("buyProduct", this.onProductBuy, this), AddCoinsWindow = this.previousAddCoinsWindow
            },
            run: function() {
                user.on("buyProduct", this.onProductBuy, this), this.previousAddCoinsWindow = AddCoinsWindow, AddCoinsWindow = GiftActionCoinsWindow
            },
            onProductBuy: function(e) {
                if ("coins" === e.type) {
                    var i = user.get("coinsAction").prizes;
                    for (var t in prices)
                        if (e === prices[t] && i[t]) {
                            var o = i[t];
                            switch (o.type) {
                                case "good":
                                    for (var s in prices)
                                        if ("good" === prices[s].type && prices[s].goodName == o.name) {
                                            var n = prices[s];
                                            if (goods.isAlreadyBetter(n.goodType, o.workDays)) break;
                                            goods.goodBuyed(n.goodType, o.workDays), callService("../../../levelbase/src/services/giftaction.php", function() {}, function() {}, {
                                                goodName: n.goodName,
                                                workDays: o.workDays
                                            });
                                            var a = ["addThreeMoves", "starInField", "unlimitedKeys"].indexOf(n.goodName);
                                            a >= 0 && new ShopWindow({
                                                page: a
                                            });
                                            break
                                        }
                            }
                        }
                }
            }
        }),
        GiftActionCoinsWindow = BaseCoinsWindow.extend({
            templateClass: ".giftActionCoinsWindow_template",
            render: function() {
                BaseCoinsWindow.prototype.render.apply(this, arguments);
                var e = user.get("coinsAction").prizes;
                if (e)
                    for (var i in e) {
                        var t, o = e[i];
                        switch (o.type) {
                            case "good":
                                t = this.$(".invisible ." + o.name + "Gift").clone(), t.text(o.workDays + " " + plural(messages.days, o.workDays))
                        }
                        t && this.$('.addCoinsProduct[data-priceId="' + i + '"] .productGifts').append(t)
                    }
            },
            onOpen: function() {
                BaseCoinsWindow.prototype.onOpen.apply(this, arguments);
                var e = _.bind(function() {
                    var e = user.get("coinsAction").end - application.getCurrentServerTime();
                    0 >= e ? (clearInterval(this.updateCoinsActionInterval), delete this.updateCoinsActionInterval, this.close()) : this.$(".timeout").html(formatTime("%F:%i:%s", e))
                }, this);
                this.updateCoinsActionInterval = setInterval(e, 1e3), e()
            },
            onClose: function() {
                this.updateCoinsActionInterval && clearInterval(this.updateCoinsActionInterval), BaseCoinsWindow.prototype.onClose.apply(this, arguments)
            }
        });
    Application.on("ready", function() {
        new GiftAction
    });
    var BoringWindow = TWindow.extend({
            templateClass: ".boringWindow_template",
            events: {
                "click .close": "close",
                "click .oneWindowBtn": "inviteFriends"
            },
            initialize: function() {
                this.notInAppIds = allUsers.getBestForInvite(), this.notInAppIds.length >= 3 && TWindow.prototype.initialize.call(this)
            },
            onOpen: function() {
                this.render(), TWindow.prototype.onOpen.call(this)
            },
            inviteFriends: function() {
                return this.close(), socialNetwork.invite(this.notInAppIds), !1
            },
            render: function() {
                this.$("#missingFriendsBoringBlock").empty();
                for (var e = 0; 3 > e && e < this.notInAppIds.length; e++) {
                    var i = $($("#missingFriendCardTpl").html()),
                        t = this.notInAppIds[e];
                    i.find(".missingFriendName").text(users[t].first_name), i.find(".missingFriendPhoto").html(makeImg(users[t].photo, Config.basePhotoSize)), i.appendTo(this.$("#missingFriendsBoringBlock"))
                }
            }
        }, {
            process: function() {
                if (!Modernizr.touch && !window.mobile) {
                    var e = 0;
                    setInterval(function() {
                        application.windows.anyWindowOpen() ? e = 0 : (e++, e > 120 && new BoringWindow)
                    }, 1e3), $(document).on("mousemove touchmove mousedown touchstart mouseup touchend", function() {
                        e = 0
                    })
                }
            }
        }),
        ConnectionLostWindow = TWindow.extend({
            templateClass: ".connectionLost_template",
            events: {
                "click #connectionLostRefresh": "refresh",
                "click #connectionLostClose": "close"
            },
            onOpenSound: "losegame",
            onOpen: function() {
                var e = this.options.error || "default",
                    i = messages.connectionLostTitle[e] || messages.connectionLostTitle["default"],
                    t = messages.connectionLostText[e] || messages.connectionLostText["default"];
                this.$(".connectionLostTitle").html(i), this.$(".connectionLostText").html(t), this.options.close ? (this.$("#connectionLostRefresh").hide(), this.$("#connectionLostClose").show()) : (this.$("#connectionLostRefresh").show(), this.$("#connectionLostClose").hide()), TWindow.prototype.onOpen.call(this)
            },
            initialize: function() {
                ConnectionLostWindow.allreadyOpened || (ConnectionLostWindow.allreadyOpened = !0, application.windows.closeAll(), this.closed = this.shown = !1, this.once("open", this.open, this), application.windows.add(this, this.options))
            },
            refresh: function() {
                location.reload()
            }
        }),
        FriendsStillNotPlay = TWindow.extend({
            templateClass: ".friendsstillnotplay_template",
            events: {
                "click .close": "close",
                "click #intiveMissingFriends": "inviteFriends"
            },
            initialize: function() {
                this.notInAppIds = allUsers.getBestForInvite(), this.notInAppIds.length >= 3 && TWindow.prototype.initialize.call(this), setCookie("notInvite", 1, new Date((new Date).getTime() + 6048e5).toUTCString())
            },
            onOpen: function() {
                this.render(), TWindow.prototype.onOpen.call(this)
            },
            inviteFriends: function() {
                this.close(), socialNetwork.invite(this.notInAppIds)
            },
            render: function() {
                this.$(".addFriendBonus").html(bonusForInvite), this.$("#missingFriendsBlock").empty();
                for (var e = 0; 3 > e && e < this.notInAppIds.length; e++) {
                    var i = $($("#missingFriendCardTpl").html()),
                        t = this.notInAppIds[e];
                    i.find(".missingFriendName").text(users[t].first_name), i.find(".missingFriendPhoto").html(makeImg(users[t].photo, Config.basePhotoSize)), i.appendTo(this.$("#missingFriendsBlock"))
                }
            }
        }),
        GetCoinsForInviteWindow = TWindow.extend({
            templateClass: ".getCoinsForInviteWindow_template",
            events: {
                "click .close": "close",
                "click #intiveFriendsForCoins": "inviteFriends"
            },
            initialize: function() {
                this.notInAppIds = allUsers.getBestForInvite(), this.friendsInvited = !1, this.notInAppIds.length >= 3 && ("odnoklassniki" == network || "mailru" == network || "test" == network) && TWindow.prototype.initialize.call(this)
            },
            onClose: function() {
                var e = 0;
                this.friendsInvited && (e = Config.coinsForInvite), callService("../../../levelbase/src/services/getcoinsforinvite.php", function(i) {
                    "ok" == i && e > 0 && user.set({
                        coins: user.get("coins") + e
                    }, {
                        notSave: !0
                    })
                }, function() {}, {
                    coins: e
                })
            },
            onOpen: function() {
                this.render(), TWindow.prototype.onOpen.call(this)
            },
            inviteFriends: function() {
                socialNetwork.invite(this.notInAppIds, _.bind(function(e) {
                    e.length > 0 && (this.friendsInvited = !0, this.close())
                }, this))
            },
            render: function() {
                this.$(".coinsForInviteBonus").html(Config.coinsForInvite), this.$("#freeCoinsFriendsBlock").empty();
                for (var e = 0; 3 > e && e < this.notInAppIds.length; e++) {
                    var i = $(".invisible .coinsForInviteFriend").clone();
                    i.find(".name").text(users[this.notInAppIds[e]].first_name), i.find(".photo").html(makeImg(users[this.notInAppIds[e]].photo, Config.basePhotoSize)), this.$("#freeCoinsFriendsBlock").append(i)
                }
            }
        }),
        PublicationForBonusWindow = TWindow.extend({
            templateClass: ".publicationforbonuswindow_template",
            events: {
                "click .close": "close",
                "click #publishForBonus": "publish"
            },
            onClose: function() {
                setCookie("notPublish", 1, new Date((new Date).getTime() + 2592e5).toUTCString())
            },
            publish: function() {
                this.close(), user.defaultPublication("bonusPublication", function() {
                    user.set("coins", new ObscureNumber(user.get("coins") + publicationBonus), {
                        notSave: !0
                    }), callService("../../../levelbase/src/services/addpublicationbonus.php", function() {}, function() {})
                })
            }
        }),
        StripWindow = TWindow.extend({
            events: {
                "click .close": "close",
                "click .getStripRevard": "getRevard"
            },
            getRevard: function() {
                var e = this.options.model;
                e.getRevard() && this.close()
            },
            onOpen: function() {
                var e = this.options.model;
                e.each(function(e) {
                    new StripModelItemView({
                        el: this.$(".bonusOption." + e.get("id")),
                        item: e
                    })
                }), e.on("change:checked", this.renderProgress, this), this.renderProgress(), e.once("complete", this.renderComplete, this), this.renderComplete(), this.$(".stripAmount").html(Config.stripBonus[user.get("strip")]), TWindow.prototype.onOpen.call(this)
            },
            renderProgress: function() {
                var e = this.options.model,
                    i = e.where({
                        checked: !0
                    }).length;
                this.$(".stripCheckedAmount").html(i), this.$(".stripProgres").css("width", 100 * i / e.length + "%")
            },
            onClose: function() {
                var e = this.options.model;
                e.off(null, null, this);
                var i = this.options.strip;
                i.calcActive()
            },
            renderComplete: function() {
                var e = this.options.model;
                e.isCompleted() ? this.$(".getStripRevard").removeClass("disabled") : this.$(".getStripRevard").addClass("disabled")
            }
        }),
        SuperOfferWindow = TWindow.extend({
            templateClass: ".superOfferWindow_template",
            initialize: function() {
                SuperOfferWindow.getSuperOfferProduct() && TWindow.prototype.initialize.call(this)
            },
            events: {
                "click .superOfferBuy": "buy",
                "click .superOfferClose": "close"
            },
            buy: function() {
                this.close(), showBuy(SuperOfferWindow.getSuperOfferProduct())
            },
            onOpen: function() {
                var e = SuperOfferWindow.getSuperOfferProduct();
                this.$(".superOfferAmount").html(e.amount), this.$(".superOfferPrice").html(e.desc.price), TWindow.prototype.onOpen.call(this)
            },
            onClose: function() {
                setCookie("superoffer", 1, new Date((new Date).getTime() + 432e6).toUTCString())
            }
        }, {
            getSuperOfferProduct: function() {
                for (var e in prices)
                    if (prices[e].superOffer) return prices[e]
            }
        }),
        BaseForceView = TWindow.extend({
            events: {
                click: "close"
            },
            initialize: function() {
                (!application.get("forceOpenNow") || this.options.ignoreForceOpenNow || this.model && this.model.get("ignoreForceOpenNow")) && this.$el.length && this.$el.is(":visible") ? (application.set("forceOpenNow", !0), TWindow.prototype.initialize.call(this)) : setTimeout(_.bind(function() {
                    this.stopListening(), this.undelegateEvents()
                }, this), 0)
            },
            open: function() {
                if (application.get("page") !== this.options.needPage) return application.windows.remove(), this.stopListening(), this.undelegateEvents(), void 0;
                this.shown = !0;
                var e = parseInt($(".wrapper").css("width")),
                    i = parseInt($(".wrapper").css("height")),
                    t = parseInt(this.$el.css("width")),
                    o = parseInt(this.$el.css("height"));
                this.model && (this.model.get("additionalWidth") && (t += this.model.get("additionalWidth")), this.model.get("additionalHeight") && (o += this.model.get("additionalHeight")));
                var s = this.$el.offset(),
                    n = $(".blockedAnimations").offset();
                s.left = Math.round(s.left), s.top = Math.round(s.top), n.left = Math.round(n.left), n.top = Math.round(n.top), s.top -= n.top, s.left -= n.left;
                var a = '<div class="fieldDisabledBaseForce"><div class="fieldDisabledContent"></div></div>',
                    r = $(a);
                r.css({
                    width: e + "px",
                    height: s.top + "px",
                    left: "0px",
                    top: "0px"
                }), $(".blockedAnimations").append(r), r = $(a), r.css({
                    width: e + "px",
                    height: i - s.top - o + "px",
                    left: "0px",
                    top: s.top + o + "px"
                }), $(".blockedAnimations").append(r), r = $(a), r.css({
                    width: s.left + "px",
                    height: o + "px",
                    left: "0px",
                    top: s.top + "px"
                }), $(".blockedAnimations").append(r), r = $(a), r.css({
                    width: e - s.left - t + "px",
                    height: o + "px",
                    left: s.left + t + "px",
                    top: s.top + "px"
                }), window.mobile && r.css("position", "absolute"), $(".blockedAnimations").append(r);
                var l, d;
                if (this.model ? (l = this.model.get("name"), d = this.model.get("textId") ? this.model.get("textId") : this.model.get("name")) : (l = this.options.name, d = this.options.name), !this.model || !this.model.get("notNeedDisabledBg")) {
                    r = $(a);
                    var c = this.$el.position();
                    r.css({
                        width: t + "px",
                        height: o + "px",
                        left: parseInt(c.left) + "px",
                        top: parseInt(c.top) + "px",
                        "z-index": 0
                    }), r.addClass(l + "Button"), this.model && this.model.get("addZIndex") && (this.currentZIndex = this.$el.css("z-index"), this.$el.css("z-index", 30), r.css("z-index", 30)), window.mobile && (r.css("position", "absolute"), this.$el.css("margin-left") && r.css("margin-left", this.$el.css("margin-left")), this.$el.css("left").indexOf("%") && r.css("left", this.$el.css("left")), this.$el.css("bottom") && r.css("bottom", this.$el.css("bottom"))), this.$el.before(r)
                }
                this.model && this.model.get("addCssClass") && this.$el.addClass(this.model.get("addCssClass")), this.options.addCssClass && this.$el.addClass(this.options.addCssClass), $("#force").removeClass().addClass(l);
                var u = messages.ForceTexts[d];
                $("#force .forceText").html($("<div class='text'>").html(u)), $(".fieldDisabledBaseForce").fadeIn(300), setTimeout(_.bind(function() {
                    $(".levelAnimation").hide(), $("#force").fadeIn(300), "undefined" != typeof BaseForceWithButtonView && this instanceof BaseForceWithButtonView || (r = $('<div class="fieldDisabledArrow"><div class="fieldDisabledArrowContent"></div></div>'), r.addClass(l + "Arrow"), r.css({
                        left: s.left + Math.floor(t / 2) + "px",
                        top: s.top + "px"
                    }), $(".blockedAnimations").append(r))
                }, this), 300)
            },
            close: function() {
                $(".fieldDisabledArrow").remove(), $(".fieldDisabledBaseForce").fadeOut(300), $("#force").fadeOut(300), $(".levelAnimation").show(), setTimeout(_.bind(function() {
                    $(".fieldDisabledBaseForce").remove(), application.windows.remove(), this.stopListening(), this.undelegateEvents(), this.model && (this.model.done(), this.model.get("addZIndex") && this.$el.css("z-index", this.currentZIndex), this.model.get("addCssClass") && this.$el.removeClass(this.model.get("addCssClass"))), this.options.addCssClass && this.$el.removeClass(this.options.addCssClass), application.set("forceOpenNow", !1)
                }, this), 300)
            }
        }),
        NewBaseForceView = TWindow.extend({
            getMessage: function() {
                return this.model ? messages.ForceTexts[this.model.get("name")] : messages.ForceTexts[this.options.name]
            },
            events: {
                click: "close"
            },
            getDisabledCss: function() {
                return {
                    width: this.getWrapperWidth() + "px",
                    height: this.getWrapperHeight() + "px",
                    left: "0px",
                    top: "0px"
                }
            },
            initialize: function() {
                return this.options.ignoreForceOpenNow ? (application.set("forceOpenNow", !0), TWindow.prototype.initialize.call(this), void 0) : (!application.get("forceOpenNow") && this.$el.length && this.$el.is(":visible") ? (application.set("forceOpenNow", !0), TWindow.prototype.initialize.call(this)) : setTimeout(_.bind(function() {
                    this.stopListening(), this.undelegateEvents()
                }, this), 0), void 0)
            },
            getTemplate: function() {
                return '<div class="fieldDisabledBaseForce"><div class="fieldDisabledContent"></div></div>'
            },
            getWrapperWidth: function() {
                return parseInt($(".wrapper").css("width"))
            },
            getWrapperHeight: function() {
                return parseInt($(".wrapper").css("height"))
            },
            blockDiv: function() {
                var e = this.model ? this.model.get("name") : this.options.name,
                    i = $(".blockedAnimations").offset(),
                    t = this.$el,
                    o = parseInt(t.css("width")),
                    s = t.offset();
                s.top -= i.top, s.left -= i.left;
                var n = $(this.getTemplate());
                n.css(this.getDisabledCss()), n.css("z-index", 14), this.currentZIndex = this.$el.css("z-index"), this.$el.css("z-index", 15).addClass("inNewBaseForce"), this.model && this.model.get("visibleElements") && (this.elemntsZIndexes = {}, _.each(this.model.get("visibleElements"), _.bind(function(e) {
                    this.elemntsZIndexes[e] = $(e).css("z-index"), $(e).on("click.inForce", function() {
                        return !1
                    }), $(e).css("z-index", 15)
                }, this))), this.$el.first().before(n), $("#force").removeClass().addClass(e), $("#force .forceText").html(this.getMessage(e)), $(".fieldDisabledBaseForce").fadeIn(300), setTimeout(function() {
                    $("#force").fadeIn(300), n = $('<div class="fieldDisabledArrow"><div class="fieldDisabledArrowContent"></div></div>'), n.addClass(e + "DisabledArrow"), n.css({
                        left: s.left + Math.floor(o / 2) + "px",
                        top: s.top + "px"
                    }), $(".blockedAnimations").append(n)
                }, 300)
            },
            close: function() {
                function e() {
                    this.$el.css("z-index", this.currentZIndex), this.model && this.model.get("visibleElements") && _.each(this.model.get("visibleElements"), _.bind(function(e) {
                        $(e).css("z-index", this.elemntsZIndexes[e]), $(e).off(".inForce")
                    }, this)), this.$el.removeClass("inNewBaseForce"), $(".fieldDisabledBaseForce").remove(), application.set("forceOpenNow", !1), this.stopListening(), this.undelegateEvents(), this.model && this.model.done(), application.windows.remove()
                }
                return $(".fieldDisabledArrow").remove(), $(".fieldDisabledBaseForce").fadeOut(300), $("#force").fadeOut(300), setTimeout(_.bind(e, this), 300), this.model && this.model.get("onClick") ? (this.model.get("onClick").call(this.model), !1) : void 0
            },
            open: function() {
                return application.get("page") !== this.options.needPage ? (application.windows.remove(), this.stopListening(), this.undelegateEvents(), void 0) : (this.shown = !0, this.blockDiv(), void 0)
            }
        }),
        BaseForceWithButtonView = BaseForceView.extend({
            events: {},
            initialize: function() {
                this.keydown = _.bind(this.keydown, this), this.closeForce = _.bind(this.closeForce, this), BaseForceView.prototype.initialize.call(this)
            },
            open: function() {
                BaseForceView.prototype.open.call(this), this.$button = $('<div class="forceButton"></div>'), this.$button.html(messages.ForceButtonTexts[this.model.get("name")]), this.$button.on("click touchend", this.closeForce), $("body").on("keydown", this.keydown), $("#force .forceText").append(this.$button), this.options.customizeView && this.options.customizeView(this)
            },
            keydown: function(e) {
                27 === e.keyCode && this.closeForce()
            },
            closeForce: function() {
                return this.$button && (this.$button.off(), $("body").off("keypress", this.keydown), this.close()), !1
            }
        }),
        BaseForce = Backbone.Model.extend({
            defaults: {
                id: !1,
                view: !1,
                needPage: "main",
                name: !1
            },
            done: function() {
                user.set("shownForces", user.get("shownForces") | 1 << this.id), application.trigger("shownForces", this)
            },
            onOpen: function() {},
            process: function() {
                setTimeout(_.bind(function() {
                    var e = this.get("view"),
                        i = this.getEl();
                    if (i.length) {
                        this.onOpen();
                        var t = {
                            el: i,
                            model: this,
                            highlightedElements: this.getHighlightedElements(),
                            needPage: this.get("needPage")
                        };
                        this.afterCreateViewOption(t), new e(t)
                    }
                }, this), 50)
            },
            afterCreateViewOption: function() {},
            needShow: function() {
                return !(user.get("shownForces") & 1 << this.id)
            },
            initialize: function() {
                this.needShow() && (this.on("event", function() {
                    this.off(), application.get("page") == this.get("needPage") ? this.process() : application.once(this.get("needPage"), this.process, this)
                }, this), this.eventFunction())
            },
            getHighlightedElements: function() {
                return []
            }
        }),
        MccafeWorldForce = BaseForce.extend({
            defaults: {
                id: 24,
                view: BaseForceView,
                needPage: "main",
                name: "mccafeWorldForce",
                addCssClass: "forceBlackout",
                addZIndex: !0,
                additionalHeight: 10
            },
            getEl: function() {
                return $(".bonusWorldBlock")
            },
            eventFunction: function() {
                user.on("change:bonusWorldAvailable", function() {
                    user.get("bonusWorldAvailable") && (user.get("episode") < Config.episodesAmount || user.get("level") <= Config.levelsInEpisode) && user.getRealLevel() >= (Config.bonusWorld.available.minEpisodeToEnter - 1) * Config.levelsInEpisode + Config.bonusWorld.available.minLevelToEnter && "mccafe" == Config.bonusWorld.name && setTimeout(_.bind(function() {
                        this.trigger("event")
                    }, this), 700)
                }, this)
            }
        }),
        AliceWorldForce = BaseForce.extend({
            defaults: {
                id: 25,
                view: BaseForceView,
                needPage: "main",
                name: "aliceWorldForce",
                addCssClass: "forceBlackout",
                addZIndex: !0,
                additionalHeight: 10
            },
            getEl: function() {
                return $(".bonusWorldBlock")
            },
            eventFunction: function() {
                user.on("change:bonusWorldAvailable", function() {
                    user.get("bonusWorldAvailable") && (user.get("episode") < Config.episodesAmount || user.get("level") <= Config.levelsInEpisode) && user.getRealLevel() >= (Config.bonusWorld.available.minEpisodeToEnter - 1) * Config.levelsInEpisode + Config.bonusWorld.available.minLevelToEnter && "alice" == Config.bonusWorld.name && setTimeout(_.bind(function() {
                        this.trigger("event")
                    }, this), 700)
                }, this)
            }
        }),
        CollectCoinsForce = BaseForce.extend({
            defaults: {
                id: 1,
                view: BaseForceView,
                needPage: "main",
                name: "collectCoinsForce",
                addZIndex: !0
            },
            getEl: function() {
                return this.get("el")
            },
            eventFunction: function() {
                user.get("episode") > 5 || user.on("canCollectCoins", function(e) {
                    this.has("el") || (this.set("el", e), this.trigger("event"))
                }, this)
            }
        }),
        GiftsShopForce = BaseForce.extend({
            defaults: {
                id: 10,
                view: NewBaseForceView,
                needPage: "main",
                name: "giftsShopForce"
            },
            getEl: function() {
                return $("#main .givePriceFriends")
            },
            eventFunction: function() {
                application.on("giftsAvailable", function() {
                    (user.get("level") > 5 || user.get("episode") > 1) && (1 == user.get("level") || user.get("level") == Config.levelsInEpisode + 1 || episode.isBonusWorld() || this.trigger("event"))
                }, this)
            }
        }),
        StripForce = BaseForce.extend({
            defaults: {
                id: 4,
                view: BaseForceView,
                needPage: "main",
                name: "stripForce"
            },
            getEl: function() {
                return $("#stripMain")
            },
            eventFunction: function() {
                application.strip.on("change:active", function() {
                    application.strip.get("active") !== !1 && (user.get("episode") < Config.episodesAmount || user.get("level") <= Config.levelsInEpisode) && (window.mobile && "menuMain" !== application.get("subPage") || this.trigger("event"))
                }, this)
            }
        }),
        BoxForce = BaseForce.extend({
            defaults: {
                id: 5,
                view: NewBaseForceView,
                needPage: "main",
                name: "boxForce"
            },
            getEl: function() {
                return $(".currentBox")
            },
            eventFunction: function() {
                Config.boxForceLevel && application.on("main", function() {
                    if (Config.boxForceLevel <= user.getRealLevel() && user.get("level") <= Config.levelsInEpisode) {
                        if (Config.boxForceMaxLevel && user.getRealLevel() > Config.boxForceMaxLevel) return;
                        this.trigger("event")
                    }
                }, this)
            }
        }),
        AdditionalLifesForce = BaseForce.extend({
            defaults: {
                id: 9,
                view: NewBaseForceView,
                needPage: "main",
                name: "additionalLifesForce",
                onClick: function() {
                    new AdditionalLivesFreeWindow
                }
            },
            getEl: function() {
                return $(".livesAmulet")
            },
            eventFunction: function() {
                user.on("change:additionalLivesAvailable", function() {
                    user.get("additionalLivesAvailable") && (user.get("episode") < Config.episodesAmount || user.get("level") <= Config.levelsInEpisode) && setTimeout(_.bind(function() {
                        this.trigger("event")
                    }, this), 700)
                }, this)
            }
        }),
        Achievement = Backbone.Model.extend({
            defaults: {
                level: 0
            },
            process: function() {
                new AchievementDoneWindow({
                    name: this.get("name"),
                    level: this.get("level"),
                    firstPriority: !0
                })
            },
            isAvailable: function() {
                var e = Config.achievementsAvailable[this.get("name")];
                return e ? user.get("episode") > e.episode || user.get("episode") == e.episode && user.get("level") >= e.level : !1
            },
            isDisabled: function() {
                var e = Config.achievementsAvailable[this.get("name")];
                return e ? !1 : !0
            },
            getProgress: function() {
                return 0
            },
            getTotal: function() {
                return 10
            },
            isCurrentLevelDone: function() {
                return this.isEnd() ? !1 : this.getProgress() >= this.getTotal()
            },
            isEnd: function() {
                var e = Config.achievementsParams[this.get("name")];
                return this.get("level") >= e.length
            },
            calcProgress: function() {
                return Math.round(this.getProgress() / this.getTotal() * 100)
            },
            initialize: function() {
                if (this.isAvailable()) {
                    for (var e = !1; this.isCurrentLevelDone();) this.set("level", this.get("level") + 1), e = !0;
                    e && user.changeAchievement(this.get("order"), this.get("level"))
                }
                var i = this.get("level") - 1;
                user.on(this.get("eventName"), function() {
                    this.isCurrentLevelDone() && this.isAvailable() && this.get("level") > i && (i = this.get("level"), this.process())
                }, this)
            }
        }),
        Achievements = Backbone.Collection.extend({
            model: Achievement
        }),
        GachaWinAchievement = Achievement.extend({
            defaults: {
                name: "gachaWin",
                eventName: "change:todayGachaPlayTimes"
            },
            process: function() {
                Achievement.prototype.process.call(this), application.windows.views[0].close(), new GachaWindow
            },
            getProgress: function() {
                return user.get("todayGachaPlayTimes")
            },
            getTotal: function() {
                var e = Config.achievementsParams[this.get("name")];
                return e[this.get("level")].needPlayGacha
            }
        }),
        MaxCoinsAchievement = Achievement.extend({
            defaults: {
                name: "maxCoins",
                eventName: "change:coins"
            },
            getProgress: function() {
                return user.get("coins").get()
            },
            getTotal: function() {
                var e = Config.achievementsParams[this.get("name")];
                return e[this.get("level")].needCoins
            }
        }),
        PowerUpsMasterAchievement = Achievement.extend({
            defaults: {
                name: "powerUpsMaster",
                eventName: "change:usedPowerUps"
            },
            process: function() {
                setTimeout(_.bind(function() {
                    user.set("usedPowerUps", {}), Achievement.prototype.process.call(this)
                }, this), 1e3)
            },
            getProgress: function() {
                var e = Config.achievementsParams[this.get("name")],
                    i = user.get("usedPowerUps"),
                    t = e[this.get("level")].needPowerUps,
                    o = 0;
                for (var s in t) void 0 !== i[s] && (o += i[s] < t[s] ? i[s] : t[s]);
                return o
            },
            getTotal: function() {
                var e = Config.achievementsParams[this.get("name")],
                    i = e[this.get("level")].needPowerUps,
                    t = 0;
                for (var o in i) t += i[o];
                return t
            }
        }),
        WithoutLoseSeriaAchievement = Achievement.extend({
            defaults: {
                name: "withoutLoseSeria",
                eventName: "change:withoutLoseSeria"
            },
            process: function() {
                setTimeout(_.bind(function() {
                    Achievement.prototype.process.call(this)
                }, this), 0)
            },
            getProgress: function() {
                return user.get("withoutLoseSeria")
            },
            getTotal: function() {
                var e = Config.achievementsParams[this.get("name")];
                return e[this.get("level")].seria
            }
        });
    window.Config = {
        gameClass: GameClass,
        gameViewClass: CandyValleyView,
        preloaderClasses: ["preload1", "preload2"],
        cellWidth: 70,
        cellHeight: 70,
        basePhotoSize: 40,
        episodeLockedWindowPhotoSize: 36,
        punish: {
            showAfterMovesAmount: 5,
            appearTimeout: 1500,
            minLevel: 30
        },
        rows: 8,
        cols: 8,
        levelsInEpisode: 20,
        maxLives: 5,
        lifeRestoreTime: 1800,
        lifeRefillPrice: 300,
        collectCoinsFromFriend: 10,
        collectCoinsFromFriendDayAmount: 6,
        upFriendsNotifMinLevel: 3,
        maxLifesGiftOneTime: "facebook" === network ? 49 : 10,
        maxFriendsInviteOneTime: "facebook" === network ? 49 : 10,
        treasureElementsLevels: [5, 15, 20],
        friendsPanelSize: 7,
        friendsPanelViewCssWidth: 96,
        maxHelpFriends: 3,
        useStatistics: !0,
        amountMovesByInviteFriend: 3,
        amountBombMovesByInviteFriend: 3,
        squirrelAppearEpisode: 16,
        squirrelAppearLevel: 1,
        mouseFarmAppearEpisode: 50,
        mouseFarmAppearLevel: 1,
        mixerAppearEpisode: 54,
        mixerAppearLevel: 1,
        boxForceLevel: 3,
        boxForceMaxLevel: 20,
        makeGiftLevel: 10,
        congratesLevel: 30,
        autoUnlockEpisodeTime: 86400,
        treasuresInRowInWindow: 4,
        treasuresRowsInWindow: 2,
        openGraphEnabled: !0,
        everydayBonus: {
            episode: 1,
            level: 2,
            prizes: [
                [{
                    type: "coins",
                    amount: 50
                }],
                [{
                    type: "coins",
                    amount: 100
                }],
                [{
                    type: "powerUp",
                    name: "deleteCellPowerUp",
                    available: 6
                }, {
                    type: "coins",
                    amount: 200
                }]
            ]
        },
        saveBeginStats: !1,
        stripBonus: [500, 800],
        coinsForInvite: 300,
        gacha: !1,
        goods: {
            unlimitedLifes: {
                productId: 1,
                workDays: 3,
                viewClass: "UnlimitedLifesView"
            },
            additionalLifes: {
                productId: 2,
                workDays: 7,
                viewClass: "AdditionalLifesView",
                coinsPrice: 500,
                available: 35,
                addLifesAmount: 3
            }
        },
        friendsHelpMoves: 3,
        unlockEpisodePrice: 1e3,
        superOffer: {
            episode: 3,
            level: 1,
            showAfterNotPayDays: 14
        },
        outOfMoves: {
            price: 300,
            upPrice: 200,
            moves: 5
        },
        bombExplode: {
            price: 300,
            upPrice: 200,
            moves: 5
        },
        lessMovesAmount: 5,
        prizes: [{
            cssSelector: "#box1",
            requiredStars: 20,
            oneOfThreeGame: !0,
            openAnimationTimeout: 1e3,
            variants: [{
                coins: 500
            }, {
                coins: 300,
                powerUp: "deleteCellPowerUp",
                powerUpAmount: 1,
                available: 6
            }, {
                coins: 100,
                powerUp: "deleteColorPowerUp",
                powerUpAmount: 1,
                available: 11
            }]
        }, {
            cssSelector: "#box2",
            requiredStars: 40,
            oneOfThreeGame: !0,
            openAnimationTimeout: 1e3,
            variants: [{
                coins: 800
            }, {
                coins: 600,
                powerUp: "deleteCellPowerUp",
                powerUpAmount: 1,
                available: 6
            }, {
                coins: 500,
                powerUp: "deleteRowPowerUp",
                powerUpAmount: 1,
                available: 16
            }]
        }, {
            cssSelector: "#box3",
            requiredStars: 60,
            oneOfThreeGame: !0,
            openAnimationTimeout: 1e3,
            variants: [{
                coins: 1e3,
                powerUp: "deleteColorPowerUp",
                powerUpAmount: 1,
                available: 11
            }, {
                coins: 1100,
                powerUp: "deleteRowPowerUp",
                powerUpAmount: 1,
                available: 16
            }, {
                coins: 1200,
                powerUp: "addBonusPowerUp",
                powerUpAmount: 1,
                available: 19
            }]
        }],
        thimblePrize: {
            oneOfThreeGame: !0,
            openAnimationTimeout: 1e3,
            shuffleAnimationTimeout: 2e3,
            variants: [{
                coins: 500
            }, {
                powerUp: "deleteColorPowerUp",
                powerUpAmount: 1
            }, {
                good: "unlimitedLifes"
            }]
        },
        prizeClosedWindowEnabled: !0,
        suggestTimeout: 5e3,
        shopAvailable: !1,
        collectCoinsAvailable: {
            level: 12,
            episode: 1
        },
        shopRecommened: !1,
        shopProducts: [],
        listPowerUps: function() {
            return [new DeleteCell({
                id: "deleteCellPowerUp",
                price: 300,
                available: 5
            }), new DeleteColor({
                id: "deleteColorPowerUp",
                price: 600,
                available: 10
            }), new PlusOne({
                id: "addBonusPowerUp",
                price: 400,
                available: 18
            }), new DeleteColumn({
                id: "deleteRowPowerUp",
                price: 500,
                available: 15
            })]
        },
        powerUpIdsOrder: ["deleteCellPowerUp", "addBonusPowerUp", "deleteColorPowerUp", "deleteRowPowerUp"],
        initialize: function() {
            window.CellsRegistry = new CellsRegistryClass, CellsRegistry.registerCellType(Cell.chars + ".", Cell), CellsRegistry.registerCellType("@", MultiColorCell), CellsRegistry.registerCellType("V", WallCell), CellsRegistry.registerCellType("zxvm", PearlCell), CellsRegistry.registerCellType("L", LeftMoveCell), CellsRegistry.registerCellType("ryq", NutCell), CellsRegistry.registerCellType("we", WellCell), CellsRegistry.registerCellType(EggCell.chars, EggCell), CellsRegistry.registerCellType("X", BombCell), CellsRegistry.registerCellType("!", BombAutoNewCell), CellsRegistry.registerCellType("Fghjklbncцуке", FishCell), CellsRegistry.registerCellType("56789", MorphColorCell), CellsRegistry.registerCellType("a", PenguinCell), CellsRegistry.registerCellType("%", MixerCell), CellsRegistry.registerCellType("М", MouseFarmCell), CellsRegistry.registerCellType("d", CakeLUCell), CellsRegistry.registerCellType("f", CakeRUCell), CellsRegistry.registerCellType("i", CakeLDCell), CellsRegistry.registerCellType("o", CakeRDCell), CellsRegistry.registerCellType("^", PeacockCell), CellsRegistry.registerCellType("4", StrawBerryCell)
        },
        gameControllers: function() {
            SwapMoveController()
        },
        tasks: {
            CollectColor: {
                name: "собрать",
                cssClass: "CollectColor"
            },
            CollectPearl: {
                name: "собрать",
                cssClass: "CollectPearl"
            },
            CollectType: {
                name: "собрать",
                cssClass: "CollectType"
            },
            ClearCellAttributes: {
                name: "черная метка",
                cssClass: "CollectRoll"
            },
            CollectMorphColor: {
                name: "собрать сладости с изменяемым цветом",
                cssClass: "CollectMorphColor"
            },
            CollectComplexTask: {
                name: "собрать составные части",
                cssClass: "CollectComplexTask"
            }
        }
    }, Config.episodesAmount = 59, Config.episodesAvailable = "mobage" === network || "spmobage" === network ? 51 : "draugiem" === network ? 39 : "nk" === network ? 39 : "facebook" === network ? 52 : "yahoo" === network ? 10 : 58, Config.forces = [StripForce, CollectCoinsForce, BoxForce, AdditionalLifesForce, GiftsShopForce], Config.bonusWorldsForces = [MccafeWorldForce, AliceWorldForce], Config.bonusWorlds = [{
        name: "mccafe",
        levelsInEpisode: 5,
        onClickBonusWorldButton: function() {
            window.bonusWorldCompleted ? window.brightStat.eventComplete("icon2_click") : window.brightStat.eventComplete("icon1_click")
        },
        onShowBonusWorldGroupWindow: function() {
            window.brightStat.eventComplete("popup1_show")
        },
        onClickBonusWorldGroupWindow: function() {
            window.brightStat.eventComplete("popup1_button_click")
        },
        onShowBonusWorldCompletedWindow: function() {
            window.brightStat.eventComplete("popup4_show")
        },
        onClickBonusWorldCompletedWindow: function() {
            window.brightStat.eventComplete("popup4_button_click")
        },
        onShowBonusWorldMoreInfoWindow: function(e) {
            window.brightStat.eventComplete("popup" + (2 == e ? 2 : 3) + "_show")
        },
        onClickBonusWorldMoreInfoWindow: function(e) {
            window.brightStat.eventComplete("popup" + (2 == e ? 2 : 3) + "_url_click")
        },
        onEnterBonusWorld: function() {
            bonusWorldFinishTime || (bonusWorldFinishTime = application.getCurrentServerTime() + 172800, callService("../../../levelbase/src/services/setbonusworldfinishtime.php", function() {}, function() {}, {
                finishTime: bonusWorldFinishTime,
                worldName: Config.bonusWorld.name
            }), Config.bonusWorld.runBonusWorldTimer()), window.brightStat.eventComplete("location_show")
        },
        onStartBonusWorldLevel: function(e) {
            window.brightStat.eventComplete("location_lvl" + e)
        },
        onCompleteBonusWorldLevel: function(e) {
            window.brightStat.eventComplete("location_end_lvl" + e), (2 == e || 4 == e) && application.once("main", function() {
                new BonusWorldMoreInfoWindow({
                    link: Config.bonusWorld.available.applicationLink,
                    level: e
                })
            })
        },
        onBonusWorldTakePrize: function() {
            window.brightStat.eventComplete("location_bonus"), $(".bonusWorldBlock").removeClass("available"), callService("../../../levelbase/src/services/setbonusworldfinished.php", function() {}, function() {}, {
                worldName: Config.bonusWorld.name
            })
        },
        onCompleteBonusWorld: function() {
            var e = new BonusWorldFinishedWindow({
                finished: !0
            });
            e.offPublicCheckbox = function() {}, e.onPublicCheckbox = function() {}, e.needPublic = !1, e.$("a").click(function() {
                window.brightStat.eventComplete("location_sait_enter")
            })
        },
        runBonusWorldTimer: function() {
            $(".bonusWorldTimer").addClass("showed");
            var e = !1,
                i = function() {
                    var i = bonusWorldFinishTime - application.getCurrentServerTime();
                    0 >= i ? ($(".bonusWorldBlock").removeClass("available"), clearInterval(e)) : i >= 86400 ? $(".bonusWorldTimer").html(formatTime("%j" + messages.bonusWorldLeftTime[2] + "%G" + messages.bonusWorldLeftTime[0], i)) : $(".bonusWorldTimer").html(formatTime("%H" + messages.bonusWorldLeftTime[0] + "%i" + messages.bonusWorldLeftTime[1], i))
                };
            e = setInterval(i, 1e3), i()
        },
        available: {
            networks: ["vkontakte"],
            episode: 2,
            level: 2,
            applicationLink: "https://vk.com/app5019061",
            minEpisodeToEnter: 2,
            minLevelToEnter: 2,
            groupUrl: function() {
                return window.brightStat.getRedirectUrl("app_install")
            },
            checkFunction: function(e) {
                e = _.once(e);
                var i = function() {
                    $(".bonusWorldBlock").removeClass("available"), e(!1)
                };
                window.brightStat = new BrightStat("vk_dolinasladostey_MacCafe"), "test" === network ? e(!0) : callService("../../../levelbase/src/services/getbonusworldfinishtime.php", function(t) {
                    if (-1 === t) window.bonusWorldCompleted = !0, window.brightStat.checkAvailability(function() {
                        e(!0)
                    });
                    else if (t) {
                        var o = t - application.getCurrentServerTime();
                        o > 0 ? window.brightStat.checkAvailability(function() {
                            e(!0), bonusWorldFinishTime = t, Config.bonusWorld.runBonusWorldTimer()
                        }) : e(!1)
                    } else {
                        if (user.get("paid") && (!user.get("lastPayDate") || user.get("lastPayDate") > "2015-03-18")) return i();
                        window.brightStat.checkAvailability(e)
                    }
                }, function() {
                    e(!1)
                }, {
                    worldName: Config.bonusWorld.name
                })
            },
            onEnterCheckFunction: function(e) {
                if (window.bonusWorldCompleted) return new BonusWorldCompletedWindow({
                    link: Config.bonusWorld.available.applicationLink
                }), void 0;
                if ("test" === network) return new BonusWorldGroupWindow({
                    success: e,
                    checkFunction: function(e) {
                        e(!0)
                    }
                });
                var i = function(e) {
                    callService("../../../levelbase/src/services/checkrowexists.php", function(i) {
                        e(i)
                    }, function() {}, {
                        table: "mccafe"
                    })
                };
                i(function(t) {
                    if (t) e();
                    else {
                        var o = Config.bonusWorld.available.groupUrl();
                        o && "#" !== o ? new BonusWorldGroupWindow({
                            success: e,
                            checkFunction: i
                        }) : e()
                    }
                })
            },
            complete: function() {}
        }
    }, {
        name: "alice",
        levelsInEpisode: 9,
        configure: function() {},
        onEnterBonusWorld: function() {
            bonusWorldFinishTime || (bonusWorldFinishTime = application.getCurrentServerTime() + 172800, callService("../../../levelbase/src/services/setbonusworldfinishtime.php", function() {}, function() {}, {
                finishTime: bonusWorldFinishTime,
                worldName: Config.bonusWorld.name
            }), Config.bonusWorld.runBonusWorldTimer())
        },
        onBonusWorldTakePrize: function() {
            $(".bonusWorldBlock").removeClass("available"), callService("../../../levelbase/src/services/setbonusworldfinished.php", function() {}, function() {}, {
                worldName: Config.bonusWorld.name
            })
        },
        onCompleteBonusWorld: function() {
            new BonusWorldFinishedWindow({
                finished: !0
            })
        },
        runBonusWorldTimer: function() {
            $(".bonusWorldTimer").addClass("showed");
            var e = !1,
                i = function() {
                    var i = bonusWorldFinishTime - application.getCurrentServerTime();
                    0 >= i ? ($(".bonusWorldBlock").removeClass("available"), clearInterval(e)) : i >= 86400 ? $(".bonusWorldTimer").html(formatTime("%j" + messages.bonusWorldLeftTime[2] + "%G" + messages.bonusWorldLeftTime[0], i)) : $(".bonusWorldTimer").html(formatTime("%H" + messages.bonusWorldLeftTime[0] + "%i" + messages.bonusWorldLeftTime[1], i))
                };
            e = setInterval(i, 1e3), i()
        },
        onCompleteBonusWorldLevel: function(e) {
            setTimeout(function() {
                3 == e && new BonusWorldFinishedWindow({
                    type: "middlePrize",
                    level: e,
                    prize: [{
                        type: "powerUp",
                        name: "deleteCellPowerUp",
                        cssClass: "deleteCellPowerUp",
                        amount: 1
                    }]
                }), 6 == e && new BonusWorldFinishedWindow({
                    type: "middlePrize",
                    level: e,
                    prize: [{
                        type: "powerUp",
                        name: "deleteRowPowerUp",
                        cssClass: "deleteRowPowerUp",
                        amount: 1
                    }]
                })
            }, 0)
        },
        available: {
            networks: ["test", "odnoklassniki"],
            episode: 1,
            level: 1,
            minEpisodeToEnter: 2,
            minLevelToEnter: 2,
            checkFunction: function(e) {
                callService("../../../levelbase/src/services/getbonusworldfinishtime.php", function(i) {
                    if (i) {
                        var t = i - application.getCurrentServerTime();
                        t > 0 ? (bonusWorldFinishTime = i, Config.bonusWorld.runBonusWorldTimer(), Config.bonusWorld.configure(), e(!0)) : e(!1)
                    } else Config.bonusWorld.configure(), e(!0)
                }, function() {
                    e(!1)
                }, {
                    worldName: Config.bonusWorld.name
                })
            },
            onEnterCheckFunction: function(e) {
                user.getRealLevel() < (Config.bonusWorld.available.minEpisodeToEnter - 1) * Config.levelsInEpisode + Config.bonusWorld.available.minLevelToEnter ? new BonusWorldNotAvailableWindow : e()
            },
            complete: function() {}
        }
    }], Config.sounds = {
        giftUserNotSelected: "message",
        giftSended: "championwindow",
        giftReceived: "championwindow",
        fourFigureRemove: "arrowcollect",
        fiveFigureRemove: "arrowcollect",
        pearlTakeLevel: "pearltakelevel",
        removePearl: "pearltakelevel",
        taskCompleted: "task",
        eggCollected: !1,
        nutTakeLife: "pearltakelevel",
        nutRemove: "nutremove",
        collectTaskElem: "collecttaskelem",
        jamFull: "jamfull",
        jamHalf: "jamhalf",
        candyCooking: "element",
        elementFound: "element",
        usePowerUpSound: "task",
        bombCellRemove: "bombexplode",
        cellChangeCoeff: "changecellcoeff",
        blockedDecoratorRemove: "chain",
        chocolateDecoratorCreate: "dirtcreate",
        multiColorCellRemove: "multicolor",
        deleteCellExecution: "deletecell",
        deleteColorExecution: "deletecolor",
        deleteColumnExecution: "deletecolumn",
        plusOneExecution: "plusoneall",
        leftMoveCandyCreate: "leftmovecreate",
        leftMoveCandyExplode: "leftmoveexplode",
        mixer: "s_mixer",
        giftSended: "championwindow",
        giftReceived: "championwindow",
        buyGood: "buymoves",
        buyCoins: "buymoves",
        buyLives: "buymoves",
        buyBombMoves: "buymoves",
        buyMoves: "buymoves",
        buyShopProduct: "buymoves",
        collectCoinsFromFriend: "friendcoins",
        flightCollectedCoinsFromFriend: "coinsfly",
        swapMove: "swapmove",
        swapMoveRollback: "swapmove",
        changeSelected: "click",
        fallDown: "falldown",
        showTask: "showtask",
        addMoves: "getstar",
        addBombMoves: "getstar",
        addMovesFromFriend: "message",
        showTasks: "initialshowtask",
        showField: "showfield",
        getStar: "getstar",
        vortex: "shuffle",
        gameMessage: "message",
        episodeLockedWindow: "showwindow",
        episodeLockedWindowKeysCollected: "buymoves",
        everydayBonusWindow: "showfield",
        failedWindowLostLife: "losegame",
        gachaWindowPowerUpsPrize: "getstar",
        gachaWindowPassivesPrize: "getstar",
        gachaWindowThumbler: "gachathumbler",
        gachaWindowWhip: "gachawhip",
        gachaWindowWin: "gachawin",
        gachaWindowLose: "gachalose",
        helpFriendsWindowSend: "getstar",
        noExistingMovesShuffle: "shuffle",
        clearFloorAttributesTask: "ice",
        deleteRowExecution: "lightning",
        deleteCrossExecution: "blaster",
        otherFigureRemove: "doublearrowcollect",
        arrowCellDoubleLightning: "doublelightning",
        arrowCellLightning: "lightning",
        fishCellRemove: "explode1",
        wellCellFlyWater: "flywater",
        wellCellChangeWater: "wellwater",
        bombCellExplode: "bombexplode",
        chocolateDecoratorRemove: "dirtremove",
        squirrel: "squirrel",
        squirrelNut: "squirrelnut",
        penguinEat: "penguineat",
        owlEat: "owleat",
        mouseMove: "mousemove",
        mouseFarmCellCreateMouse: "mousemove",
        mouseRemove: "mouseremove",
        cakeCellTakeLife: "caketakelife",
        cakeCellRemove: "cakeremove",
        raccoonEat: "raccooneat",
        oneOfThreeBoxOpen: "element",
        oneOfThreeBoxOpened: "championwindow",
        oneOfThreeWindowOpen: "happybirthday",
        explode2: "explode1",
        strawBerryCellTakeLife: "strawberry",
        strawBerryRemove: "strawberry",
        peacockCellFireAnimation: "bird",
        dragonEat: "cat"
    };
    var Bots = [{
        id: -1,
        name: messages.botsNames[0],
        photo: "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/bots/bot1.6d77c48dae.jpg",
        score: 7e3
    }, {
        id: -2,
        name: messages.botsNames[1],
        photo: "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/bots/bot2.50a5cc502a.jpg",
        score: 4e3
    }, {
        id: -3,
        name: messages.botsNames[2],
        photo: "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/bots/bot3.c8f319405c.jpg",
        score: 3e3
    }];
    window.GameScores = {
        collectColor: 1e3,
        leftMove: 0,
        pearl: 1e3,
        multicolor: 0,
        nut: 1e3,
        bomb: 1e3,
        collectMorphColor: 1e3,
        bossLife: 1e3,
        boss: 1e4,
        mouse: 3e3,
        complexTask: 1e3
    }, GameClass.prototype.swap = function(e, i) {
        this.field[e.y][e.x] = i, this.field[i.y][i.x] = e;
        var t = e.x;
        e.x = i.x, i.x = t, t = e.y, e.y = i.y, i.y = t
    }, GameClass.prototype.isNeighbors = function(e, i) {
        return Math.abs(e.x - i.x) + Math.abs(e.y - i.y) == 1
    }, GameClass.prototype.tryMove = function(e, i) {
        if (this.canMove()) {
            if (!this.has("selected")) {
                if (i) return;
                return this.set("selected", e), void 0
            }
            if (this.get("selected") === e) {
                if (i) return;
                return this.unset("selected"), void 0
            }
            var t = this.get("selected"),
                o = e;
            return t ? this.isNeighbors(t, o) ? (canvas.canvas_c.style.cursor = "default", this.move({
                first: t,
                second: o
            }), this.unset("selected"), void 0) : (i || this.set("selected", e), void 0) : (this.unset("selected"), void 0)
        }
    }, GameClass.prototype.countSameTypeInRow = function(e, i, t, o) {
        for (var s = this.field[i][e].color, n = 0; this.inField(e, i) && this.field[i][e].getCurrentColor() === s;) e += t, i += o, n++;
        return n
    }, GameClass.prototype.isThreeInRow = function(e, i) {
        return this.inField(e, i) ? "none" === this.field[i][e].getCurrentColor() || void 0 === this.field[i][e].getCurrentColor() ? !1 : this.countSameTypeInRow(e, i, 1, 0) + this.countSameTypeInRow(e, i, -1, 0) - 1 >= 3 ? !0 : this.countSameTypeInRow(e, i, 0, 1) + this.countSameTypeInRow(e, i, 0, -1) - 1 >= 3 ? !0 : !1 : !1
    }, GameClass.prototype.findValidMove = function() {
        for (var e = 0; e < Config.rows; e++)
            for (var i = 0; i < Config.cols; i++)
                if (this.inField(i, e)) {
                    var t;
                    if (this.inField(i + 1, e) && (t = {
                            first: this.field[e][i],
                            second: this.field[e][i + 1]
                        }, this.isRealValidMove(t))) return t;
                    if (this.inField(i, e + 1) && (t = {
                            first: this.field[e][i],
                            second: this.field[e + 1][i]
                        }, this.isRealValidMove(t))) return t
                }
        return !1
    }, GameClass.prototype.existValidMove = function() {
        return this.findValidMove() !== !1
    }, GameClass.prototype.isFiveOrMoreInRow = function(e, i, t) {
        var o = [];
        return _.each(e, function(e) {
            o.push(e.x * i + e.y * t)
        }), o.sort(), _.last(o) - _.first(o) >= 4
    }, GameClass.prototype.calcItemsFigure = function(e) {
        if (e[0] instanceof EggCell) return "egg";
        for (var i = 0; i < e.length; i++)
            if ("" != e[i].getDecoratorName() && !e[i].decorator.get("oneTimeRemove")) return "three";
        return 3 == e.length ? "three" : 4 == e.length ? "four" : this.isFiveOrMoreInRow(e, 1, 0) || this.isFiveOrMoreInRow(e, 0, 1) ? "five" : "other"
    }, GameClass.prototype.matchSameType = function(e, i, t) {
        if (this.isThreeInRow(e, i)) {
            var o = [],
                s = 0,
                n = this.field[i][e].color,
                a = _.bind(function(e) {
                    this.isThreeInRow(e.x, e.y) && this.field[e.y][e.x].getCurrentColor() === n && void 0 === t[this.field[e.y][e.x].id] && (o.push(this.field[e.y][e.x]), t[this.field[e.y][e.x].id] = !0)
                }, this);
            for (a({
                x: e,
                y: i
            }); s < o.length;) {
                var r = o[s];
                s++, a({
                    x: r.x - 1,
                    y: r.y
                }), a({
                    x: r.x + 1,
                    y: r.y
                }), a({
                    x: r.x,
                    y: r.y - 1
                }), a({
                    x: r.x,
                    y: r.y + 1
                })
            }
            this.trigger("matchSameType", o)
        }
    }, GameClass.prototype.isValidMove = function(e) {
        if (!this.inField(e.first.x, e.first.y) || !this.inField(e.second.x, e.second.y)) return !1;
        if (!e.first.isMovable() || !e.second.isMovable()) return !1;
        if (!(e.first.isRemovable() || e.second.isRemovable() || e.first.color || e.second.color)) return !1;
        this.onlySwap(e);
        var i = this.isThreeInRow(e.first.x, e.first.y) || this.isThreeInRow(e.second.x, e.second.y);
        return this.onlySwap(e), i
    }, GameClass.prototype.onlySwap = function(e) {
        this.field[e.first.y][e.first.x] = e.second, this.field[e.second.y][e.second.x] = e.first;
        var i = e.first.x;
        e.first.x = e.second.x, e.second.x = i, i = e.first.y, e.first.y = e.second.y, e.second.y = i
    }, GameClass.prototype.baseMakeMove = function(e) {
        this.set("explodeChocolate", !1), this.set("explodeSpiderWeb", !1), this.field[e.first.y][e.first.x] = e.second, this.field[e.second.y][e.second.x] = e.first;
        var i = e.first.x;
        e.first.setX(e.second.x), e.second.setX(i), i = e.first.y, e.first.setY(e.second.y), e.second.setY(i)
    }, GameClass.prototype.makeMove = function(e) {
        this.baseMakeMove(e)
    }, GameClass.prototype.explode = function() {
        for (var e = {}, i = 0; i < Config.rows; i++)
            for (var t = 0; t < Config.cols; t++) this.field[i][t] && !e[this.field[i][t].id] && this.matchSameType(t, i, e)
    }, GameClass.prototype.shuffleField = function(e) {
        for (var i = [], t = 0; t < Config.rows; t++)
            for (var o = 0; o < Config.cols; o++) Game.field[t][o] && Game.field[t][o].isMovable() && !Game.field[t][o].notShuffled && (Game.field[t][o] instanceof DroppableCell && !e || i.push(Game.field[t][o]));
        i = _.shuffle(i);
        var s = i.slice(0),
            n = _.bind(function(e, i) {
                var t = s.pop();
                Game.field[e][i] = t, t.x = i, t.y = e
            }, this),
            a = _.bind(function(e, t) {
                var o = i.pop();
                this.trigger("moveCell", o, {
                    x: t,
                    y: e
                }, Game.animate(function() {
                    Game.field[e][t] = o, o.setX(t), o.setY(e)
                }, Game))
            }, this),
            r = function(i) {
                for (var t = 0; t < Config.rows; t++)
                    for (var o = 0; o < Config.cols; o++) Game.field[t][o] && Game.field[t][o].isMovable() && !Game.field[t][o].notShuffled && (Game.field[t][o] instanceof DroppableCell && !e || i(t, o))
            };
        r(n), this.existValidMove() ? (r(a), Game.trigger("vortex", Game.animate())) : this.shuffleField(e)
    };
    var oldCreateField = GameClass.prototype.createField;
    GameClass.prototype.createField = function() {
        for (oldCreateField.call(this);;) {
            for (var e = !0; e;) {
                e = !1;
                for (var i = 0; i < Config.rows; i++)
                    for (var t = 0; t < Config.cols; t++) this.isThreeInRow(t, i) && (e = !0, this.field[i][t].setRandomColor())
            }
            if (!this.noExistingMove(!0)) break
        }
    };
    var prev = GameClass.prototype.initialize;
    GameClass.prototype.initialize = function() {
        prev.call(this), this.lastMove = {
            first: null,
            second: null
        }, this.on("validMove", function(e) {
            this.lastMove = e
        }, this)
    };
    var oldStart = GameClass.prototype.start;
    GameClass.prototype.start = function() {
        oldStart.call(this);
        var e = function(e) {
            var i;
            for (i = 0; i < e.length; i++)
                if (e[i] == Game.lastMove.first || e[i] == Game.lastMove.second) return e[i];
            var t = 0,
                o = 0;
            for (i = 0; i < e.length; i++) t += e[i].x, o += e[i].y;
            return t /= e.length, o /= e.length, _.min(e, function(e) {
                return Math.abs(e.x - t) + Math.abs(e.y - o)
            })
        };
        this.on("matchSameType", function(i) {
            var t = this.calcItemsFigure(i),
                o = {},
                s = [];
            _.each(i, function(e) {
                o[e.x + "_" + e.y] = !0
            }), _.each(i, function(e) {
                e.decorator && "three" == t && "changecolor" != e.getDecoratorName() || Game.neighbors(e, function(e) {
                    void 0 === o[e.x + "_" + e.y] && (o[e.x + "_" + e.y] = !0, s.push(e))
                })
            });
            var n = e(i);
            switch (RemoveFigureController.points(i, n), t) {
                case "egg":
                    RemoveFigureController.eggFigureRemove(i, n, s);
                    break;
                case "three":
                    RemoveFigureController.threeFigureRemove(i, n, s);
                    break;
                case "five":
                    RemoveFigureController.fiveFigureRemove(i, n, s);
                    break;
                case "four":
                    RemoveFigureController.fourFigureRemove(i, n, s);
                    break;
                case "other":
                    RemoveFigureController.otherFigureRemove(i, n, s)
            }
        }, this)
    }, GameClass.prototype.noExistingMove = function(e) {
        if (e) {
            for (var i = !1; !this.existValidMove();) {
                var t = [];
                Game.each(function(e) {
                    e instanceof Cell && "none" !== e.getCurrentColor() && "N" !== e.getCurrentColor() && t.push(e)
                });
                for (var o = RANDOM(t), s = o.color; o.color === s;) o.setRandomColor();
                e || this.trigger("cellChangeColor", o, s, Game.animate(function() {}, Game)), i = !0
            }
            return i
        }
        Game.trigger("showMessage", messages.noMovesShuffle, "noMovesShuffleMessage"), setTimeout(Game.animate(function() {
            application.playSound("noExistingMovesShuffle"), this.shuffleField()
        }, Game), 1500)
    };
    var CollectColor = Task.extend({
        initialize: function() {
            this.set("color", this.get("description").cell), this.set("event", "removedItem"), this.set("amount", this.get("description").amount), this.set("type", this.get("description").type), Task.prototype.initialize.call(this), this.set("cssClass", this.get("cssClass") + "_" + this.get("color"))
        }
    });
    CollectColor.prototype.tick = function(e) {
        this.get("color") === e.color && (e instanceof Cell || e instanceof ArrowCell) && this.animateCollect(e.$div, GameScores.collectColor, Game.animate(function() {
            Task.prototype.tick.call(this)
        }, this))
    };
    var lastTaskTickTime = 0,
        lastTaskTickOrder = 0;
    CollectColor.prototype.tick = function(e) {
        if (e instanceof Cell && this.get("color") === e.color) {
            var i = e.getRealCoeff() + 1;
            if ($(".powerUpCatAnimation").is(":visible")) DeleteColor.prototype.animateCatCollect(e.$div, GameScores.collectColor * (e.coeff + 1), _.bind(function() {
                for (var e = 0; i > e; e++) Task.prototype.tick.call(this)
            }, this));
            else {
                var t = (new Date).getTime();
                t > lastTaskTickTime + 50 && (lastTaskTickOrder = 0), lastTaskTickTime = t, this.animateCollect(e.$div, 200 * lastTaskTickOrder, GameScores.collectColor * (e.coeff + 1), Game.animate(), _.bind(function() {
                    for (var e = 0; i > e; e++) Task.prototype.tick.call(this)
                }, this)), lastTaskTickOrder++, lastTaskTickOrder > 5 && (lastTaskTickOrder = 0)
            }
        }
    };
    var CollectMorphColor = Task.extend({
            initialize: function() {
                this.set("event", "removedItem"), this.set("amount", this.get("description").amount), this.set("type", this.get("description").type), Task.prototype.initialize.call(this), this.set("cssClass", this.get("cssClass"))
            }
        }),
        lastTaskTickTime = 0,
        lastTaskTickOrder = 0;
    CollectMorphColor.prototype.tick = function(e) {
        if (e instanceof MorphColorCell) {
            var i = 1;
            if ($(".powerUpCatAnimation").is(":visible")) DeleteColor.prototype.animateCatCollect(e.$div, GameScores.collectMorphColor, _.bind(function() {
                for (var e = 0; i > e; e++) Task.prototype.tick.call(this)
            }, this));
            else {
                var t = (new Date).getTime();
                t > lastTaskTickTime + 50 && (lastTaskTickOrder = 0), lastTaskTickTime = t, this.animateCollect(e.$div, 200 * lastTaskTickOrder, GameScores.collectMorphColor, Game.animate(), _.bind(function() {
                    for (var e = 0; i > e; e++) Task.prototype.tick.call(this)
                }, this)), lastTaskTickOrder++, lastTaskTickOrder > 5 && (lastTaskTickOrder = 0)
            }
        }
    };
    var CollectPearl = Task.extend({
        getCapitalisedBaseName: function() {
            return "Pearl"
        },
        getTaskElementInstanceName: function() {
            return PearlCell
        },
        initialize: function() {
            this.set("event", "removed" + this.getCapitalisedBaseName()), this.set("amount", this.countElementsInField()), this.set("type", this.get("description").type), Task.prototype.initialize.call(this)
        }
    });
    CollectPearl.prototype.countElementsInField = function() {
        for (var e = 0, i = 0; i < Config.cols; i++)
            for (var t = Config.rows - 1; t >= 0; t--) Game.field[t][i] && Game.field[t][i] instanceof this.getTaskElementInstanceName() && e++;
        return e
    }, CollectPearl.prototype.tick = function(e) {
        this.animateCollect(e, GameScores.pearl, Game.animate(function() {
            Task.prototype.tick.call(this)
        }, this)), e.remove()
    }, CollectPearl.prototype.tick = function(e) {
        this.animateCollect(e, 200, GameScores.pearl, Game.animate(), _.bind(function() {
            Task.prototype.tick.call(this)
        }, this)), e.remove()
    };
    var CollectType = Task.extend({
        initialize: function() {
            this.set("autoNewElements", 0), void 0 !== this.get("description").cell && (this.set("event", "removedItem"), this.set("cellClass", CellsRegistry.getCellType(this.get("description").cell)), "auto" == this.get("description").amount ? this.set("amount", this.countCellsInField()) : (this.set("amount", this.get("description").amount), this.get("cellClass") == FishCell && this.set("autoNewElements", this.get("description").amount - this.countCellsInField())), this.set("type", this.get("description").type), Task.prototype.initialize.call(this), this.set("cssClass", this.get("cssClass") + "_" + this.get("description").cell)), void 0 !== this.get("description").decorator && (this.set("event", "removedDecorator"), this.set("decoratorName", this.get("description").decorator), "auto" == this.get("description").amount ? this.set("amount", this.countDecoratorsInField()) : this.set("amount", this.get("description").amount), this.set("type", this.get("description").type), Task.prototype.initialize.call(this), this.set("cssClass", this.get("cssClass") + "_" + this.get("description").decorator))
        }
    });
    CollectType.prototype.countCellsInField = function() {
        var e = 0;
        return Game.each(function(i) {
            this.canCollect(i) && e++
        }, this), e
    }, CollectType.prototype.countDecoratorsInField = function() {
        var e = 0;
        return Game.each(function(i) {
            i.decorator && this.canCollect(i.decorator) && e++
        }, this), e
    }, CollectType.prototype.canCollect = function(e) {
        return this.has("decoratorName") ? e.get("name") != this.get("decoratorName") ? !1 : !0 : e instanceof this.get("cellClass") ? e instanceof FishCell && e.type != FishCell.codeToType(this.get("description").cell) ? !1 : e instanceof EggCell && 0 != e.color ? !1 : e instanceof BossCell && !e.isHead() ? !1 : !0 : !1
    }, CollectType.prototype.collectAnimation = function(e, i, t) {
        this.animateCollect(i, t, Game.animate(function() {
            if (Task.prototype.tick.call(this), this.playCollectSound(e), this.get("autoNewElements") > 0) {
                var i = {
                    offset: Math.floor(2 * Math.random() + 1),
                    cellClass: this.get("cellClass")
                };
                i.type = e.type, Game.fallDownSpecialCells.push(i), this.set("autoNewElements", this.get("autoNewElements") - 1)
            }
        }, this))
    }, CollectType.prototype.tick = function(e) {
        if (this.canCollect(e)) {
            if (e instanceof BossCell) return Task.prototype.tick.call(this), void 0;
            var i = !1;
            if (("undefined" != typeof FlowerCell && e instanceof FlowerCell || "undefined" != typeof CakeCell && e instanceof CakeCell) && (i = !0), i && e.mainPart !== !0) return;
            if (this.has("decoratorName")) e.animateCollect(this.$div, Game.animate(function() {
                Task.prototype.tick.call(this)
            }, this));
            else {
                var t = e.$div;
                i && (t = e.getDieDiv(), Figure.blockedAnimations.append(t), t.alignTo(e.$div)), this.collectAnimation(e, t, GameScores[e.scoresId]), i && t.remove()
            }
        }
    }, CollectType.prototype.playCollectSound = function() {}, CollectType.prototype.collectAnimation = function(e, i) {
        var t = 1;
        void 0 !== e.sizeInCells && (t = e.sizeInCells), this.animateCollect(i, 0, GameScores.nut, Game.animate(), _.bind(function() {
            Task.prototype.tick.call(this)
        }, this), !1, t)
    };
    var ClearCellAttributes = Task.extend({
        initialize: function() {
            this.set("event", "removedAttribute_key"), this.set("amount", 0);
            for (var e = 0; e < Config.cols; e++)
                for (var i = Config.rows - 1; i >= 0; i--) Game.field[i][e] && Game.field[i][e].attribute && this.set("amount", this.get("amount") + 1);
            this.set("type", this.get("description").type), Task.prototype.initialize.call(this)
        }
    });
    ClearCellAttributes.prototype.tick = function(e) {
        this.animateCollect(e.$div.find(".attribute"), GameScores.attribute, Game.animate(function() {
            application.playSound("clearCellAttribute"), Task.prototype.tick.call(this)
        }, this), 2 * Game.get("speed"))
    }, ClearCellAttributes.prototype.tick = function(e) {
        this.animateCollect(e.$div, 0, GameScores.nut, Game.animate(), _.bind(function() {
            Task.prototype.tick.call(this)
        }, this))
    };
    var CellsRegistryClass = function() {
        this.cellTypes = {}
    };
    CellsRegistryClass.prototype.getCellType = function(e) {
        return _.find(this.cellTypes, function(i, t) {
            return -1 != t.indexOf(e)
        })
    }, CellsRegistryClass.prototype.registerCellType = function(e, i) {
        this.cellTypes[e] = i
    }, CellsRegistryClass.prototype.initCell = function(e) {
        function i(e, i) {
            function t() {
                return e.apply(this, i)
            }
            return t.prototype = e.prototype, new t
        }
        var t = this.getCellType(e);
        return i(t, _.toArray(arguments).slice(1))
    };
    var BaseCell = function(e, i, t) {
        _.extend(this, Backbone.Events), this.id = _.uniqueId("cell_"), this.y = e, this.x = i, this.life = 1, this.movable = !0, this.removable = !0, this.removeOnRemoveNear = !1, this.showPointsOnRemove = 0, this.color = t ? t : "none", this.onField = !1
    };
    BaseCell.extend = Backbone.Model.extend, BaseCell.prototype.getDecoratorName = function() {
        return this.decorator ? this.decorator.get("name") : ""
    }, BaseCell.prototype.clickAnimate = function() {}, BaseCell.prototype.isMovable = function() {
        return this.movable
    }, BaseCell.prototype.isRemovable = function() {
        return this.removable
    }, BaseCell.prototype.getCurrentColor = function() {
        return this.color
    }, BaseCell.prototype.getTemplateClass = function() {
        return "defaultCell"
    }, BaseCell.prototype.createDiv = function() {
        var e = createByTemplate(".invisible ." + this.getTemplateClass());
        return this instanceof Cell && "none" === this.color ? e.addClass("color_" + this.saveColor) : e.addClass("color_" + this.color), Figure.field.append(e), e.setCoords(getItemCoords(this)), this.$div = e, e
    }, BaseCell.prototype.removeNear = function() {
        this.removeOnRemoveNear && this.remove()
    }, BaseCell.prototype.setY = function(e) {
        this.y = e
    }, BaseCell.prototype.setX = function(e) {
        this.x = e
    }, BaseCell.prototype.afterFallDown = function() {}, BaseCell.prototype.fallDown = function(e, i) {
        var t = this.$div;
        t.delay((i + Math.random()) * Game.get("speed")), this.y < 0 && t.queue(function(e) {
            this.css({
                opacity: 1
            }), e()
        });
        var o = Game.animate(function() {
            this.afterFallDown(), this.setY(e)
        }, this);
        t.ourAnimate(getItemCoordsForFallDown(this, e), .6 * Math.abs(e - this.y) * Game.get("speed"), "easeInQuad", o)
    }, BaseCell.prototype.beforeGameFinish = function() {}, BaseCell.prototype.beforeRemove = function() {}, BaseCell.prototype.afterRemove = function() {}, BaseCell.prototype.executeRemove = function(e) {
        this.beforeRemove(e), this.onField && this.y >= 0 && (Game.field[this.y][this.x] = void 0), Game.trigger("removedItem", this);
        var i = Game.animate(function() {
            this.afterRemove()
        }, this);
        this.$div.queue(_.bind(function(t) {
            e ? (this.$div.remove(), i()) : this.animateRemoval(i), t()
        }, this))
    }, BaseCell.prototype.highlight = function(e) {
        e ? (this.$div.removeClass("powerUpHighlight"), this.$div.find(".powerUpHighlightBg").removeClass("powerUpHighlightBgAnimation")) : (this.$div.addClass("powerUpHighlight"), this.$div.find(".powerUpHighlightBg").addClass("powerUpHighlightBgAnimation"))
    }, BaseCell.prototype.remove = function(e) {
        return this.isRemovable() ? 0 == this.life ? !1 : (this.life--, this.life > 0 ? this.animateTakeLife(Game.animate()) : this.executeRemove(e), !0) : !1
    };
    var explodeSound = 0,
        explodeSoundTime = 0;
    BaseCell.prototype.animateRemoval = function(e) {
        this.$div.remove();
        var i = (new Date).getTime();
        i - 100 > explodeSoundTime && (explodeSound = (explodeSound + 1) % 2, application.playSound("explode" + (explodeSound + 1)), explodeSoundTime = i), Game.trigger("explodeSimpleCell", this.x, this.y, e, this)
    }, BaseCell.prototype.deformate = function(e) {
        $innerClass = ".cellStone", this instanceof FishCell && ($innerClass = ".fishcellBg"), this instanceof PenguinCell && ($innerClass = ".penguinHeadCell"), this.$div.find($innerClass).removeClass("animated").removeClass("stable").addClass(e), this.$div.find(".attribute").removeClass("stable").addClass(e), setTimeout(_.bind(function() {
            this.$div.find($innerClass).removeClass(e);
            var i = this.$div.find($innerClass);
            i.hasClass("roll") ? this.$div.find(".attribute").removeClass(e).addClass("stable") : this instanceof MultiColorCell ? i.addClass("animated") : i.addClass("stable")
        }, this), 400)
    }, BaseCell.prototype.afterFallDown = function() {
        this.deformate("deformateDown")
    }, BaseCell.prototype.clickAnimate = function() {
        var e = this.isMovable() ? "deformateClickYes" : "deformateClickNo";
        this.deformate(e)
    };
    var Cell = function(e, i) {
        BaseCell.call(this, e, i), this.initialize.apply(this, arguments)
    };
    Cell.extend = Backbone.Model.extend, Cell.chars = "RGBYPWN", _.extend(Cell.prototype, BaseCell.prototype), Cell.prototype.initialize = function(e, i, t) {
        this.color = ".", t && (this.color = application.level.map[e].charAt(i), application.level.cellAttribute && "*" == application.level.cellAttribute[e].charAt(i) && (this.attribute = "key")), "." == this.color && this.setRandomColor(), t && application.level.decorators && (this.decorator = Decorator.create(application.level.decorators[e].charAt(i), this))
    }, Cell.prototype.showFieldPoints = function() {
        this.showPointsOnRemove && this instanceof Cell && Game.trigger("showFieldPoints", this.$div, this.showPointsOnRemove, "explodeCell_" + this.color)
    }, Cell.prototype.beforeRemove = function(e) {
        this.attribute && (Game.trigger("removedAttribute_" + this.attribute, this), Game.trigger("removedAttribute", this), this.$div.find(".attribute").remove()), Game.set("score", Game.get("score") + GameScores.cell), e || this.showFieldPoints()
    }, Cell.prototype.remove = function(e) {
        return this.decorator ? (this.decorator.remove(e), !0) : BaseCell.prototype.remove.call(this, e)
    }, Cell.prototype.setRandomColor = function() {
        if (application.level.stack && application.level.stack.length > 0) this.color = application.level.stack.charAt(0), application.level.stack = application.level.stack.substr(1);
        else {
            for (var e = "", i = 0; i < Cell.chars.length; i++) application.level.colors.indexOf(Cell.chars.charAt(i)) >= 0 && (e += Cell.chars.charAt(i));
            this.color = e.charAt(_.random(0, e.length - 1))
        }
    }, Cell.prototype.createDiv = function(e) {
        var i = BaseCell.prototype.createDiv.call(this, e);
        if (this.attribute) {
            var t = createByTemplate(".invisible .attribute_" + this.attribute);
            i.append(t)
        }
        return this.decorator && this.decorator.render(), i
    }, Cell.prototype._initialize = Cell.prototype.initialize, Cell.prototype.initialize = function() {
        this.coeff = 0, Cell.prototype._initialize.apply(this, arguments)
    }, Cell.chars = "RGACOBYPWNt", Cell.colorsWithAttributes = "RGACO", Cell.prototype.removeNear = function(e) {
        if (!this.deleted) {
            var i = gameView.tasksView.options.tasks.findWhere({
                type: "CollectColor",
                color: this.color
            });
            i && (void 0 === e && (e = 1), setTimeout(_.bind(function() {
                this.life && (this.coeff += e, this.coeff > 9 && (this.coeff = 9), this.cellChangeCoeff(), this.cellCoeffIncreased(), application.playSound("changecellcoeff"))
            }, this), 0))
        }
        BaseCell.prototype.removeNear.call(this)
    }, Cell.prototype.grassBlink = function() {
        var e = Figure.find("#floor_" + this.y + "_" + this.x);
        e.addClass("animated"), setTimeout(_.bind(function() {
            e.removeClass("animated")
        }, this), 900)
    }, Cell.prototype.cellCoeffIncreased = function() {
        this instanceof BombCell || this instanceof BombAutoNewCell || (this.$div.find(".powerUpHighlightBg").removeClass("stable").addClass("cellCoeffBlockLight"), this.$div.find(".cellStone").removeClass("stable").addClass("cellCoeffBlockAnimation")), setTimeout(_.bind(function() {
            this.$div.find(".powerUpHighlightBg").removeClass("cellCoeffBlockLight").addClass("stable"), this.$div.find(".cellStone").removeClass("cellCoeffBlockAnimation").addClass("stable")
        }, this), 300)
    }, Cell.prototype.cellChangeCoeff = function() {
        this.coeff > 0 ? (this.$div.addClass("cellCoeffBlockShow"), this.$div.find(".cellCoeff").html("+" + this.coeff)) : (this.$div.removeClass("cellCoeffBlockShow"), this.$div.find(".cellCoeff").html(""))
    }, Cell.prototype.removeCoeff = function() {
        this.getRealCoeff() > 0 && (oldFieldCoeffs !== !1 && (oldFieldCoeffs[this.y][this.x] = 0), this.coeff = 0, this.cellChangeCoeff())
    }, Cell.prototype.getRealCoeff = function() {
        return oldFieldCoeffs !== !1 ? oldFieldCoeffs[this.y][this.x] : this.coeff
    }, Cell.prototype.showFieldPoints = function() {}, Cell.prototype.beforeRemove = function() {
        this.coeff = this.getRealCoeff(), this.attribute && (Game.trigger("removedAttribute_" + this.attribute, this), this.$div.find(".attribute").remove())
    };
    var oldFieldCoeffs = !1,
        beforeCellMakeMove = GameClass.prototype.makeMove;
    GameClass.prototype.makeMove = function(e) {
        beforeCellMakeMove.call(this, e), oldFieldCoeffs = [];
        for (var i = 0; i < Config.rows; i++) {
            oldFieldCoeffs.push([]);
            for (var t = 0; t < Config.cols; t++) oldFieldCoeffs[i].push(0)
        }
        Game.each(function(e) {
            e.coeff > 0 && !e.deleted && (oldFieldCoeffs[e.y][e.x] = e.coeff, 0 == Game.floor[e.y][e.x] && (e.coeff = 0))
        }), Game.once("fallDownStart", function() {
            oldFieldCoeffs = !1, Game.each(function(e) {
                e instanceof Cell && e.cellChangeCoeff()
            })
        }), Game.once("endTurn", function() {
            Game.each(function(e) {
                e instanceof Cell && 0 != Game.floor[e.y][e.x] && e.coeff && e.grassBlink()
            })
        })
    };
    var baseSetRandomColor = Cell.prototype.setRandomColor;
    if (Cell.prototype.setRandomColor = function() {
            for (baseSetRandomColor.call(this); this.attribute && Cell.colorsWithAttributes.indexOf(this.color) < 0;) baseSetRandomColor.call(this)
        }, Cell.prototype.createDiv = function(e) {
            var i = BaseCell.prototype.createDiv.call(this, e);
            if (this.attribute) {
                var t = createByTemplate(".invisible .attribute_" + this.attribute);
                $selectedCellBg = i.find(".selectedCellBg").clone(), i.find(".selectedCellBg").remove(), i.append(t), i.append($selectedCellBg), i.find(".cellStone").removeClass().addClass("cellStone").addClass("roll")
            }
            return this.decorator && this.decorator.render(), i
        }, !GameClass.prototype.isValidMove) throw "include multicolorcell.js after threeinrow.js";
    var oldValidMove = GameClass.prototype.isValidMove;
    GameClass.prototype.isValidMove = function(e) {
        return e.first instanceof MultiColorCell && e.second instanceof EggCell ? !1 : e.second instanceof MultiColorCell && e.first instanceof EggCell ? !1 : e.first instanceof MultiColorCell && e.second instanceof MultiColorCell ? !0 : e.first instanceof MultiColorCell && "none" !== e.second.getCurrentColor() && e.second.isMovable() && e.second.isRemovable() ? !0 : e.second instanceof MultiColorCell && "none" !== e.first.getCurrentColor() && e.first.isMovable() && e.first.isRemovable() ? !0 : oldValidMove.call(this, e)
    };
    var oldMakeMove = GameClass.prototype.makeMove;
    GameClass.prototype.makeMove = function(e) {
        if (oldMakeMove.call(this, e), e.first instanceof MultiColorCell || e.second instanceof MultiColorCell) {
            var i = e.first,
                t = e.second;
            e.first instanceof MultiColorCell || (i = e.second, t = e.first), t instanceof MultiColorCell ? (i.explodeMultiColors(t), user.trigger("swapTwoStars")) : "undefined" != typeof ArrowCell && t instanceof ArrowCell ? (i.arrowRemoveDirection = t.dir, "horizontal" == i.arrowRemoveDirection && user.trigger("swapHorLightningAndStar"), "vertical" == i.arrowRemoveDirection && user.trigger("swapVertLightningAndStar"), "both" == i.arrowRemoveDirection && user.trigger("swapCrossLightningAndStar"), i.remove(t.color)) : i.remove(t.color)
        }
    };
    var MultiColorCell = function(e, i) {
        BaseCell.call(this, e, i)
    };
    _.extend(MultiColorCell.prototype, BaseCell.prototype), MultiColorCell.prototype.beforeGameFinish = function() {
        return this.isRemovable() ? (this.remove(), !0) : void 0
    }, MultiColorCell.prototype.explodeMultiColors = function(e) {
        var i = [],
            t = [];
        Game.each(function(o) {
            o != this && o != e && o.isRemovable() && !o.notRemoveByTwoMulticolors && (Math.random() < .5 ? i.push(o) : t.push(o))
        }, this);
        for (var o = 0; o < i.length; o++) this.explodeOneCell(i[o]);
        for (var o = 0; o < t.length; o++) e.explodeOneCell(t[o]);
        Game.set("score", Game.get("score") + 2 * GameScores.multicolor), this.showFieldPoints(GameScores.multicolor + this.getFieldPoints(i), "W"), e.showFieldPoints(GameScores.multicolor + e.getFieldPoints(t), "W"), BaseCell.prototype.remove.call(this, !0), BaseCell.prototype.remove.call(e, !0)
    }, MultiColorCell.prototype.getFieldPoints = function(e) {
        for (var i = 0, t = 0; t < e.length; t++) e[t] instanceof Cell && (!e[t].decorator || "changecolor" == e[t].getDecoratorName()) && (i += GameScores.cell);
        return i
    }, MultiColorCell.prototype.getSmallFireAnimateSpeed = function() {
        return 3 * Game.get("speed")
    }, MultiColorCell.prototype.getSmallFireRemoveDelay = function() {
        return 0
    }, MultiColorCell.prototype.createSmallFire = function() {
        var e = createByTemplate(".invisible .smallFire");
        return Figure.blockedAnimations.append(e), e.alignTo(this.$div), e
    }, MultiColorCell.prototype.explodeOneCell = function(e, i) {
        var t = this.createSmallFire(),
            o = Game.animate(function() {
                if (t.remove(), this.arrowRemoveDirection && 3 > i) {
                    var o = this.arrowRemoveDirection;
                    "both" != o && (o = Math.random() < .5 ? "horizontal" : "vertical"), e instanceof ArrowCell ? (e.$div.find(".arrow").removeClass("dir_" + e.dir).addClass("dir_both"), e.dir = "both") : e.$div.append(createByTemplate(".invisible .arrow").addClass("dir_" + o));
                    var s = Game.animate(function() {
                        e instanceof ArrowCell ? e.remove() : (e.$div.find(".arrow").remove(), e.remove(!0), createdCell = new ArrowCell(e.y, e.x, !1, "-", e.color), createdCell.dir = o, createdCell.createDiv(), createdCell.remove())
                    }, this);
                    setTimeout(s, 150 * i + 300)
                } else e.remove()
            }, this);
        t.ourAnimate({
            target: e.$div
        }, this.getSmallFireAnimateSpeed(), "easeInQuad", _.bind(function() {
            0 == this.getSmallFireRemoveDelay() ? o() : t.delay(this.getSmallFireRemoveDelay()).queue(function(e) {
                e(), o()
            })
        }, this))
    }, MultiColorCell.prototype.showFieldPoints = function(e, i) {
        Game.trigger("showFieldPoints", this.$div, e, "explodeMulticolorCell explodeCell_" + i)
    }, MultiColorCell.prototype.onAfterRemove = function() {}, MultiColorCell.prototype.afterRemove = function() {
        var e = [];
        Game.each(function(i) {
            i.getCurrentColor() === this.colorToRemove && e.push(i)
        }, this), e = _.shuffle(e), this.showFieldPoints(GameScores.multicolor + this.getFieldPoints(e), this.colorToRemove);
        for (var i = 0; i < e.length; i++) e[i].decorator && "changecolor" != e[i].getDecoratorName() || Game.neighbors(e[i], _.bind(function(e) {
            e.getCurrentColor() !== this.colorToRemove && e.removeNear()
        }, this)), this.explodeOneCell(e[i], i);
        Game.set("score", Game.get("score") + GameScores.multicolor), this.onAfterRemove(e)
    }, MultiColorCell.prototype.remove = function(e) {
        if (void 0 !== e) this.colorToRemove = e;
        else {
            var i = [];
            Game.each(function(e) {
                "none" !== e.getCurrentColor() && i.push(e.color)
            }), i.length > 0 && (this.colorToRemove = i[_.random(0, i.length - 1)])
        }
        Game.neighbors(this, function(e) {
            e.removeNear()
        }), BaseCell.prototype.remove.call(this)
    }, MultiColorCell.prototype.animateRemoval = function(e) {
        application.playSound("multiColorCellRemove"), this.$div.fadeOut(3 * Game.get("speed"), function() {
            this.remove()
        }), e && e()
    }, MultiColorCell.prototype.createDiv = function(e) {
        var i = BaseCell.prototype.createDiv.call(this, e);
        return i.addClass("multicolor").find(".cellStone").addClass("animated"), i
    }, MultiColorCell.prototype.onAfterRemove = function(e) {
        var i = gameView.tasksView.options.tasks.findWhere({
            type: "CollectColor",
            color: this.colorToRemove
        });
        if (i) {
            var t = 0;
            _.each(e, function(e) {
                t += e.getRealCoeff() + 1
            }), Game.trigger("showFieldPoints", this.$div, t, "explodeMulticolorCell explodeCell_" + this.colorToRemove)
        }
    }, MultiColorCell.prototype.showFieldPoints = function() {}, MultiColorCell.prototype.createSmallFire = function() {
        var e = createByTemplate(".invisible .smallFire");
        Figure.field.append(e);
        var i = {
            left: Config.cellWidth * Config.cols / 2,
            top: Config.cellHeight * Config.rows / 2
        };
        return e.setCoords(i), e
    }, MultiColorCell.prototype.animateRemoval = function(e) {
        application.playSound("multicolor");
        var i = this.$div.clone(),
            t = {
                left: Config.cellWidth * Config.cols / 2 - this.$div.attrs.width / 2,
                top: Config.cellHeight * Config.rows / 2 - this.$div.attrs.height / 2
            };
        Figure.field.append(i), i.alignTo(this.$div), this.$div.remove(), i.addClass("multicolorUsed"), i.ourAnimate(t, 300, "easeInQuad", function() {
            e && e()
        }), i.ruleAnimation.on("round", function() {
            i.remove()
        })
    };
    var WallCell = function(e, i) {
        BaseCell.call(this, e, i), this.movable = !1, this.removable = !1
    };
    _.extend(WallCell.prototype, BaseCell.prototype), WallCell.prototype.indestructible = !0, WallCell.prototype.createDiv = function(e) {
        var i = BaseCell.prototype.createDiv.call(this, e);
        return i.addClass("wall"), i
    };
    var BombCell = function(e, i, t) {
        Cell.call(this, e, i, !1), this.movesToExplode = application.level.bombExplodeMoves, this.movesToExplodeDelay = 0, t || (this.movesToExplodeDelay = 1)
    };
    _.extend(BombCell.prototype, Cell.prototype), BombCell.process = function() {
        Game.once("endTurn", function() {
            if (Game.get("running")) {
                var e = !1;
                if (Game.each(function(i) {
                        (i instanceof BombCell || i instanceof BombAutoNewCell) && i.decMovesToExplode() && (e = !0)
                    }), e) {
                    Game.set("running", !1);
                    var i, t = [];
                    Game.each(function(e) {
                        (e instanceof BombCell || e instanceof BombAutoNewCell) && t.push(e.color)
                    }), t = _.uniq(t), i = RANDOM(t), new BombExplodeWindow({
                        color: i
                    })
                }
            }
        })
    }, BombCell.addBombMoves = function(e) {
        Game.each(function(i) {
            (i instanceof BombCell || i instanceof BombAutoNewCell) && (i.movesToExplode += e, i.drawMovesToExplode())
        })
    }, BombCell.explodeBomb = function(e) {
        var i = [];
        return Game.each(function(e) {
            (e instanceof BombCell || e instanceof BombAutoNewCell) && 0 == e.movesToExplode && i.push(e)
        }), i.length > 0 ? (i[0].explodeAnimation(i, e), void 0) : void 0
    }, BombCell.prototype.beforeRemove = function() {
        Game.set("score", Game.get("score") + GameScores.bomb), Game.trigger("showFieldPoints", this.$div, GameScores.bomb, "explodeBombCell explodeCell_" + this.color)
    }, BombCell.prototype.explodeAnimation = function(e, i) {
        var t = 0,
            o = {},
            s = function(e, i) {
                var s = 400;
                i > 0 && (s += 300), i > 1 && (s += 300), i > 2 && (s += 250 * (i - 2)), o[s] || (o[s] = !0, setTimeout(function() {
                    application.playSound("bombCellExplode")
                }, s)), s > t && (t = s), e.$div.delay(s).queue(function(i) {
                    Figure.find("#floor_" + e.y + "_" + e.x).remove();
                    var t = createByTemplate(".invisible .bombExplode");
                    Figure.blockedAnimations.append(t), t.alignTo(this), this.remove(), e instanceof PizzaCell && $("#pizzaEl" + e.id).remove(), t.sprite.once("round", function() {
                        t.remove()
                    }), i()
                })
            };
        Game.each(function(i) {
            var t = 1e3;
            _.each(e, function(e) {
                t = Math.min(t, Math.max(Math.abs(i.y - e.y), Math.abs(i.x - e.x)))
            }), s(i, t)
        }), setTimeout(i, t + 800)
    }, BombCell.prototype.drawMovesToExplode = function() {
        this.movesToExplode <= 2 ? this.$div.addClass("bombSoonExplode") : this.$div.removeClass("bombSoonExplode"), this.movesToExplode >= 10 ? this.$div.addClass("movesToExplodeTwoDigits") : this.$div.removeClass("movesToExplodeTwoDigits"), this.movesToExplodeDiv.html(this.movesToExplode)
    }, BombCell.prototype.decMovesToExplode = function() {
        return this.movesToExplodeDelay > 0 ? this.movesToExplodeDelay-- : this.movesToExplode--, this.drawMovesToExplode(), 0 == this.movesToExplode ? !0 : !1
    }, BombCell.prototype.getTemplateClass = function() {
        return "bombCell"
    }, BombCell.prototype.createDiv = function(e) {
        return Cell.prototype.createDiv.call(this, e), this.movesToExplodeDiv = this.$div.find(".movesToExplode"), this.drawMovesToExplode(), this.$div
    }, BombCell.prototype.explodeAnimation = function(e, i) {
        _.each(e, function(e) {
            var i = e.$div.clone();
            e.$div.hide(), i.find(".cellStone").removeClass("stable").addClass("bombExpand"), Figure.blockedAnimations.append(i), i.alignTo(e.$div), application.playSound("bombexplode"), setTimeout(function() {
                i.addClass("bombExpandSpots"), i.find(".bombMoves").addClass("hidden"), i.find(".cellStone").removeClass("bombExpand").addClass("bombExpandSpotsAnimation")
            }, 540)
        }), setTimeout(i, 3e3)
    }, BombCell.prototype.animateRemoval = function(e) {
        this.$div.addClass("removeBomb").delay(300).queue(_.bind(function(i) {
            this.$div.remove(), e(), i()
        }, this))
    }, BombCell.prototype.beforeRemove = function() {};
    var BombAutoNewCell = function(e, i, t) {
        BombCell.call(this, e, i, t)
    };
    _.extend(BombAutoNewCell.prototype, BombCell.prototype), BombAutoNewCell.prototype.remove = function() {
        return this.decorator ? (Cell.prototype.remove.call(this), void 0) : (Game.fallDownSpecialCells.push({
            offset: Math.floor(3 * Math.random() + 1),
            cellClass: BombAutoNewCell
        }), BaseCell.prototype.remove.call(this), void 0)
    };
    var WellCell = function(e, i) {
        BaseCell.call(this, e, i), this.color = "none", this.movable = !1, this.removeOnRemoveNear = !0, this.processCounter = 0, "e" == application.level.map[e].charAt(i) && (this.processCounter = 3)
    };
    _.extend(WellCell.prototype, BaseCell.prototype), WellCell.prototype.getWaterColor = function() {
        return "N"
    }, WellCell.prototype.remove = function() {
        this.processCounter < 4 && (this.processCounter++, this.animateChangeWater())
    }, WellCell.prototype.getTemplateClass = function() {
        return "wellCell"
    }, WellCell.prototype.createDiv = function() {
        var e = BaseCell.prototype.createDiv.call(this);
        return e.addClass("wellLevel" + this.processCounter), e
    }, WellCell.prototype.animateFireWater = function(e, i) {
        application.playSound("wellCellFlyWater");
        var t = createByTemplate(".invisible .emptyTemplate").addClass("flyWater");
        Figure.blockedAnimations.append(t), t.alignTo(this.$div), t.ourAnimate({
            target: e.$div
        }, 500, "linear", _.bind(function() {
            e.$div.removeClass("color_" + e.color).addClass("color_" + this.getWaterColor()), e.removeCoeff && e.removeCoeff(), e.color = this.getWaterColor(), t.remove(), i()
        }, this))
    }, WellCell.prototype.animateChangeWater = function() {
        application.playSound("wellCellChangeWater"), this.$div.removeClass("wellLevel0").removeClass("wellLevel1").removeClass("wellLevel2").removeClass("wellLevel3").removeClass("wellLevel4").addClass("wellLevel" + this.processCounter);
        var e = Game.animate();
        e()
    }, WellCell.prototype.checkCanFire = function(e) {
        return e instanceof Cell && !e.decorator && e.getCurrentColor() !== this.getWaterColor() ? !0 : !1
    }, WellCell.prototype.process = function(e) {
        if (4 == this.processCounter) {
            var i = [];
            if (Game.each(_.bind(function(t) {
                    e[t.y][t.x] || this.checkCanFire(t) && i.push(t)
                }, this)), i.length > 0) {
                this.processCounter = 0, this.animateChangeWater(), i = _.shuffle(i);
                for (var t = 0; 4 > t && t < i.length; t++) e[i[t].y][i[t].x] = !0, this.animateFireWater(i[t], Game.animate())
            }
        }
    }, WellCell.process = function() {
        for (var e = [], i = 0; i < Config.rows; i++) {
            e.push([]);
            for (var t = 0; t < Config.cols; t++) e[i].push(!1)
        }
        Game.each(function(i) {
            i instanceof WellCell && i.process(e)
        })
    }, WellCell.prototype.getWaterColor = function() {
        return "W"
    }, WellCell.prototype.indestructible = !0, WellCell.prototype.createDiv = function() {
        var e = BaseCell.prototype.createDiv.call(this);
        return e.find(".wellCellBg").addClass("wellLevel" + this.processCounter), e
    }, WellCell.prototype.animateChangeWater = function() {
        application.playSound("wellCellChangeWater"), this.$div.find(".wellCellBg").removeClass("wellLevel0").removeClass("wellLevel1").removeClass("wellLevel2").removeClass("wellLevel3").removeClass("wellLevel4").addClass("wellLevel" + this.processCounter);
        var e = Game.animate();
        e()
    }, WellCell.prototype.checkCanFire = function(e) {
        return e instanceof Cell && !e.decorator && "key" !== e.attribute && e.getCurrentColor() !== this.getWaterColor() ? !0 : !1
    };
    var PearlCell = function(e, i) {
        BaseCell.call(this, e, i), this.init(), this.baseName = "pearl";
        var t = application.level.map[e].charAt(i);
        switch (t) {
            case "z":
                this.life = 1;
                break;
            case "x":
                this.life = 2;
                break;
            case "v":
                this.life = 3;
                break;
            default:
                this.life = 4
        }
    };
    _.extend(PearlCell.prototype, BaseCell.prototype), PearlCell.prototype.init = function() {
        this.color = "none", this.movable = !1, this.removeOnRemoveNear = !0
    }, PearlCell.prototype.getTakeLifeSound = function() {
        return this.baseName + "TakeLevel"
    }, PearlCell.prototype.animateTakeLife = function(e) {
        application.playSound(this.getTakeLifeSound()), this.$div.removeClass(this.baseName + "Level" + (this.life + 1)).addClass(this.baseName + "Level" + this.life).find("." + this.baseName + "CellBg").removeClass("stable").addClass("stable"), e()
    }, PearlCell.prototype.getRemoveSound = function() {
        return "remove" + this.getCapitalisedBaseName()
    }, PearlCell.prototype.animateRemoval = function(e) {
        application.playSound(this.getRemoveSound());
        var i = gameView.createFallDownExplodePiece("die_" + this.baseName);
        i.alignTo(this.$div), gameView.fallDownExplodePiece(i);
        var t = createByTemplate(".invisible .emptyTemplate").addClass(this.baseName);
        Figure.blockedAnimations.append(t), t.alignTo(this.$div), Game.trigger("removed" + this.getCapitalisedBaseName(), t), this.$div.remove(), e()
    }, PearlCell.prototype.getTemplateClass = function() {
        return this.baseName + "Cell"
    }, PearlCell.prototype.createDiv = function() {
        var e = BaseCell.prototype.createDiv.call(this);
        return e.addClass(this.baseName + "Level" + this.life).find("." + this.baseName + "CellBg").addClass("stable"), e
    }, PearlCell.prototype.getCapitalisedBaseName = function() {
        return this.baseName.charAt(0).toUpperCase() + this.baseName.slice(1)
    };
    var BossCell = function(e, i) {
        BaseCell.call(this, e, i), this.color = "none", this.movable = !1, this.removeOnRemoveNear = !0, void 0 !== application.level.bossLife && (BossCell.LIFE = application.level.bossLife), this.name = void 0 !== application.level.bossName ? application.level.bossName : "dragon", this.setSize(), this.head = this.getHead(), this.life = BossCell.LIFE, this.isHead() || (this.life = 1), this.isHead() && this.createTalkingInterval(), setTimeout(_.bind(function() {
            $("#tasks .taskBossLife").parent().addClass(this.name + "Task")
        }, this), 0)
    };
    BossCell.LIFE = 80, BossCell.WIDTH = 2, BossCell.HEIGHT = 2, _.extend(BossCell.prototype, BaseCell.prototype), BossCell.prototype.setSize = function() {
        this.width = BossCell.WIDTH, this.height = BossCell.HEIGHT
    }, BossCell.prototype.createTalkingInterval = function() {
        this.talkingAnimationInterval && clearInterval(this.talkingAnimationInterval), this.talkingAnimationInterval = setInterval(_.bind(this.talkingAnimation, this), 1e4)
    }, BossCell.prototype.removeTalkingInterval = function() {
        clearInterval(this.talkingAnimationInterval), $(".bossBg").removeClass("bossTalk").addClass("stable")
    }, BossCell.prototype.isHead = function() {
        return this.head == this
    }, BossCell.prototype.highlight = function(e) {
        this.isHead() ? BaseCell.prototype.highlight.call(this, e) : this.head.highlight(e)
    }, BossCell.prototype.getHead = function() {
        for (var e = this.width; e >= 0; e--)
            for (var i = this.height; i >= 0; i--)
                if (Game.inField(this.x - e, this.y - i) && Game.field[this.y - i][this.x - e] instanceof BossCell) return Game.field[this.y - i][this.x - e];
        return this
    }, BossCell.prototype.animateTakeLife = function(e) {
        Game.set("score", Game.get("score") + GameScores.bossLife), this.renderLife(), sounds[this.playingTalkingSound] && sounds[this.playingTalkingSound].stop(), this.playTakeLifeSound(), this.removeTalkingInterval();
        var i = this.getAngryAnimationTime();
        this.$div.removeClass("stable").addClass(this.name + "Angry").find("." + this.name + "Bg").removeClass("stable").addClass(this.name + "Angry").delay(i).queue(_.bind(function(e) {
            this.$div.removeClass(this.name + "Angry").addClass("stable").find("." + this.name + "Bg").removeClass(this.name + "Angry").addClass("stable"), this.createTalkingInterval(), this.playingTakeLifeSound = !1, e()
        }, this)), Game.trigger("showFieldPoints", this.$div, 1, "damageBoss " + this.lifeClass()), Game.trigger("showFieldPoints", $("#tasksBlock .CollectType_q"), -1, "damageBossTask " + this.lifeClass()), e()
    }, BossCell.prototype.getAngryAnimationTime = function() {
        return 1e3
    }, BossCell.prototype.playTakeLifeSound = function() {
        var e = this.name + "damage";
        application.playSound(e), this.playingTakeLifeSound = e
    }, BossCell.prototype.lifeClass = function() {
        return Math.round(100 * this.life / BossCell.LIFE) > 50 ? "less100PercentLife" : Math.round(100 * this.life / BossCell.LIFE) <= 25 ? "less25PercentLife" : Math.round(100 * this.life / BossCell.LIFE) <= 50 ? "less50PercentLife" : !1
    }, BossCell.prototype.beforeRemove = function() {
        if (this.isHead())
            for (var e = 0; e < this.width; e++)
                for (var i = 0; i < this.height; i++) Game.inField(this.x + e, this.y + i) && Game.field[this.y + i][this.x + e] instanceof BossCell && Game.field[this.y + i][this.x + e] != this && Game.field[this.y + i][this.x + e].remove()
    }, BossCell.prototype.animateRemoval = function(e) {
        Game.set("score", Game.get("score") + GameScores.boss), Game.trigger("showFieldPoints", this.$div, GameScores.boss, "explodeBossCell"), this.playRemoveSound(), this.renderLife(), this.playRemoveAnimation(e), this.removeTalkingInterval()
    }, BossCell.prototype.playRemoveSound = function() {
        var e = this.name + "death";
        application.playSound(e)
    }, BossCell.prototype.playRemoveAnimation = function(e) {
        var i = createByTemplate(".invisible ." + this.name + "Fly");
        Figure.blockedAnimations.append(i), i.alignTo(this.$div), this.$div.remove(), sounds.gamemusic.stop(), i.ourAnimate({
            top: -(2 * Config.cellHeight) + "px"
        }, 2e3, "easeInQuad", function() {
            this.remove(), e()
        })
    }, BossCell.prototype.calcBossLifeWidth = function() {
        return Math.round(this.life / BossCell.LIFE * (46 / 60) * Config.cellWidth) + "px"
    }, BossCell.prototype.renderLife = function() {
        this.$div.find(".life").css({
            width: this.calcBossLifeWidth()
        }), this.$div.removeClass("less50PercentLife less25PercentLife"), this.$div.find(".life").removeClass("less50PercentLife less25PercentLife"), $(".taskBossLife").find(".currentLife").removeClass("less50PercentLife less25PercentLife"), this.lifeClass() && (this.$div.addClass(this.lifeClass()), this.$div.find(".life").addClass(this.lifeClass()), $(".taskBossLife").find(".currentLife").addClass(this.lifeClass())), $(".taskBossLife").find(".currentLife").html(this.life), $(".taskBossLife").find(".maxLife").html(BossCell.LIFE)
    }, BossCell.prototype.remove = function() {
        this.isHead() ? BaseCell.prototype.remove.call(this) : 0 == this.head.life ? BaseCell.prototype.remove.call(this, !0) : this.head.remove()
    }, BossCell.prototype.getTemplateClass = function() {
        return this.isHead() ? this.name + "HeadCell" : this.name + "BodyCell"
    }, BossCell.prototype.createDiv = function() {
        var e = BaseCell.prototype.createDiv.call(this);
        return this.isHead() && this.renderLife(), e
    }, BossCell.prototype.playTalkingSound = function() {}, BossCell.prototype.talkingAnimation = function() {
        if ($(".bossBg").removeClass("stable").addClass("bossTalk"), this.playTalkingSound(), this.playingTalkingSound) {
            var e = sounds[this.playingTalkingSound].instance._duration;
            setTimeout(_.bind(function() {
                $(".bossBg").removeClass("bossTalk").addClass("stable"), sounds[this.playingTalkingSound] && sounds[this.playingTalkingSound].stop()
            }, this), e)
        }
    };
    var PenguinCell = function(e, i) {
        BossCell.call(this, e, i), this.removeOnRemoveNear = !1, this.removable = !1, this.sizeInCells = 2, this.isHead() && Game.on("removedItem", _.bind(function(e) {
            this.collectItems(e)
        }, this)), PenguinCell.eatingItems = [], "penguin" == application.level.bossName ? PenguinCell.eatingItems = ["A"] : "dragon" == application.level.bossName ? PenguinCell.eatingItems = ["R"] : "owl" == application.level.bossName && (PenguinCell.eatingItems = ["t"])
    };
    extend(PenguinCell, BossCell), PenguinCell.prototype.collectItems = function(e) {
        var i = "raccoon" == application.level.bossName && "fish9" == e.scoresId,
            t = PenguinCell.eatingItems.indexOf(e.color) > -1 && void 0 === e.attribute && e instanceof Cell && !$(".powerUpCatAnimation").is(":visible") && this.life > 0,
            o = i || t;
        if (o) {
            var s = this.$div,
                n = {
                    left: 35,
                    top: 40
                },
                a = {
                    targetScale: .6,
                    vy: 500,
                    easing: Library.linearEasing
                },
                r = e.$div.clone(),
                l = Game.animate();
            Figure.blockedAnimations.append(r), r.alignTo(e.$div), e.$div.hide(), r.ourAnimate({
                target: s,
                ajust: n,
                animation: Library.collectFly,
                options: a
            }, 12 * Game.get("speed"), void 0, _.bind(function() {
                e.$div.remove(), r.remove(), this.removable = !0, this.remove(), l()
            }, this))
        }
    };
    var oldBossCellRemove = BossCell.prototype.remove;
    PenguinCell.prototype.remove = function() {
        oldBossCellRemove.call(this), this.removable = !1
    }, PenguinCell.prototype.playTakeLifeSound = function() {
        switch (application.level.bossName) {
            case "penguin":
                application.playSound("penguinEat");
                break;
            case "owl":
                application.playSound("owlEat");
                break;
            case "raccoon":
                application.playSound("raccoonEat");
                break;
            case "dragon":
                application.playSound("dragonEat")
        }
    }, PenguinCell.prototype.playRemoveSound = function() {}, PenguinCell.prototype.renderLife = function() {
        this.$div.find(".currentLife").html(this.life);
        var e = this.life > 0 ? 0 : 1;
        switch ($(".taskBossLife").find(".currentLife").html(e), $(".taskBossLife").find(".maxLife").html(1), this.lifeClass()) {
            case "less100PercentLife":
                this.$div.addClass(this.lifeClass());
                break;
            case "less50PercentLife":
                this.$div.removeClass("less100PercentLife").addClass(this.lifeClass());
                break;
            case "less25PercentLife":
                this.$div.removeClass("less50PercentLife").addClass(this.lifeClass())
        }
        if ("owl" == application.level.bossName) switch (this.lifeClass()) {
            case "less100PercentLife":
                this.$div.find("." + this.name + "Bg").addClass(this.lifeClass()), this.$div.find("." + this.name + "Zzz").addClass(this.lifeClass()), this.$div.find("." + this.name + "Body").addClass(this.lifeClass());
                break;
            case "less50PercentLife":
                this.$div.find("." + this.name + "Bg").removeClass("less100PercentLife").addClass(this.lifeClass()), this.$div.find("." + this.name + "Zzz").removeClass("less100PercentLife").addClass(this.lifeClass()), this.$div.find("." + this.name + "Body").removeClass("less100PercentLife").addClass(this.lifeClass());
                break;
            case "less25PercentLife":
                this.$div.find("." + this.name + "Bg").removeClass("less50PercentLife").addClass(this.lifeClass()), this.$div.find("." + this.name + "Zzz").removeClass("less50PercentLife").addClass(this.lifeClass()), this.$div.find("." + this.name + "Body").removeClass("less50PercentLife").addClass(this.lifeClass())
        }
    }, PenguinCell.prototype.playRemoveAnimation = function(e) {
        if ("dragon" === this.name) {
            var i = createByTemplate(".invisible ." + this.name + "Fly");
            Figure.blockedAnimations.append(i), i.alignTo(this.$div), this.$div.remove(), setTimeout(function() {
                i.remove(), e()
            }, 700)
        } else this.$div.remove(), e()
    }, PenguinCell.prototype.getAngryAnimationTime = function() {
        return 840
    };
    var oldBossCellBeforeRemove = BossCell.prototype.beforeRemove;
    PenguinCell.prototype.beforeRemove = function() {
        Game.each(function(e) {
            e instanceof PenguinCell && (e.removable = !0)
        }), this.$div.find("." + application.level.bossName + "LifeText").remove(), oldBossCellBeforeRemove.call(this)
    }, PenguinCell.prototype.clickAnimate = function() {
        BaseCell.prototype.clickAnimate.call(this.head)
    };
    var MixerCell = function(e, i) {
        BossCell.call(this, e, i), this.removeOnRemoveNear = !1, this.removable = !1, this.sizeInCells = 2, this.isHead() && (this.isActiveNow = !1, this.moves = Config.mixerAppearEpisode && Config.mixerAppearLevel && episode.get("num") === Config.mixerAppearEpisode && application.level.num === Config.mixerAppearLevel ? 1 : MixerCell.MOVES, Game.set("mixer", this))
    };
    extend(MixerCell, BossCell), MixerCell.MOVES = 5, MixerCell.prototype.indestructible = !0, MixerCell.prototype.createTalkingInterval = function() {}, MixerCell.prototype.process = function() {
        this.moves--, this.moves <= 0 && (this.moves = MixerCell.MOVES, this.shuffle()), this.renderMoves()
    }, MixerCell.prototype.shuffle = function() {
        this.isActiveNow = !0;
        var e = Game.animate();
        this.$div.find(".mixerBg").removeClass("stable").addClass("shuffle"), application.playSound("mixer"), setTimeout(_.bind(function() {
            this.$div.find(".mixerBg").removeClass("shuffle").addClass("stable"), Game.shuffleField(), e()
        }, this), 1e3), Game.once("vortex", function() {
            setTimeout(_.bind(function() {
                this.isActiveNow = !1
            }, this), 0)
        }, this)
    }, MixerCell.prototype.renderMoves = function() {
        $moves = this.$div.find(".moves"), $moves.html(this.moves), 1 === this.moves ? $moves.addClass("soonShuffle") : $moves.removeClass("soonShuffle")
    }, MixerCell.prototype.createDiv = function() {
        var e = BaseCell.prototype.createDiv.call(this);
        return this.isHead() && (e.find(".mixerBg").addClass("stable"), this.renderMoves()), e
    }, MixerCell.process = function() {
        Game.has("mixer") && Game.get("mixer").process()
    };
    var PeacockCell = function(e, i) {
        BaseCell.call(this, e, i), this.removable = !1, this.movable = !1, this.width = 2, this.height = 2, this.head = this.getHead(), this.isHead() && (this.mustFire = !1)
    };
    extend(PeacockCell, BaseCell), PeacockCell.prototype.indestructible = !0, PeacockCell.prototype.removeNear = function() {
        this.isHead() ? this.mustFire = !0 : this.head.removeNear()
    }, PeacockCell.prototype.fire = function() {
        var e = [];
        if (Game.each(_.bind(function(i) {
                this.checkCanFire(i) && e.push(i)
            }, this)), e.length) {
            e = _.shuffle(e);
            for (var i = 0; i < Math.min(3, e.length); i++) this.animateFire(e[i], Game.animate());
            this.$div.addClass("fireAnimation"), setTimeout(_.bind(function() {
                this.$div.removeClass("fireAnimation")
            }, this), 800)
        }
    }, PeacockCell.prototype.checkCanFire = function(e) {
        if (e instanceof Cell) {
            var i = gameView.tasksView.options.tasks.findWhere({
                type: "CollectColor",
                color: e.color
            });
            if (i) return !0
        }
        return !1
    }, PeacockCell.prototype.animateFire = function(e, i) {
        application.playSound("peacockCellFireAnimation");
        var t = createByTemplate(".invisible .emptyTemplate").addClass("flyPeacockFeather");
        Figure.blockedAnimations.append(t), t.alignTo(this.$div, {
            ajust: {
                top: 0,
                left: Config.cellWidth / 2
            }
        }), t.ourAnimate({
            target: e.$div
        }, 500, "linear", _.bind(function() {
            t.addClass("removeAnimation"), setTimeout(function() {
                e.removeNear(5), t.remove()
            }, 700), i()
        }, this))
    }, PeacockCell.prototype.isHead = function() {
        return this.head == this
    }, PeacockCell.prototype.getHead = function() {
        for (var e = this.width; e >= 0; e--)
            for (var i = this.height; i >= 0; i--)
                if (Game.inField(this.x - e, this.y - i) && Game.field[this.y - i][this.x - e] instanceof PeacockCell) return Game.field[this.y - i][this.x - e];
        return this
    }, PeacockCell.prototype.getTemplateClass = function() {
        return this.isHead() ? "peacockHeadCell" : "peacockBodyCell"
    }, PeacockCell.process = function() {
        Game.each(function(e) {
            e instanceof PeacockCell && e.mustFire && (e.fire(), e.mustFire = !1)
        })
    };
    var DroppableCell = BaseCell.extend({
            constructor: function(e, i, t) {
                this.char = t ? application.level.map[e].charAt(i) : void 0, BaseCell.call(this, e, i), this.removable = !1, t && application.level.decorators && (this.decorator = Decorator.create(application.level.decorators[e].charAt(i), this), this.decorator && this.listenTo(this.decorator, "remove", this.onRemoveDecorator))
            },
            onRemoveDecorator: function() {
                setTimeout(_.bind(function() {
                    this.setY(this.y)
                }, this), 500)
            },
            isRemovable: function() {
                return this.decorator ? !0 : this.removable
            },
            remove: function(e) {
                return this.decorator ? (this.decorator.remove(e), !0) : BaseCell.prototype.remove.call(this, e)
            },
            createDiv: function() {
                var e = Cell.prototype.createDiv.call(this);
                return e
            },
            setY: function(e) {
                BaseCell.prototype.setY.call(this, e);
                for (var i = e + 1; i < Config.rows; i++)
                    if (null !== Game.field[i][this.x]) return;
                this.removable = !0, BaseCell.prototype.remove.call(this)
            },
            animateRemoval: function(e) {
                e(), this.$div.delay(100).queue(_.bind(function() {
                    this.$div.remove()
                }, this))
            },
            afterRemove: function() {
                Game.trigger("afterRemovedItem", this)
            }
        }),
        FishCell = DroppableCell.extend({
            animations: ["dancingFishAnim1", "dancingFishAnim2", "dancingFishAnim3"],
            constructor: function(e, i, t, o) {
                this.type = t ? FishCell.codeToType(application.level.map[e].charAt(i)) : o, this.dancingClassId = 0, this.scoresId = 1 == this.type ? "fish" : "fish" + this.type, DroppableCell.call(this, e, i, t)
            },
            getTemplateClass: function() {
                return "fishCell"
            },
            createDiv: function() {
                var e = Cell.prototype.createDiv.call(this);
                return e.addClass(RANDOM(this.animations)).addClass(this.scoresId), e.find(".fishcellBg").addClass(this.scoresId), application.trigger("createFish"), e
            },
            animateRemoval: function(e) {
                application.playSound("fishCellRemove"), e(), this.$div.remove()
            }
        }, {
            codeToType: function(e) {
                return "FghjklbncuDцуке".indexOf(e) + 1
            }
        }),
        LeftMoveCell = function(e, i) {
            BaseCell.call(this, e, i)
        };
    _.extend(LeftMoveCell.prototype, BaseCell.prototype), LeftMoveCell.prototype.createDiv = function(e) {
        var i = BaseCell.prototype.createDiv.call(this, e);
        return i.addClass("leftmove"), i
    }, LeftMoveCell.prototype.remove = function() {
        var e = this.x,
            i = this.y,
            t = [{
                x: 0,
                y: 1
            }, {
                x: 0,
                y: -1
            }, {
                x: 1,
                y: 0
            }, {
                x: -1,
                y: 0
            }, {
                x: 1,
                y: 1
            }, {
                x: 1,
                y: -1
            }, {
                x: -1,
                y: 1
            }, {
                x: -1,
                y: -1
            }];
        _.each(t, function(t) {
            var o = e + t.x,
                s = i + t.y;
            Game.inField(o, s) && Game.inField(o, s) instanceof Cell && Game.inField(o, s).remove()
        })
    };
    var NutCell = function(e, i) {
        BaseCell.call(this, e, i), this.removeOnRemoveNear = !0;
        var t = application.level.map[e].charAt(i);
        switch (t) {
            case "r":
                this.life = 1;
                break;
            case "y":
                this.life = 2;
                break;
            case "q":
                this.life = 3;
                break;
            default:
                this.life = 1
        }
    };
    NutCell.prototype.notShuffled = !0, _.extend(NutCell.prototype, BaseCell.prototype), NutCell.prototype.getTemplateClass = function() {
        return "nutCell"
    }, NutCell.prototype.animateTakeLife = function(e) {
        function i(i) {
            if (2 == t) this.$div.find(".cellStone").addClass("nut3_annihilation"), this.$div.delay(400).queue(_.bind(function(i) {
                this.$div.find(".cellStone").removeClass("nut3_annihilation"), this.$div.removeClass("nutLevel" + (t + 1)).addClass("nutLevel" + t), e(), i()
            }, this));
            else {
                this.$div.removeClass("nutLevel" + (t + 1)).addClass("nutLevel" + t);
                var o = gameView.createFallDownExplodePiece("fallDownPieceTemplate");
                o.alignTo(this.$div), gameView.fallDownExplode(o, 2, "nutLevel2_remove_animatePiece"), e()
            }
            i()
        }
        var t = this.life;
        this.$div.queue(_.bind(function(e) {
            application.playSound("nutTakeLife"), i.call(this, e)
        }, this))
    }, NutCell.prototype.createDiv = function() {
        var e = BaseCell.prototype.createDiv.call(this);
        return e.addClass("nutLevel" + this.life), e
    }, NutCell.prototype.animateRemoval = function(e) {
        application.playSound("nutRemove"), BaseCell.prototype.animateRemoval.call(this, e)
    };
    var EggCell = function(e, i, t, o) {
        BaseCell.call(this, e, i), this.color = EggCell.codeToType(t ? application.level.map[e].charAt(i) : o), this.scoresId = "egg", this.removable = 0 == this.color ? !0 : !1
    };
    _.extend(EggCell.prototype, BaseCell.prototype), EggCell.chars = "0123", EggCell.codeToType = function(e) {
        return EggCell.chars.indexOf(e)
    }, EggCell.prototype.createDiv = function() {
        return application.trigger("createEgg"), BaseCell.prototype.createDiv.apply(this, arguments)
    }, EggCell.prototype.animateRemoval = function(e) {
        this.$div.remove(), e()
    };
    var Decorator = Backbone.Model.extend({
        defaults: {
            name: "",
            level: 1,
            cell: null
        },
        initialize: function() {
            this.get("cell").movable = !1
        },
        takeColor: function() {
            this.get("cell").removeOnRemoveNear = !0, "none" !== this.get("cell").color && (this.get("cell").saveColor = this.get("cell").color, this.get("cell").color = "none")
        },
        backColor: function() {
            this.get("cell").color = this.get("cell").saveColor, this.get("cell").saveColor = void 0, this.get("cell").removeOnRemoveNear = !1
        },
        getDecoratorClass: function() {
            return "decorator_" + this.get("name")
        },
        getAnimatedPiecesClass: function() {
            return this.getDecoratorClass() + "_remove_animatePiece"
        },
        getDiv: function() {
            return this.get("cell").$div.find("." + this.getDecoratorClass())
        },
        remove: function() {
            this.animateRemoval(), this.set("level", this.get("level") - 1), 0 == this.get("level") && (this.get("cell").decorator = void 0, this.get("cell").movable = !0), this.trigger("remove")
        },
        animateRemoval: function() {
            1 == this.get("level") && this.getDiv().remove()
        },
        cellDecoratorPlace: function() {
            return this.get("cell").$div
        },
        render: function() {
            var e = createByTemplate(".invisible ." + this.getDecoratorClass());
            e.find(".life").html(this.get("level")), this.cellDecoratorPlace().append(e)
        }
    }, {
        create: function(e, i) {
            var t = _.find(Decorator.listDecorators(), function(i) {
                return -1 != i.SYMBOL.indexOf(e)
            });
            return void 0 === t ? void 0 : new t({
                cell: i,
                "char": e
            })
        },
        isRegularCell: function(e) {
            return e instanceof Cell
        }
    });
    Decorator.listDecorators = function() {
        return [BlockedDecorator, MouseDecorator, ChainBlockedDecorator]
    };
    var LayerDecorator = Decorator.extend({
            setLevel: function(e) {
                this.set("level", e.indexOf(this.get("char")) + 1)
            },
            getDecoratorClass: function(e) {
                return void 0 === e && (e = this.get("level")), 1 == e ? Decorator.prototype.getDecoratorClass.call(this) : Decorator.prototype.getDecoratorClass.call(this) + e
            },
            render: function() {
                for (var e = 1; e <= this.get("level"); e++) {
                    var i = createByTemplate(".invisible ." + this.getDecoratorClass(e));
                    this.cellDecoratorPlace().append(i)
                }
            }
        }),
        BlockedDecorator = LayerDecorator.extend({
            initialize: function() {
                this.set("name", "blocked"), this.setLevel(BlockedDecorator.SYMBOL), 1 == this.get("level") && this.set("oneTimeRemove", !0), Decorator.prototype.initialize.call(this)
            },
            remove: function() {
                LayerDecorator.prototype.remove.call(this), 1 == this.get("level") && this.set("oneTimeRemove", !0)
            },
            getAnimatedPiecesAmount: function() {
                return 4
            },
            animateRemoval: function() {
                application.playSound("blockedDecoratorRemove"), gameView.fallDownExplode(this.getDiv(), this.getAnimatedPiecesAmount(), this.getAnimatedPiecesClass()), Decorator.prototype.animateRemoval.call(this, this.getDiv())
            }
        }, {
            SYMBOL: "*@z"
        });
    BlockedDecorator.prototype.animateRemoval = function() {
        application.playSound("blockedDecoratorRemove"), this.getDiv().addClass("remove").delay(800).queue(function(e) {
            this.remove(), e()
        })
    };
    var GrowDecorator = Decorator.extend({}, {
            process: function(e, i) {
                if (!Game.get(e)) {
                    var t = [];
                    if (Game.each(function(e) {
                            i(e) && Game.neighbors(e, function(e) {
                                Decorator.isRegularCell(e) && !e.decorator && t.push(e)
                            })
                        }), t.length > 0) return RANDOM(t)
                }
                return !1
            }
        }),
        MouseDecorator = Decorator.extend({
            defaults: {
                name: "mouse",
                cell: null,
                level: 2
            },
            onMoveSound: "mousemove",
            onMoveAnimation: function() {
                return createByTemplate(".invisible .moveMouse").addClass("move_" + this.get("name")).addClass("level_" + this.get("level"))
            },
            render: function() {
                Decorator.prototype.render.call(this), this.getDiv().addClass("level_" + this.get("level"))
            },
            moveMouse: function(e, i) {
                application.playSound(this.onMoveSound);
                var t = this.onMoveAnimation();
                return Figure.blockedAnimations.append(t), t.alignTo(this.getDiv()), this.getDiv().remove(), t.ourAnimate({
                    target: e.$div
                }, 500, "linear", function() {
                    t.remove(), i()
                }), e.x > this.get("cell").x && t.addClass("moveRight"), t
            },
            animateRemoval: function() {
                this.get("level") > 1 ? (this.getDiv().removeClass("level_" + this.get("level")).addClass("level_" + (this.get("level") - 1)), application.playSound("mouseRemove")) : (Game.trigger("removedDecorator", this), application.playSound("mouseRemove"), Decorator.prototype.animateRemoval.call(this))
            },
            mouseOneStep: function(e, i, t, o, s, n) {
                var a = this.get("name"),
                    r = this.get("cell");
                if (0 != e) {
                    var l = [];
                    if (Game.neighbors(r, function(e) {
                            (e.x !== o || e.y !== s) && e instanceof Cell && !e.decorator && !n[e.y][e.x] && l.push(e)
                        }), l.length > 0) {
                        var d = RANDOM(l);
                        return "mouse" == a && MouseDecorator.occupite(d, this.get("level")), n[d.y][d.x] = !0, this.moveMouse(d, Game.animate(function() {
                            d.decorator.render(), this.occupited(d), d.decorator.mouseOneStep(e - 1, d.x, d.y, i, t, n)
                        }, d.decorator)), r.decorator = void 0, r.movable = !0, !0
                    }
                    return !1
                }
            },
            occupited: function() {},
            animateCollect: function(e, i) {
                var e = e.find(".taskIco"),
                    t = createByTemplate(".invisible .emptyTemplate").addClass("mouseCollect");
                Figure.blockedAnimations.append(t), t.alignTo(this.getDiv()), void 0 === MouseDecorator.icoSize && (MouseDecorator.icoSize = parseInt(e.css("width"))), koef = MouseDecorator.icoSize / Config.cellWidth;
                var o = {
                    left: -(1 - koef) * Config.cellWidth / 2,
                    top: -(1 - koef) * Config.cellHeight / 2
                };
                t.ourAnimate({
                    target: e,
                    scale: koef,
                    ajust: o
                }, 10 * Game.get("speed"), void 0, function() {
                    Game.set("score", Game.get("score") + GameScores.mouse)
                }).ourAnimate({
                    opacity: 0
                }, 2 * Game.get("speed"), void 0, function() {
                    i(), t.remove()
                })
            }
        }, {
            SYMBOL: "]",
            occupite: function(e, i) {
                e.decorator = new MouseDecorator({
                    cell: e,
                    level: i
                })
            },
            process: function() {
                for (var e = [], i = 0; i < Config.rows; i++) {
                    e.push([]);
                    for (var t = 0; t < Config.cols; t++) e[i].push(!1)
                }
                for (var o = !0; o;) o = !1, Game.each(function(i) {
                    if (0 === i.getDecoratorName().indexOf("mouse") && !e[i.y][i.x]) {
                        {
                            i.getDecoratorName()
                        }
                        i.decorator.mouseOneStep(1, i.x, i.y, !1, !1, e) && (o = !0)
                    }
                })
            }
        }),
        MorphColorCell = function(e, i) {
            BaseCell.call(this, e, i);
            var t = application.level.map[e].charAt(i);
            switch (t) {
                case "5":
                    this.color = "R";
                    break;
                case "6":
                    this.color = "G";
                    break;
                case "7":
                    this.color = "C";
                    break;
                case "8":
                    this.color = "A";
                    break;
                case "9":
                    this.color = "O";
                    break;
                default:
                    this.color = "R"
            }
            this.processCounter = 0
        };
    _.extend(MorphColorCell.prototype, BaseCell.prototype), MorphColorCell.prototype.createDiv = function() {
        var e = BaseCell.prototype.createDiv.call(this);
        return e.addClass("morphColorCell"), e
    }, MorphColorCell.prototype.getTemplateClass = function() {
        return "morphColorCell"
    }, MorphColorCell.prototype.animateChangeColor = function(e) {
        for (var i = Game.animate(), t = (this.$div.find("." + this.baseName + "CellBg"), application.level.colors.split("")), o = "RGCAO", s = [], n = 0, a = t.length; a > n; n++)
            if (o.indexOf(t[n]) >= 0) {
                var r = gameView.tasksView.options.tasks.findWhere({
                    type: "CollectColor",
                    color: t[n]
                });
                r || s.push(t[n])
            }
        if (!(s.length <= 1)) {
            var l = _.indexOf(s, this.color);
            l > -1 && (l++, l >= s.length && (l = 0));
            var d = s[l];
            this.$div.removeClass("color_" + this.color).addClass("color_" + d), this.color = d, this.$div.find(".morphColorAnimation").addClass("changeColor"), this.$div.delay(440).queue(_.bind(function(t) {
                this.$div.find(".morphColorAnimation").removeClass("changeColor"), i(), e(), t()
            }, this))
        }
    }, MorphColorCell.prototype.process = function() {
        this.processCounter++, this.processCounter > 1 && (this.processCounter = 0, this.animateChangeColor(Game.animate()))
    }, MorphColorCell.process = function() {
        Game.each(function(e) {
            e instanceof MorphColorCell && e.process()
        })
    }, MorphColorCell.prototype.setRandomColor = function() {};
    var StrawBerryCell = function(e, i) {
        BaseCell.call(this, e, i), this.color = "none", this.movable = !1, this.removable = !1, this.life = 3;
        var t = function(e) {
            this.life > 0 && "W" === e.getCurrentColor() && Math.abs(e.x - this.x) + Math.abs(e.y - this.y) == 1 && (this.removable = !0, this.remove(), this.removable = !1, 0 == this.life && Game.off("removedItem", t, this))
        };
        Game.on("removedItem", t, this)
    };
    _.extend(StrawBerryCell.prototype, BaseCell.prototype), StrawBerryCell.prototype.getTemplateClass = function() {
        return "strawBerryCell"
    }, StrawBerryCell.prototype.drawLife = function() {
        this.$div.removeClass("life" + (this.life + 1)).addClass("life" + this.life)
    }, StrawBerryCell.prototype.animateTakeLife = function(e) {
        this.drawLife(), application.playSound("strawBerryCellTakeLife"), e()
    }, StrawBerryCell.prototype.createDiv = function() {
        var e = BaseCell.prototype.createDiv.call(this);
        return this.drawLife(), e
    }, StrawBerryCell.prototype.animateRemoval = function(e) {
        application.playSound("strawBerryRemove"), BaseCell.prototype.animateRemoval.call(this, e)
    };
    var MouseFarmCell = function(e, i) {
        BaseCell.call(this, e, i), this.color = "none", this.movable = !1, this.removable = !1, this.level = Config.mouseFarmAppearEpisode === episode.get("num") && application.level.num === Config.mouseFarmAppearLevel ? 3 : Math.floor(Math.random() * MouseFarmCell.MAXLEVEL)
    };
    MouseFarmCell.MAXLEVEL = 3, _.extend(MouseFarmCell.prototype, BaseCell.prototype), MouseFarmCell.prototype.getTemplateClass = function() {
        return "mouseFarmCell"
    }, MouseFarmCell.prototype.createDiv = function() {
        var e = Cell.prototype.createDiv.call(this);
        return e.addClass("mouseFarmLevel" + this.level).find(".mouseFarmCellMouse").addClass("stable"), e
    }, MouseFarmCell.prototype.createMouse = function(e, i) {
        application.playSound("mouseFarmCellCreateMouse"), this.$div.removeClass("mouseFarmLevel" + MouseFarmCell.MAXLEVEL).addClass("mouseFarmLevel0");
        var t = createByTemplate(".invisible .mouseFarmCreateMouse").addClass("level_2");
        Figure.blockedAnimations.append(t), t.alignTo(this.$div), t.ourAnimate({
            target: e.$div
        }, 500, "linear", function() {
            t.remove(), i()
        })
    }, MouseFarmCell.prototype.incMouseFarmLevel = function() {
        this.level++, this.$div.removeClass("mouseFarmLevel" + (this.level - 1)).addClass("mouseFarmLevel" + this.level).find(".mouseFarmCellMouse").removeClass("stable").addClass("mouseFarmMove").sprite.once("round", _.bind(function() {
            this.$div.find(".mouseFarmCellMouse").removeClass("mouseFarmMove").addClass("stable")
        }, this))
    }, MouseFarmCell.process = function() {
        for (var e = [], i = 0; i < Config.rows; i++) {
            e.push([]);
            for (var t = 0; t < Config.cols; t++) e[i].push(!1)
        }
        Game.each(function(i) {
            try {
                if (i instanceof MouseFarmCell)
                    if (i.level < MouseFarmCell.MAXLEVEL) i.incMouseFarmLevel();
                    else {
                        var t = [];
                        if (Game.neighbors(i, function(i) {
                                i instanceof Cell && !i.decorator && !e[i.y][i.x] && t.push(i)
                            }), t.length) {
                            var o = RANDOM(t);
                            e[o.y][o.x] = !0, i.level = 0, MouseDecorator.occupite(o), i.createMouse(o, Game.animate(function() {
                                o.decorator.attributes.level = 2, o.decorator.render(o.$div)
                            }, Game))
                        }
                    }
            } catch (s) {
                console.log("ERRROR ", s, i)
            }
        })
    };
    var getItemCoords = function(e) {
            return {
                left: getLeftCoord(e.x) + "px",
                top: getTopCoord(e.y) + "px"
            }
        },
        getItemCoordsForFallDown = function(e, i) {
            return {
                top: getTopCoord(i) + "px"
            }
        },
        getTopCoord = function(e) {
            return e * Config.cellHeight
        },
        getLeftCoord = function(e) {
            return e * Config.cellWidth
        },
        RemoveFigureController = {
            removeItemsSilent: function(e, i) {
                _.each(e, function(e) {
                    e.decorator && "changecolor" != e.getDecoratorName() && e.remove(), e instanceof Cell ? e.remove(!0) : e.remove()
                }), _.each(i, function(e) {
                    e.removeNear()
                })
            },
            cloneItems: function(e) {
                for (var i = [], t = 0; t < e.length; t++)
                    if (e[t] instanceof Cell || e[t] instanceof EggCell) {
                        var o = e[t].$div.clone();
                        o.find(".attribute").remove(), o.find(".decorator").remove(), Figure.field.append(o), o.alignTo(e[t].$div), i.push(o)
                    }
                return i
            },
            createFigureAnimation: function(e, i, t) {
                t = _.once(t);
                for (var o = 0; o < e.length; o++) e[o].ourAnimate(getItemCoords(i), 4 * Game.get("speed"), "linear", function() {
                    this.remove(), t()
                });
                0 == e.length && t()
            },
            isItemsOneLine: function(e, i, t) {
                for (var o = 1; o < e.length; o++) {
                    if (0 == i && e[o].x != e[0].x) return !1;
                    if (0 == t && e[o].y != e[0].y) return !1
                }
                return !0
            },
            threeFigureRemove: function(e, i, t) {
                _.each(e, function(e) {
                    e.remove()
                }), _.each(t, function(e) {
                    e.removeNear()
                })
            },
            createEggFigureAnimation: function(e, i, t) {
                RemoveFigureController.createFigureAnimation(e, i, t)
            },
            eggFigureRemove: function(e, i, t) {
                application.playSound("eggCollected");
                var o = RemoveFigureController.cloneItems(e);
                _.each(e, function(e) {
                    e.removable = !0
                }), RemoveFigureController.removeItemsSilent(e, t);
                var s = Game.animate();
                RemoveFigureController.createEggFigureAnimation(o, i, _.bind(function() {
                    var e = new EggCell(i.y, i.x, !1, i.color - 1);
                    this.addItem(e, !0), RemoveFigureController.animateEggAfterTransform(e, function() {
                        0 == e.color && e.remove(), s()
                    })
                }, Game))
            },
            animateEggAfterTransform: function(e, i) {
                i()
            },
            fourFigureRemove: function(e, i, t) {
                var o = RemoveFigureController.isItemsOneLine(e, 1, 0) ? "-" : "|";
                application.playSound("fourFigureRemove");
                var s = RemoveFigureController.cloneItems(e);
                RemoveFigureController.removeItemsSilent(e, t), RemoveFigureController.createFigureAnimation(s, i, Game.animate(function() {
                    var e = new ArrowCell(i.y, i.x, !1, o, i.color);
                    this.addItem(e, !0)
                }, Game))
            },
            fiveFigureRemove: function(e, i, t) {
                application.playSound("fiveFigureRemove");
                var o = RemoveFigureController.cloneItems(e);
                RemoveFigureController.removeItemsSilent(e, t), RemoveFigureController.createFigureAnimation(o, i, Game.animate(function() {
                    var e = new MultiColorCell(i.y, i.x);
                    this.addItem(e, !0)
                }, Game))
            },
            otherFigureRemove: function(e, i, t) {
                application.playSound("otherFigureRemove");
                var o = RemoveFigureController.cloneItems(e);
                RemoveFigureController.removeItemsSilent(e, t), RemoveFigureController.createFigureAnimation(o, i, Game.animate(function() {
                    var e = new ArrowCell(i.y, i.x, !1, "+", i.color);
                    this.addItem(e, !0)
                }, Game))
            },
            points: function(e, i) {
                var t = 0,
                    o = 0;
                if (_.each(e, function(e) {
                        e instanceof Cell && (t++, e.decorator || o++)
                    }), t != e.length && i instanceof Cell) {
                    for (var s = 0; s < e.length; s++)
                        if (!(e[s] instanceof Cell)) {
                            e[s].showPointsOnRemove += o * GameScores.cell;
                            break
                        }
                } else i.showPointsOnRemove += GameScores.cell * o
            }
        };
    _.extend(RemoveFigureController, {
        pumpCellAnimation: function(e, i, t) {
            var o = createByTemplate(".invisible .smallFire");
            Figure.field.append(o), o.alignTo(i.$div), o.ourAnimate({
                target: e.$div,
                ajust: {
                    left: 35,
                    top: 40
                }
            }, 2.5 * Game.get("speed"), "easeInQuad", Game.animate(function() {
                o.remove(), t()
            }))
        },
        createFigureAnimation: function(e, i, t) {
            for (var o = 0; o < e.length; o++) e[o].remove();
            t()
        },
        createEggFigureAnimation: function(e, i, t) {
            var o = "jamHalf";
            1 == i.color && (o = "jamFull"), application.playSound(o), t = _.once(t);
            for (var s = 0; s < e.length; s++) e[s].ourAnimate({
                top: "-=5px"
            }, 2.5 * Game.get("speed"), "linear", Game.animate(_.bind(function() {
                this.ourAnimate({
                    top: "+=5px"
                }, 2.5 * Game.get("speed"), "linear", Game.animate(_.bind(function() {
                    this.ourAnimate(getItemCoords(i), 4 * Game.get("speed"), "linear", function() {
                        this.remove(), t()
                    })
                }, this)))
            }, e[s])));
            0 == e.length && t()
        },
        animateEggAfterTransform: function(e, i) {
            e.$div.removeClass("color_" + e.color).addClass("color_" + (e.color + 1)), setTimeout(_.bind(function() {
                e.$div.removeClass("color_" + (e.color + 1)).addClass("color_" + e.color).find(".cellStone").addClass("collected"), setTimeout(function() {
                    e.$div.find(".cellStone").removeClass("collected"), i()
                }, 1e3)
            }, this), 400)
        },
        fourFigureRemove: function(e, i, t) {
            var o = gameView.tasksView.options.tasks.where({
                    type: "CollectColor"
                }),
                s = _.map(o, function(e) {
                    return e.get("color")
                }),
                n = _.filter(t, function(e) {
                    return s.indexOf(e.color) >= 0
                });
            n.length > 0 && application.playSound("fourFigureRemove"), _.each(n, function(e) {
                RemoveFigureController.pumpCellAnimation(e, i, function() {
                    e.removeNear(2)
                })
            }), _.each(_.difference(t, n), function(e) {
                e.removeNear()
            }), _.each(e, function(e) {
                e.remove()
            })
        },
        otherFigureRemove: function(e, i, t) {
            RemoveFigureController.fourFigureRemove(e, i, t)
        },
        points: function(e, i) {
            if (gameView.tasksView.options.tasks.findWhere({
                    type: "CollectColor",
                    color: e[0].color
                })) {
                for (var t = 0, o = 0; o < e.length; o++) e[o].decorator || (t += e[o].getRealCoeff() + 1);
                Game.trigger("showFieldPoints", i.$div, t, "explodeCell_" + i.color)
            }
        }
    });
    var SwapMoveController = function() {
        Game.on("change:running", function(e, i) {
            i ? SwapMoveController.fieldOn() : SwapMoveController.fieldOff()
        }), Game.on("invalidMove", SwapMoveController.invalidMove), Game.on("validMove", SwapMoveController.validMove), Game.on("change:selected", SwapMoveController.changeSelected), Game.on("cellChangeColor", SwapMoveController.cellChangeColor), Game.on("moveCell", SwapMoveController.moveCell), Game.on("change:suggest", SwapMoveController.changeSuggest)
    };
    SwapMoveController.getSwapCellsSpeed = function() {
        return 4
    }, SwapMoveController.invalidMove = function(e, i) {
        application.playSound("swapMove"), e.first.$div.ourAnimate(getItemCoords(e.second), Game.get("speed") * SwapMoveController.getSwapCellsSpeed(), "linear", function() {
            application.playSound("swapMoveRollback")
        }), e.first.$div.ourAnimate(getItemCoords(e.first), Game.get("speed") * SwapMoveController.getSwapCellsSpeed(), "linear"), e.second.$div.ourAnimate(getItemCoords(e.first), Game.get("speed") * SwapMoveController.getSwapCellsSpeed(), "linear"), e.second.$div.ourAnimate(getItemCoords(e.second), Game.get("speed") * SwapMoveController.getSwapCellsSpeed(), "linear", i)
    }, SwapMoveController.validMove = function(e, i) {
        application.playSound("swapMove"), e.first.$div.ourAnimate(getItemCoords(e.second), Game.get("speed") * SwapMoveController.getSwapCellsSpeed(), "linear"), e.second.$div.ourAnimate(getItemCoords(e.first), Game.get("speed") * SwapMoveController.getSwapCellsSpeed(), "linear", i)
    }, SwapMoveController.changeSelected = function(e, i) {
        var t = Game.previous("selected");
        if (void 0 !== t && t.$div.find(".selectedCellBg").remove(), void 0 !== i) {
            var o = createByTemplate(".invisible .selectedTemplate");
            application.playSound("changeSelected"), i.$div.append(o)
        }
    }, SwapMoveController.cellChangeColor = function(e, i, t) {
        e.$div.fadeOut(200, function() {
            e.$div.removeClass("color_" + i).addClass("color_" + e.color).fadeIn(200, t)
        })
    }, SwapMoveController.moveCell = function(e, i, t) {
        e.$div.ourAnimate(getItemCoords(i), 200, "linear", t)
    }, SwapMoveController.changeSuggest = function(e, i) {
        Game.previous("suggest") && (Game.previous("suggest").first.$div.removeClass("suggest"), Game.previous("suggest").second.$div.removeClass("suggest")), i && (i.first.$div.addClass("suggest"), i.second.$div.addClass("suggest"))
    }, SwapMoveController.fieldOn = function() {
        SwapMoveController.fieldOff(), SwapMoveController.mouseDown = !1, SwapMoveController.multicolorHighLight = !1, gameView.fieldOffset = Figure.field.offset();
        var e;
        e = $("#canvas");
        var i = "touchstart.swapmove";
        is_android_browser || (i += " mousedown.swapmove"), e.on(i, function(e) {
            var i = gameView.getCell(e);
            return i !== !1 ? (Game.isEndTurn() && i.clickAnimate(), i.isMovable() && (SwapMoveController.multicolorHighLight && (SwapMoveController.multicolorHighLight = !1, Game.each(function(e) {
                e.highlight(!0)
            })), SwapMoveController.mouseDown = !0, Game.tryMove(i)), !1) : void 0
        });
        var t = "touchend.swapmove";
        is_android_browser || (t += " mouseup.swapmove"), e.on(t, function() {
            SwapMoveController.mouseDown = !1
        });
        var o = "touchmove.swapmove";
        is_android_browser || (o += " mousemove.swapmove"), e.on(o, SwapMoveController.moveEventListener)
    }, SwapMoveController.moveEventListener = function(e) {
        var i = gameView.getCell(e);
        if (window.mobile || (canvas.canvas_c.style.cursor = "default"), !SwapMoveController.multicolorHighLight || i !== !1 && i.getCurrentColor() == SwapMoveController.multicolorHighLight || (SwapMoveController.multicolorHighLight = !1, Game.each(function(e) {
                e.highlight(!0)
            })), i !== !1 && i.isMovable()) {
            if (window.mobile || (canvas.canvas_c.style.cursor = "pointer"), SwapMoveController.mouseDown) return Game.tryMove(i, !0), !1;
            Game.has("selected") && Game.get("selected") instanceof MultiColorCell && "none" !== i.getCurrentColor() && !(i instanceof EggCell) && Game.isNeighbors(Game.get("selected"), i) && (SwapMoveController.multicolorHighLight = i.color, Game.each(function(e) {
                e.getCurrentColor() === SwapMoveController.multicolorHighLight && e.highlight()
            }))
        }
    }, SwapMoveController.fieldOff = function() {
        var e;
        e = $("#canvas"), e.off(".swapmove")
    }, SwapMoveController.getMoveDirections = function(e) {
        return e.first.x == e.second.x ? e.first.y < e.second.y ? ["Up", "Down"] : ["Down", "Up"] : e.first.x < e.second.x ? ["Right", "Left"] : ["Left", "Right"]
    }, SwapMoveController.changeSelected = function(e, i) {
        var t = Game.previous("selected");
        void 0 !== t && t.$div.removeClass("selectedCell"), void 0 !== i && (application.playSound("changeSelected"), i.$div.addClass("selectedCell"))
    }, SwapMoveController.invalidMove = function(e, i) {
        if (e.first instanceof MultiColorCell || e.second instanceof MultiColorCell) return i(), void 0;
        var t = SwapMoveController.getMoveDirections(e);
        application.playSound("swapmove"), e.first.$div.ourAnimate(getItemCoords(e.second), 2.5 * Game.get("speed"), "linear", function() {
            application.playSound("swapmove")
        }), e.first.$div.ourAnimate(getItemCoords(e.first), 2.5 * Game.get("speed"), "linear", function() {
            SwapMoveController.setClassesBefore(e.first.$div.find(".cellStone"), "deformate" + t[0]), setTimeout(function() {
                SwapMoveController.setClassesAfter(e.first.$div.find(".cellStone"), "deformate" + t[0])
            }, 400)
        }), e.second.$div.ourAnimate(getItemCoords(e.first), 2.5 * Game.get("speed"), "linear"), e.second.$div.ourAnimate(getItemCoords(e.second), 2.5 * Game.get("speed"), "linear", function() {
            SwapMoveController.setClassesBefore(e.second.$div.find(".cellStone"), "deformate" + t[1]), setTimeout(function() {
                SwapMoveController.setClassesAfter(e.second.$div.find(".cellStone"), "deformate" + t[1])
            }, 400), i()
        })
    }, SwapMoveController.setClassesBefore = function(e, i) {
        e.find(".cellStone").removeClass("animated stable").addClass(i), e.find(".attribute").removeClass("stable").addClass(i)
    }, SwapMoveController.setClassesAfter = function(e, i) {
        e.find(".cellStone").removeClass(i);
        var t = e.find(".cellStone");
        t.hasClass("roll") ? e.find(".attribute").removeClass(i).addClass("stable") : t.addClass("stable")
    }, SwapMoveController.validMove = function(e, i) {
        application.playSound("swapmove");
        var t = SwapMoveController.getMoveDirections(e);
        e.first.$div.ourAnimate(getItemCoords(e.second), 2.5 * Game.get("speed"), "linear", function() {
            SwapMoveController.setClassesBefore(e.first.$div.find(".cellStone"), "deformate" + t[1]), setTimeout(function() {
                SwapMoveController.setClassesAfter(e.first.$div.find(".cellStone"), "deformate" + t[1])
            }, 400)
        }), e.second.$div.ourAnimate(getItemCoords(e.first), 2.5 * Game.get("speed"), "linear", function() {
            SwapMoveController.setClassesBefore(e.second.$div.find(".cellStone"), "deformate" + t[0]), setTimeout(function() {
                SwapMoveController.setClassesAfter(e.second.$div.find(".cellStone"), "deformate" + t[0])
            }, 400), i()
        })
    }, SwapMoveController.changeSuggest = function(e, i) {
        if (SwapMoveController.helpArrows && SwapMoveController.helpArrows.fadeOut(300, function() {
                this.remove()
            }), i) {
            var t = i.first,
                o = i.second;
            if (t.y > o.y) {
                var s = t;
                t = o, o = s
            }
            SwapMoveController.helpArrows = t.x === o.x ? createByTemplate(".invisible .moveHelpVer") : createByTemplate(".invisible .moveHelpHor"), Figure.blockedAnimations.append(SwapMoveController.helpArrows), SwapMoveController.helpArrows.alignTo(t.$div), SwapMoveController.helpArrows.hide().fadeIn(300)
        }
    }, FieldController.explodeSimpleCellTimeout = function() {
        return 2 * Game.get("speed")
    }, FieldController.onPrepared = function() {
        var e = $("#game .holder").offset();
        Figure.find("#fieldContainer").setCoords({
            left: Math.round(e.left - canvas.position.left),
            top: Math.round(e.top - canvas.position.top)
        })
    }, FieldController.explodeSimpleCell = function(e, i, t, o) {
        var s = createByTemplate(".invisible .explosion");
        o && o.color > "" && s.addClass("cell_explode_color_" + o.color), s.set({
            x: e * Config.cellWidth,
            y: i * Config.cellHeight,
            duration: FieldController.explodeSimpleCellTimeout()
        }), Figure.field.append(s), s.sprite.once("round", function() {
            s.remove(), t()
        })
    }, FieldController.explodeSimpleCellTimeout = function() {
        return 300
    };
    var PowerUpBaseView = Backbone.View.extend({
            unUse: function() {
                this.model.get("used") || this.close()
            },
            run: function() {
                this.model.get("runned") || (this.model.run(), this.close())
            },
            close: function() {
                Game.set("selectedPowerUp", !1), this.stopListening(), this.undelegateEvents()
            }
        }),
        PowerUpView = PowerUpBaseView.extend({
            initialize: function() {
                SwapMoveController.fieldOff()
            },
            close: function() {
                PowerUpBaseView.prototype.close.call(this), SwapMoveController.fieldOn()
            }
        }),
        SlidePowerUpsView = PowerUpView.extend({
            getCell: function(e) {
                e.originalEvent && e.originalEvent.touches && (e = e.originalEvent.touches[0]);
                var i = this.$el.offset();
                return !this.inForce && e.pageX >= i.left && e.pageX <= i.left + this.elWidth && e.pageY >= i.top && e.pageY <= i.top + this.elHeight ? (this.$el.addClass("cancel"), this.cursorOnPowerUp = !0) : (this.$el.removeClass("cancel"), this.cursorOnPowerUp = !1), gameView.getCell(e)
            },
            initialize: function() {
                PowerUpView.prototype.initialize.call(this), this.elWidth = parseInt(this.$el.css("width")), this.elHeight = parseInt(this.$el.css("height")), this.inForce = this.$el.hasClass("inForce"), this.cursorOnPowerUp = this.inForce ? !1 : !0, $(".wrapper").append(this.model.powerUpCursor), this.wasMouseMove = !1, $(".wrapper").on("mousemove.powerupcontrol touchmove.powerupcontrol touchstart.powerupcontrol", _.bind(function(e) {
                    return this.wasMouseMove = !0, this.updateCell(e), e.originalEvent && e.originalEvent.touches && (e = e.originalEvent.touches[0]), this.model.powerUpCursor.alignTo({
                        left: e.pageX,
                        top: e.pageY
                    }).show(), !1
                }, this))
            },
            close: function() {
                this.$el.removeClass("cancel"), $(".wrapper").off(".powerupcontrol"), this.model.powerUpCursor && this.model.powerUpCursor.remove(), PowerUpView.prototype.close.call(this)
            }
        }),
        PowerUpsView = Backbone.View.extend({
            el: "#powerUps",
            events: {
                "mousedown .powerUp": "use"
            },
            off: function() {
                this.stopListening(), this.undelegateEvents()
            },
            renderAvailable: function() {
                Game.powerUps.each(function(e) {
                    episode.absoluteLevelNumber(application.level.num) >= e.get("available") || episode.isBonusWorld() ? this.$("#" + e.id).removeClass("disabled") : this.$("#" + e.id).addClass("disabled").removeClass("active").find(".powerUpLevel").html(e.get("available"))
                }, this)
            },
            renderPowerUpsAmount: function() {
                var e = user.get("powerUpsAmount");
                for (var i in e) this.$("#" + i + " .powerUpAmount").html(e[i]), e[i] > 0 ? (this.$("#" + i).removeClass("powerUpAmountZero"), e[i] > 9 ? this.$("#" + i).addClass("moreThanNine") : this.$("#" + i).removeClass("moreThanNine")) : this.$("#" + i).removeClass("moreThanNine").addClass("powerUpAmountZero")
            },
            renderActive: function() {
                Game.get("fullRunning") ? this.$(".powerUp").delay(500).queue(function(e) {
                    $(this).addClass("active"), e()
                }) : this.$(".powerUp").removeClass("active")
            },
            initialize: function() {
                this.renderPowerUpsAmount(), this.renderActive(), this.renderAvailable(), Game.on("change:isPlaying", function(e, i) {
                    i || (this.stopListening(), this.undelegateEvents())
                }, this), Game.on("change:fullRunning", this.renderActive, this), Game.powerUps.each(function(e) {
                    this.$("#" + e.id + " .powerUpPrice").html(e.get("price")), this.$("#" + e.id).removeClass("accentuation")
                }, this), Game.on("powerAmountChanged", this.renderPowerUpsAmount, this), Game.on("change:selectedPowerUp", function(model, powerUp) {
                    if (powerUp) {
                        Config.usePowerUpSound && (powerUp.silent || application.playSound("usePowerUpSound")), powerUp.set({
                            used: !1,
                            runned: !1
                        }), this.$("#" + powerUp.id).addClass("accentuation");
                        var viewClass = eval(powerUp.get("view")),
                            view = new viewClass({
                                el: document.getElementById(powerUp.id),
                                model: powerUp
                            })
                    } else this.$("#" + Game.previous("selectedPowerUp").id).removeClass("accentuation")
                }, this)
            },
            use: function(e) {
                if (!Game.canMove() || Game.get("selectedPowerUp")) return !1;
                if ($(e.currentTarget).hasClass("used")) return !1;
                Game.unset("selected");
                var i = Game.powerUps.get($(e.currentTarget).attr("id"));
                return user.wantUsePowerUp(i), !1
            }
        }),
        TasksView = Backbone.View.extend({
            el: "#tasks",
            initialize: function() {
                this.$el.empty(), this.options.tasks.each(_.bind(function(e) {
                    var i;
                    i = $(".invisible .task." + e.get("cssClass")).length ? $(".invisible .task." + e.get("cssClass")).clone() : $(".invisible .task.noClass").clone().addClass(e.get("cssClass")).removeClass("noClass"), e.set("beginAmount", e.get("amount")), this.drawInitialAmountForTask(i, e), i.find(".taskName").html(e.get("name")), this.$el.append(i), e.on("change:collectedAmount", _.bind(function(e, t) {
                        this.drawCollectAmountForTask(i, e, t)
                    }, this)), e.on("change:amount", _.bind(function(e, t) {
                        this.drawAmountForTask(i, e, t)
                    }, this)), e.on("change:completed", function() {
                        application.playSound("taskCompleted"), i.addClass("complete")
                    }), e.on("collectPart", _.bind(function(e, t) {
                        this.collectPart(i, e, t)
                    }, this)), e.$div = i
                }, this)), Game.off("beforeWin"), Game.on("beforeWin", function(e) {
                    this.options.tasks.each(_.bind(function(e, i) {
                        e.$div.delay(500 * i).queue(function(e) {
                            application.playSound("showTask"), e()
                        }).ourAnimate({
                            scale: 1.5
                        }, 250).ourAnimate({
                            scale: 1
                        }, 250)
                    }, this)), setTimeout(e, 500 * this.options.tasks.length)
                }, this)
            },
            drawInitialAmountForTask: function(e, i) {
                e.find(".taskNeedAmount").html(i.get("amount")), e.find(".taskAmount").html(i.get("amount")), e.find(".taskCollectAmount").html(0)
            },
            drawCollectAmountForTask: function(e, i, t) {
                e.find(".taskCollectAmount").html(t)
            },
            drawAmountForTask: function(e, i, t) {
                e.find(".taskAmount").html(t)
            },
            collectPart: function(e, i, t) {
                e.find(t).addClass("collected")
            },
            off: function() {
                this.options.tasks.each(function(e) {
                    e.off()
                })
            },
            stringValue: function(e) {
                return 1e3 > e ? e : Math.floor(e / 1e3) + "k"
            }
        }),
        BonusLevelTaskView = Backbone.View.extend({
            el: "#bonusLevelTask",
            initialize: function() {
                this.taskNeed = this.model.get("amount"), this.$(".taskNeed").html(this.taskNeed), this.$(".taskAmount").html(0), this.$(".taskProgress").css("width", "0%"), this.model.$div = this.$(".taskAmount"), this.model.on("change:amount", function(e, i) {
                    this.$(".taskAmount").html(this.taskNeed - i), this.$(".taskProgress").css("width", Math.floor(100 * (this.taskNeed - i) / this.taskNeed) + "%")
                }, this)
            },
            off: function() {
                this.model.off()
            }
        }),
        UnlimitedLifesView = Backbone.View.extend({
            el: "#livesBlock",
            renderActive: function() {
                this.model.get("active") ? this.$el.addClass("unlimitedLifes") : this.$el.removeClass("unlimitedLifes")
            },
            initialize: function() {
                this.model.on("change:active", this.renderActive, this), this.model.on("change:timeToFinish", function(e, i) {
                    var t;
                    t = i > 86400 ? formatTime("%j" + messages.unlimitedLivesTimeStamp[0] + "%G" + messages.unlimitedLivesTimeStamp[1], i) : formatTime("%H:%i:%s", i), this.$(".unlimitedLifesBlock .timeToFinish").html(t)
                }, this), this.renderActive()
            }
        }),
        AdditionalLifesView = Backbone.View.extend({
            el: "#livesBlock",
            renderActive: function() {
                this.model.get("active") ? (this.$el.addClass("additionalLifes"), $(".livesAmulet").addClass("active"), Config.maxLives += Config.goods.additionalLifes.addLifesAmount) : (this.$el.removeClass("additionalLifes"), $(".livesAmulet").removeClass("active"), Config.maxLives -= Config.goods.additionalLifes.addLifesAmount, user.updateMaxLives())
            },
            initialize: function() {
                this.model.on("change:active", this.renderActive, this), this.model.on("change:timeToFinish", function(e, i) {
                    if ("main" == application.get("page")) {
                        var t;
                        t = i > 86400 ? formatTime("%j" + messages.unlimitedLivesTimeStamp[0] + "%G" + messages.unlimitedLivesTimeStamp[1], i) : formatTime("%H:%i:%s", i), $("#additionalLivesWindow .timeToFinish").html(t);
                        var o = 86400 * Config.goods.additionalLifes.workDays,
                            s = i / o * 100;
                        $(".livesAmulet .progress").css("width", s + "%")
                    }
                }, this), this.renderActive()
            }
        }),
        GoodInShopView = Backbone.View.extend({
            renderActive: function() {
                this.model.get("active") ? $("#shopWindow ." + this.model.get("name")).addClass("shopItemDisabled") : $("#shopWindow ." + this.model.get("name")).removeClass("shopItemDisabled")
            },
            initialize: function() {
                this.model.on("change:active", this.renderActive, this), this.model.on("change:timeToFinish", function(e, i) {
                    var t;
                    t = i >= 86400 ? formatTime("%j" + messages.unlimitedLivesTimeStamp[0] + "%G" + messages.unlimitedLivesTimeStamp[1], i) : formatTime("%H:%i:%s", i), $("#shopWindow ." + this.model.get("name") + " .shopBuyedTimeout").html(t)
                }, this), this.renderActive()
            }
        }),
        DeleteColumn = PowerUp.extend({
            defaults: {
                view: "DeleteColumnView",
                column: !1,
                cell: !1
            },
            execute: function() {
                application.playSound("deletecolumn");
                for (var e = 0; e < Config.rows; e++) Game.field[e][this.get("column")] && Game.field[e][this.get("column")] instanceof Cell && (this.get("cell").showPointsOnRemove += GameScores.cell);
                this.get("column");
                Game.each(function(e) {
                    if (this.get("column") == e.x) {
                        var i = Game.animate();
                        _.delay(function() {
                            e.remove(), i()
                        }, 200 * e.y)
                    }
                }, this), this.set("column", !1)
            }
        }),
        DeleteColumnView = SlidePowerUpsView.extend({
            updateCell: function(e) {
                var i = this.getCell(e);
                i && (i.isRemovable() || i.decorator || (i = !1)), i !== !1 ? this.model.set({
                    cell: i,
                    column: i.x
                }) : this.model.set({
                    cell: !1,
                    column: !1
                })
            },
            getModelPowerUpCursor: function() {
                return $('<div class="cursorLighting"></div>')
            },
            initialize: function() {
                this.model.powerUpCursor = this.getModelPowerUpCursor(), SlidePowerUpsView.prototype.initialize.call(this), $(".wrapper").on("mousedown.powerupcontrol touchend.powerupcontrol", _.bind(function() {
                    return this.cursorOnPowerUp ? (this.wasMouseMove && this.unUse(), !1) : (this.wasMouseMove = !0, this.model.get("column") !== !1 && (this.model.set("used", !0), this.animate()), !1)
                }, this)), this.model.on("change:column", function(e, i) {
                    if (this.model.previous("column") !== !1 && Game.each(function(e) {
                            e.highlight(!0)
                        }), i !== !1)
                        for (var t = 0; t < Config.rows; t++) Game.field[t][i] && Game.field[t][i].isRemovable() && Game.field[t][i].highlight()
                }, this)
            },
            animate: function() {
                Game.each(function(e) {
                    e.highlight(!0)
                }), this.run()
            }
        });
    DeleteColumnView.prototype.animate = function() {
        var e = createByTemplate(".invisible .cart");
        Figure.blockedAnimations.append(e), e.setCoords({
            left: this.model.get("column") * Config.cellWidth + Config.cellWidth / 2 + Figure.field.parent().attrs.x,
            top: 0
        }), e.ourAnimate({
            top: $("#canvas").height()
        }, 2e3, "linear", _.bind(function() {
            e.remove()
        }, this)), this.run()
    };
    var DeleteCell = PowerUp.extend({
            defaults: {
                view: "DeleteCellView",
                cell: !1
            },
            getHummerParent: function() {
                return Figure.blockedAnimations
            },
            createHummer: function() {
                var e = createByTemplate(".invisible .hammerTemplate");
                return this.getHummerParent().append(e), e.alignTo(this.get("cell").$div), e
            },
            animateExecution: function(e, i) {
                setTimeout(function() {
                    application.playSound("deleteCellExecution")
                }, 400), setTimeout(_.bind(function() {
                    e.remove(), i()
                }, this), 500)
            },
            execute: function() {
                this.get("cell") instanceof Cell && (this.get("cell").showPointsOnRemove += GameScores.cell);
                var e = this.createHummer();
                this.animateExecution(e, Game.animate(function() {
                    this.get("cell").remove()
                }, this))
            }
        }),
        oldDeleteCell = DeleteCell,
        DeleteCell = oldDeleteCell.extend({
            createHummer: function() {
                var e = createByTemplate(".invisible .hammer");
                return this.getHummerParent().append(e), e.alignTo(this.get("cell").$div), e
            },
            getHummerParent: function() {
                return Figure.blockedAnimations
            },
            animateExecution: function(e, i) {
                var t = "cake" === this.get("cell").scoresId;
                t ? this.animateExecutionCake(e, i) : this.animateExecutionRegular(e, i)
            },
            animateExecutionCake: function(e, i) {
                setTimeout(function() {
                    application.playSound("deletecell")
                }, 400), setTimeout(_.bind(function() {
                    e.remove(), $("#powerUps").removeClass("powerUpsUnderCanvas"), i()
                }, this), 900)
            },
            animateExecutionRegular: function(e, i) {
                var t = this.get("cell").$div.clone();
                $("#powerUps").addClass("powerUpsUnderCanvas"), setTimeout(_.bind(function() {
                    Figure.blockedAnimations.append(t), t.alignTo(this.get("cell").$div), this.get("cell").$div.hide()
                }, this), 300), setTimeout(function() {
                    application.playSound("deletecell")
                }, 400), setTimeout(_.bind(function() {
                    e.remove(), this.get("cell").$div.show(), $("#powerUps").removeClass("powerUpsUnderCanvas"), t.remove(), i()
                }, this), 900)
            }
        }),
        DeleteCellBaseView = SlidePowerUpsView.extend({
            updateCell: function(e) {
                var i = this.getCell(e);
                i && (i.isRemovable() || i.decorator || (i = !1)), this.model.set("cell", i)
            },
            getAjust: function() {
                return void 0
            },
            initialize: function() {
                this.model.powerUpCursor = $('<div class="cursorHammer"></div>'), SlidePowerUpsView.prototype.initialize.call(this), $(".wrapper").on("mousedown.powerupcontrol touchend.powerupcontrol", _.bind(function() {
                    if (this.cursorOnPowerUp) return this.wasMouseMove && this.unUse(), !1;
                    if (this.wasMouseMove = !0, this.model.get("cell") !== !1) {
                        this.model.set("used", !0), $(".wrapper").off(".powerupcontrol");
                        var e = _.bind(function() {
                            Game.each(function(e) {
                                e.highlight(!0)
                            }), this.run()
                        }, this);
                        window.mobile ? e() : this.model.powerUpCursor.ourAnimate({
                            target: this.model.get("cell").$div,
                            ajust: this.getAjust()
                        }, 100, "linear", e)
                    }
                    return !1
                }, this)), this.model.on("change:cell", function(e, i) {
                    this.model.previous("cell") !== !1 && Game.each(function(e) {
                        e.highlight(!0)
                    }), i !== !1 && i.highlight()
                }, this)
            }
        }),
        DeleteCellView = DeleteCellBaseView.extend({
            getAjust: function() {
                return {
                    left: 51,
                    top: 34
                }
            }
        }),
        DeleteColor = PowerUp.extend({
            defaults: {
                view: "DeleteColorView"
            },
            animateCatCollect: function(e, i, t) {
                CollectColor.prototype.animateCollect(e, Math.floor(1e3 * Math.random()), i, function() {}, Game.animate(t), !0)
            },
            execute: function() {
                var e, i = this.get("cell").color;
                window.mobile ? (e = $('<div class="powerUpCatAnimation"></div>'), $("#game").append(e)) : (e = $(".powerUpCatAnimation"), e.fadeIn(500));
                var t = gameView.tasksView.options.tasks.findWhere({
                    type: "CollectColor",
                    color: i
                });
                Game.each(function(e) {
                    e.isRemovable() && e.getCurrentColor() === i && (t || e.decorator || this.animateCatCollect(e.$div, 0, function() {}), e.remove())
                }, this), Game.once("fallDownStart", function() {
                    window.mobile ? e.remove() : e.fadeOut(500)
                }), application.playSound("deletecolor")
            }
        }),
        DeleteColorView = SlidePowerUpsView.extend({
            initialize: function() {
                this.model.powerUpCursor = $('<div class="cursorDeleteColor"></div>'), SlidePowerUpsView.prototype.initialize.call(this), $(".wrapper").on("mousedown.powerupcontrol touchend.powerupcontrol", _.bind(function() {
                    return this.cursorOnPowerUp ? (this.wasMouseMove && this.unUse(), !1) : (this.wasMouseMove = !0, this.model.get("cell") !== !1 && (this.model.set("used", !0), Game.each(function(e) {
                        e.highlight(!0)
                    }), this.run()), !1)
                }, this)), this.model.on("change:cell", function(e, i) {
                    this.model.previous("cell") !== !1 && Game.each(function(e) {
                        e.highlight(!0)
                    }), i !== !1 && Game.each(function(e) {
                        e.isRemovable() && e.getCurrentColor() === i.color && e.highlight()
                    }, this)
                }, this)
            },
            updateCell: function(e) {
                var i = this.getCell(e);
                !i || i.isRemovable() && "none" !== i.getCurrentColor() || (i = !1), this.model.set("cell", i)
            }
        }),
        PlusOne = PowerUp.extend({
            defaults: {
                view: "PlusOneView"
            },
            execute: function() {
                var e = function(e, i) {
                    $("#powerUps").addClass("powerUpsUnderCanvas");
                    var t = createByTemplate(".invisible .plusPointStar");
                    Figure.blockedAnimations.append(t), t.alignTo($("#addBonusPowerUp"));
                    var o = Game.animate(function() {
                        t.remove(), i(), $("#powerUps").removeClass("powerUpsUnderCanvas")
                    });
                    t.css({
                        opacity: 0
                    }), t.delay(500 * Math.random()).queue(function(e) {
                        t.css({
                            opacity: 1
                        }), e()
                    }).ourAnimate({
                        target: e.$div
                    }, 8 * Game.get("speed"), "easeInQuad", o)
                };
                Game.each(function(i) {
                    if (i instanceof Cell) {
                        var t = gameView.tasksView.options.tasks.findWhere({
                            type: "CollectColor",
                            color: i.color
                        });
                        t && e(i, _.bind(i.removeNear, i))
                    }
                }), application.playSound("plusoneall")
            }
        }),
        PlusOneView = PowerUpView.extend({
            initialize: function() {
                this.model.set("used", !0), setTimeout(_.bind(function() {
                    this.run()
                }, this), 0), PowerUpView.prototype.initialize.call(this)
            }
        });
    GameClass.prototype.createFloor = function() {
        this.floor = [];
        for (var e = 0; e < Config.rows; e++) {
            this.floor.push([]);
            for (var i = 0; i < Config.cols; i++) application.level.floorAttribute ? this.floor[e].push(parseInt(application.level.floorAttribute[e].charAt(i))) : this.floor[e].push(0)
        }
    }, GameClass.prototype.addFloor = function(e, i) {
        if (void 0 === i && (i = 1), this.floor[e.y][e.x] < i) {
            if (0 == this.floor[e.y][e.x]) {
                var t = gameView.tasksView.options.tasks.findWhere({
                    type: "ClearFloorAttributes"
                });
                t.set("amount", t.get("amount") + 1)
            }
            this.floor[e.y][e.x] = i, this.trigger("createFloor", {
                x: e.x,
                y: e.y
            }, Game.animate())
        }
    }, GameClass.prototype.floorListen = function() {
        this.on("removedItem", function(e) {
            if (this.floor[e.y] && this.floor[e.y][e.x] > 0) {
                var i = this.floor[e.y][e.x];
                this.floor[e.y][e.x]--, this.floor[e.y][e.x] > 0 && this.trigger("changeFloor", {
                    x: e.x,
                    y: e.y
                }, this.floor[e.y][e.x], i), 0 == this.floor[e.y][e.x] && this.trigger("removeFloor", {
                    x: e.x,
                    y: e.y
                })
            }
        }, this)
    };
    var old = GameClass.prototype.createField;
    if (void 0 === old) throw "Include floor.js after gems.js";
    GameClass.prototype.createField = function() {
        this.createFloor(), this.floorListen(), old.call(this)
    }, GameClass.prototype.floorListen = function() {};
    var Processor = function(e, i) {
        this.name = e, this.line = i
    };
    Processor.prototype.run = function() {
        for (var e = Game.get(this.name), i = e; i < this.line.length; i++)
            if (this.line[i].process(), Game.set(this.name, i + 1), 0 !== Game.get("animations")) return
    }, GameClass.prototype.createAfterTurnProcessor = function() {
        this.afterTurnProcessor = new Processor("amountAfterTurnProcess", [MouseDecorator, BombCell, Squirrel, MorphColorCell, MouseFarmCell, MixerCell, PeacockCell])
    };
    var Squirrel = Backbone.Model.extend({
            initialize: function() {
                this.processCounter = Config.squirrelAppearEpisode && Config.squirrelAppearLevel && episode.get("num") === Config.squirrelAppearEpisode && application.level.num === Config.squirrelAppearLevel ? 3 : 0
            },
            process: function() {
                if (this.processCounter++, this.processCounter >= 4) {
                    var e = [];
                    if (Game.each(function(i) {
                            if (i instanceof Cell && void 0 === i.decorator && i.isMovable() && i.isRemovable()) {
                                var t = gameView.tasksView.options.tasks.findWhere({
                                    type: "CollectColor",
                                    color: i.color
                                });
                                t && e.push(i)
                            }
                        }), 0 == e.length) return;
                    e = _.shuffle(e);
                    var i = e[0];
                    if (window.mobile) {
                        var t = Game.animate(),
                            o = createByTemplate(".invisible .squirrelNut");
                        Figure.blockedAnimations.append(o), o.setCoords({
                            left: -100,
                            top: -100
                        });
                        var s = Math.floor(o.get("x")) - Math.floor(i.$div.get("x")),
                            n = Math.floor(o.get("y")) - Math.floor(i.$div.get("y")),
                            a = Math.sqrt(s * s + n * n) + 500;
                        o.ourAnimate({
                            target: i.$div,
                            animation: Library.linearFly,
                            options: {
                                targetScale: 1,
                                rotate: 350
                            }
                        }, a, "linear", _.bind(function() {
                            o.remove();
                            var e = new NutCell(i.y, i.x);
                            e.life = 3, i.color = "none", i.remove(!0), Game.addItem(e, !0), application.playSound("squirrelNut"), t(), this.processCounter = 0
                        }, this))
                    } else {
                        var r = Game.animate(),
                            t = Game.animate(),
                            l = createByTemplate(".invisible .squirrel"),
                            o = createByTemplate(".invisible .squirrelNut");
                        Figure.blockedAnimations.append(l), Figure.blockedAnimations.append(o), $("#powerUps").addClass("powerUpsUnderCanvas"), o.setCoords({
                            left: -585,
                            top: -530
                        }), l.setCoords({
                            left: 700,
                            top: 660
                        }), application.playSound("squirrel"), l.addClass("move").ourAnimate({
                            left: 598,
                            top: 569
                        }, 240, "linear", _.bind(function() {
                            l.removeClass("move").addClass("wink").ourAnimate({
                                left: 598,
                                top: 569
                            }, 400, "linear", _.bind(function() {
                                l.removeClass("wink").addClass("move").ourAnimate({
                                    left: 585,
                                    top: 480
                                }, 240, "linear", _.bind(function() {
                                    l.removeClass("move").addClass("throws").ourAnimate({
                                        left: 585,
                                        top: 480
                                    }, 550, "linear", _.bind(function() {
                                        o.setCoords({
                                            left: 585,
                                            top: 530
                                        });
                                        var e = Math.floor(o.get("x")) - Math.floor(i.$div.get("x")),
                                            s = Math.floor(o.get("y")) - Math.floor(i.$div.get("y")),
                                            n = Math.sqrt(e * e + s * s) + 500;
                                        o.ourAnimate({
                                            target: i.$div,
                                            animation: Library.linearFly,
                                            options: {
                                                targetScale: 1,
                                                rotate: 350
                                            }
                                        }, n, "linear", _.bind(function() {
                                            o.remove();
                                            var e = new NutCell(i.y, i.x);
                                            e.life = 3, i.color = "none", i.remove(!0), Game.addItem(e, !0), application.playSound("squirrelNut"), t()
                                        }, this)), l.removeClass("throws").addClass("threw").ourAnimate({
                                            left: 585,
                                            top: 480
                                        }, 200, "linear", _.bind(function() {
                                            l.removeClass("threw").addClass("moveback").ourAnimate({
                                                left: 376,
                                                top: 660
                                            }, 320, "linear", _.bind(function() {
                                                l.remove(), this.processCounter = 0, $("#powerUps").removeClass("powerUpsUnderCanvas"), r()
                                            }, this))
                                        }, this))
                                    }, this))
                                }, this))
                            }, this))
                        }, this))
                    }
                }
            }
        }, {
            process: function() {
                gameView.squirrel && gameView.squirrel.process()
            }
        }),
        canvas = {},
        canvas_ctx, ctime, DevicePixelRatio;
    canvas.init = function() {
        DevicePixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1, canvas.canvas_c = $("#canvas").get(0), canvas.canvasWidth = $("#canvas").width(), canvas.canvasHeight = $("#canvas").height(), canvas.canvas_c.width = canvas.canvasWidth * DevicePixelRatio, canvas.canvas_c.height = canvas.canvasHeight * DevicePixelRatio, canvas.position = $("#canvas").offset(), canvas_ctx = canvas.canvas_c.getContext("2d"), 1 != DevicePixelRatio && canvas_ctx.scale(DevicePixelRatio, DevicePixelRatio)
    }, canvas.start = function() {
        production || 0 == $(".canvas-fps").length && ($fps = $("<div class='canvas-fps'></div>"), $fps.css({
            position: "fixed",
            right: 0,
            top: 0,
            "z-index": 100
        }), $("body").append($fps)), canvas.init();
        var e = function() {
                canvas_ctx.clearRect(0, 0, canvas.canvasWidth, canvas.canvasHeight)
            },
            i = function() {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e) {
                        window.setTimeout(e, 1e3 / 60)
                    }
            }();
        if (canvas.layer && canvas.layer.remove(), canvas.layer = createByTemplate(".invisible .canvasTemplate"), Figure.field = Figure.find("#field"), Figure.blockedAnimations = Figure.find("#blockedAnimations"), !production) var t = 1e4,
            o = setInterval(function() {
                $(".canvas-fps").html(Math.round(t)), void 0 != window.FPSCounter && 1e4 != t && (window.FPSCounter.minTimes++, window.FPSCounter.minSum += t, t < window.FPSCounter.min && (window.FPSCounter.min = t)), t = 1e4
            }, 1e3);
        canvas.running = !0, canvas.pausing = !1, canvas.needRedrawStatic = !0;
        var s, n = _.now();
        canvas.finishedCssAnimations = [], canvas_ctx.X = canvas_ctx.Y = 0;
        var a = function() {
            ctime = _.now();
            for (var o = 0; o < tickListeners.length; o++) tickListeners[o](ctime) && o--;
            production || (s = 1e3 / (ctime - n), t > s && (t = s), n = ctime, void 0 != window.FPSCounter && (window.FPSCounter.frames += s, window.FPSCounter.times++)), e(), canvas.layer.drawWithClasses();
            for (var o = 0; o < canvas.finishedCssAnimations.length; o++) canvas.finishedCssAnimations[o].trigger("round");
            canvas.finishedCssAnimations = [];
            for (var o = 0; o < newTickListeners.length; o++) tickListeners.push(newTickListeners[o]);
            newTickListeners = [], canvas.running && !canvas.pausing && i(a)
        };
        i(a), canvas.stop = function() {
            o && clearInterval(o), canvas.running = !1
        }, canvas.pause = function() {
            canvas.pausing = !0
        }, canvas.resume = function() {
            canvas.pausing = !1, i(a)
        }
    };
    var cachedTemplates = {},
        createByTemplate = function(e) {
            if (void 0 === cachedTemplates[e]) {
                0 == $(e).length && console.log("cant find " + e);
                var i = $(e).html();
                if (!i) throw new Error('Template "' + e + '" not found.');
                cachedTemplates[e] = Figure.fromTemplate(i), cachedTemplates[e].sprite && (cachedTemplates[e].sprite.destructor(), cachedTemplates[e].sprite = void 0), cachedTemplates[e].ruleAnimation && (cachedTemplates[e].ruleAnimation.destructor(), cachedTemplates[e].ruleAnimation = void 0)
            }
            return cachedTemplates[e].clone()
        };
    $(".fieldTemplates").children().each(function(e, i) {
        createByTemplate(".invisible ." + $(i).attr("class"))
    });
    var Figure = Backbone.Model.extend({
            initialize: function() {
                this.animationQueue = [], this.classes = [], this.children = [], this.length = 1, this.needCalculateAttrs = !0, this._parent = void 0, this.text = void 0, this.on("change", function() {
                    if (!this.needCalculateAttrs)
                        for (var e in this.attributes) this.calculatedAttrs[e] = this.attributes[e]
                }, this), this.on("change:id", function() {
                    Figure._figuresById[this.id] = this
                }, this)
            },
            hide: function() {
                return this.set("opacity", 0), this
            },
            show: function() {
                return this.set("opacity", 1), this
            },
            append: function(e, i) {
                i ? this.children.unshift(e) : this.children.push(e), e._parent = this
            },
            prepend: function(e) {
                this.append(e, !0)
            },
            appendTo: function(e) {
                return e.append(this), this
            },
            alignTo: function(e, i) {
                var t = _.isNumber(e.left) ? e : e.offset(),
                    o = this._parent.offset(),
                    s = {
                        left: 0,
                        top: 0
                    };
                return i && i.ajust && (s = i.ajust), this.set({
                    x: t.left - o.left + s.left,
                    y: t.top - o.top + s.top
                }), this
            },
            getRealOffset: function() {
                var e = this.offset(),
                    i = this._parent.offset();
                return {
                    left: e.left - i.left,
                    top: e.top - i.top
                }
            },
            distanceTo: function(e) {
                var i = this.offset(),
                    t = e.offset();
                return Math.sqrt((i.left - t.left) * (i.left - t.left) + (i.top - t.top) * (i.top - t.top))
            },
            clone: function(e) {
                var i = new Figure;
                e && (i._parent = e), i.classes = this.classes;
                for (var t = 0; t < this.children.length; t++) i.append(this.children[t].clone(this));
                i.classes = [];
                for (var t = 0; t < this.classes.length; t++) i.addClass(this.classes[t]);
                return i.set(this.attributes), i.text = this.text, i
            },
            parent: function() {
                return this._parent
            },
            setCoords: function(e) {
                return this.set({
                    x: parseInt(e.left),
                    y: parseInt(e.top)
                }), this
            },
            html: function(e) {
                return this.text = e, this
            },
            empty: function() {
                return _.each(this.children, function(e) {
                    e.remove()
                }), this.children = [], this
            },
            find: function(e) {
                if ("#" == e.charAt(0) && this.id == e.substr(1)) return this;
                if ("." == e.charAt(0))
                    for (var i = 0; i < this.classes.length; i++)
                        if (this.classes[i] == e.substr(1)) return this;
                for (var i = 0; i < this.children.length; i++) {
                    var t = this.children[i].find(e);
                    if (t.length) return t
                }
                return emptyFigure
            },
            remove: function() {
                this.empty(), this.animationFunc && removeTickListener(this.animationFunc), this.animationQueue = [], this.removeAllClasses(), this._parent && (this._parent.children = _.without(this._parent.children, this), this._parent = void 0), this.off()
            },
            addAnimation: function(e) {
                this.animationQueue.push(e), 1 == this.animationQueue.length && this.runNextAnimation()
            },
            removeAttr: function(e) {
                this.unset(e)
            },
            removeAnimation: function() {
                this.animationQueue.shift(), this.animationQueue.length > 0 && this.runNextAnimation()
            },
            runNextAnimation: function() {
                if (this.animationQueue[0].options.queue) return this.animationQueue[0].options.queue.call(this, _.bind(function() {
                    this.removeAnimation()
                }, this)), void 0;
                this.animationQueue[0].params = this.convert(this.animationQueue[0].params), this.baseValues = {}, this.deltaValues = {};
                for (var e in this.animationQueue[0].params) this.baseValues[e] = this.has(e) ? this.get(e) : Figure.defaults[e], this.deltaValues[e] = this.animationQueue[0].params[e] - this.baseValues[e];
                this.startAnimationTime = ctime, this.animationFunc = _.bind(function(e) {
                    if (e -= this.startAnimationTime, e >= this.animationQueue[0].options.duration) {
                        this.set(this.animationQueue[0].params), removeTickListener(this.animationFunc), this.animationFunc = !1;
                        var i = this.animationQueue[0].options.callback;
                        return this.removeAnimation(), i && i.call(this), !0
                    }
                    return e /= this.animationQueue[0].options.duration, void 0 !== this.animationQueue[0].options.easing && (e = this.animationQueue[0].options.easing(e)), this.animationQueue[0].options.step ? this.animationQueue[0].options.step.call(this, e) : Figure.animationStepFunction.call(this, e), !1
                }, this), addTickListener(this.animationFunc)
            },
            delay: function(e) {
                return this.addAnimation({
                    params: {},
                    options: {
                        duration: e
                    }
                }), this
            },
            queue: function(e) {
                return void 0 === e ? this.animationQueue : (this.addAnimation({
                    params: {},
                    options: {
                        queue: e
                    }
                }), this)
            },
            convert: function(e) {
                var i = {};
                return void 0 !== e.width && (i.width = parseFloat(e.width)), void 0 !== e.height && (i.height = parseFloat(e.height)), void 0 !== e["background-width"] && (i["background-width"] = parseFloat(e["background-width"])), void 0 !== e["background-height"] && (i["background-height"] = parseFloat(e["background-height"])), void 0 !== e.height && (i.height = parseFloat(e.height)), void 0 !== e.top && (i.y = e.top.indexOf && 0 === e.top.indexOf("+=") ? this.get("y") + parseFloat(e.top.substr(2)) : e.top.indexOf && 0 === e.top.indexOf("-=") ? this.get("y") - parseFloat(e.top.substr(2)) : parseFloat(e.top)), void 0 !== e.left && (i.x = e.left.indexOf && 0 === e.left.indexOf("+=") ? this.get("x") + parseFloat(e.left.substr(2)) : e.left.indexOf && 0 === e.left.indexOf("-=") ? this.get("x") - parseFloat(e.left.substr(2)) : parseFloat(e.left)), void 0 !== e.opacity && (i.opacity = e.opacity), void 0 !== e.scale && (i.scale = e.scale), void 0 !== e.rotate && (i.rotate = parseFloat(e.rotate)), i
            },
            animate: function(e, i, t, o, s) {
                return this.addAnimation({
                    params: e,
                    options: {
                        duration: i,
                        easing: Figure.easingFunctions[t],
                        callback: o,
                        step: s
                    }
                }), this
            },
            ourAnimate: function(e, i, t, o, s) {
                if (e.target) {
                    var n = e.target.offset(),
                        a = this.parent().offset();
                    void 0 === e.ajust && (e.ajust = {
                        left: 0,
                        top: 0
                    }), e.left = n.left - a.left + e.ajust.left + "px", e.top = n.top - a.top + e.ajust.top + "px", delete e.target
                }
                if (e.animation) {
                    var r, l = this;
                    this.queue(function(i) {
                        r = l.getRealOffset(), e.options.difX = parseFloat(e.left) - r.left, e.options.difY = parseFloat(e.top) - r.top, i()
                    }), s = _.bind(function(i) {
                        var t = e.animation(i, e.options);
                        this.css({
                            left: r.left + t.left,
                            top: r.top + t.top,
                            rotate: t.rotate + "deg",
                            scale: t.scale
                        })
                    }, this)
                }
                return this.addAnimation({
                    params: e,
                    options: {
                        duration: i,
                        easing: Figure.easingFunctions[t],
                        callback: o,
                        step: s
                    }
                }), this
            },
            attr: function(e, i) {
                if (void 0 === i) return "id" == e ? this.get("id") : "class" == e ? this.classes.join(" ") : (console.log("Get undefined attr " + e), !1);
                if ("id" == e) {
                    var t = i;
                    this.set("id", t)
                }
                "id" != e && console.log("Setting up " + e + " = " + i)
            },
            css: function(e) {
                return this.set(this.convert(e)), this
            },
            fadeOut: function(e, i) {
                return this.animate({
                    opacity: 0
                }, e, "linear", i)
            },
            fadeIn: function(e, i) {
                return this.animate({
                    opacity: 1
                }, e, "linear", i)
            },
            offset: function() {
                var e;
                return e = this.parent() ? this.parent().offset() : {
                    left: canvas.position.left,
                    top: canvas.position.top
                }, this.get("x") && (e.left += this.get("x")), this.get("y") && (e.top += this.get("y")), e
            },
            reCalculateStylesRec: function() {
                this.needCalculateAttrs = !0;
                for (var e = 0; e < this.children.length; e++) this.children[e].reCalculateStylesRec()
            },
            addClass: function(e) {
                if (_.indexOf(this.classes, e) < 0 && (this.classes.push(e), this.reCalculateStylesRec(), FigureRules["." + e]))
                    for (var i = 0; i < FigureRules["." + e].length; i++) {
                        var t = FigureRules["." + e][i].getParams();
                        (t.spriteFrames || t.animation) && this.isAcceptedRootSelector(FigureRules["." + e][i].rootSelector) && (t.spriteFrames && (this.sprite && this.sprite.destructor(), this.sprite = new Sprite({
                            duration: t.duration,
                            playRound: t.playRound,
                            frames: t.spriteFrames,
                            delay: t.delay,
                            alternate: t.alternate,
                            framesOrder: t.framesOrder,
                            lastFrame: t.lastFrame
                        })), t.animation && (this.ruleAnimation && this.ruleAnimation.destructor(), this.ruleAnimation = new RuleAnimation(t.animation)))
                    }
                for (var i = 0; i < this.children.length; i++) this.children[i].hasClass("stable") && this.children[i].removeClass("stable").addClass("stable");
                return this
            },
            removeClass: function(e) {
                if (void 0 === e) return this.removeAllClasses(), this;
                if (_.indexOf(this.classes, e) >= 0 && (this.classes = _.without(this.classes, e), this.reCalculateStylesRec(), FigureRules["." + e]))
                    for (var i = 0; i < FigureRules["." + e].length; i++) {
                        var t = FigureRules["." + e][i].getParams();
                        (t.spriteFrames || t.animation) && this.isAcceptedRootSelector(FigureRules["." + e][i].rootSelector) && (t.spriteFrames && this.sprite && (this.sprite.destructor(), this.sprite = void 0), t.animation && this.ruleAnimation && (this.ruleAnimation.destructor(), this.ruleAnimation = void 0))
                    }
                return this
            },
            removeAllClasses: function() {
                for (var e = this.classes.length - 1; e >= 0; e--) this.removeClass(this.classes[e]);
                this.sprite && (this.sprite.destructor(), this.sprite = void 0), this.ruleAnimation && (this.ruleAnimation.destructor(), this.ruleAnimation = void 0)
            },
            isAcceptedRootSelector: function(e) {
                return e ? " " == e.charAt(e.length - 1) ? this.parent() ? this.parent().isAcceptedRule(e) : !1 : this.isAcceptedRule(e) : !0
            },
            isAcceptedRule: function(e) {
                if (!e) return !0;
                " " == e.charAt(e.length - 1) && (e = e.substr(0, e.length - 1));
                var i = e.lastIndexOf("."); - 1 == i && console.log("GLOBAL ERROR");
                var t = e.substr(i + 1);
                return this.hasClass(t) ? this.isAcceptedRule(e.substr(0, i)) : this.parent() ? this.parent().isAcceptedRule(e) : !1
            },
            hasClass: function(e) {
                return _.indexOf(this.classes, e) >= 0
            },
            processRule: function(e) {
                if (FigureRules[e])
                    for (var i = 0; i < FigureRules[e].length; i++) {
                        var t = FigureRules[e][i].rootSelector;
                        if (this.isAcceptedRootSelector(t)) {
                            var o = FigureRules[e][i].getParams();
                            for (var s in o) this.calculatedAttrs[s] = o[s]
                        }
                    }
            },
            drawWithClasses: function() {
                if (this.needCalculateAttrs) {
                    this.needCalculateAttrs = !1, this.calculatedAttrs = {};
                    for (var e in Figure.defaults) this.calculatedAttrs[e] = Figure.defaults[e];
                    for (var i = 0; i < this.classes.length; i++) this.processRule("." + this.classes[i]);
                    this.id && this.processRule("#" + this.id);
                    for (var e in this.attributes) this.calculatedAttrs[e] = this.attributes[e]
                }
                this.calcAnimatedAttrs(), this.draw()
            },
            calcAnimatedAttrs: function() {
                if (this.ruleAnimation) {
                    this.attrs = {};
                    for (var e in this.calculatedAttrs) this.attrs[e] = this.calculatedAttrs[e];
                    var i = this.ruleAnimation.getCurrentAttrs();
                    for (var e in i) this.attrs[e] = i[e]
                } else this.attrs = this.calculatedAttrs;
                this.attrs.backgroundXOffset = 0, this.attrs.backgroundYOffset = 0, this.sprite && (this.attrs.spriteVertical ? this.attrs.backgroundYOffset = this.sprite.getCurrentFrame() * this.attrs["background-height"] : this.attrs.backgroundXOffset = this.sprite.getCurrentFrame() * this.attrs["background-width"], this.attrs.backgroundYOffset < 0 && (this.attrs.backgroundYOffset = 0), this.attrs.backgroundXOffset < 0 && (this.attrs.backgroundXOffset = 0))
            },
            draw: function() {
                if (0 != this.attrs.opacity && 0 != this.attrs.scale)
                    if (0 != this.attrs.rotate || 1 != this.attrs["scale-x"] || 1 != this.attrs["scale-y"] || 1 != this.attrs.scale) {
                        canvas_ctx.save(), canvas_ctx.globalAlpha *= this.attrs.opacity, canvas_ctx.translate(canvas_ctx.X + this.attrs.x + this.attrs.width / 2 + this.attrs["margin-left"], canvas_ctx.Y + this.attrs.y + this.attrs.height / 2 + this.attrs["margin-top"]), canvas_ctx.scale(1 != this.attrs["scale-x"] ? this.attrs["scale-x"] : this.attrs.scale, 1 != this.attrs["scale-y"] ? this.attrs["scale-y"] : this.attrs.scale), canvas_ctx.rotate(this.attrs.rotate * Figure.DegToRadMultiple);
                        var e = canvas_ctx.X,
                            i = canvas_ctx.Y;
                        canvas_ctx.X = -this.attrs.width / 2, canvas_ctx.Y = -this.attrs.height / 2, this.drawSelf(), this.drawChildren(), canvas_ctx.X = e, canvas_ctx.Y = i, canvas_ctx.restore()
                    } else {
                        if (this.attrs.opacity < 1) {
                            var t = canvas_ctx.globalAlpha;
                            canvas_ctx.globalAlpha *= this.attrs.opacity
                        }
                        canvas_ctx.X += this.attrs.x + this.attrs["margin-left"], canvas_ctx.Y += this.attrs.y + this.attrs["margin-top"], this.drawSelf(), this.drawChildren(), canvas_ctx.X -= this.attrs.x + this.attrs["margin-left"], canvas_ctx.Y -= this.attrs.y + this.attrs["margin-top"], this.attrs.opacity < 1 && (canvas_ctx.globalAlpha = t)
                    }
            },
            drawSelf: function() {
                if (this.attrs["background-image"]) {
                    this.attrs.backgroundYOffset < 0 && (this.attrs.backgroundYOffset = 0), this.attrs.backgroundXOffset < 0 && (this.attrs.backgroundXOffset = 0);
                    try {
                        var e = Figure.imageByFilename(this.attrs["background-image"]);
                        e.loaded && canvas_ctx.drawImage(e.image, this.attrs.backgroundXOffset + this.attrs["background-position-x"], this.attrs.backgroundYOffset + this.attrs["background-position-y"], this.attrs["background-width"], this.attrs["background-height"], canvas_ctx.X, canvas_ctx.Y, this.attrs.width, this.attrs.height)
                    } catch (i) {
                        console.log("error in draw image"), console.log(i), console.log("Pixel ratio:", DevicePixelRatio), console.log(this.attrs.backgroundXOffset, this.attrs["background-position-x"]), console.log(this.attrs["background-image"], this.attrs.backgroundXOffset + this.attrs["background-position-x"], this.attrs.backgroundYOffset + this.attrs["background-position-y"], this.attrs["background-width"], this.attrs["background-height"], canvas_ctx.X, canvas_ctx.Y, this.attrs.width, this.attrs.height)
                    }
                }
                if (this.attrs["background-color"] && (canvas_ctx.fillStyle = this.attrs["background-color"], canvas_ctx.fillRect(canvas_ctx.X, canvas_ctx.Y, this.attrs.width, this.attrs.height)), void 0 !== this.text) {
                    this.attrs.font && (canvas_ctx.font = this.attrs.font), this.attrs.color && (canvas_ctx.fillStyle = this.attrs.color), this.attrs.shadowBlur && (canvas_ctx.shadowBlur = this.attrs.shadowBlur), this.attrs.shadowColor && (canvas_ctx.shadowColor = this.attrs.shadowColor);
                    var t = 0,
                        o = 0;
                    this.attrs["text-left"] && (t = this.attrs["text-left"]), this.attrs["text-top"] && (o = this.attrs["text-top"]), canvas_ctx.fillText(this.text, canvas_ctx.X + t, canvas_ctx.Y + o), this.attrs.shadowBlur && (canvas_ctx.shadowBlur = 0), this.attrs.shadowColor && (canvas_ctx.shadowColor = void 0)
                }
            },
            drawChildren: function() {
                for (var e = 0; e < this.children.length; e++) this.children[e].drawWithClasses()
            },
            multipleKoef: function(e) {
                this.needCalculateAttrs = !0;
                var i = {};
                this.has("x") && (i.x = this.get("x") * e), this.has("y") && (i.y = this.get("y") * e), this.has("margin-left") && (i["margin-left"] = this.get("margin-left") * e), this.has("margin-top") && (i["margin-top"] = this.get("margin-top") * e), this.has("width") && (i.width = this.get("width") * e), this.has("height") && (i.height = this.get("height") * e), this.set(i);
                for (var t = 0; t < this.children.length; t++) this.children[t].multipleKoef(e)
            }
        }, {
            animationInterval: 11,
            easingFunctions: {
                easeInQuad: function(e) {
                    return e * e
                }
            },
            animationStepFunction: function(e) {
                var i = {};
                for (var t in this.baseValues) i[t] = e * this.deltaValues[t] + this.baseValues[t];
                this.set(i)
            },
            fromTemplate: function(e) {
                var i = e.indexOf(">"),
                    t = e.lastIndexOf("<"),
                    o = e.substr(0, i + 1),
                    s = e.substr(i + 1, t - i - 1),
                    n = new Figure,
                    a = 0;
                for (t = 0, i = 0;;) {
                    if (i = s.indexOf("<", i), -1 === i) break;
                    i++, "/" == s.charAt(i) ? a-- : a++, 0 == a && (i = s.indexOf(">", i) + 1, n.append(Figure.fromTemplate(s.substr(t, i - t))), t = i)
                }
                var r = o.match(/class=(?:"|')(.*)(?:"|')/);
                return null !== r && _.each(r[1].split(/\s/), function(e) {
                    n.addClass(e)
                }), r = o.match(/id=(?:"|')(.*)(?:"|')/), null !== r && n.attr("id", r[1]), n
            },
            _figuresById: {},
            byId: function(e) {
                return void 0 === Figure._figuresById[e] ? emptyFigure : Figure._figuresById[e]
            },
            imagesCache: {},
            imagesCacheX: 0,
            imagesCacheY: 0,
            imageByFilename: function(e) {
                return void 0 === Figure.imagesCache[e] && (Figure.imagesCache[e] = {
                    image: new Image,
                    loaded: !1
                }, Figure.imagesCache[e].image.onload = function() {
                    if (!is_android_browser) {
                        var i = document.createElement("canvas");
                        i.width = Figure.imagesCache[e].image.width, i.height = Figure.imagesCache[e].image.height;
                        var t = i.getContext("2d");
                        t.drawImage(Figure.imagesCache[e].image, 0, 0), Figure.imagesCache[e].image = i
                    }
                    Figure.imagesCache[e].loaded = !0
                }, Figure.imagesCache[e].image.src = e), Figure.imagesCache[e]
            },
            defaults: {
                width: 0,
                height: 0,
                "background-width": 0,
                "background-height": 0,
                "margin-left": 0,
                "margin-top": 0,
                "scale-x": 1,
                "scale-y": 1,
                x: 0,
                y: 0,
                scale: 1,
                rotate: 0,
                opacity: 1
            },
            find: function(e) {
                return e instanceof Figure ? e : "#" == e.charAt(0) ? Figure.byId(e.substr(1)) : canvas.layer.find(e)
            },
            DegToRadMultiple: Math.PI / 180
        }),
        emptyFigure = new Figure;
    emptyFigure.length = 0;
    var tickListeners = [],
        newTickListeners = [],
        addTickListener = function(e) {
            newTickListeners.push(e)
        },
        removeTickListener = function(e) {
            tickListeners = _.without(tickListeners, e), newTickListeners = _.without(newTickListeners, e)
        },
        FigureRules = {};
    FigureRules.addRule = function(e, i) {
        void 0 === FigureRules[e] && (FigureRules[e] = []), FigureRules[e].push(i)
    }, FigureRules.add = function(e, i) {
        _.each(e.split(", "), function(e) {
            var t = e.lastIndexOf("."),
                o = e.lastIndexOf("#");
            o > t && (t = o);
            var s = new FigureClass(i);
            t > 0 && (s.rootSelector = e.substr(0, t), e = e.substr(t)), FigureRules.addRule(e, s)
        })
    };
    var FigureClass = function(e) {
        this.params = _.clone(e)
    };
    FigureClass.prototype.getParams = function() {
        return this.params
    };
    var Sprite = Backbone.Model.extend({
            initialize: function() {
                this.frameTime = this.get("duration") / this.get("frames"), this.waitAndPlay()
            },
            waitAndPlay: function() {
                if (!this.removed)
                    if (this.get("delay")) {
                        var e = this.get("delay");
                        this.delayTimeout = setTimeout(_.bind(this.playSprite, this), Math.random() * (e[1] - e[0]) + e[0])
                    } else this.playSprite()
            },
            getCurrentFrame: function() {
                var e = 0;
                if (this.startTime === !1 && (this.get("playRound") || (e = this.get("frames") - 1), this.has("lastFrame") && (e = this.get("lastFrame"))), this.startTime) {
                    var i = _.now() - this.startTime;
                    i >= this.get("duration") ? (e = this.get("frames") - 1, this.triggerRound || (canvas.finishedCssAnimations.push(this), this.triggerRound = !0), this.startTime = !1, this.get("playRound") ? this.waitAndPlay() : this.destructor()) : e = Math.floor(i / this.frameTime)
                }
                return 0 > e && (e = 0), this.has("framesOrder") ? this.get("framesOrder")[e] : e
            },
            playSprite: function() {
                this.startTime = _.now()
            },
            destructor: function() {
                this.removed = !0, clearTimeout(this.delayTimeout)
            }
        }),
        RuleAnimation = Backbone.Model.extend({
            initialize: function() {
                this.waitAndPlay()
            },
            waitAndPlay: function() {
                if (!this.removed)
                    if (this.startTime = !1, this.get("delay")) {
                        var e = this.get("delay");
                        this.delayTimeout = setTimeout(_.bind(this.playAnimation, this), Math.random() * (e[1] - e[0]) + e[0])
                    } else this.playAnimation()
            },
            getCurrentAttrs: function() {
                if (!this.startTime) return {};
                var e = _.now() - this.startTime;
                e > this.get("duration") && (this.triggerRound || (canvas.finishedCssAnimations.push(this), this.triggerRound = !0), this.get("playRound") ? e %= this.get("duration") : e = this.get("duration"));
                var i = {};
                e /= this.get("duration");
                var t = this.get("params");
                for (var o in t) {
                    var s = e,
                        n = 1 / (t[o].length - 1);
                    s /= n;
                    var a = Math.floor(s);
                    a >= t[o].length - 1 && a--, s -= a, i[o] = t[o][a] + (t[o][a + 1] - t[o][a]) * s
                }
                return i
            },
            playAnimation: function() {
                this.startTime = _.now()
            },
            destructor: function() {
                this.removed = !0, clearTimeout(this.delayTimeout), this.startTime = !1
            }
        }),
        figureRulesProcess = {
            process: function() {
                this.commonClasses(), this.additionalClasses()
            },
            commonClasses: function() {
                FigureRules.add(".fieldDisabled, .fieldDisabledContent", {
                    "background-color": "#000000",
                    opacity: .65
                }), FigureRules.add(".fieldDisabledNoOpacity.fieldDisabled", {
                    opacity: 0
                }), FigureRules.add(".cellBg", {
                    width: Config.cellWidth,
                    height: Config.cellHeight,
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 70,
                    "background-height": 70,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/cellBg.89e1eb2842.png"
                }), FigureRules.add(".cellBg_1.cellBg", {
                    "background-position-x": 70
                }), FigureRules.add(".cellBGLastVer.cellBg", {
                    "background-height": 71
                }), FigureRules.add(".cellBGLastHor.cellBg", {
                    "background-width": 71
                }), FigureRules.add(".fieldDisabledArrow", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 52,
                    "background-height": 75,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/levelAnimation.48b6dcbbb3.png",
                    width: 52,
                    height: 75,
                    "margin-left": -26,
                    "margin-top": -80,
                    spriteFrames: 6,
                    duration: 650,
                    playRound: !0
                }), FigureRules.add(".plusPointStar", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 34,
                    "background-height": 34,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/plusPointStar.12c981966a.png",
                    width: 34 / 70 * Config.cellWidth,
                    height: 34 / 70 * Config.cellHeight,
                    "margin-left": 18 / 70 * Config.cellWidth,
                    "margin-top": 18 / 70 * Config.cellHeight
                }), FigureRules.add(".cell_explode", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 69,
                    "background-height": 69,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/explode.b3b2d38933.png",
                    width: 69 / 70 * Config.cellWidth,
                    height: 69 / 70 * Config.cellHeight,
                    "margin-left": 1 / 70 * Config.cellWidth,
                    "margin-top": 1 / 70 * Config.cellHeight,
                    spriteFrames: 8,
                    lastFrame: 0,
                    duration: 300
                }), FigureRules.add(".powerUpHighlight .powerUpHighlightBg", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 111,
                    "background-height": 107,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/powerUpHighlightBg.84d44d1666.png",
                    width: 106 / 70 * Config.cellWidth,
                    height: 106 / 70 * Config.cellHeight,
                    "margin-left": -(18 / 70 * Config.cellWidth),
                    "margin-top": -(19 / 70 * Config.cellHeight)
                }), FigureRules.add(".powerUpHighlightBg.stable", {
                    spriteFrames: 4,
                    duration: 600,
                    playRound: !0
                }), FigureRules.add(".deformateClickYes", {
                    animation: {
                        params: {
                            "scale-x": [1, 1.2, 1],
                            "scale-y": [1, .9, 1]
                        },
                        duration: 400
                    }
                }), FigureRules.add(".deformateClickNo", {
                    animation: {
                        params: {
                            rotate: [0, -10, 10, 0]
                        },
                        duration: 400
                    }
                }), FigureRules.add(".cellStone.deformateUp", {
                    animation: {
                        params: {
                            "scale-y": [1, .9, 1],
                            "margin-top": [-2, -6, -2]
                        },
                        duration: 400
                    }
                }), FigureRules.add(".cellStone.deformateDown", {
                    animation: {
                        params: {
                            "scale-y": [1, .9, 1],
                            "margin-top": [-2, 6, -2]
                        },
                        duration: 400
                    }
                }), FigureRules.add(".cellStone.deformateLeft", {
                    animation: {
                        params: {
                            "scale-x": [1, .9, 1],
                            "margin-left": [-2, 6, -2]
                        },
                        duration: 400
                    }
                }), FigureRules.add(".cellStone.deformateRight", {
                    animation: {
                        params: {
                            "scale-x": [1, .9, 1],
                            "margin-left": [-2, -6, -2]
                        },
                        duration: 400
                    }
                }), FigureRules.add(".blockedAnimation .cellStone", {
                    animation: {},
                    spriteFrames: 0
                }), FigureRules.add(".moveHelpHor", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 45,
                    "background-height": 70,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/moveHelpHor.b0faa48c42.png",
                    width: 45 / 70 * Config.cellWidth,
                    height: Config.cellHeight,
                    "margin-left": 48 / 70 * Config.cellWidth,
                    spriteFrames: 5,
                    framesOrder: [0, 1, 2, 1, 0],
                    spriteVertical: !0,
                    duration: 400,
                    playRound: !0
                }), FigureRules.add(".moveHelpVer", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 70,
                    "background-height": 45,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/moveHelpVer.e09b9f63c3.png",
                    width: Config.cellWidth,
                    height: 45 / 70 * Config.cellHeight,
                    "margin-top": 48 / 70 * Config.cellHeight,
                    spriteFrames: 5,
                    framesOrder: [0, 1, 2, 1, 0],
                    duration: 400,
                    playRound: !0
                }), FigureRules.add(".multicolor .cellStone", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 150,
                    "background-height": 150,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/multicolor.18d6ff588b.png",
                    width: 74 / 70 * Config.cellWidth,
                    height: 74 / 70 * Config.cellHeight,
                    "margin-left": -2 / 70 * Config.cellWidth,
                    "margin-top": -2 / 70 * Config.cellHeight
                }), FigureRules.add(".multicolor .cellStone.animated", {
                    animation: {
                        params: {
                            rotate: [0, 11, 0, -11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        },
                        duration: 4e3,
                        playRound: !0
                    }
                }), FigureRules.add(".multicolor.multicolorUsed", {
                    animation: {
                        params: {
                            rotate: [11, -11, 11, -11, 11],
                            scale: [1, 2, 2, 0]
                        },
                        duration: 1200
                    }
                }), FigureRules.add(".mixing", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 400,
                    "background-height": 400,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/mix.af9a666b71.png",
                    width: 400 / 70 * Config.cellWidth,
                    height: 400 / 70 * Config.cellHeight,
                    "margin-left": 80 / 70 * Config.cellWidth,
                    "margin-top": 80 / 70 * Config.cellHeight,
                    animation: {
                        params: {
                            rotate: [0, -360]
                        },
                        duration: 700,
                        playRound: !0
                    }
                }), FigureRules.add(".fallingCandy, .leftmove .cellStone", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 77,
                    "background-height": 77,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/fallingCandy.a3af86e835.png",
                    width: 1.1 * Config.cellWidth,
                    height: 1.1 * Config.cellHeight,
                    "margin-left": -3 / 70 * Config.cellWidth,
                    "margin-top": -3 / 70 * Config.cellHeight
                }), FigureRules.add(".cellStone.leftmoveStone", {
                    spriteFrames: 5,
                    framesOrder: [0, 1, 2, 1, 0],
                    duration: 500,
                    playRound: !0
                }), FigureRules.add(".cellStone.leftmoveStone.explode", {
                    "background-position-x": 231,
                    animation: {
                        params: {
                            opacity: [1, 0]
                        },
                        duration: 300,
                        playRound: !0
                    }
                }), FigureRules.add(".powerUpHighlightBg.leftmoveExplosion", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 226,
                    "background-height": 226,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/leftMoveExplosion.b471b969d9.png",
                    width: 226 / 70 * Config.cellWidth,
                    height: 226 / 70 * Config.cellHeight,
                    "margin-left": -1.1 * Config.cellWidth,
                    "margin-top": -1.1 * Config.cellHeight,
                    spriteFrames: 5,
                    lastFrame: 4,
                    duration: 280
                }), FigureRules.add(".beforeCandy", {
                    width: 680 / 70 * Config.cellWidth,
                    height: 660 / 70 * Config.cellHeight,
                    "margin-top": 18 / 70 * Config.cellHeight
                }), FigureRules.add(".beforeCandyPart", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 383,
                    "background-height": 374,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/gameWave.02e5f73b9d.png",
                    width: 383 / 70 * Config.cellWidth,
                    height: 374 / 70 * Config.cellHeight,
                    spriteFrames: 7,
                    lastFrame: 6,
                    duration: 400
                }), FigureRules.add(".beforeCandyPart2.beforeCandyPart", {
                    "margin-left": 3.9 * Config.cellWidth,
                    "margin-top": .1 * Config.cellHeight,
                    rotate: 90
                }), FigureRules.add(".beforeCandyPart3.beforeCandyPart", {
                    "margin-left": 265 / 70 * Config.cellWidth,
                    "margin-top": 4 * Config.cellHeight,
                    rotate: 180
                }), FigureRules.add(".beforeCandyPart4.beforeCandyPart", {
                    "margin-left": -0.1 * Config.cellWidth,
                    "margin-top": 3.9 * Config.cellHeight,
                    rotate: 270
                }), FigureRules.add(".decorator_blocked", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/chainBlast.8d7d32fc3a.png",
                    width: 69 / 70 * Config.cellWidth,
                    height: 69 / 70 * Config.cellHeight,
                    "margin-left": 1 / 70 * Config.cellWidth
                }), FigureRules.add(".decorator_blocked.remove", {
                    spriteFrames: 9,
                    lastFrame: 9,
                    duration: 800
                }), FigureRules.add(".pearlCell .cellStone, .die_pearl", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode2/pearlBg.d2866b3483.png",
                    width: 74 / 70 * Config.cellWidth,
                    height: 74 / 70 * Config.cellHeight,
                    "margin-left": -2 / 70 * Config.cellHeight,
                    "margin-top": -2 / 70 * Config.cellHeight
                }), FigureRules.add(".pearl", {
                    "background-position-x": 1620,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode2/pearlBg.d2866b3483.png",
                    width: 74 / 70 * Config.cellWidth,
                    height: 74 / 70 * Config.cellHeight,
                    "margin-left": -2 / 70 * Config.cellHeight,
                    "margin-top": -2 / 70 * Config.cellHeight
                }), FigureRules.add(".pearlLevel1.pearlCell .cellStone", {
                    "background-position-x": 1260
                }), FigureRules.add(".pearlLevel2.pearlCell .cellStone", {
                    "background-position-x": 810
                }), FigureRules.add(".pearlLevel3.pearlCell .cellStone", {
                    "background-position-x": 450
                }), FigureRules.add(".pearlLevel4.pearlCell .cellStone", {
                    "background-position-x": 90
                }), FigureRules.add(".pearlLevel1.pearlCell .cellStone.animated", {
                    spriteFrames: 4,
                    lastFrame: 0,
                    duration: 400
                }), FigureRules.add(".pearlLevel2.pearlCell .cellStone.animated", {
                    spriteFrames: 4,
                    lastFrame: 0,
                    duration: 400
                }), FigureRules.add(".pearlLevel3.pearlCell .cellStone.animated", {
                    spriteFrames: 3,
                    lastFrame: 0,
                    duration: 300
                }), FigureRules.add(".pearlLevel4.pearlCell .cellStone.animated", {
                    spriteFrames: 3,
                    lastFrame: 0,
                    duration: 400
                }), FigureRules.add(".wellCellBg", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode4/bowler.9acad4c815.png",
                    width: 74 / 70 * Config.cellWidth,
                    height: 74 / 70 * Config.cellHeight,
                    "margin-left": -2 / 70 * Config.cellHeight,
                    "margin-top": -2 / 70 * Config.cellHeight
                }), FigureRules.add(".wellCellBg.wellLevel1", {
                    "background-position-x": 90,
                    spriteFrames: 10,
                    duration: 1100,
                    playRound: !0
                }), FigureRules.add(".wellCellBg.wellLevel2", {
                    "background-position-x": 990,
                    spriteFrames: 9,
                    duration: 950,
                    playRound: !0
                }), FigureRules.add(".wellCellBg.wellLevel3", {
                    "background-position-x": 1800,
                    spriteFrames: 9,
                    duration: 950,
                    playRound: !0
                }), FigureRules.add(".wellCellBg.wellLevel4", {
                    "background-position-x": 2610,
                    spriteFrames: 4,
                    duration: 420,
                    playRound: !0
                }), FigureRules.add(".flyWater", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/cellStoneW.0917babd3b.png",
                    width: 74 / 70 * Config.cellWidth,
                    height: 74 / 70 * Config.cellHeight,
                    "margin-left": -2 / 70 * Config.cellWidth,
                    "margin-top": -2 / 70 * Config.cellHeight
                }), FigureRules.add(".floorLevel1", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 99,
                    "background-height": 98,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode5/grass.6434421752.png",
                    width: 99 / 70 * Config.cellWidth,
                    height: 101 / 70 * Config.cellHeight,
                    "margin-left": -13 / 70 * Config.cellWidth,
                    "margin-top": -16 / 70 * Config.cellHeight
                }), FigureRules.add(".floorLevel1.animated", {
                    spriteFrames: 11,
                    lastFrame: 0,
                    duration: 900
                }), FigureRules.add(".color_0.cell .cellStone, .color_1.cell .cellStone, .color_2.cell .cellStone", {
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode6/jam.d09ba6bc85.png",
                    width: 90 / 70 * Config.cellWidth,
                    height: 90 / 70 * Config.cellHeight,
                    "margin-left": -8 / 70 * Config.cellWidth,
                    "margin-top": -8 / 70 * Config.cellHeight
                }), FigureRules.add(".color_0.cell .cellStone", {
                    "background-position-x": 180,
                    "background-position-y": 90
                }), FigureRules.add(".color_1.cell .cellStone", {
                    "background-position-x": 0,
                    "background-position-y": 90
                }), FigureRules.add(".color_2.cell .cellStone", {
                    "background-position-x": 810,
                    "background-position-y": 0
                }), FigureRules.add(".color_0.cell .cellStone.collected", {
                    "background-position-x": 0
                }), FigureRules.add(".color_1.cell .cellStone.collected", {
                    "background-position-y": 0
                }), FigureRules.add(".color_0.cell .cellStone.collected, .color_1.cell .cellStone.collected", {
                    spriteFrames: 9,
                    framesOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 2],
                    lastFrame: 0,
                    duration: 1e3
                }), FigureRules.add(".color_0.cell .cellStone.deformateUp, .color_1.cell .cellStone.deformateUp, .color_2.cell .cellStone.deformateUp", {
                    animation: {}
                }), FigureRules.add(".color_0.cell .cellStone.deformateDown, .color_1.cell .cellStone.deformateDown, .color_2.cell .cellStone.deformateDown", {
                    animation: {}
                }), FigureRules.add(".color_0.cell .cellStone.deformateLeft, .color_1.cell .cellStone.deformateLeft, .color_2.cell .cellStone.deformateLeft", {
                    animation: {}
                }), FigureRules.add(".color_0.cell .cellStone.deformateRight, .color_1.cell .cellStone.deformateRight, .color_2.cell .cellStone.deformateRight", {
                    animation: {}
                }), FigureRules.add(".fishcellBg.fish", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 96,
                    "background-height": 96,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/cupoftea.d17d14ea46.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".episode_mccafe .fishcellBg.fish", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 70,
                    "background-height": 70,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/episode/episodemccafe/cupofcoffee.f90f1e9501.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".episode_thumbelina .fishcellBg.fish", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 96,
                    "background-height": 96,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episodethumbelina/cupoftea.5bcb991494.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".fishcellBg.fish2", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode12/cookie1.67fd2f47c8.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".fishcellBg.fish3", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode12/cookie2.d912fd340f.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".fishcellBg.fish4", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode12/cookie3.fbc2350905.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".nutLevel1 .cellStone, .nut_remove_animatePiece1", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode3/nut.c3571fc864.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".nutLevel1 .cellStone.stable", {
                    spriteFrames: 16,
                    delay: [3e3, 1e4],
                    framesOrder: [0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7],
                    lastFrame: 0,
                    duration: 1600,
                    playRound: !0
                }), FigureRules.add(".nut_remove_animatePiece1", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode3/nut.c3571fc864.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight,
                    "margin-left": -2 / 70 * Config.cellWidth,
                    "margin-top": -2 / 70 * Config.cellHeight
                }), FigureRules.add(".nutLevel2 .cellStone", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode8/nut2.66d2f4bb8e.png",
                    width: 74 / 70 * Config.cellWidth,
                    height: 74 / 70 * Config.cellHeight,
                    "margin-left": -2 / 70 * Config.cellWidth,
                    "margin-top": -2 / 70 * Config.cellHeight
                }), FigureRules.add(".nutLevel2_remove_animatePiece1, .nutLevel2_remove_animatePiece2, .nutLevel2_remove_animatePiece3, .nutLevel2_remove_animatePiece4", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode8/nut2.66d2f4bb8e.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight,
                    "margin-left": -2 / 70 * Config.cellWidth,
                    "margin-top": -2 / 70 * Config.cellHeight
                }), FigureRules.add(".nutLevel2_remove_animatePiece1", {
                    "background-position-x": 90,
                    "margin-left": -29 / 70 * Config.cellWidth,
                    "margin-top": 6 / 70 * Config.cellHeight
                }), FigureRules.add(".nutLevel2_remove_animatePiece2", {
                    "background-position-x": 180,
                    "margin-left": 29 / 70 * Config.cellWidth,
                    "margin-top": 5 / 70 * Config.cellHeight
                }), FigureRules.add(".nutLevel3 .cellStone", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode8/nut3.14d3f60de3.png",
                    width: 74 / 70 * Config.cellWidth,
                    height: 74 / 70 * Config.cellHeight,
                    "margin-left": -2 / 70 * Config.cellWidth,
                    "margin-top": -2 / 70 * Config.cellHeight
                }), FigureRules.add(".nutLevel3 .cellStone.nut3_annihilation", {
                    spriteFrames: 5,
                    lastFrame: 0,
                    duration: 600
                }), FigureRules.add(".squirrelNut", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode8/nut3.14d3f60de3.png",
                    width: 62 / 70 * Config.cellWidth,
                    height: 62 / 70 * Config.cellHeight,
                    "margin-left": 4 / 70 * Config.cellWidth,
                    "margin-top": 4 / 70 * Config.cellHeight
                }), FigureRules.add(".squirrel", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 177,
                    "background-height": 164,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode16/squirrel.ef1427338b.png",
                    width: 177 / 70 * Config.cellWidth,
                    height: 164 / 70 * Config.cellHeight
                }), FigureRules.add(".squirrel.move", {
                    spriteFrames: 2,
                    duration: 80,
                    playRound: !0
                }), FigureRules.add(".squirrel.wink", {
                    spriteFrames: 4,
                    framesOrder: [1, 2, 3, 1],
                    lastFrame: 1,
                    duration: 400
                }), FigureRules.add(".squirrel.throws", {
                    spriteFrames: 5,
                    framesOrder: [1, 4, 5, 6, 7],
                    lastFrame: 7,
                    duration: 550
                }), FigureRules.add(".squirrel.threw", {
                    spriteFrames: 2,
                    framesOrder: [8, 9],
                    lastFrame: 9,
                    duration: 200
                }), FigureRules.add(".squirrel.moveback", {
                    spriteFrames: 2,
                    framesOrder: [10, 9],
                    duration: 80,
                    playRound: !0
                }), FigureRules.add(".penguinBg", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 284,
                    "background-height": 284,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode23/penguin.940e1c310e.png",
                    width: 142 / 70 * Config.cellWidth,
                    height: 142 / 70 * Config.cellHeight,
                    "margin-top": -1 / 70 * Config.cellHeight
                }), FigureRules.add(".penguinBg.stable", {
                    spriteFrames: 8,
                    framesOrder: [0, 1, 2, 1, 0, 1, 2, 1],
                    duration: 800,
                    delay: [3e3, 5e3],
                    playRound: !0
                }), FigureRules.add(".penguinHeadCell.deformateClickNo", {
                    animation: "none"
                }), FigureRules.add(".penguinHeadCell.deformateClickNo .penguinBg.stable", {
                    spriteFrames: 8,
                    framesOrder: [0, 1, 2, 1, 0, 1, 2, 1],
                    duration: 800
                }), FigureRules.add(".penguinBg.penguinAngry", {
                    spriteFrames: 7,
                    framesOrder: [0, 3, 4, 5, 6, 6, 6],
                    duration: 840
                }), FigureRules.add(".penguinLifeText", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 124,
                    "background-height": 82,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode23/penguinLifeBlock.cd23615cf3.png",
                    width: 62 / 70 * Config.cellWidth,
                    height: 41 / 70 * Config.cellHeight,
                    "margin-left": 66 / 70 * Config.cellWidth,
                    "margin-top": 94 / 70 * Config.cellHeight
                }), FigureRules.add(".currentLife", {
                    width: 25 / 70 * Config.cellWidth,
                    height: 26 / 70 * Config.cellHeight,
                    color: "#fff4c2",
                    "text-left": 30 / 70 * Config.cellWidth,
                    "text-top": 27 / 70 * Config.cellHeight
                }), FigureRules.add(".penguinFly", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 284,
                    "background-height": 284,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode23/penguin.940e1c310e.png",
                    width: 142 / 70 * Config.cellWidth,
                    height: 142 / 70 * Config.cellHeight,
                    "margin-top": -1 / 70 * Config.cellHeight
                }), FigureRules.add(".penguinHeadCell .powerUpHighlightBg.powerUpHighlightBgAnimation", {
                    "margin-top": Config.cellWidth + .55 * Config.cellWidth,
                    "margin-left": Config.cellHeight - 20 / 60 * Config.cellHeight
                }), FigureRules.add(".wall", {
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode2/wall.b90c595712.png",
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    width: Config.cellWidth - 1,
                    height: Config.cellHeight - 1,
                    "margin-left": 1,
                    "margin-top": 1
                }), FigureRules.add(".dragonBg", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 284,
                    "background-height": 284,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode26/sweetDragon.ec03a5b096.png",
                    width: 142 / 70 * Config.cellWidth,
                    height: 142 / 70 * Config.cellHeight,
                    "margin-top": -1 / 70 * Config.cellHeight
                }), FigureRules.add(".dragonBg.stable", {
                    spriteFrames: 8,
                    framesOrder: [0, 1, 0, 2, 0, 1, 0, 2],
                    duration: 1200,
                    delay: [3e3, 5e3],
                    playRound: !0
                }), FigureRules.add(".dragonHeadCell.deformateClickNo", {
                    animation: "none"
                }), FigureRules.add(".dragonHeadCell.deformateClickNo .dragonBg.stable", {
                    spriteFrames: 8,
                    framesOrder: [0, 1, 0, 2, 0, 1, 0, 2],
                    duration: 1200
                }), FigureRules.add(".dragonBg.dragonAngry", {
                    spriteFrames: 7,
                    framesOrder: [0, 3, 4, 5, 6, 6, 6],
                    duration: 840
                }), FigureRules.add(".dragonLifeText", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 124,
                    "background-height": 82,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode26/dragonLifeBlock.b2c9b72f53.png",
                    width: 62 / 70 * Config.cellWidth,
                    height: 41 / 70 * Config.cellHeight,
                    "margin-left": 80 / 70 * Config.cellWidth,
                    "margin-top": 102 / 70 * Config.cellHeight
                }), FigureRules.add(".currentLife", {
                    width: 25 / 70 * Config.cellWidth,
                    height: 26 / 70 * Config.cellHeight,
                    color: "#fff4c2",
                    "text-left": 30 / 70 * Config.cellWidth,
                    "text-top": 27 / 70 * Config.cellHeight
                }), FigureRules.add(".dragonHeadCell .powerUpHighlightBg.powerUpHighlightBgAnimation", {
                    "margin-top": Config.cellWidth + .55 * Config.cellWidth,
                    "margin-left": Config.cellHeight - 20 / 60 * Config.cellHeight
                }), FigureRules.add(".episode_alice .dragonBg, .episode_alice .dragonBg.dragonAngry", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 140,
                    "background-height": 140,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episodealice/smile.6016fc9138.png",
                    width: 2 * Config.cellWidth,
                    height: 2 * Config.cellHeight
                }), FigureRules.add(".episode_alice .dragonSmile", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 140,
                    "background-height": 140,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episodealice/catStable.d37320df2d.png",
                    width: 2 * Config.cellWidth,
                    height: 2 * Config.cellHeight
                }), FigureRules.add(".episode_alice .dragonBg.stable, .episode_alice .dragonBg.dragonAngry", {
                    spriteFrames: 8,
                    framesOrder: [0, 1, 2, 1, 0, 1, 2, 1],
                    duration: 1200,
                    delay: [3e3, 5e3],
                    playRound: !0
                }), FigureRules.add(".episode_alice .less100PercentLife.dragonHeadCell .dragonSmile", {
                    opacity: .4
                }), FigureRules.add(".episode_alice .less50PercentLife.dragonHeadCell .dragonSmile", {
                    opacity: .7
                }), FigureRules.add(".episode_alice .less25PercentLife.dragonHeadCell .dragonSmile", {
                    opacity: 1
                }), FigureRules.add(".dragonFly .dragonBg", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 235,
                    "background-height": 194,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episodealice/catFly.48c08ef461.png",
                    width: 235 / 70 * Config.cellWidth,
                    height: 194 / 70 * Config.cellHeight,
                    "margin-top": -15 / 70 * Config.cellHeight,
                    spriteFrames: 7,
                    duration: 600,
                    delay: [0, 0],
                    playRound: !1
                }), FigureRules.add(".fishcellBg.fish9", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode33/cookieForRaccoon.29da4813b3.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".raccoonHeadCell, .raccoonFly", {
                    "background-width": 254,
                    "background-height": 250,
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode33/racoonBg.b823b2583a.png",
                    width: 142 / 70 * Config.cellWidth,
                    height: 2 * Config.cellHeight
                }), FigureRules.add(".raccoonBg.stable", {
                    "background-width": 211,
                    "background-height": 141,
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode33/racoonAnimation.6bc5d05f1f.png",
                    width: 128 / 70 * Config.cellWidth,
                    height: 86 / 70 * Config.cellHeight,
                    "margin-left": 13 / 70 * Config.cellWidth,
                    "margin-top": 29 / 70 * Config.cellHeight,
                    spriteFrames: 8,
                    framesOrder: [0, 1, 0, 1, 0, 1, 0, 1],
                    duration: 2e3,
                    delay: [3e3, 5e3],
                    playRound: !0
                }), FigureRules.add(".raccoonBg.raccoonAngry", {
                    "background-width": 211,
                    "background-height": 141,
                    "background-position-x": 422,
                    "background-position-y": 0,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode33/racoonAnimation.6bc5d05f1f.png",
                    width: 128 / 70 * Config.cellWidth,
                    height: 86 / 70 * Config.cellHeight,
                    "margin-left": 13 / 70 * Config.cellWidth,
                    "margin-top": 29 / 70 * Config.cellHeight,
                    spriteFrames: 9,
                    framesOrder: [0, 1, 0, 1, 0, 1, 0, 1, 2],
                    duration: 1800,
                    playRound: !1
                }), FigureRules.add(".raccoonLifeText", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 130,
                    "background-height": 80,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode33/raccoonLifeBlock.55ac2cc00c.png",
                    width: .9 * Config.cellWidth,
                    height: 39 / 70 * Config.cellHeight,
                    "margin-left": 76 / 70 * Config.cellWidth,
                    "margin-top": 100 / 70 * Config.cellHeight
                }), FigureRules.add(".currentLife", {
                    width: 25 / 70 * Config.cellWidth,
                    height: 26 / 70 * Config.cellHeight,
                    color: "#fff4c2",
                    "text-left": 30 / 70 * Config.cellWidth,
                    "text-top": 27 / 70 * Config.cellHeight
                }), FigureRules.add(".fishcellBg.fish5", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 100,
                    "background-height": 100,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episodebonusworld1/bw2Cake1.1e607af8c7.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".fishcellBg.fish6", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 100,
                    "background-height": 100,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episodebonusworld1/bw2Cake2.f101e74324.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".fishcellBg.fish7", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 100,
                    "background-height": 100,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episodebonusworld1/bw2Cake3.9f2c34c4b9.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".fishcellBg.fish8", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episodebonusworld1/bw2Book.1dcb139deb.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".decorator_chain", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 93,
                    "background-height": 93,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episodebonusworld1/bw2Bead.d70eda3ff3.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".decorator_chain.remove", {
                    spriteFrames: 9,
                    lastFrame: 9,
                    duration: 800
                }), FigureRules.add(".decorator_chain, .decorator_chain_remove_animatePiece", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 93,
                    "background-height": 93,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episodebonusworld1/bw2Bead.d70eda3ff3.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".decorator_chain_remove_animatePiece1.decorator_chain_remove_animatePiece", {
                    "background-position-x": 93
                }), FigureRules.add(".decorator_chain_remove_animatePiece2.decorator_chain_remove_animatePiece", {
                    "background-position-x": 186
                }), FigureRules.add(".decorator_chain_remove_animatePiece3.decorator_chain_remove_animatePiece", {
                    "background-position-x": 279
                }), FigureRules.add(".decorator_chain_remove_animatePiece4.decorator_chain_remove_animatePiece", {
                    "background-position-x": 372
                }), FigureRules.add(".cakeHead", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 160,
                    "background-height": 160,
                    width: 2 * Config.cellWidth,
                    height: 2 * Config.cellHeight
                }), FigureRules.add(".cakeLife0, .cakeLife1, .cakeLife2", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 80,
                    "background-height": 80,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode36/cakeLifesBurn.024b5ff5ba.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".dieCake", {
                    "background-position-x": 320,
                    "background-position-y": 0,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode36/cakeLifesBurn.024b5ff5ba.png",
                    "background-width": 160,
                    "background-height": 160,
                    width: 2 * Config.cellWidth,
                    height: 2 * Config.cellHeight
                }), FigureRules.add(".cakeType_0_0.cakeLife2", {
                    "background-position-x": 0,
                    "background-position-y": 0
                }), FigureRules.add(".cakeType_1_0.cakeLife2", {
                    "background-position-x": 80,
                    "background-position-y": 0
                }), FigureRules.add(".cakeType_0_1.cakeLife2", {
                    "background-position-x": 0,
                    "background-position-y": 80
                }), FigureRules.add(".cakeType_1_1.cakeLife2", {
                    "background-position-x": 80,
                    "background-position-y": 80
                }), FigureRules.add(".cakeType_0_0.cakeLife1", {
                    "background-position-x": 160,
                    "background-position-y": 0
                }), FigureRules.add(".cakeType_1_0.cakeLife1", {
                    "background-position-x": 240,
                    "background-position-y": 0
                }), FigureRules.add(".cakeType_0_1.cakeLife1", {
                    "background-position-x": 160,
                    "background-position-y": 80
                }), FigureRules.add(".cakeType_1_1.cakeLife1", {
                    "background-position-x": 240,
                    "background-position-y": 80
                }), FigureRules.add(".cakeType_0_0.cakeLife0", {
                    "background-position-x": 320,
                    "background-position-y": 0
                }), FigureRules.add(".cakeType_1_0.cakeLife0", {
                    "background-position-x": 400,
                    "background-position-y": 0
                }), FigureRules.add(".cakeType_0_1.cakeLife0", {
                    "background-position-x": 320,
                    "background-position-y": 80
                }), FigureRules.add(".cakeType_1_1.cakeLife0", {
                    "background-position-x": 400,
                    "background-position-y": 80
                }), FigureRules.add(".fishcellBg.fish12", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode12/cookie1.67fd2f47c8.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".fishcellBg.fish13", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode12/cookie2.d912fd340f.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".fishcellBg.fish14", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 90,
                    "background-height": 90,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode12/cookie3.fbc2350905.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".mouseFarmCell", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 70,
                    "background-height": 70,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode50/hole.4edeccb3bf.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".mouseFarmLevel1", {
                    "background-position-x": 0,
                    spriteFrames: 5,
                    duration: 500,
                    delay: [0, 0],
                    playRound: !1
                }), FigureRules.add(".mouseFarmLevel2", {
                    "background-position-x": 350,
                    spriteFrames: 2,
                    duration: 200,
                    delay: [0, 0],
                    playRound: !1
                }), FigureRules.add(".mouseFarmLevel3", {
                    "background-position-x": 490,
                    spriteFrames: 2,
                    duration: 200,
                    delay: [0, 0],
                    playRound: !1
                }), FigureRules.add(".mouseFarmCellMouse", {
                    "background-position-x": 630,
                    "background-position-y": 0,
                    "background-width": 70,
                    "background-height": 70,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode50/bug.25c2da33a1.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".mouseFarmLevel2 .mouseFarmCellMouse.stable", {
                    "background-position-x": 0,
                    spriteFrames: 3,
                    lastFrame: 2,
                    duration: 400,
                    delay: [500, 1500],
                    playRound: !0
                }), FigureRules.add(".mouseFarmLevel3 .mouseFarmCellMouse.stable", {
                    "background-position-x": 420,
                    spriteFrames: 3,
                    duration: 400,
                    delay: [500, 1500],
                    playRound: !0
                }), FigureRules.add(".mouseFarmLevel1 .mouseFarmCellMouse.mouseFarmMove, .mouseFarmLevel2 .mouseFarmCellMouse.mouseFarmMove", {
                    "background-position-x": 630,
                    spriteFrames: 1,
                    duration: 100,
                    playRound: !1
                }), FigureRules.add(".mouseFarmLevel3 .mouseFarmCellMouse.mouseFarmMove", {
                    "background-position-x": 210,
                    spriteFrames: 3,
                    duration: 300,
                    playRound: !1
                }), FigureRules.add(".mixerHeadCell, .mixerFly", {
                    "background-width": 137,
                    "background-height": 137,
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode54/mixerBg.9520349f71.png",
                    width: 2 * Config.cellWidth,
                    height: 2 * Config.cellHeight
                }), FigureRules.add(".mixerBg", {
                    "background-width": 140,
                    "background-height": 140,
                    "background-position-y": 0,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode54/mixerAnimation.523ce38d54.png",
                    width: 2 * Config.cellWidth,
                    height: 2 * Config.cellHeight
                }), FigureRules.add(".mixerHeadCell .stable", {
                    "background-position-x": 0,
                    spriteFrames: 9,
                    duration: 1500,
                    delay: [0, 0],
                    playRound: !0
                }), FigureRules.add(".mixerHeadCell .shuffle", {
                    "background-position-x": 1260,
                    spriteFrames: 6,
                    duration: 1e3,
                    delay: [0, 0],
                    playRound: !0
                }), FigureRules.add(".mixerLifeText", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 37,
                    "background-height": 35,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode54/mixerLifeBlock.d6f1996453.png",
                    width: 37 / 70 * Config.cellWidth,
                    height: .5 * Config.cellHeight,
                    "margin-left": 100 / 70 * Config.cellWidth,
                    "margin-top": 100 / 70 * Config.cellHeight
                }), FigureRules.add(".mixerHeadCell .moves", {
                    width: 25 / 70 * Config.cellWidth,
                    height: 26 / 70 * Config.cellHeight,
                    color: "#ffdca1",
                    font: "lv" === locale ? "bold " + 19 / 70 * Config.cellWidth + "px/" + 30 / 70 * Config.cellWidth + "px HVDComicSerifPro" : "pl" === locale ? "bold " + 19 / 70 * Config.cellWidth + "px/" + 30 / 70 * Config.cellWidth + "px HVDComicSerifPro" : "bold " + 15 / 70 * Config.cellWidth + "px/" + 26 / 70 * Config.cellWidth + "px ObelixPro",
                    "text-left": 13 / 70 * Config.cellWidth,
                    "text-top": 25 / 70 * Config.cellHeight
                }), FigureRules.add(".mixerHeadCell .moves.soonShuffle", {
                    color: "#FF0000",
                    animation: {
                        params: {
                            opacity: [1, .1, 1]
                        },
                        duration: 800,
                        playRound: !0
                    }
                }), FigureRules.add(".peacockHeadCell", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 140,
                    "background-height": 140,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode58/peacock.a3611833a9.png",
                    width: 2 * Config.cellWidth,
                    height: 2 * Config.cellHeight
                }), FigureRules.add(".peacockBg", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 30,
                    "background-height": 30,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode58/eye.2c15b5f108.png",
                    width: 30 / 70 * Config.cellWidth,
                    height: 30 / 70 * Config.cellWidth,
                    "margin-left": .3 * Config.cellWidth,
                    "margin-top": 43 / 70 * Config.cellHeight,
                    spriteFrames: 4,
                    framesOrder: [0, 1, 2, 1],
                    duration: 600,
                    delay: [1500, 2700],
                    playRound: !0
                }), FigureRules.add(".flyPeacockFeather", {
                    "background-position-x": 0,
                    "background-position-y": 0,
                    "background-width": 70,
                    "background-height": 70,
                    "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode58/feather.4c07bcd2ca.png",
                    width: Config.cellWidth,
                    height: Config.cellHeight
                }), FigureRules.add(".flyPeacockFeather.removeAnimation", {
                    spriteFrames: 8,
                    duration: 700,
                    playRound: !1
                })
            }
        };
    figureRulesProcess.additionalClasses = function() {
        FigureRules.add(".cellCoeffBlockShow .cellCoeffBlock", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 24,
            "background-height": 24,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/cellCoeff.f3eecf24a5.png",
            width: 24 / 70 * Config.cellWidth,
            height: 24 / 70 * Config.cellHeight,
            "margin-left": 45 / 70 * Config.cellWidth,
            "margin-top": 1 / 70 * Config.cellHeight
        }), FigureRules.add(".cellCoeffBlockShow .cellCoeff", {
            font: "lv" === locale ? "bold " + .2 * Config.cellWidth + "px/" + 24 / 70 * Config.cellWidth + "px HVDComicSerifPro" : "pl" === locale ? "bold " + .2 * Config.cellWidth + "px/" + 24 / 70 * Config.cellWidth + "px HVDComicSerifPro" : "bold " + 12 / 70 * Config.cellWidth + "px/" + 22 / 70 * Config.cellWidth + "px ObelixPro",
            color: "#fbf3c3",
            "text-left": 4 / 70 * Config.cellWidth,
            "text-top": 17 / 70 * Config.cellHeight
        }), FigureRules.add(".powerUpHighlightBg.cellCoeffBlockLight", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 106,
            "background-height": 106,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/cellCoeffBlockAnimation.cc9e356860.png",
            width: 106 / 70 * Config.cellWidth,
            height: 106 / 70 * Config.cellHeight,
            "margin-left": -(18 / 70 * Config.cellWidth),
            "margin-top": -(18 / 70 * Config.cellHeight),
            spriteFrames: 4,
            duration: 300,
            playRound: !0
        }), FigureRules.add(".cart", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 139,
            "background-height": 155,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/cart.fc1e4a3c90.png",
            width: 139 / 70 * Config.cellWidth,
            height: 155 / 70 * Config.cellHeight,
            "margin-left": -(139 / 70 * Config.cellWidth) / 2,
            "margin-top": -(1 * Config.cellHeight)
        }), FigureRules.add(".hammer", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 98,
            "background-height": 115,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/hammer.15cbb04b6c.png",
            width: 1.4 * Config.cellWidth,
            height: 115 / 70 * Config.cellHeight,
            "margin-left": .5 * Config.cellWidth,
            "margin-top": -(1 * Config.cellHeight),
            animation: {
                params: {
                    "margin-left": [35, 70, 15, 15],
                    "margin-top": [-70, -90, -60, -45],
                    rotate: [0, 0, 0, 10]
                },
                duration: 900
            }
        }), FigureRules.add(".selectedCell .selectedCellBg", {
            "background-position-x": 518,
            "background-position-y": 0,
            "background-width": 70,
            "background-height": 70,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/stones.3525fe58e5.png",
            width: Config.cellWidth,
            height: Config.cellHeight,
            "margin-left": -(1 / 70 * Config.cellWidth),
            "margin-top": -(1 / 70 * Config.cellHeight)
        }), FigureRules.add(".cell", {
            width: Config.cellWidth,
            height: Config.cellHeight
        }), FigureRules.add(".cellStone.cellCoeffBlockAnimation", {
            animation: {
                params: {
                    scale: [1, 1.2, 1]
                },
                duration: 300
            }
        }), FigureRules.add(".color_R .cellStone, .color_G .cellStone, .color_O .cellStone, .color_A .cellStone, .color_C .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/stones.3525fe58e5.png",
            "background-position-y": 0,
            "background-width": 74,
            "background-height": 74,
            width: 74 / 70 * Config.cellWidth,
            height: 74 / 70 * Config.cellHeight,
            "margin-left": -2 / 70 * Config.cellWidth,
            "margin-top": -2 / 70 * Config.cellHeight
        }), FigureRules.add(".color_R .cellStone", {
            "background-position-x": 296
        }), FigureRules.add(".color_G .cellStone", {
            "background-position-x": 0
        }), FigureRules.add(".color_O .cellStone", {
            "background-position-x": 222
        }), FigureRules.add(".color_A .cellStone", {
            "background-position-x": 592
        }), FigureRules.add(".color_C .cellStone", {
            "background-position-x": 665
        }), FigureRules.add(".color_Y .cellStone, .color_W .cellStone, .color_P .cellStone, .color_B .cellStone", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 90,
            "background-height": 90,
            width: 74 / 70 * Config.cellWidth,
            height: 74 / 70 * Config.cellHeight,
            "margin-left": -2 / 70 * Config.cellWidth,
            "margin-top": -2 / 70 * Config.cellHeight
        }), FigureRules.add(".color_Y .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/cellStoneY.59bc6c1dbf.png"
        }), FigureRules.add(".color_Y .cellStone.stable", {
            spriteFrames: 12,
            delay: [3e3, 1e4],
            duration: 1200,
            playRound: !0
        }), FigureRules.add(".color_W .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/cellStoneW.0917babd3b.png"
        }), FigureRules.add(".color_W .cellStone.stable, .color_P .cellStone.stable", {
            spriteFrames: 8,
            delay: [3e3, 1e4],
            duration: 500,
            playRound: !0
        }), FigureRules.add(".color_P .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/cellStoneP.292ec4af97.png"
        }), FigureRules.add(".color_B .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/animations/cellStoneB.396afbef2a.png"
        }), FigureRules.add(".color_B .cellStone.stable", {
            spriteFrames: 11,
            delay: [3e3, 1e4],
            duration: 1100,
            playRound: !0
        }), FigureRules.add(".morphColorCell .cellStone", {
            "background-position-x": 0,
            "background-width": 90,
            "background-height": 90,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode20/morphColor.1057887661.png",
            width: 68 / 70 * Config.cellWidth,
            height: 68 / 70 * Config.cellHeight,
            "margin-left": 3 / 70 * Config.cellWidth,
            "margin-top": 1 / 70 * Config.cellHeight
        }), FigureRules.add(".color_R.morphColorCell .cellStone", {
            "background-position-y": 0
        }), FigureRules.add(".color_G.morphColorCell .cellStone", {
            "background-position-y": 90
        }), FigureRules.add(".color_A.morphColorCell .cellStone", {
            "background-position-y": 180
        }), FigureRules.add(".color_C.morphColorCell .cellStone", {
            "background-position-y": 270
        }), FigureRules.add(".color_O.morphColorCell .cellStone", {
            "background-position-y": 360
        }), FigureRules.add(".morphColorCell .cellStone.stable", {
            spriteFrames: 4,
            framesOrder: [0, 1, 2, 1],
            delay: [3e3, 1e4],
            duration: 600,
            playRound: !0
        }), FigureRules.add(".morphColorAnimation.changeColor", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 84,
            "background-height": 84,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode20/morphColorBoom.da7fa51164.png",
            width: 74 / 70 * Config.cellWidth,
            height: 74 / 70 * Config.cellHeight,
            "margin-left": -2 / 70 * Config.cellWidth,
            spriteFrames: 4,
            duration: 440
        }), FigureRules.add(".bomb .cellStone", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 163,
            "background-height": 159,
            width: 163 / 70 * Config.cellWidth,
            height: 159 / 70 * Config.cellHeight,
            "margin-left": -46 / 70 * Config.cellWidth,
            "margin-top": -44 / 70 * Config.cellHeight
        }), FigureRules.add(".color_Y.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsY.5e90f7f752.png"
        }), FigureRules.add(".color_R.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsR.503f4407cc.png"
        }), FigureRules.add(".color_W.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsW.bc5370166d.png"
        }), FigureRules.add(".color_P.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsP.3e58acf788.png"
        }), FigureRules.add(".color_B.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsB.9b9edcd550.png"
        }), FigureRules.add(".color_G.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsG.0fea87fecb.png"
        }), FigureRules.add(".color_C.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsC.c4ff4adc36.png"
        }), FigureRules.add(".color_A.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsA.086ca89152.png"
        }), FigureRules.add(".color_O.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsO.aa2b86c4ec.png"
        }), FigureRules.add(".bomb .cellStone.stable", {
            spriteFrames: 7,
            framesOrder: [0, 1, 2, 3, 2, 1, 0],
            duration: 1200,
            playRound: !0
        }), FigureRules.add(".bomb .cellStone.bombExpand", {
            "background-position-x": 652,
            spriteFrames: 6,
            lastFrame: 5,
            duration: 500
        }), FigureRules.add(".bomb .movesToExplode", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 28,
            "background-height": 24,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/life.b785891cef.png",
            width: .4 * Config.cellWidth,
            height: 24 / 70 * Config.cellHeight,
            "margin-left": 41 / 70 * Config.cellWidth,
            "margin-top": 41 / 70 * Config.cellHeight,
            font: "lv" === locale ? "bold " + 15 / 70 * Config.cellWidth + "px/" + 26 / 70 * Config.cellWidth + "px 'HVDComicSerifPro'" : "pl" === locale ? "bold " + 15 / 70 * Config.cellWidth + "px/" + 26 / 70 * Config.cellWidth + "px 'HVDComicSerifPro'" : "bold " + 13 / 70 * Config.cellWidth + "px/" + 24 / 70 * Config.cellWidth + "px 'ObelixPro'",
            "text-left": 10 / 70 * Config.cellWidth,
            "text-top": 19 / 70 * Config.cellHeight,
            color: "#FFFABB"
        }), FigureRules.add(".bomb .movesToExplodeTwoDigits.movesToExplode", {
            "text-left": 5 / 70 * Config.cellWidth
        }), FigureRules.add(".bomb.bombSoonExplode .movesToExplode", {
            color: "#FF0000"
        }), FigureRules.add(".bombDangerHighlight", {
            animation: {
                params: {
                    opacity: [1, .1, 1]
                },
                duration: 800,
                playRound: !0
            }
        }), FigureRules.add(".bombMoves.hidden", {
            opacity: 0
        }), FigureRules.add(".bomb.bombSoonExplode .bombDangerHighlight", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 28,
            "background-height": 24,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombDangerHighlight.0c03088172.png",
            width: .4 * Config.cellWidth,
            height: 24 / 70 * Config.cellHeight,
            "margin-left": 41 / 70 * Config.cellWidth,
            "margin-top": 41 / 70 * Config.cellHeight
        }), FigureRules.add(".bomb.removeBomb", {
            animation: {
                params: {
                    opacity: [1, 0],
                    scale: [1, .1]
                },
                duration: 300,
                playRound: !0
            }
        }), FigureRules.add(".bomb.bombExpandSpots", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 420,
            "background-height": 363,
            width: 6 * Config.cellWidth,
            height: 363 / 70 * Config.cellHeight,
            animation: {
                params: {
                    "margin-top": [0, 200]
                },
                duration: 8e3
            }
        }), FigureRules.add(".bomb.bombExpandSpots .cellStone", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 420,
            "background-height": 363,
            width: 6 * Config.cellWidth,
            height: 363 / 70 * Config.cellHeight,
            "margin-left": -2.5 * Config.cellWidth,
            "margin-top": -146 / 70 * Config.cellHeight
        }), FigureRules.add(".color_Y.bombExpandSpots.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsYSpots.39d226bc1e.png"
        }), FigureRules.add(".color_R.bombExpandSpots.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsRSpots.07c71931dd.png"
        }), FigureRules.add(".color_W.bombExpandSpots.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsWSpots.fe2f183b38.png"
        }), FigureRules.add(".color_P.bombExpandSpots.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsPSpots.6b1b2c6fa9.png"
        }), FigureRules.add(".color_B.bombExpandSpots.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsBSpots.c4ba128a1e.png"
        }), FigureRules.add(".color_G.bombExpandSpots.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsGSpots.3c796312e9.png"
        }), FigureRules.add(".color_C.bombExpandSpots.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsCSpots.0f824cf3b8.png"
        }), FigureRules.add(".color_A.bombExpandSpots.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsASpots.837c643224.png"
        }), FigureRules.add(".color_O.bombExpandSpots.bomb .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode10/bombsOSpots.3711bcf7e0.png"
        }), FigureRules.add(".bomb.bombExpandSpots .cellStone.bombExpandSpotsAnimation", {
            spriteFrames: 3,
            lastFrame: 2,
            duration: 180
        }), FigureRules.add(".bomb .cellStone.deformateUp", {
            animation: {
                params: {
                    "scale-y": [1, .9, 1],
                    "margin-top": [-44, -50, -44]
                },
                duration: 400
            }
        }), FigureRules.add(".bomb .cellStone.deformateDown", {
            animation: {
                params: {
                    "scale-y": [1, .9, 1],
                    "margin-top": [-44, -38, -44]
                },
                duration: 400
            }
        }), FigureRules.add(".bomb .cellStone.deformateLeft", {
            animation: {
                params: {
                    "scale-x": [1, .9, 1],
                    "margin-left": [-46, -40, -46]
                },
                duration: 400
            }
        }), FigureRules.add(".bomb .cellStone.deformateRight", {
            animation: {
                params: {
                    "scale-x": [1, .9, 1],
                    "margin-left": [-46, -52, -46]
                },
                duration: 400
            }
        }), FigureRules.add(".cellStone.roll", {
            "background-image": ""
        }), FigureRules.add(".attribute", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 80,
            "background-height": 80,
            width: Config.cellWidth,
            height: Config.cellHeight
        }), FigureRules.add(".attribute_key", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode14/jellies.11bf6f32a7.png"
        }), FigureRules.add(".color_A .attribute_key", {
            "background-position-x": 0
        }), FigureRules.add(".color_C .attribute_key", {
            "background-position-x": 80
        }), FigureRules.add(".color_G .attribute_key", {
            "background-position-x": 160
        }), FigureRules.add(".color_O .attribute_key", {
            "background-position-x": 240
        }), FigureRules.add(".color_R .attribute_key", {
            "background-position-x": 320
        }), FigureRules.add(".episode_thumbelina .cellStone.roll", {
            "background-image": ""
        }), FigureRules.add(".episode_thumbelina .attribute", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 80,
            "background-height": 80,
            width: Config.cellWidth,
            height: Config.cellHeight
        }), FigureRules.add(".episode_thumbelina .attribute_key", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episodethumbelina/jellies.d60921bc8a.png"
        }), FigureRules.add(".episode_thumbelina .color_A .attribute_key", {
            "background-position-x": 0
        }), FigureRules.add(".episode_thumbelina .color_C .attribute_key", {
            "background-position-x": 80
        }), FigureRules.add(".episode_thumbelina .color_G .attribute_key", {
            "background-position-x": 160
        }), FigureRules.add(".episode_thumbelina .color_O .attribute_key", {
            "background-position-x": 240
        }), FigureRules.add(".episode_thumbelina .color_R .attribute_key", {
            "background-position-x": 320
        }), FigureRules.add(".episode_alice .cellStone.roll", {
            "background-image": ""
        }), FigureRules.add(".episode_alice .attribute", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 70,
            "background-height": 70,
            width: Config.cellWidth,
            height: Config.cellHeight
        }), FigureRules.add(".episode_alice .attribute_key", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episodealice/jellies.33344d6c78.png"
        }), FigureRules.add(".episode_alice .color_A .attribute_key", {
            "background-position-x": 0
        }), FigureRules.add(".episode_alice .color_G .attribute_key", {
            "background-position-x": 70
        }), FigureRules.add(".episode_alice .color_R .attribute_key", {
            "background-position-x": 140
        }), FigureRules.add(".decorator_mouse", {
            "background-position-y": 0,
            "background-width": 78,
            "background-height": 78,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode27/ladybug.51534ab3b1.png",
            width: Config.cellWidth,
            height: Config.cellHeight
        }), FigureRules.add(".decorator_mouse.stable.level_2", {
            "background-position-x": 0
        }), FigureRules.add(".move_mouse.level_2", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 78,
            "background-height": 78,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode27/ladybug.51534ab3b1.png",
            width: Config.cellHeight,
            height: Config.cellHeight,
            spriteFrames: 4,
            duration: 260,
            playRound: !0
        }), FigureRules.add(".decorator_mouse.stable.level_1", {
            "background-position-x": 312
        }), FigureRules.add(".move_mouse.level_1", {
            "background-position-x": 312,
            "background-position-y": 0,
            "background-width": 78,
            "background-height": 78,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode27/ladybug.51534ab3b1.png",
            width: Config.cellHeight,
            height: Config.cellHeight,
            spriteFrames: 4,
            duration: 260,
            playRound: !0
        }), FigureRules.add(".mouseCollect, .changeLevel", {
            "background-position-x": 312,
            "background-position-y": 0,
            "background-width": 78,
            "background-height": 78,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode27/ladybug.51534ab3b1.png",
            width: Config.cellHeight,
            height: Config.cellHeight
        }), FigureRules.add(".owlBody", {
            "background-position-y": 0,
            "background-width": 140,
            "background-height": 140,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode30/owl.f3e3c473b8.png",
            width: 2 * Config.cellWidth,
            height: 2 * Config.cellHeight
        }), FigureRules.add(".owlBody.less100PercentLife", {
            "background-position-x": 0
        }), FigureRules.add(".owlBody.less50PercentLife", {
            "background-position-x": 140
        }), FigureRules.add(".owlBody.less25PercentLife", {
            "background-position-x": 280
        }), FigureRules.add(".owlBg", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 15,
            "background-height": 35,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode30/beak.630afcb147.png",
            width: 15 / 70 * Config.cellWidth,
            height: .5 * Config.cellHeight,
            "margin-left": .9 * Config.cellWidth,
            "margin-top": 40 / 70 * Config.cellHeight
        }), FigureRules.add(".owlBg.less100PercentLife", {
            spriteFrames: 11,
            delay: [4e3, 8e3],
            framesOrder: [0, 1, 2, 4, 3, 4, 3, 4, 2, 1, 0],
            duration: 2200,
            playRound: !0
        }), FigureRules.add(".owlBg.owlAngry", {
            spriteFrames: 7,
            framesOrder: [0, 1, 2, 3, 2, 1, 0],
            duration: 1e3,
            playRound: !1
        }), FigureRules.add(".owlZzz", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 24,
            "background-height": 25,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode30/zzz.06e130d950.png",
            width: 24 / 70 * Config.cellWidth,
            height: 25 / 70 * Config.cellHeight,
            "margin-left": 116 / 70 * Config.cellWidth
        }), FigureRules.add(".owlZzz.less100PercentLife", {
            spriteFrames: 5,
            duration: 800,
            delay: [1500, 2e3],
            playRound: !0
        }), FigureRules.add(".owlLifeText", {
            "background-width": 63,
            "background-height": 39,
            "background-position-x": 0,
            "background-position-y": 0,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode30/owlLifeBlock.eab85f562f.png",
            width: .9 * Config.cellWidth,
            height: 39 / 70 * Config.cellHeight,
            "margin-left": 68 / 70 * Config.cellWidth,
            "margin-top": 1.4 * Config.cellHeight
        }), FigureRules.add(".currentLife", {
            width: 25 / 70 * Config.cellWidth,
            height: 26 / 70 * Config.cellHeight,
            font: "lv" === locale ? "bold " + 19 / 70 * Config.cellWidth + "px/" + 30 / 70 * Config.cellWidth + "px HVDComicSerifPro" : "pl" === locale ? "bold " + 19 / 70 * Config.cellWidth + "px/" + 30 / 70 * Config.cellWidth + "px HVDComicSerifPro" : "bold " + 15 / 70 * Config.cellWidth + "px/" + 26 / 70 * Config.cellWidth + "px ObelixPro",
            color: "#fff4c2",
            "text-left": 30 / 70 * Config.cellWidth,
            "text-top": 27 / 70 * Config.cellHeight
        }), FigureRules.add(".color_t .cellStone", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode30/coffee.52cf1b93af.png",
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 74,
            "background-height": 74,
            width: 74 / 70 * Config.cellWidth,
            height: 74 / 70 * Config.cellHeight,
            "margin-left": -2 / 70 * Config.cellWidth,
            "margin-top": -2 / 70 * Config.cellHeight
        }), FigureRules.add(".fish12, .fish13, .fish14", {
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode40/cake.ccd61f9b29.png",
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 75,
            "background-height": 74,
            width: 75 / 70 * Config.cellWidth,
            height: 74 / 70 * Config.cellHeight,
            "margin-left": -1 / 70 * Config.cellWidth
        }), FigureRules.add(".fish13", {
            "background-position-x": 75
        }), FigureRules.add(".fish14", {
            "background-position-x": 150
        }), FigureRules.add(".strawBerryCell", {
            "background-position-x": 0,
            "background-position-y": 0,
            "background-width": 90,
            "background-height": 90,
            "background-image": "//www21orangeapps.cdnvideo.ru/candyvalley/candyvalley/site/img/snowball/episode45/strawberry.8f7d281e8f.png",
            width: Config.cellWidth,
            height: Config.cellHeight,
            spriteFrames: 5,
            framesOrder: [0, 1, 2, 1, 0],
            delay: [3e3, 1e4],
            lastFrame: 0,
            duration: 600,
            playRound: !0
        }), FigureRules.add(".strawBerryCell.life3", {
            "background-position-x": 0
        }), FigureRules.add(".strawBerryCell.life2", {
            "background-position-x": 270
        }), FigureRules.add(".strawBerryCell.life1", {
            "background-position-x": 540
        })
    };
    var BonusWorldIntroduceWindow = TWindow.extend({
            forceId: 29,
            templateClass: ".bonusWorldIntroduceWindow_template",
            events: {
                "click .close": "close",
                "click .startBonusWorld": "startBonusWorld"
            },
            onClose: function() {
                user.set("shownForces", user.get("shownForces") | 1 << this.forceId)
            },
            startBonusWorld: function() {
                this.close(), episodeView.gotoBonusWorld()
            },
            onOpen: function() {
                var e = Config.bonusWorld.name;
                this.$el.removeClass().addClass("window"), this.$el.addClass("bonusWorldEpisode"), this.$el.addClass("episode_" + e), this.$(".newEpisodeName").html(messages[e + "NewBonusWorldName"]), this.$(".newEpisodeText").html(messages[e + "NewBonusWorldText"]), TWindow.prototype.onOpen.call(this)
            }
        }),
        ChainBlockedDecorator = BlockedDecorator.extend({
            initialize: function() {
                this.set("name", "chain"), this.setLevel(ChainBlockedDecorator.SYMBOL), 1 == this.get("level") && this.set("oneTimeRemove", !0), Decorator.prototype.initialize.call(this)
            },
            animateRemoval: function() {
                application.playSound("blockedDecoratorRemove"), gameView.fallDownExplode(this.getDiv(), this.getAnimatedPiecesAmount(), this.getAnimatedPiecesClass()), Decorator.prototype.animateRemoval.call(this, this.getDiv())
            }
        }, {
            SYMBOL: "1"
        }),
        CakeCell = function(e, i) {
            BaseCell.call(this, e, i), this.color = "none", this.movable = !1, this.removeOnRemoveNear = !0, this.life = 2, this.removeLifeAnimation = 0, this.scoresId = "cake", this.sizeInCells = 2
        };
    _.extend(CakeCell.prototype, BaseCell.prototype);
    var CakeLUCell = function(e, i) {
        CakeCell.call(this, e, i), this.dx = 0, this.dy = 0, this.mainPart = !0
    };
    CakeLUCell.prototype = CakeCell.prototype;
    var CakeRUCell = function(e, i) {
        CakeCell.call(this, e, i), this.dx = 1, this.dy = 0
    };
    CakeRUCell.prototype = CakeCell.prototype;
    var CakeLDCell = function(e, i) {
        CakeCell.call(this, e, i), this.dx = 0, this.dy = 1
    };
    CakeLDCell.prototype = CakeCell.prototype;
    var CakeRDCell = function(e, i) {
        CakeCell.call(this, e, i), this.dx = 1, this.dy = 1
    };
    CakeRDCell.prototype = CakeCell.prototype, CakeCell.prototype.isDead = function() {
        for (var e = 0; 2 > e; e++)
            for (var i = 0; 2 > i; i++)
                if (0 != Game.field[i + this.y - this.dy][e + this.x - this.dx].life || 0 != Game.field[i + this.y - this.dy][e + this.x - this.dx].removeLifeAnimation) return !1;
        return !0
    }, CakeCell.prototype.highlight = function(e) {
        for (var i = 0; 2 > i; i++)
            for (var t = 0; 2 > t; t++) BaseCell.prototype.highlight.call(Game.field[t + this.y - this.dy][i + this.x - this.dx], e)
    }, CakeCell.prototype.animateTakeLife = function(e, i) {
        e.$div.removeClass("cakeLife0"), e.$div.removeClass("cakeLife1"), e.$div.removeClass("cakeLife2"), e.$div.addClass("cakeLife" + this.life), application.playSound("cakeCellTakeLife"), i()
    }, CakeCell.prototype.getDieDiv = function() {
        return createByTemplate(".invisible .dieCake")
    }, CakeCell.prototype.remove = function() {
        this.life > 0 && (this.life--, this.animateTakeLife(Game.field[this.y][this.x], Game.animate(function() {
            if (this.isDead())
                for (var e = 0; 2 > e; e++)
                    for (var i = 0; 2 > i; i++) BaseCell.prototype.executeRemove.call(Game.field[i + this.y - this.dy][e + this.x - this.dx], !0)
        }, this)))
    }, CakeCell.prototype.getTemplateClass = function() {
        return "cakeCell"
    }, CakeCell.prototype.createDiv = function() {
        var e = BaseCell.prototype.createDiv.call(this);
        return e.addClass("cakeType_" + this.dx + "_" + this.dy).addClass("cakeLife" + this.life), e
    };
    var CollectComplexTask = Task.extend({
        initialize: function() {
            this.set("event", "removedItem"), this.set("type", "CollectComplexTask"), this.set("taskName", this.get("description").taskName), this.set("parts", this.get("description").parts);
            var e = {};
            this.get("parts").split("").forEach(function(i) {
                e[i] = !1
            }), this.set("leftParts", e), this.set("amount", _.keys(e).length), this.set("collectedAmount", 0), Task.prototype.initialize.call(this)
        },
        isWin: function() {
            var e = this.get("leftParts");
            for (key in e)
                if (!e[key]) return !1;
            return !0
        },
        collectPartAnimation: function(e, i, t, o, s) {
            this.animateCollect(i, t, Game.animate(function() {
                this.trigger("collectPart", this, s), this.isWin() && this.set("completed", !0)
            }, this), void 0, o)
        },
        tick: function(e) {
            var i = e.char;
            if (0 == this.get("leftParts")[i]) {
                this.get("leftParts")[i] = !0;
                var t = ".charcode_" + i.charCodeAt(0),
                    o = this.$div.find(t);
                this.set("collectedAmount", this.get("collectedAmount") + 1), this.collectPartAnimation(e, e.$div, GameScores.complexTask, o, t)
            }
        }
    });
    CollectComplexTask.prototype.collectPartAnimation = function(e, i, t, o, s) {
        this.animateCollect(i, 0, t, Game.animate(), _.bind(function() {
            this.trigger("collectPart", this, s), this.isWin() && this.set("completed", !0)
        }, this), !1, 1, o)
    };
    var AdditionalLivesWindow = TWindow.extend({
            templateClass: ".additionalLivesWindow_template",
            events: {
                "click .close": "close",
                "click .buy": "buy"
            },
            buy: function() {
                var e = Config.goods.additionalLifes;
                user.set({
                    coins: new ObscureNumber(user.get("coins").get() - e.coinsPrice)
                }, {
                    validate: !0
                }) ? (goods.goodBuyed(e.productId, e.workDays), callServiceAddInQueue("../../../levelbase/src/services/additionallives.php"), user.set("lives", Config.maxLives), this.render()) : (this.close(), new AdditionalLivesWindow)
            },
            render: function() {
                var e = Config.goods.additionalLifes;
                this.$(".price").html(e.coinsPrice), goods.checkProduct("additionalLifes") ? (goods.findWhere({
                    name: "additionalLifes"
                }).refresh(!0), this.$el.removeClass("notActive").addClass("active")) : this.$el.removeClass("active").addClass("notActive")
            },
            onOpen: function() {
                this.render(), TWindow.prototype.onOpen.call(this)
            }
        }),
        AdditionalLivesFreeWindow = TWindow.extend({
            templateClass: ".additionalLivesWindow_template",
            events: {
                "click .close": "close",
                "click .buy": "close"
            },
            onClose: function() {
                goods.goodBuyed(Config.goods.additionalLifes.productId, 1), callServiceAddInQueue("../../../levelbase/src/services/additionallivespromo.php"), user.set("lives", Config.maxLives), new AdditionalLivesWindow
            },
            onOpen: function() {
                this.$el.addClass("promo"), this.$(".additionalLivesText").html(messages.additionalLivesPromoText), this.$(".additionalLivesTitle").html(messages.additionalLivesPromoTitle), this.$(".oneWindowBtn").html(messages.additionalLivesPromoButton), TWindow.prototype.onOpen.call(this)
            }
        }),
        ABTesting = Backbone.Model.extend({
            getGroup: function() {
                if ("undefined" != typeof ABTestingGroups && ABTestingGroups.networks.indexOf(network) >= 0)
                    for (var e = user.get("userId") % 100, i = 0; i < ABTestingGroups.groups.length; i++)
                        if (ABTestingGroups.groups[i].diap[0] <= e && ABTestingGroups.groups[i].diap[1] >= e) return ABTestingGroups.groups[i];
                return !1
            }
        });
    Application.on("ready", function() {
        new ABTesting
    }), ABTesting.prototype.initialize = function() {
        var e = this.getGroup();
        4 === e.id && (Config.punish.minLevel = 1e6)
    };
    var Gifts = Backbone.Model.extend({
            defaults: {
                canSendSelf: !0,
                canSendNotInApp: !0,
                available: !1
            },
            calcUsersForGifts: function() {
                var e;
                e = this.get("canSendNotInApp") ? _.clone(allFriendsIds) : _.clone(friendsInAppIds), this.get("canSendSelf") && e.unshift(user.get("userId")), this.set("usersForGifts", e)
            },
            addProductListener: function(e, i) {
                void 0 === this.buyQueue[prices[e].product] && (this.buyQueue[prices[e].product] = []), this.buyQueue[prices[e].product].push({
                    userId: i,
                    transactionId: Math.floor(1e6 * Math.random())
                })
            },
            processOrder: function(e, i) {
                e.userId == user.get("userId") ? Gifts.receiveGift(i) : ("odgifts" != i.buyType && new GiftSendedWindow({
                    gift: i,
                    userId: e.userId
                }), callServiceAddInQueue("../../../base/src/services/addgiftmessage.php", {
                    uid: i.uid,
                    friend: e.userId,
                    transactionId: e.transactionId
                }))
            },
            processCoinsGift: function(e, i) {
                var t = Gifts.findGiftById(e);
                this.processOrder({
                    userId: i,
                    transactionId: Math.floor(1e6 * Math.random())
                }, t)
            },
            initialize: function() {
                this.buyQueue = {}, this.calcUsersForGifts(), this.get("usersForGifts").length > 0 && (this.listeners = {}, user.on("buyProduct", function(e) {
                    if ("gift" == e.type && this.buyQueue[e.product] && this.buyQueue[e.product].length) {
                        var i = !1;
                        for (var t in prices)
                            if (prices[t].product == e.product) {
                                i = t;
                                break
                            }
                        var o = Gifts.findGiftById(i);
                        if (o !== !1) {
                            var s = this.buyQueue[e.product].pop();
                            this.processOrder(s, o)
                        }
                    }
                }, this), socialNetwork.on("success_odGiftPayment", function(e) {
                    var i = Gifts.findGiftByOdGiftId(e.giftId);
                    if (i !== !1) {
                        var t = Math.floor(1e6 * Math.random());
                        callServiceAddInQueue("../../../base/src/services/buyodgift.php", {
                            giftId: i.odGiftId,
                            payed: i.odGiftPrice,
                            giftTo: e.userId,
                            transactionId: t
                        }), this.processOrder({
                            userId: e.userId,
                            transactionId: t
                        }, i)
                    }
                }, this), this.controls = [], new GiftsView({
                    model: this
                }), this.set("available", !0))
            },
            findDivId: function(e) {
                for (var i = 0; i < this.controls.length; i++)
                    if (this.controls[i].div == e) return i;
                return !1
            },
            getStickerGifts: function(e) {
                var i = 0;
                e == user.get("userId") ? i = user.get("gifts") : friends.get(e) && (i = friends.get(e).get("gifts"));
                for (var t = []; i > 0;) {
                    var o = Gifts.findGiftByUid(i % 100);
                    if (o !== !1) {
                        for (var s = !1, n = 0; n < t.length; n++)
                            if (t[n].id == o.id) {
                                s = !0;
                                break
                            }
                        s || t.push(o)
                    }
                    i = Math.floor(i / 100)
                }
                return t
            },
            addDiv: function(e, i) {
                this.findDivId(e) === !1 && (this.controls.push({
                    div: e,
                    userId: i
                }), this.trigger("divAdded", e, i))
            },
            refreshUserStrickerGifts: function() {
                for (var e = 0; e < this.controls.length; e++) this.controls[e].userId == user.get("userId") && this.trigger("renderGifts", this.controls[e].div, this.controls[e].userId)
            },
            removeDiv: function(e) {
                var i = this.findDivId(e);
                if (i !== !1) {
                    for (var t = this.controls[i].userId, o = i; o < this.controls.length - 1; o++) this.controls[o] = this.controls[o + 1];
                    this.trigger("divRemoved", e, t)
                }
            }
        }, {
            findGift: function(e, i) {
                for (var t = 0; t < Config.gifts.blocks.length; t++)
                    for (var o = 0; o < Config.gifts.blocks[t].gifts.length; o++)
                        if (Config.gifts.blocks[t].gifts[o][e] == i) return Config.gifts.blocks[t].gifts[o];
                return !1
            },
            findGiftById: function(e) {
                return Gifts.findGift("id", e)
            },
            findGiftByUid: function(e) {
                return Gifts.findGift("uid", e)
            },
            findGiftByOdGiftId: function(e) {
                return Gifts.findGift("odGiftId", e)
            },
            receiveGift: function(e) {
                application.playSound("giftReceived"), "sticker" == e.type && (user.set("gifts", (100 * user.get("gifts") + e.uid) % 1e6), gifts.refreshUserStrickerGifts()), e.onReceive && e.onReceive()
            }
        }),
        GiftsView = Backbone.View.extend({
            sendGiftWindow: function(e) {
                new SendGiftWindow({
                    users: this.model.get("usersForGifts"),
                    selectedUser: e
                })
            },
            renderGifts: function(e, i) {
                e.find(".gifts").remove();
                for (var t = this.model.getStickerGifts(i), o = $('<div class="gifts"><div class="giftsContent"></div></div>'), s = 0; s < t.length; s++) {
                    var n = $('<div class="gift"></div>');
                    n.addClass(t[s].id), o.find(".giftsContent").append(n)
                }
                o.addClass("amountGifts_" + t.length), e.append(o)
            },
            initialize: function() {
                this.model.on("renderGifts", this.renderGifts, this), this.model.on("divAdded", function(e, i) {
                    (this.model.get("usersForGifts").indexOf(i) >= 0 || void 0 === i) && (e.on("click", _.bind(function() {
                        this.sendGiftWindow(i)
                    }, this)), void 0 !== i && (e.on("mouseover", function() {
                        e.addClass("sendGift")
                    }), e.on("mouseout", function() {
                        e.removeClass("sendGift")
                    }))), void 0 !== i && this.renderGifts(e, i)
                }, this), this.model.on("divRemoved", function(e, i) {
                    e.off("click"), void 0 !== i && (e.find(".gifts").remove(), e.off("mouseover"), e.off("mouseout"))
                }, this)
            }
        }),
        SendGiftWindow = TWindow.extend({
            templateClass: ".sendGiftWindow_template",
            events: {
                "click .close": "close",
                "click .changeUser": "unsetUserId",
                "click .selectedUserBlock .photo": "unsetUserId",
                "click .closeSelectUser": "clearSelectUserMask",
                "keyup .selectUserMask": "renderSelectUser"
            },
            setUserId: function(e) {
                this.userId = e;
                var i = users[this.userId].photo;
                users[this.userId].bigPhoto && (i = users[this.userId].bigPhoto), this.$(".selectedUserBlock .photo").html(makeImg(i, Config.gifts.selectedUserPhotoSize)), this.$(".selectedUserBlock .firstName").html(users[this.userId].first_name), this.$(".selectedUserBlock .lastName").html(users[this.userId].last_name), this.$el.addClass("userSelected")
            },
            unsetUserId: function() {
                this.userId = void 0, this.$el.removeClass("userSelected"), this.renderSelectUser()
            },
            clearSelectUserMask: function() {
                "" != this.$(".selectUserMask").val() && (this.$(".selectUserMask").val(""), this.renderSelectUser())
            },
            sendGift: function(e) {
                void 0 !== this.userId ? ("money" == e.buyType && (gifts.addProductListener(e.id, this.userId), showBuy(prices[e.id]), this.close()), "odgifts" == e.buyType && (odBuyGift(e.odGiftId, this.userId), this.close()), "coins" == e.buyType && (this.close(), user.set({
                    coins: new ObscureNumber(user.get("coins") - e.price)
                }, {
                    validate: !0
                }) ? gifts.processCoinsGift(e.id, this.userId) : new SendGiftWindow({
                    selectedUser: this.userId,
                    users: this.options.users
                }))) : (application.playSound("giftUserNotSelected"), this.$(".notSelectedUserText").html(messages.gifts.notSelectedUser).clearQueue().stop().css("opacity", 1).show().delay(1e3).fadeOut(500))
            },
            renderSelectUser: function() {
                this.$(".selectUserContent").empty();
                var e = this.$(".selectUserMask").val().toUpperCase(),
                    i = 0;
                _.each(this.options.users, _.bind(function(t) {
                    if (!(i >= 30 && window.mobile || i >= 300)) {
                        var o = (users[t].first_name + " " + users[t].last_name).toUpperCase(),
                            s = (users[t].last_name + " " + users[t].first_name).toUpperCase();
                        if (o.indexOf(e) >= 0 || s.indexOf(e) >= 0) {
                            i++;
                            var n = $(".invisible.sendGiftWindowTemplate .selectUser").clone();
                            n.find(".photo").html(makeImg(users[t].photo, Config.gifts.selectUserPhotoSize)), n.find(".firstName").html(users[t].first_name), n.find(".lastName").html(users[t].last_name), n.find(".selectHim").html(messages.gifts.selectHim), n.find(".selectHim").on("click", _.bind(function() {
                                this.setUserId(t)
                            }, this)), this.$(".selectUserContent").append(n)
                        }
                    }
                }, this))
            },
            selectTab: function(e) {
                this.$(".giftsSubBlock").hide(), this.$(".giftsSubBlock." + e).show(), this.$(".giftsTab.selected").removeClass("selected"), this.$(".giftsTab." + e).addClass("selected")
            },
            onOpen: function() {
                if (this.$(".windowTitle").html(messages.gifts.windowTitle), this.$(".changeUser").html(messages.gifts.changeUser), this.$(".giftFor").html(messages.gifts.giftFor), this.$(".selectUserMask").attr("placeholder", messages.gifts.findUser), Config.gifts.tabVersion && this.$el.addClass("tabVersion"), void 0 !== this.options.selectedUser ? this.setUserId(this.options.selectedUser) : this.unsetUserId(), this.$(".giftsBlock").empty(), Config.gifts.tabVersion ? this.$(".giftsTabs").show().empty() : this.$(".giftsTabs").remove(), needCalcOdGiftsPrices = [], _.each(Config.gifts.blocks, _.bind(function(e) {
                        var i = $(".invisible.sendGiftWindowTemplate .giftsSubBlock").clone();
                        i.find(".title").html(messages.gifts[e.id]), i.addClass(e.id), i.find(".content").empty();
                        var t = 0,
                            o = !1;
                        _.each(e.gifts, _.bind(function(e, t) {
                            var o = $(".invisible.sendGiftWindowTemplate .gift").clone();
                            o.addClass(e.id).addClass("giftNumber_" + t), "money" == e.buyType ? (o.find(".price").html(prices[e.id].desc.price), o.find(".name").html(prices[e.id].desc.product)) : o.find(".name").html(messages.gifts[e.id]), "coins" == e.buyType && (o.find(".price").html($(".invisible.sendGiftWindowTemplate .coinsPriceTemplate").html()), o.find(".coinsPrice").html(e.price)), "odgifts" == e.buyType && (needCalcOdGiftsPrices.push({
                                div: o.find(".price"),
                                giftId: e.odGiftId
                            }), o.find(".price").html(e.odGiftPrice + " ОК")), o.on("click", _.bind(function() {
                                this.sendGift(e)
                            }, this)), "sticker" == e.type && (o.on("mouseover", _.bind(function() {
                                this.$(".selectedUserBlock").addClass(e.id)
                            }, this)), o.on("mouseout", _.bind(function() {
                                this.$(".selectedUserBlock").removeClass(e.id)
                            }, this))), i.find(".content").append(o)
                        }, this)), this.$(".giftsBlock").append(i), void 0 === e.scrollStep && (e.scrollStep = i.find(".content .gift").width() + parseInt(i.find(".content .gift").css("margin-left")) + parseInt(i.find(".content .gift").css("margin-right")));
                        var s, n, a = i.find(".content").width() - i.find(".holder").width();
                        a = Math.floor((a + e.scrollStep / 2) / e.scrollStep);
                        var r = function() {
                            s = t >= 0 ? !1 : !0, n = -a >= t ? !1 : !0, s ? i.find(".leftArrow").removeClass("disabled").addClass("enabled") : i.find(".leftArrow").addClass("disabled").removeClass("enabled"), n ? i.find(".rightArrow").removeClass("disabled").addClass("enabled") : i.find(".rightArrow").addClass("disabled").removeClass("enabled")
                        };
                        r();
                        var l = !1,
                            d = function() {
                                if (!l && o !== !1) {
                                    if ("+" == o) {
                                        if (!s) return;
                                        t++
                                    } else {
                                        if (!n) return;
                                        t--
                                    }
                                    r(), l = !0, i.find(".content").ourAnimate({
                                        left: o + "=" + e.scrollStep + "px"
                                    }, 300, "linear", function() {
                                        l = !1, d()
                                    })
                                }
                            };
                        i.find(".leftArrow").on("mousedown", function() {
                            o = "+", d()
                        }), i.find(".rightArrow").on("mousedown", function() {
                            o = "-", d()
                        }), i.find(".leftArrow").on("mouseout", function() {
                            o = !1
                        }), i.find(".leftArrow").on("mouseup", function() {
                            o = !1
                        }), i.find(".rightArrow").on("mouseout", function() {
                            o = !1
                        }), i.find(".rightArrow").on("mouseup", function() {
                            o = !1
                        }), Config.gifts.tabVersion && ($tab = $(".invisible.sendGiftWindowTemplate .giftsTab").clone(), $tab.addClass(e.id), $tab.html(messages.gifts[e.id]), $tab.on("click", _.bind(function() {
                            this.selectTab(e.id)
                        }, this)), this.$(".giftsTabs").append($tab))
                    }, this)), needCalcOdGiftsPrices.length) {
                    for (var e = [], i = 0; i < needCalcOdGiftsPrices.length; i++) e.push(needCalcOdGiftsPrices[i].giftId);
                    FAPI.Client.call({
                        method: "presents.get",
                        present_ids: e.join(","),
                        fields: "present.price"
                    }, function(e, i) {
                        if ("ok" == e)
                            for (var t = 0; t < i.presents.length; t++)
                                for (var o = 0; o < needCalcOdGiftsPrices.length; o++)
                                    if (i.presents[t].present_type_ref.indexOf(needCalcOdGiftsPrices[o].giftId) >= 0) {
                                        var s = Gifts.findGiftByOdGiftId(needCalcOdGiftsPrices[o].giftId);
                                        s.odGiftPrice = i.presents[t].price, s.odGiftPrice > 0 ? needCalcOdGiftsPrices[o].div.html(s.odGiftPrice + " ОК") : needCalcOdGiftsPrices[o].div.html("бесплатно");
                                        break
                                    }
                    })
                }
                Config.gifts.tabVersion && this.selectTab(Config.gifts.blocks[0].id)
            }
        }),
        GiftSendedWindow = TWindow.extend({
            templateClass: ".giftSendedWindow_template",
            onOpenSound: "giftSended",
            onClose: function() {
                socialNetwork.sendRequest({
                    type: "giftSended",
                    userIds: this.options.userId,
                    message: sprintf(messages.gifts.sendedRequest[user.get("gender")], {
                        giftName: this.giftName
                    })
                })
            },
            onOpen: function() {
                this.giftName = "money" == this.options.gift.buyType ? prices[this.options.gift.id].desc.product : messages.gifts[this.options.gift.id], this.$(".windowTitle").html(messages.gifts.sendedWindowTitle), this.$(".windowText").html(messages.gifts.sendedWindowText), this.$(".gift").addClass(this.options.gift.id), this.$(".giftName").html(this.giftName), this.$(".firstName").html(users[this.options.userId].first_name), this.$(".lastName").html(users[this.options.userId].last_name);
                var e = users[this.options.userId].photo;
                users[this.options.userId].bigPhoto && (e = users[this.options.userId].bigPhoto), this.$(".photo").html(makeImg(e, Config.gifts.sendedWindowPhotoSize))
            }
        }),
        gifts;
    Application.on("ready", function() {
        if (void 0 === Config.gifts.networks || Config.gifts.networks.indexOf(network) >= 0) {
            gifts = new Gifts(Config.gifts.params), application.friendsPanelView.friendsOnPanel.on("renderNewElement", function(e, i) {
                void 0 !== i && gifts.addDiv(e.find(".friendCardPhotoBorder"), i)
            }), application.friendsPanelView.friendsOnPanel.on("removeElement", function(e) {
                gifts.removeDiv(e.find(".friendCardPhotoBorder"))
            }), friends.on("addMapFriend", function(e, i) {
                gifts.addDiv(e, i)
            }), friends.on("removeMapFriend", function(e) {
                gifts.removeDiv(e)
            }), gifts.addDiv($(".userCard"), user.get("userId"));
            var e = $('<div class="givePriceFriends"></div>');
            $("#main").append(e), gifts.addDiv($("#main .givePriceFriends")), application.friendsPanelView.friendsOnPanel.update(), application.friendsView.renderFriends(), application.trigger("giftsAvailable")
        }
    }), Config.gifts = {
        selectedUserPhotoSize: 135,
        selectUserPhotoSize: 30,
        sendedWindowPhotoSize: 73,
        tabVersion: !0,
        networks: ["test", "odnoklassniki", "vkontakte", "mailru"],
        blocks: [{
            id: "giftsBlock1",
            gifts: [{
                id: "gift_sticker7",
                uid: 13,
                type: "sticker",
                buyType: "coins",
                price: 300
            }, {
                id: "gift_sticker8",
                uid: 14,
                type: "sticker",
                buyType: "coins",
                price: 300
            }, {
                id: "gift_sticker1",
                uid: 7,
                type: "sticker",
                buyType: "coins",
                price: 400
            }, {
                id: "gift_sticker2",
                uid: 8,
                type: "sticker",
                buyType: "coins",
                price: 400
            }, {
                id: "gift_sticker3",
                uid: 9,
                type: "sticker",
                buyType: "coins",
                price: 400
            }, {
                id: "gift_sticker5",
                uid: 11,
                type: "sticker",
                buyType: "coins",
                price: 400
            }, {
                id: "gift_sticker10",
                uid: 16,
                type: "sticker",
                buyType: "coins",
                price: 400
            }, {
                id: "gift_sticker4",
                uid: 10,
                type: "sticker",
                buyType: "coins",
                price: 500
            }, {
                id: "gift_sticker11",
                uid: 17,
                type: "sticker",
                buyType: "coins",
                price: 500
            }, {
                id: "gift_sticker6",
                uid: 12,
                type: "sticker",
                buyType: "coins",
                price: 500
            }, {
                id: "gift_sticker9",
                uid: 15,
                type: "sticker",
                buyType: "coins",
                price: 600
            }, {
                id: "gift_sticker12",
                uid: 18,
                type: "sticker",
                buyType: "coins",
                price: 800
            }]
        }, {
            id: "giftsBlock2",
            gifts: [{
                id: "gift_unlimitedLifes",
                uid: 1,
                buyType: "money",
                onReceive: function() {
                    goods.isAlreadyBetter(1, 3) || (goods.goodBuyed(1, 3), callService("../../../levelbase/src/services/giftaction.php", function() {}, function() {}, {
                        goodName: "unlimitedLifes",
                        workDays: 3
                    }))
                }
            }, {
                id: "gift_1000coins",
                uid: 2,
                buyType: "money",
                onReceive: function() {
                    user.set("coins", new ObscureNumber(user.get("coins") + 1e3))
                }
            }, {
                id: "gift_threeDeleteCellPowerUps",
                uid: 3,
                buyType: "money",
                onReceive: function() {
                    user.setPowerUpAmount("deleteCellPowerUp", user.getPowerUpAmount("deleteCellPowerUp") + 3)
                }
            }, {
                id: "gift_threeDeleteColorPowerUp",
                uid: 4,
                buyType: "money",
                onReceive: function() {
                    user.setPowerUpAmount("deleteColorPowerUp", user.getPowerUpAmount("deleteColorPowerUp") + 3)
                }
            }, {
                id: "gift_threeAddBonusPowerUp",
                uid: 5,
                buyType: "money",
                onReceive: function() {
                    user.setPowerUpAmount("addBonusPowerUp", user.getPowerUpAmount("addBonusPowerUp") + 3)
                }
            }, {
                id: "gift_threeDeleteRowPowerUp",
                uid: 6,
                buyType: "money",
                onReceive: function() {
                    user.setPowerUpAmount("deleteRowPowerUp", user.getPowerUpAmount("deleteRowPowerUp") + 3)
                }
            }]
        }]
    };
    var mixTouchEvents = function(e, i) {
        var t = function(e) {
                var i = {
                        mousedown: "touchstart",
                        click: "touchend",
                        mouseup: "touchend",
                        mousemove: "touchmove"
                    },
                    t = e;
                for (var o in i) t = t.replace(o, i[o]);
                return t == e ? void 0 : t
            },
            o = function(e, i) {
                return void 0 != e[i]
            };
        return _.each(e, function(s, n) {
            var a = t(n);
            if (void 0 != a && !o(e, a)) {
                var r = s + "_touch";
                e[a] = r, i[r] = function(e) {
                    i[s].apply(this, _.toArray(arguments)), e.preventDefault()
                }
            }
        }), e
    };
    for (var className in this)(/View$/.test(className) || /Window$/.test(className)) && this[className] && this[className].prototype instanceof Backbone.View && (this[className].prototype.events = mixTouchEvents(this[className].prototype.events, this[className].prototype));
    Application.on("ready", function() {
        function e(e) {
            if ("thz" !== e.type && "offer" !== e.type && user.set("paid", 1, {
                    notSave: !0
                }), user.set({
                    actionName: "$product: " + e.product,
                    actionEpisode: user.get("episode"),
                    actionLevel: user.get("level"),
                    actionPrice: e.price
                }), ("coinsWithGift" === e.type || "coins" === e.type) && user.set("coins", new ObscureNumber(user.get("coins") + e.amount), {
                    notSave: !0
                }), "good" === e.type && goods.goodBuyed(e.goodType), "punish" === e.type && new PunishNowWindow, "bonusLevelTime" === e.type && user.trigger("buyBonusLevelTime"), "bonusLevelRefresh" === e.type && user.trigger("buyBonusLevelRefresh"), "addMoves" === e.type && user.trigger("buyAddMoves"), "offer" === e.type) {
                var i = e.product;
                i = i.substr(i.indexOf("_") + 1), user.trigger("completeOffer", i)
            }
            if ("bundle" === e.type)
                for (var t = 0; t < e.items.length; t++) {
                    var o = e.items[t];
                    switch (o.type) {
                        case "powerUp":
                            user.setPowerUpAmount(o.name, user.getPowerUpAmount(o.name) + o.amount, !0), Game && Game.trigger("powerAmountChanged"), user.set("powerUps", user.calcPowerUps());
                            break;
                        case "good":
                            goods.isAlreadyBetter(o.name, o.amount) || (goods.goodBuyed(Config.goods[o.name].productId, o.amount), callService("../../../levelbase/src/services/giftaction.php", function() {}, function() {}, {
                                goodName: o.name,
                                workDays: o.amount
                            }))
                    }
                }
            user.trigger("buyProduct", e)
        }

        function i() {
            console.log("cancel payment")
        }
        socialNetwork.on("cancel_payment", i), socialNetwork.on("success_payment", e)
    })
}({}, function() {
    return this
}());