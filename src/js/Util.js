/**
 * Created by wiley on 2017/5/20.
 */
var Util = {};

/*提示层*/
var _timer = null;
Util.toast = function (msg, duration) {
    var duration = duration || 2000;
    $('.toast').remove();
    var $div = $("<div class='toast'>" + msg + "</div>");

    $('body').append($div);
    $('.toast').addClass('showAlert');
    clearTimeout(_timer);
    _timer = setTimeout(() => {
        $('.toast').remove();
        _timer = null;
    }, duration);
}

/*alert*/
Util.alert = function (content, cb, confirmText) {
    var confirmText = confirmText || '确定'
    var content = content || "输入点内容"
    var ctrls = '';
    var contentHtml = '';

    // 确定按钮
    ctrls = '<button class="btn-alert">' + confirmText + '</button>'
    contentHtml = _getMsgHtml(content,ctrls)

    $('body').append(contentHtml);

    $(".btn-alert").on("click", function () {
        $(".msg").remove();
        cb && cb()
    })

}

/*confirm*/
Util.confirm = function (opts) {
    var content = opts.content || "请输入内容"
    var ctrls = '';

    // 确定和取消按钮
    ctrls = `<input type="button" class="btn-confirm-sure" value="确定">
             <div class="btn-confirm-line"></div>
             <input type="button" class="btn-confirm-cancel" value="取消">`
    var contentHtml =  _getMsgHtml(content,ctrls)

    $('body').append(contentHtml);

    $(".btn-confirm-sure").on("click", function () {
        $(".msg").remove();
        opts.sureCb && opts.sureCb();
    })

    $(".btn-confirm-cancel").on("click", function () {
        $(".msg").remove();
        opts.cancelCb && opts.cancelCb();
    })

}

/*cookie*/
Util.cookie = function(name, value, options) {
  /*  1.简单写入一条 Cookie 信息
    cookie("user", "baidu");

    2.写入一条 Cookie 信息，并且设置更多选项
    cookie("user", "baidu", {
        expires: 10, // 有效期为 10 天
        path: "/", // 整个站点有效
        domain: "www.baidu2.com", // 有效域名
        secure: true // 加密数据传输
    });
    3.删除Cookie信息：
    cookie("user", null);*/

    // 如果第二个参数存在
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            // 设置失效时间
            options.expires = -1;
        }
        var expires = '';
        // 如果存在事件参数项，并且类型为 number，或者具体的时间，那么分别设置事件
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + options.path : '', // 设置路径
            domain = options.domain ? '; domain=' + options.domain : '', // 设置域
            secure = options.secure ? '; secure' : ''; // 设置安全措施，为 true 则直接设置，否则为空

        // 把所有字符串信息都存入数组，然后调用 join() 方法转换为字符串，并写入 Cookie 信息
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // 如果第二个参数不存在
        var CookieValue = null;
        if (document.cookie && document.cookie != '') {
            var Cookies = document.cookie.split(';');
            for (var i = 0; i < Cookies.length; i++) {
                var Cookie = (Cookies[i] || "").replace( /^\s+|\s+$/g, "");
                if (Cookie.substring(0, name.length + 1) == (name + '=')) {
                    CookieValue = decodeURIComponent(Cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return CookieValue;
    }
};

/*本地存储*/
Util.storage = (function mystorage(){
   /*
    console.log(mystorage.set('tqtest','tqtestcontent'));//存储
    console.log(mystorage.set('tqtest1','newtqtestcontent1'));//修改
    console.log(mystorage.get('tqtest'));//读取
    console.log(mystorage.remove('tqtest'));//删除
    mystorage.clear();//整体清除
   */

    var ms = "mystorage";
    var storage=window.localStorage;

    var set = function(key,value){
        //存储
        var mydata = storage.getItem(ms);
        if(!mydata){
            this.init();
            mydata = storage.getItem(ms);
        }
        mydata = JSON.parse(mydata);
        mydata.data[key] = value;
        storage.setItem(ms,JSON.stringify(mydata));
        return mydata.data;

    };

    var get = function(key){
        //读取
        var mydata = storage.getItem(ms);
        if(!mydata){
            return false;
        }
        mydata = JSON.parse(mydata);

        return mydata.data[key];
    };

    var remove = function(key){
        //读取
        var mydata = storage.getItem(ms);
        if(!mydata){
            return false;
        }

        mydata = JSON.parse(mydata);
        delete mydata.data[key];
        storage.setItem(ms,JSON.stringify(mydata));
        return mydata.data;
    };

    var clear = function(){
        //清除对象
        storage.removeItem(ms);
    };

    var init = function(){
        storage.setItem(ms,'{"data":{}}');
    };

    return {
        set : set,
        get : get,
        remove : remove,
        init : init,
        clear : clear
    };
})();

function _getMsgHtml (content,ctrls) {
    return  `<div class="msg">
                   <div class="pnl">
                      <div class="msg-content">${content}</div>
                      <div class="ctrls tpx">
                           ${ctrls}
                      </div>
                   </div>
                </div>`
}
