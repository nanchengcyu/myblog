//动态小人
L2Dwidget.init({
    "model": { "jsonPath":"https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json", "scale": 1, "hHeadPos":0.5, "vHeadPos":0.618 },
    "display": { "position": "right", "width": 150, "height": 150, "hOffset": 0, "vOffset": 0 },
    "mobile": { "show": true, "scale": 0.5 },
    "react": { "opacityDefault": 0.7, "opacityOnHover": 0.2 }
});
//鼠标点击出现文字
var body = document.getElementsByTagName('body')[0];
var textArr=["乐观", "❤" ,"积极", "向上", "自由", "正能量","(*^▽^*)", "元气满满", "开心" ,"快乐", "善良", "可爱", "暴富", "暴瘦"];
document.addEventListener('click',(e)=>{
    // 生成字符串
    var ev = e || window.event;
    var baseX = ev.pageX;
    var baseY = ev.pageY;
    var new_span=document.createElement('span');
    new_span.innerText=textArr[parseInt(Math.random()*textArr.length)]
    new_span.style.position='fixed';
    new_span.style.left=baseX-10+'px';
    new_span.style.top=baseY+'px';
    new_span.style.color='RGB('+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+')';
    body.appendChild(new_span);
    // 定时器1实现字符串上升效果
    var timer = window.setInterval(()=>{
        new_span.style.top=parseInt(window.getComputedStyle(new_span,null)['top'])-2+'px';
        // console.log(window.getComputedStyle(new_span,null)['fontSize']);
        new_span.style.opacity=window.getComputedStyle(new_span,null)['opacity']-0.02;

    },30);
    // 定时器2实现字符串消失
    window.setTimeout(()=>{
        window.clearInterval(timer);
        body.removeChild(new_span);
    },1000);
},false);

// 导航栏显示
var waypoint = new Waypoint({
    element: document.getElementById('waypoint'),
    handler: function(direction) {
        if (direction == 'down') {
            $('#nav').show(500);
        } else {
            $('#nav').hide(500);
        }
    }
})
//一键到顶 平滑效果
var waypoint = new Waypoint({
    element: document.getElementById('waypoint'),
    handler: function(direction) {
        if (direction == 'down') {
            $('#toolbar').show(100);
        } else {
            $('#toolbar').hide(500);
        }
        console.log('Scrolled to waypoint!  ' + direction);
    }
})
//一键到顶
$('#toTop-button').click(function () {
    $(window).scrollTo(0,500);
});

// 运行时间统计
function secondToDate(second) {
    if (!second) {
        return 0;
    }
    var time = new Array(0, 0, 0, 0, 0);
    if (second >= 365 * 24 * 3600) {
        time[0] = parseInt(second / (365 * 24 * 3600));
        second %= 365 * 24 * 3600;
    }
    if (second >= 24 * 3600) {
        time[1] = parseInt(second / (24 * 3600));
        second %= 24 * 3600;
    }
    if (second >= 3600) {
        time[2] = parseInt(second / 3600);
        second %= 3600;
    }
    if (second >= 60) {
        time[3] = parseInt(second / 60);
        second %= 60;
    }
    if (second > 0) {
        time[4] = second;
    }
    return time;
}
function setTime() {
    /*此处为网站的创建时间*/
    var create_time = Math.round(new Date(Date.UTC(2022, 12, 25, 15, 15, 15)).getTime() / 1000);
    var timestamp = Math.round((new Date().getTime() + 8 * 60 * 60 * 1000) / 1000);
    currentTime = secondToDate((timestamp - create_time));
    currentTimeHtml = currentTime[0] + '年' + currentTime[1] + '天'
        + currentTime[2] + '时' + currentTime[3] + '分' + currentTime[4]
        + '秒';
    document.getElementById("htmer_time").innerHTML = currentTimeHtml;
}
setInterval(setTime, 1000);


$('.menu.toggle').click(function () {
    $('.m-item').toggleClass('m-mobile-show');

});

//背景粒子
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let width = window.innerWidth
let height = window.innerHeight

let dotsNum = 80 // 点的数量
let radius = 1 // 圆的半径，连接线宽度的一半
let fillStyle = 'rgba(255,255,255,0.5)' // 点的颜色
let lineWidth = radius * 2
let connection = 120 // 连线最大距离
let followLength = 80 // 鼠标跟随距离

let dots = []
let animationFrame = null
let mouseX = null
let mouseY = null

function addCanvasSize () { // 改变画布尺寸
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = width
    canvas.height = height
    ctx.clearRect(0, 0, width, height)
    dots = []
    if (animationFrame) window.cancelAnimationFrame(animationFrame)
    initDots(dotsNum)
    moveDots()
}

function mouseMove (e) {
    mouseX = e.clientX
    mouseY = e.clientY
}

function mouseOut (e) {
    mouseX = null
    mouseY = null
}

function mouseClick () {
    for (const dot of dots) dot.elastic()
}

class Dot {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
        this.follow = false
    }
    draw () {
        ctx.beginPath()
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()
    }
    move () {
        if (this.x >= width || this.x <= 0) this.speedX = -this.speedX
        if (this.y >= height || this.y <= 0) this.speedY = -this.speedY
        this.x += this.speedX
        this.y += this.speedY
        if (this.speedX >= 1) this.speedX--
        if (this.speedX <= -1) this.speedX++
        if (this.speedY >= 1) this.speedY--
        if (this.speedY <= -1) this.speedY++
        this.correct()
        this.connectMouse()
        this.draw()
    }
    correct () { // 根据鼠标的位置修正
        if (!mouseX || !mouseY) return
        let lengthX = mouseX - this.x
        let lengthY = mouseY - this.y
        const distance = Math.sqrt(lengthX ** 2 + lengthY ** 2)
        if (distance <= followLength) this.follow = true
        else if (this.follow === true && distance > followLength && distance <= followLength + 8) {
            let proportion = followLength / distance
            lengthX *= proportion
            lengthY *= proportion
            this.x = mouseX - lengthX
            this.y = mouseY - lengthY
        } else this.follow = false
    }
    connectMouse () { // 点与鼠标连线
        if (mouseX && mouseY) {
            let lengthX = mouseX - this.x
            let lengthY = mouseY - this.y
            const distance = Math.sqrt(lengthX ** 2 + lengthY ** 2)
            if (distance <= connection) {
                opacity = (1 - distance / connection) * 0.5
                ctx.strokeStyle = `rgba(255,255,255,${opacity})`
                ctx.beginPath()
                ctx.moveTo(this.x, this.y)
                ctx.lineTo(mouseX, mouseY);
                ctx.stroke();
                ctx.closePath()
            }
        }
    }
    elastic () { // 鼠标点击后的弹射
        let lengthX = mouseX - this.x
        let lengthY = mouseY - this.y
        const distance = Math.sqrt(lengthX ** 2 + lengthY ** 2)
        if (distance >= connection) return
        const rate = 1 - distance / connection // 距离越小此值约接近1
        this.speedX = 40 * rate * -lengthX / distance
        this.speedY = 40 * rate * -lengthY / distance
    }
}

function initDots (num) { // 初始化粒子
    ctx.fillStyle = fillStyle
    ctx.lineWidth = lineWidth
    for (let i = 0; i < num; i++) {
        const x = Math.floor(Math.random() * width)
        const y = Math.floor(Math.random() * height)
        const dot = new Dot(x, y)
        dot.draw()
        dots.push(dot)
    }
}

function moveDots () { // 移动并建立点与点之间的连接线
    ctx.clearRect(0, 0, width, height)
    for (const dot of dots) {
        dot.move()
    }
    for (let i = 0; i < dots.length; i++) {
        for (let j = i; j < dots.length; j++) {
            const distance = Math.sqrt((dots[i].x - dots[j].x) ** 2 + (dots[i].y - dots[j].y) ** 2)
            if (distance <= connection) {
                opacity = (1 - distance / connection) * 0.5
                ctx.strokeStyle = `rgba(255,255,255,${opacity})`
                ctx.beginPath()
                ctx.moveTo(dots[i].x, dots[i].y)
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.stroke();
                ctx.closePath()
            }
        }
    }
    animationFrame = window.requestAnimationFrame(moveDots)
}

addCanvasSize()

initDots(dotsNum)
moveDots()

document.onmousemove = mouseMove
document.onmouseout = mouseOut
document.onclick = mouseClick
window.onresize = addCanvasSize

