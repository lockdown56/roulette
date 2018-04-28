var Roulette = {
    container: null,
    canvas: null,
    ctx: null,
    start: null,
    end: null,
    isWinning: false,
    config: {
      width: '200',
      height: '200',
      ratio: 1,
      datas: '',
      awardIndex: -1,
      runTime: 5000,
      timeStart: 0,
  
      color1: '#FFEAB0',
      color2: '#FFFFFF',
  
      borderColor: '#FFBE04',
      borderPointColor: '#FFFFFF',
  
      radius: 80,
  
      textSize: 14,
      textColor: '#D499B9',
  
      pointerTextSize: 16,
      pointerTextColor: '#FFFFFF',
      pointerBgColor: '#FF6600',
    },
    init: function (config) {
      this.container = document.getElementById(config.id);
      this.canvas = this.container.getElementsByTagName('canvas')[0];
      this.ctx = this.canvas.getContext('2d');

      this.onclick = config.onclick;
      this.end = config.end;

      this.setConfig(config);

      this.initSize(config.id);
  
      this.ctx.translate(this.config.width / 2, this.config.height / 2);
      this.ctx.save();
  
      this.drawDecoration();
  
      this.draw();
  
      this.drawPointer();
  
      this.listenClick();
    },
    setConfig: function (config) {
      this.config.datas = config.datas;
    },
    initSize: function (id) {
      var size = this.container.parentNode.offsetWidth;
  
      this.container.style.width = size + 'px';
      this.container.style.height = size + 'px';

      var ratio = this.getRatio();
  
      this.config.ratio = ratio;
  
      this.config.width = size * ratio;
      this.config.height = size * ratio;
      this.config.textSize = this.config.textSize * ratio;
      this.config.pointerTextSize = this.config.pointerTextSize * ratio;
  
      this.config.radius = (this.config.width / 2) * 0.8;
  
      this.canvas.setAttribute('width', ratio * size);
      this.canvas.setAttribute('height', ratio * size);
  
      this.canvas.style.width = size + 'px';
      this.canvas.style.height = size + 'px';
    },
    getRatio: function () {
      var devicePixelRatio = window.devicePixelRatio || 1;
  
      var backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
        this.ctx.mozBackingStorePixelRatio ||
        this.ctx.msBackingStorePixelRatio ||
        this.ctx.oBackingStorePixelRatio ||
        this.ctx.backingStorePixelRatio || 1;
  
      return devicePixelRatio / backingStoreRatio;
    },
    drawDecoration: function () {
      this.ctx.save();
  
      this.ctx.beginPath();
      this.ctx.fillStyle = this.config.borderColor;
      this.ctx.arc(0, 0, this.config.width / 2 * 0.95, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.closePath();
  
      for (var i = 0; i < 16; i++) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.config.borderPointColor;
        this.ctx.rotate(i * Math.PI / 8);
        this.ctx.arc(this.config.width / 2 * 0.875, 0, this.config.width / 2 * 0.04, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
      }
  
      this.ctx.restore();
    },
    draw: function () {
      var startAngle = 0;
      var endAngle = 0;
  
      var count = this.config.datas.length;
      var eachAngle = 2 * Math.PI / count;
  
      for (var i in this.config.datas) {
        this.ctx.save();
        this.ctx.beginPath();
  
        // endAngle = startAngle + this.config.datas[i].rate / 100 * 2 * Math.PI;
        endAngle = startAngle + eachAngle;
  
        if (i % 2 === 0) {
          this.ctx.fillStyle = this.config.color1;
          this.ctx.strokeStyle = this.config.color1;
        } else {
          this.ctx.fillStyle = this.config.color2;
          this.ctx.strokeStyle = this.config.color2;
        }
  
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.config.radius * Math.cos(startAngle), this.config.radius * Math.sin(startAngle));
        this.ctx.arc(0, 0, this.config.radius, startAngle, endAngle);
        this.ctx.lineTo(0, 0);
        this.ctx.fill();
  
        var textAngle = startAngle + (endAngle - startAngle) / 2;
        var textX = (0.8 * this.config.radius) * Math.cos(textAngle);
        var textY = (0.8 * this.config.radius) * Math.sin(textAngle);
  
        this.ctx.translate(textX, textY);
        this.ctx.rotate(Math.PI / 2 + textAngle);
        this.ctx.font = this.config.textSize + "px sans-serif";
        this.ctx.fillStyle = this.config.textColor;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.config.datas[i].text, 0, 0);
  
        startAngle = endAngle;
  
        this.ctx.closePath();
        this.ctx.restore();
      }
    },
    drawPointer: function () {
      this.ctx.save();
      this.ctx.beginPath();
  
      // this.ctx.fillStyle = '#FFEEE4';
      this.ctx.fillStyle = this.config.pointerBgColor;
      this.ctx.arc(0, 0, this.config.width * 0.1, 0, 2 * Math.PI);
      this.ctx.fill();
  
      this.ctx.moveTo(-this.config.width * 0.04, 0);
      this.ctx.lineTo(0, -this.config.width * 0.2);
      this.ctx.lineTo(this.config.width * 0.04, 0);
      this.ctx.fill();
  
      this.ctx.fillStyle = this.config.pointerTextColor;
      this.ctx.textAlign = 'center';
      this.ctx.font = this.config.pointerTextSize + 'px sans-serif';
  
      this.ctx.textBaseline = 'bottom';
      this.ctx.fillText('开始', 0, 0);
      this.ctx.textBaseline = 'top';
      this.ctx.fillText('抽奖', 0, 0);
  
      this.ctx.closePath();
      this.ctx.restore();
    },
    rotate: function () {
  
      this.ctx.save();
  
      var lastTime = this.config.runTime - (new Date().getTime() - this.config.timeStart);
  
      if (lastTime > 0) {
        this.clear();
        var rotateAngle = this.lastRotateAngle() + 2 * Math.PI - Math.pow(lastTime / 1000, 2.6) % (2 * Math.PI);
      } else {
        window.cancelAnimationFrame(this.draw);
        if (this.end instanceof Function) {
          this.end();
        }
        this.isWinning = false;
        return;
      }
  
      this.drawDecoration();
  
      this.ctx.rotate(rotateAngle);
  
      this.draw();
  
      this.ctx.restore();
  
      this.drawPointer();
  
      window.requestAnimationFrame(this.rotate.bind(this));
    },
    lastRotateAngle: function () {
      var eachAngle = 2 * Math.PI / this.config.datas.length;
      awardAngle = this.config.awardIndex * eachAngle + eachAngle / 2;
  
      return Math.PI * (2 - 1/ 2) - awardAngle;
  
      // var awardAngle = 0;
      // for (var i = 0; i < this.config.awardIndex; i++) {
      //   if (i === this.config.awardIndex - 1) {
      //     awardAngle = awardAngle + 2 * Math.PI * (this.config.datas[i].rate / (2 * 100));
      //   } else {
      //     awardAngle = awardAngle + 2 * Math.PI * this.config.datas[i].rate / 100;
      //   }
      // }
  
      // return Math.PI * (2 - 1 / 2) - awardAngle;
    },
    clear: function () {
      this.ctx.clearRect(-this.config.width / 2, -this.config.height / 2, this.config.width, this.config.height);
    },
    listenClick: function () {
      this.container.style.position = 'relative';
  
      var width = this.config.width * 0.2 / this.config.ratio;
      var height = this.config.height * 0.2 / this.config.ratio;
  
      var clickAreaWrap = document.createElement('div');
      clickAreaWrap.style.height = height + 'px';
      clickAreaWrap.style.width = width + 'px';
      clickAreaWrap.style.position = 'absolute';
      clickAreaWrap.style.top = '50%';
      clickAreaWrap.style.left = '50%';
  
      var clickAreaInner = document.createElement('div');
      clickAreaInner.style.height = height + 'px';
      clickAreaInner.style.width = width + 'px';
      clickAreaInner.style.marginTop = '-50%';
      clickAreaInner.style.marginLeft = '-50%';
  
      clickAreaWrap.append(clickAreaInner);
  
      this.container.append(clickAreaWrap);
  
      var _this = this;
      clickAreaInner.addEventListener('click', function () {
        if (_this.onclick instanceof Function && _this.isWinning === false) {
          _this.config.timeStart = new Date().getTime();
          _this.onclick();
        }
      })
    },
    preventRotate: function () {
      this.isWinning = true;
    },
    allowRotate: function () {
      this.isWinning = false;
    },
    setAwardIndex: function (awardIndex) {
      this.config.awardIndex = awardIndex;
    },
    onclick: null,
    end: null
  };