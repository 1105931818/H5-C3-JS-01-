//作用：需要将所有的DOM元素对象以及相关的资源全部都加载完毕之后，再来实现的事件函数
window.onload = function(){

    //声明一个记录点击的缩略图下标
    var bigimgIndex = 0;

    //路径导航的数据渲染
    navPathDataBind();
    function navPathDataBind(){

        /* 思路：
        1、先获取路径导航的页面元素（navPath）
        2、再来获取所需要的数据（data.js-->goodData.path）
        3、由于数据是需要动态产生的，那么DOM元素也应该是动态产生的，含义需要根据数据的数量来进行创建DOM元素
        4、在遍历数据创建DOM元素的最后一条，只创建a标签
        */

        //1.获取页面导航的元素对象
        var navPath = document.querySelector('#wrapper #content .contentMain #navPath');

        //2.获取数据
        var path = goodData.path;

        //3.遍历数据
        for (var i = 0 ; i < path.length ; i++){
            if (i == path.length - 1){
                var aNode = document.createElement("a");
                aNode.innerHTML = path[i].title;
                navPath.appendChild(aNode);
            }else{
                //4.创建a标签
                var aNode = document.createElement("a");
                aNode.href = path[i].url;
                aNode.innerHTML = path[i].title;

                //5.创建i标签
                var iNode = document.createElement('i');
                iNode.innerHTML = '/';

                //6.让navPath元素来追加a和i
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }
    
        }

    }

    //放大镜的移入、移除效果
    bigClassBind();
    function bigClassBind(){

        /* 思路
        1.获取小图框元素对象，并且设置移入事件（onmouseenter）
        2.动态的创建蒙版元素以及大图框和大图片元素
        3.移除时，需要移除蒙版元素和大图框
        */

        //1.获取小图框元素
        var smallPic = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #samllPic');

        //获取leftTop元素
        var leftTop = document.querySelector('#wrapper #content .contentMain #center #left #leftTop');

        //获取数据
        var imagessrc = goodData.imagessrc;

        //2.设置移入事件
        smallPic.onmouseenter = function(){

            //3.创建蒙版元素
            var maskDiv = document.createElement('div');
            maskDiv.className = 'mask';

            //4/创建大图框元素
            var BigPic = document.createElement('div');
            BigPic.id = 'bigPic';
            
            //5.创建大图片元素
            var BigImge = document.createElement('img');
            BigImge.src = imagessrc[bigimgIndex].b;

            //6.大图框追加图片
            BigPic.appendChild(BigImge);

            //7.让小图框追加蒙版元素
            smallPic.appendChild(maskDiv);

            //8.让leftTop追加大图框
            leftTop.appendChild(BigPic);

            //设置移动事件
            smallPic.onmousemove = function(event){

                //event.clientX:鼠标点距离浏览器左侧X轴的值
                //smallPic.getBoundingClientRect().left：是小图框元素距离浏览器左侧的可视距离
                //maskDiv.offsetWidth ：为元素的占位宽度
                var left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;
                var top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;
                
                //蒙版元素移动的边界控制
                if(left < 0){
                    left = 0;
                }else if(left > (smallPic.clientWidth - maskDiv.offsetWidth)){

                    left = smallPic.clientWidth - maskDiv.offsetWidth;

                }
                if(top < 0){
                    top = 0;
                }else if(top > (smallPic.clientHeight - maskDiv.offsetHeight)){

                    top = smallPic.clientHeight - maskDiv.offsetHeight

                }

                //设置蒙版的left和top属性
                maskDiv.style.left = left + 'px';
                maskDiv.style.top = top + 'px';

                //移动的比例关系=蒙版移动元素的距离 / 大图片元素移动的距离
                //蒙版移动元素的距离=小图框的宽度 - 蒙版的宽度
                //大图片元素移动的距离=大图片的宽度 - 大图框的宽度
                var scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (BigImge.offsetWidth - BigPic.clientWidth)
                //console.log(scale);
                //比例关系是0.695
                BigImge.style.left = -left / scale + 'px';
                BigImge.style.top = -top / scale + 'px';

            }

            //设置移除事件
            smallPic.onmouseleave = function(){

            //让小图框移除蒙版元素
            smallPic.removeChild(maskDiv);

            //让leftTop移除大图框
            leftTop.removeChild(BigPic);

            //

            }
        }

    }

    //动态渲染缩略图的数据
    thunbnailData();
    function thunbnailData(){

        /* 思路
        1.获取piclist下的ul元素
        2.获取data.js的数据 goodData --> imagessrc
        3.遍历数组，根据数组的长度来创建li元素
        4.让ul遍历追加li元素
        */

        //1.获取piclist下的ul元素
        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul ');
    
        //2.获取imagessrc数据
        var imagessrc = goodData.imagessrc;

        //3.遍历数组，根据数组的长度来创建li元素
        for(var i = 0; i < imagessrc.length; i++){

            //4.创建li元素
            var newLi = document.createElement('li');

            //5.创建img元素
            var newImg = document.createElement('img'); 
            newImg.src = imagessrc[i].s;

            //6.让li追加img元素
            newLi.appendChild(newImg);

            //7.让ul追加li元素
            ul.appendChild(newLi);
        }

    }

    //缩略图转换为大图
    thunbnailClick();
    function thunbnailClick(){

        /* 思路
        1.获取li元素，并循环发生点击事件
        2.点击缩略图需要确定下标位置来找到对应小图路径和大图路径替换现有路径
        */

        //1.获取li元素，并循环发生点击事件
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');

        //获取小图元素
        var smallPic_img = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #samllPic img ');

        var imagessrc = goodData.imagessrc;

        //小图路径需要默认和imagessrc的第一个元素的小图路径一致
        smallPic_img.src = imagessrc[0].s;

        //2.循环点击
        for(var i = 0 ; i < liNodes.length ; i++){

            //在点击事件发生之前，给每一个元素都添加自定义下标
            liNodes[i].index = i;  //还可以通过setAttribute('index',i)
            liNodes[i].onclick = function(){

                var idx = this.index;
                bigimgIndex = idx;

                //变换小图路径
                smallPic_img.src = imagessrc[idx].s

            }
        }

    }

    //轮播图效果
    thunbnailLeftRightClik();
    function thunbnailLeftRightClik(){

        /* 思路
        1.获取点击箭头元素
        2.获取可视的ul和div以及li元素
        3.计算移动的距离（发生起点，步长，总体运动的距离）
        4.单击事件
        */

        //获取箭头元素
        var perv = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.perv');
        var next = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.next');

        //获取可视的div和ul以及li元素
        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul');
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');


        //计算
        var start = 0;  //起点
        var step = (liNodes[0].offsetWidth + 20) * 2;  //步长
        var endPostion = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20);  //总长度

        //单击事件
        perv.onclick = function(){

            start -= step;
            if(start < 0){
                start = 0;
            }
            ul.style.left = -start + 'px';

        }
        next.onclick = function(){

            start += step;
            if(start > endPostion){

                start = endPostion;

            }
            ul.style.left = -start + 'px';

        }

    }

    //商品详情数据的动态渲染
    rightTopData();
    function rightTopData(){

        /* 思路
        1.获取元素
        2.获取数据
        3.建立字符串变量，将原来的布局结构贴进来，将所对应的数据放在对应的位置上重新渲染元素
        */

        //1.查找元素
        var rightTop = document.querySelector('#wrapper #content .contentMain #center #right #rightTop');
        
        //2.查找数据
        var goodsDetail = goodData.goodsDetail;
        
        //3.创建字符串变量(模版字符串),模版字符串替换数据：$(变量)
        var s = `<h2>${goodsDetail.title}</h2>
        <p>${goodsDetail.recommend}</p>
        <div class="priceWrap">

            <div class="priceTop">

                <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                <div class="price">

                    <span>¥</span>
                    <p>${goodsDetail.price}</p>
                    <i>降价通知</i>

                </div>
                <p>
                    <span>累计评价</span>
                    <span>${goodsDetail.evaluateNum}</span>

                </p>
                
            </div>
            <div class="priceBottom">

                <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                <p>

                    <span>${goodsDetail.promoteSales.type}</span>
                    <span>${goodsDetail.promoteSales.content}</span>

                </p>

            </div>

        </div>
        <div class="support">

            <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
            <p>${goodsDetail.support}</p>

        </div>
        <div class="address">

            <span>配&nbsp;送&nbsp;至</span>
            <p>${goodsDetail.address}</p>

        </div>`;
        
        //4.重新渲染元素
        rightTop.innerHTML = s;

    }

    //商品详情数据的传递
    rightBottomData();
    function rightBottomData(){

        /* 思路
        1.获取rightBotton元素
        2.获取数据
        3.遍历数组，有一个元素就要有一个动态的dl元素对象
        */

        //1.获取元素
        var chooseWrap = document.querySelector('#wrapper #content .contentMain #center #right #rightBottom .chooseWrap');
        
        //2.获取数据
        var crumbData = goodData.goodsDetail.crumbData;

        //3.循环数据
        for (var i = 0 ; i < crumbData.length ; i++){

            //4.创建对象
            var dlNode = document.createElement('dl');
            var dtNode = document.createElement('dt');

            //追加对象
            dtNode.innerHTML = crumbData[i].title;
            chooseWrap.appendChild(dlNode);
            dlNode.appendChild(dtNode);

            for(var j = 0 ; j < crumbData[i].data.length ; j++){

                var ddNode = document.createElement('dd');
                ddNode.innerHTML = crumbData[i].data[j].type;
                ddNode.setAttribute('price',crumbData[i].data[j].changePrice);
                dlNode.appendChild(ddNode);

            }
            


        }
    }

    //点击商品详情之后的颜色排他效果
    chilkddBind();
    function chilkddBind(){

        /* 思路
        1.获取所以的dl元素，取其中的第一个dl元素下的所有dd
        2.循环所有的dd元素并且添加点击事件
        3.确定实际发生事件的目标源对象然后设置其字体颜色，然后给其他所有元素颜色都重置为基础颜色
        */

        //1.获取第一个dl元素下所有的dd
        var dlNodes = document.querySelectorAll('#wrapper #content .contentMain #center #right #rightBottom .chooseWrap dl');
        
        var arr = new Array(dlNodes.length);
        var choose = document.querySelector('#wrapper #content .contentMain #center #right #rightBottom .choose');


        for(var i = 0 ; i < dlNodes.length ; i++){

            //闭包函数
            (function(i){

                var ddNodes = dlNodes[i].querySelectorAll('dd');

                //2.遍历当前所有的dd元素
                for (var j = 0 ; j < ddNodes.length ; j++){

                     ddNodes[j].onclick = function(){

                        //清空choose元素
                        choose.innerHTML = '';

                        for(var k = 0 ; k < ddNodes.length ; k++){

                            ddNodes[k].style.color = '#666';

                        }

                        this.style.color = "red";

                        //点击dd元素产生mask标记
                        /* 思路
                        1.创建数组，容纳dd的数值，确定数组的起始长度
                        2.将点击的dd的数值，按照对应下标添加进数组
                        3.遍历数组，将非0的值添加mask中
                        */

                        arr[i] = this;
                        changePriceBind(arr);
                        //遍历数组
                        arr.forEach(function(value,index){

                            if(value){

                                var maskDiv = document.createElement('div');
                                maskDiv.id = 'mask';
                                maskDiv.innerText = value.innerText;
                                var aNode = document.createElement('a');
                                aNode.setAttribute('index',index);
                                aNode.innerText = 'X';
                                maskDiv.appendChild(aNode);
                                choose.appendChild(maskDiv);

                            }
                        })
                        
                        //获取所有a标签
                        var aNodes = document.querySelectorAll('#wrapper #content .contentMain #center #right #rightBottom .choose #mask a');
            
                        for(var n = 0 ; n < aNodes.length ; n++){

                            aNodes[n].onclick = function(){

                                //获取a标签的index值
                                var idx = this.getAttribute('index');

                                //恢复数组中对应下标元素的值
                                arr[idx] = 0;

                                //找到对应下标的dl行中的所有dd元素
                                var ddlist = dlNodes[idx].querySelectorAll('dd');

                                //遍历所有的dd元素
                                for(var m = 0 ; m < ddlist.length ; m++){

                                    ddlist[m].style.color = '#666';

                                }

                                //删除对应下标的mask标记
                                choose.removeChild(this.parentNode);

                                changePriceBind(arr);

                            }

                        }
                    }

                 }

            })(i)
            
            
        }
        
    }

    //价格变动，需要点击dd和删除mask调用
    function changePriceBind(arr){

        /* 思路
        1.获取价格元素
        2.给每一个dd标签身上都默认设置一个自定义属性，用来记录变化的价格
        3.遍历arr数组，将dd元素身上新变化的价格和已有的价格相加
        4.最后将计算好的结果显示在p标签
        */

        //价格标签
       var oldPrice = document.querySelector('#wrapper #content .contentMain #center #right #rightTop .priceWrap .priceTop .price p');
       var price = goodData.goodsDetail.price;
       //遍历数组
       for(var i = 0 ; i < arr.length ; i++){

            if(arr[i]){
                
                var change = Number(arr[i].getAttribute('price'));
                price += change;

            }

       }
       oldPrice.innerText = price;
       var leftPrice = document.querySelector('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap .left p ');
       leftPrice.innerText = '¥' + price;
       var leftPrice1 = document.querySelector('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap1 .left p ');
       leftPrice1.innerText = '¥' + price;

       //遍历选择搭配中所有的复选框，看是否选中
       var ipts = document.querySelectorAll('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input');
       var newPrice = document.querySelector('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap .right i ');
       for (var i = 0 ; i < ipts.length ; i++){

            if(ipts[i].checked){

                price += Number(ipts[i].value);
                
            }

       }
       newPrice.innerText = '¥' + price;
       var ipts1 = document.querySelectorAll('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap1 .middle li input');
       var newPrice1 = document.querySelector('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap1 .right i ');
       for (var i = 0 ; i < ipts1.length ; i++){

            if(ipts1[i].checked){

                price += Number(ipts1[i].value);
                
            }

       }
       newPrice1.innerText = '¥' + price;

    }

    //选择搭配的价格变动
    choosePrice();
    function choosePrice(){

        /* 思路
        1.获取中间区域的所有复选框元素
        2.遍历这些元素获取价格，和基础价格累加，累加之后重新写回套餐标价里
        */

        //获取复选框元素
        var ipts = document.querySelectorAll('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input');
        
        var leftPrice = document.querySelector('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap .left p ');

        var newPrice = document.querySelector('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap .right i ');

        for(var i = 0 ; i < ipts.length ; i++){

            ipts[i].onclick = function(){

                var oldprice = Number(leftPrice.innerText.slice(1));
                for(var j = 0 ; j < ipts.length ; j++){

                    if(ipts[j].checked){

                        oldprice += Number(ipts[j].value);

                    }

                }
                newPrice.innerText = '¥' + oldprice;

            }

        }

        var ipts1 = document.querySelectorAll('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap1 .middle li input');
        
        var leftPrice1 = document.querySelector('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap1 .left p ');

        var newPrice1 = document.querySelector('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap1 .right i  ');

        for (var i = 0 ; i < ipts1.length ; i++){

            ipts1[i].onclick = function(){

                var oldprice1 = Number(leftPrice1.innerText.slice(1));
                for(var j = 0 ; j < ipts1.length ; j++){

                    if(ipts1[j].checked){

                        oldprice1 += Number(ipts1[j].value);

                    }

                }
                newPrice1.innerText = '¥' + oldprice1;

            }
            
        }

 
    
    }

    //封装一个公共的选项卡函数(被点击的元素，被切换显示的元素)
    function Tab(tabBtns,tabConts){

        for(var i = 0 ; i < tabBtns.length ; i++){

            tabBtns[i].index = i;
            tabBtns[i].onclick = function(){

                for (var j = 0 ; j < tabBtns.length ; j++){

                    tabBtns[j].className = '';
                    tabConts[j].className = '';

                }
                this.className = 'active';
                tabConts[this.index].className = 'active';

            }

        }

    }

    //点击左侧选项卡
    leftTab();
    function leftTab(){

        //获取点击元素
        var tabs = document.querySelectorAll('#wrapper #content .contentMain #goodsDetailWrap .liftAside .asideTop h4');

        //获取显示元素
        var conts = document.querySelectorAll('#wrapper #content .contentMain #goodsDetailWrap .liftAside .asideBottom>div');

        //调用函数
        Tab(tabs,conts);

    }

    //点击右侧选项卡
    rightTab();
    function rightTab(){

        var tabs1 = document.querySelectorAll('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .bottomDetail .tabBtns li');
        var conts1 = document.querySelectorAll('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .bottomDetail .tabContents>div ');
        Tab(tabs1,conts1);

    }

    //导航栏呼出
    rightAsideBind();
    function rightAsideBind(){

        /* 思路
        1.获取元素,点击事件
        */

        var btn = document.querySelector('#wrapper .rightAside .btns');

        var aside = document.querySelector('#wrapper .rightAside');

        var flag = true; //关闭
        btn.onclick = function(){

            if(flag){

                //展开
                btn.className = 'btns btnsOpen';
                aside.className = 'rightAside asideOpen';
                //flag = false;

            }else{

                //关闭
                btn.className = 'btns btnsClose';
                aside.className = 'rightAside asideClose';
                //flag = true;

            }

            //无论前面的if和else执行的是谁，最终flag的值都是在原来的基础上取反
            flag = !flag;

        }

    }

}
