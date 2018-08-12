(function () {
  function Starry() {//构造函数（类，一般放自己的私有属性）
    var self = this;
    self.ctx = canvas.getContext('2d');//画笔，创建2d绘画环境
    self.num = 200;
    self.data = [];//存储粒子的属性
    self.r = 1;//粒子的半径
  }
  Starry.prototype = {//原型里面放公共的方法（可以复用）
    //初始化
    init: function () {
      var self = this;
      //让画布与浏览器窗口等宽等高
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      self.cW = canvas.width;
      self.cH = canvas.height;
      for(var i = 0; i < self.num; i++){
        self.data[i] = {
          //随机位置
          x: Math.random()*(self.cW-self.r * 2) + self.r,
          y: Math.random()*(self.cH-self.r * 2) + self.r,
          //自定义随机增量
          cX: Math.random() * 0.6 - 0.3,
          cY: Math.random() * 0.6 - 0.3,
        }
        self.drawCircle(self.data[i].x, self.data[i].y);
      }
      //self.adjust();
    },
    //绘制粒子
    drawCircle: function (x, y) {
      var self = this;
      var ctx = self.ctx;
      ctx.save();
      ctx.fillStyle = 'pink';
      ctx.beginPath();
      ctx.arc(x, y, self.r, 0, Math.PI*2, false);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
    //粒子运动
    moveCircle: function () {//上一个点
      var self = this;
      //先清除前面绘制的粒子
      self.ctx.clearRect(0, 0, self.cW, self.cH);
      for(var i = 0; i < self.num; i++){
        var data = self.data[i];
        data.x += data.cX;
        data.y += data.cY;
        //边界值判断
        if((data.x-self.r) < 0 || (data.x+self.r) > self.cW){
          data.cX = -data.cX;
        }
        if((data.y-self.r) < 0 || (data.y+self.r) > self.cH){
          data.cY = -data.cY;
        }
        self.drawCircle(data.x, data.y);
        //用勾股定理来判断是否连线

        for(var j = i+1; j < self.num; j++){//下一个点
          if(Math.pow(self.data[i].x - self.data[j].x, 2) +
            Math.pow(self.data[i].y - self.data[j].y, 2) <= 50 * 50){
              self.drawLine(self.data[i].x, self.data[i].y, self.data[j].x, self.data[j].y);
          }
        }
      }
    },
    //绘制线条
    drawLine: function (x1, y1, x2, y2) {
      var self = this;
      var ctx = self.ctx;
      var color = ctx.createLinearGradient(x1, y1, x2, y2);
      color.addColorStop(0, '#333');
      color.addColorStop(.5, '#378');
      color.addColorStop(1, '#ccc');
      ctx.save();
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    },
    //窗口的调整
    adjust: function () {
      var self = this;
      window.onresize = self.debounce(self.init, 200);
    },
    //防抖函数
    debounce: function (fn, delay) {
      // 维护一个 timer
      var timer = null;

      return function() {
        // 通过 'this' 和 'arguments' 获取函数的作用域和变量
        var context = this;
        var args = arguments;

        clearTimeout(timer);
        timer = setTimeout(function() {
          fn.apply(context, args);
        }, delay);
      }
    }
  }
  var starry = new Starry(); //实例化对象（生成this)
  starry.init();
  setInterval(function () {
    starry.moveCircle();
  }, 1);
  starry.adjust();
})();