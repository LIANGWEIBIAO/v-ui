/**
 * Created by wiley on 2017/5/23.
 */

$(() => {
    var slideBox = $(".v-slide")
    var swiperContainer = $('.swiper-wrapper');
    var swiperPic = $(".swiper-slide")

    //克隆第一个元素到最后
    swiperPic.eq(swiperPic.length - 1).after(swiperPic.eq(0).clone());
    //克隆最后一个元素到前面
    swiperPic.eq(0).before(swiperPic.eq(swiperPic.length - 1).clone());

    //2.获取banner的宽度
    var bannerWidth = slideBox[0].offsetWidth;
    var ContatinerLen = $(".swiper-slide").length+1;
    //初始化容器的宽度
    swiperContainer.width(bannerWidth*ContatinerLen)

    //关闭过渡
    removeTransition();
    //设置偏移
    setTranform(-1*bannerWidth);

    var startX = 0; //记录手指的最原始的点击坐标X值
    var moveX = 0; //记录手指滑动时的坐标X值
    var distanceX = 0; //单次滑动触发所产生的距离
    var index = 1;  //默认的图片索引:因为图片已经默认偏移了一个宽度
    var timerId=null;

    swiperContainer.on("touchstart", function (e) {
        //先清除定时器
        clearInterval(timerId);

        //需要记录最原始的手指触摸坐标
        startX = e.touches[0].clientX;
    })
    swiperContainer.on("touchmove", function (e) {
        //记录手指滑动的坐标，根据坐标计算出相对于原始位置的偏移值
        moveX = e.touches[0].clientX;
        //计算当前的偏移值
        distanceX = moveX - startX;
        //滑动操作不需要添加过渡效果
        removeTransition();
        setTranform(-index * bannerWidth + distanceX);

        //禁止轮播设置位置偏移
//            if (index>=3 && distanceX < 0 || index ==0 && distanceX >0 ){
//                distanceX = 0
//            } else {
//                setTranform(-index * width + distanceX);
//            }

    })

    swiperContainer.on("touchend", function () {
        //判断当前滑动的距离，如果超出宽度的1/3，则翻页，否则，吸附回去
        if (Math.abs(distanceX) > bannerWidth / 6) {
            //判断滑动的方向
            if (distanceX > 0) { //上一张
                index--;
            }
            else {
                index++;
            }
            addTransition();
            //5.3 设置偏移位置
            setTranform(-index * bannerWidth);
        }
        else {
            addTransition();
            //5.3 设置偏移位置
            setTranform(-index * bannerWidth);
        }
        //重新开启定时器
        startTimer();
    })

    swiperContainer[0].addEventListener("webkitTransitionEnd",imgBoxCb)

    //transitionEnd的回调方法
    function imgBoxCb (){
        //判断索引
//            console.log(index)
        console.log()
        if(index >= swiperPic.length+1 ){
            //重置索引
            index=1;
            //关闭过渡
            removeTransition();
            //设置偏移
            setTranform(-index*bannerWidth);
        }
        else if(index <= 0){
            index= swiperPic.length;
            //关闭过渡
            removeTransition();
            //设置偏移
            setTranform(-index*bannerWidth);
        }
        //设置图片对应的点
        setIndicator();
    }


    //设置当前图片对应点的样式

    //1.插入圆点标签
    var originHtml = ""
    $.each(swiperPic,function (index,item) {
        originHtml += "<span></span>"
    })
    originHtml = "<div class='originBanner'>"+originHtml+"</div>"
    $(".v-slide").append(originHtml)
    $(".originBanner").children().eq(0).addClass("active")

    //2.设置样式
    var lis = $(".originBanner").children()
    function setIndicator (){
        //1.将点样式全部重置为没有
        for(var i=0;i<lis.length;i++){
            lis[i].className="";
            //lis[i].classList.remove("active");
        }
        //2.将当前索引所对应的点样式设置为
        if(index>=1){
            lis[index-1].className="active";
        }
    }

    //开启时钟
    function startTimer (){
        //5.开启定时器，实现自动的滚动
        timerId=setInterval(function(){
            //5.1 索引变化
            index++;
            //5.2 添加过渡效果
            //兼容移动端浏览器
            addTransition();
            //5.3 设置偏移位置
            setTranform(-index*bannerWidth);
        },2000);
    }
    startTimer();

    //设置偏移位置
    function setTranform(distance) {
        swiperContainer[0].style.webkitTransform = "translateX(" + distance + "px)";
        swiperContainer[0].style.transform = "translateX(" + distance + "px)";
    }

    //封装开启过渡的方法
    function addTransition() {
        swiperContainer[0].style.webkitTransition = "all 0.2s";
        swiperContainer[0].style.transition = "all 0.2s";
    }

    //封装关闭过渡的方法
    function removeTransition (){
        swiperContainer[0].style.webkitTransition="none";
        swiperContainer[0].style.transition="none";
    }

})