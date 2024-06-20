class ErgRenderer {
  constructor(){
    this.initData()
  }

  //初始化数据方法
  initData(){
    /**
     * parentEl - 挂载canvas的元素
     * el - canvas元素
     * ctx  - canvas上下文
     * cacheEl - 缓存canvas
     * cacheCtx - 缓存上下文
     * 
     * scrollEl - 滚动条元素
     * scrollElPar - 滚动条父元素
     * 
     * eventFn - 事件缓存对象，以便循环挂载/注销事件
     * 
     * maxWidth/maxHeight - 记录最大宽高
     * bufferWidth - 滚动条出现时距离边界的安全距离
     * width/height  - canvas元素宽高
     * scaleRatio - canvas缩放比例
     * scrollTop - 滚动条上距离
     * scrollLeft - 滚动条左距离
     * 
     * _data  - 数据
     * focusTarget  - 聚焦节点
     * hoverTarget - 悬停节点或线段
     * editType - 当前状态(实体addNode,主键primaryKey,非主键foreignKey,分支branchLine,框addMark,备注addNote)
     * chooseTargets - 记录选择的节点或连线
     * 
     * addNodeDefaultAttr - 添加实体时的默认生成的属性
     * 
     * imgList -  缓存过的检出icon元素
     * editable - 1可编辑/2只读(可移动缩放等)/3只读(不可任何操作)
     * 
     * 
     * 
     */
    this.scaleRatio = 1
    this.maxWidth = 0
    this.maxHeight = 0
    this.scrollTop = 0
    this.scrollLeft = 0
    this.bufferWidth = 40
    this.chooseTargets = []
    this.imgList = {}
    this.editable = 1
    this.thumbnailWidth = 150
  }

  //开始装载元素
  load (options){
    const {id, data, externalFn, editable, fontFamily} = options

    //拷贝数据指针
    this._data = data
    this.editable = editable || 1
    this.fontFamily = fontFamily

    //拷贝外部方法指针
    /**
     * options[addNode]: 创建实体通知方法
     *  @param val {Object}, 完整的信息
     * 
     * options[delNode]: 删除实体通知方法
     *  @param id {Id}, 实体的id
     * 
     * options[addLine]: 创建线通知方法
     *  @param val {Object}, 完整的信息
     * 
     * options[delLine]: 删除线通知方法
     *  @param from {Id}, to {Id}, 线的唯一标识(from, to)
     * 
     * options[addFilter]: 创建过滤器通知方法
     *  @param val {Object}, 完整的信息
     * 
     * options[delFilter]: 删除过滤器通知方法
     *  @param id {Id}, 过滤器的id
     */
    this.externalFn = externalFn

    //父元素操作
    this.parentEl = document.getElementById(id)
    this.parentEl.setAttribute('style', 'overflow: hidden;')
    var sty = getComputedStyle(this.parentEl)
    this.width = Number(sty.width.replace(/px/g,''))
    this.height = Number(sty.height.replace(/px/g,''))

    //存放canvas的容器元素
    this.box = document.createElement('div')
    this.box.setAttribute('style', 'position: relative; width: 100%; height: 100%;user-select:none;')

    //canvas元素操作
    this.el = document.createElement('canvas')
    this.el.width = this.width
    this.el.height = this.height
    this.el.setAttribute('style', 'position: absolute; z-index: 2;')
    this.ctx = this.el.getContext('2d')
    //挂载canvas
    this.box.appendChild(this.el)

    //创建缓存canvas
    this.cacheEl = document.createElement('canvas')
    this.cacheEl.width = this.width
    this.cacheEl.height = this.height
    this.cacheCtx = this.cacheEl.getContext('2d')

    //创建缩略图canvas
    this.thumbnailEl = document.createElement('canvas')
    this.thumbnailEl.width = this.thumbnailWidth
    this.thumbnailEl.height = this.thumbnailWidth
    this.thumbnailEl.setAttribute('style', 'position: absolute; z-index: 3; bottom:15px; right: 15px;border: 3px solid rgba(192,192,192,0.5);border-radius: 3px;')
    this.thumbnailCtx = this.thumbnailEl.getContext('2d')
    //挂载缩略图canvas
    this.box.appendChild(this.thumbnailEl)
    
    //添加自定义的canvas方法
    this.addCanvasAction()

    //滚动条元素
    this.scrollElPar = document.createElement('div')
    this.scrollElPar.setAttribute('style', 'position:absolute;z-index:1;width:100%;height:100%;overflow:auto;opacity: 0;')
    this.scrollEl = document.createElement('div')
    this.scrollEl.setAttribute('style', 'width: 1px; height: 1px;')
    //挂载scrollEl
    this.scrollElPar.appendChild(this.scrollEl)
    this.box.appendChild(this.scrollElPar)

    this.parentEl.appendChild(this.box)

    //初始化
    this.init()
  }

  //初始化方法
  init(){
    //开始绘制
    this.update()
    //挂载监听
    this.addListener()
  }

  //绘制缩略图canvas
  _drawThumbnail(){
    const ctx = this.thumbnailCtx, data = this._data

    ctx.save()
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, this.thumbnailEl.width,this.thumbnailEl.height)
    
    //设置画布比例
    const scale = this.thumbnailScale = Math.min(this.thumbnailWidth/Math.max(this.maxWidth, this.width), this.thumbnailWidth/Math.max(this.maxHeight, this.height))
    ctx.scale(scale, scale)

    //绘制节点
    for(const item of data.nodeDataArray){
      //不绘制过滤器
      if(!['inclusive','exclusive'].includes(item.type)){
        ctx.save()
        const w = Number(item.width) || 100
        const h = Number(item.height) || 50
        const x = Number(item.loc.x)
        const y = Number(item.loc.y)
        ctx.fillStyle = item.bgC || '#fff'
        ctx.strokeStyle = item === this.focusTarget ? '#477DE9' : '#000'
        ctx.lineWidth = 9.5
        ctx.fillRect(x, y, w, h)
        ctx.strokeRect(x, y, w, h)
        ctx.restore()
      }
    }

    //绘制视口矩形
    ctx.fillStyle = 'rgba(0,0,0,0.2)'
    ctx.fillRect(this.scrollLeft/this.scaleRatio, this.scrollTop/this.scaleRatio, this.width/this.scaleRatio, this.height/this.scaleRatio)
    ctx.restore()
  }

  //修改可编辑状态
  setEditable(val){
    this.editable = val
    this.update()
  }

  //添加自定义canvas方法
  addCanvasAction() {
    //添加绘制圆角矩形方法
    this.ctx.drawRoundedRect  = this.cacheCtx.drawRoundedRect = function (x, y, width, height, r, fill, stroke, multichamber, shadow) {
      //多物理表时多框偏移量
      var offset = 3

      this.save(); 
      this.beginPath();
      
      //绘制外圈
      if(multichamber){
        var times = 0
        while(times++ < 2){
          this.moveTo(x + offset*times, y - offset*(times-1));
          this.arcTo(x + offset*times, y - offset*times, x + r + offset*times, y - offset*times, r);
          this.arcTo(x + width + offset*times, y-offset*times, x + width + offset*times, y + r - offset*times, r);
          this.arcTo(x + width + offset*times, y + height - offset*times, x + width - r + offset*times, y + height - offset*times, r);
          !r && this.lineTo(x + width - r + offset*(times-1), y + height - offset*times)
        }
      }

      //绘制内圈
      this.moveTo(x + r, y);
      this.arcTo(x + width, y, x + width, y + r, r);
      this.arcTo(x + width, y + height, x + width - r, y + height, r); 
      this.arcTo(x, y + height, x, y + height - r, r);
      this.arcTo(x, y, x + r, y, r);
      
      if(shadow){
        this.shadowColor = "#B0B0B0";
        this.shadowBlur = 8;
        this.shadowOffsetX = 3;
        this.shadowOffsetY = 3;
      }
      if (fill) { this.fill(); }
      if (stroke) { this.stroke(); }
      this.restore(); 
    }

    //canvas单行文本自动省略
    this.cacheCtx.fittingString = function(str, maxWidth) {
      let strWidth = this.measureText(str).width;
      const ellipsis = '…';
      const ellipsisWidth = this.measureText(ellipsis).width;
      if (strWidth <= maxWidth || maxWidth <= ellipsisWidth) {
        return str;
      } else {
        var len = str.length;
        while (strWidth >= maxWidth - ellipsisWidth && len-- > 0) {
          str = str.slice(0, len);
          strWidth = this.measureText(str).width;
        }
        return str + ellipsis;
      }
    }
  }

  //根据数据更新视图
  update(newData) {
    //外部可能会改变data指向，当改变data指向时，调用该方法传入新的data
    //并且清空聚焦节点
    if(newData) {
      this._data = newData
      this.focusTarget = {}
    }

    //先清空最大宽高记录以便重新计算
    this.maxWidth = 0
    this.maxHeight = 0

    var _this = this
    var ctx = this.ctx, cacheCtx = this.cacheCtx
    ctx.font = cacheCtx.font = '15px ' + this.fontFamily
    
    //开始缓存canvas绘制
    cacheCtx.save()
    cacheCtx.clearRect(0, 0, this.width, this.height)
    cacheCtx.translate(-this.scrollLeft, -this.scrollTop)
    cacheCtx.scale(this.scaleRatio, this.scaleRatio)
    //绘制连线
    this._drawLine()
    //绘制实体
    this._drawNodes()
    //绘制备注信息
    this._drawMark()
    //绘制文本备注信息
    this._drawNote();
    cacheCtx.restore()
    
    //开始真实canvas绘制
    ctx.save()
    ctx.clearRect(0, 0, this.width, this.height)
    ctx.translate(-this.scrollLeft, -this.scrollTop)
    ctx.scale(this.scaleRatio, this.scaleRatio)
    //绘制底纹
    this._drawShading()
    ctx.restore()
    ctx.drawImage(this.cacheEl, 0, 0)

    //设置滚动条
    this.resetScroll()

    //绘制缩略图canvas
    this._drawThumbnail()
    //绘制锁定图标
    this.editable===2 && this._drawLock()
  }

  //绘制锁
  _drawLock() {
    var ctx = this.ctx,
    lockInfo = {x: this.width-40-0.5, y: 25-0.5, w: 20-0.5, h: 14-0.5}
    
    ctx.save()
    ctx.fillStyle = "#eeb174"
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 3
    ctx.beginPath();
    ctx.arc(lockInfo.x+lockInfo.w/2, lockInfo.y-3, lockInfo.w/3, 0, Math.PI, 1)
    ctx.stroke()
    ctx.drawRoundedRect(lockInfo.x, lockInfo.y, lockInfo.w, lockInfo.h, 2, true, true, false, false)//绘制圆角矩形

    ctx.restore()
  }

  //绘制画布底纹
  _drawShading(){
    var ctx = this.ctx, _this = this,
    // w = Math.max(this.maxWidth+this.bufferWidth, this.width)/(this.scaleRatio<1?this.scaleRatio:1), h = Math.max(this.maxHeight+this.bufferWidth, this.height)/(this.scaleRatio<1?this.scaleRatio:1)
    max = Math.max(this.maxWidth, this.width, this.maxHeight, this.height)/(this.scaleRatio<1?this.scaleRatio:1)
    
    ctx.save()
    var i = 0, gap = 10
    while(i*gap<max){
      ctx.strokeStyle = i%4 ? '#F8F8F8' : '#EBEBEB'
      ctx.beginPath()
      ctx.moveTo(i*gap-0.5, -0.5)
      ctx.lineTo(i*gap-0.5, max-0.5+50)
      ctx.stroke()
      ++i
    }
    
    i = 0
    while(i*gap<max){
      ctx.strokeStyle = i%4 ? '#F8F8F8' : '#EBEBEB'
      ctx.beginPath()
      ctx.moveTo(-0.5, i*gap-0.5)
      ctx.lineTo(max-0.5+50, i*gap-0.5)
      ctx.stroke()
      ++i
    }
    
    ctx.restore()
  }

  //绘制连线
  _drawLine() {
    var ctx = this.cacheCtx, _this = this
    
    this._data.linkDataArray.forEach(item => {
      ctx.save()

      ctx.strokeStyle = item === _this.focusTarget || item === _this.hoverTarget ? '#477DE9' : '#000'
      ctx.lineWidth = item === _this.focusTarget ? 3 : 1
      //根据是否是外键判断是否需要绘制虚线
      item.type==='foreignKey' && ctx.setLineDash([8, 5])
      item.pos.forEach((pointItem, pointIdx) => {
        if(pointIdx === 0){
          ctx.beginPath()
          ctx.moveTo(pointItem.x+0.5,pointItem.y+0.5)
        }else{
          ctx.lineTo(pointItem.x+0.5,pointItem.y+0.5)
        }

        //记录最大宽高
        if(pointItem.x > _this.maxWidth) _this.maxWidth = pointItem.x
        if(pointItem.y > _this.maxHeight) _this.maxHeight = pointItem.y
      })
      ctx.stroke()

      //绘制线对应关系
      _this._drawLineRelation(item)

      ctx.restore()
    });
  }

  //绘制线对应关系
  _drawLineRelation(item){
    var ctx = this.cacheCtx, w = 15, posLen = item.pos.length

    ctx.save()
    ctx.beginPath()
    ctx.setLineDash([0, 0])
    //绘制起点标志
    //竖线
    if(item.pos[0].x === item.pos[1].x){
      const dis = item.pos[1].y - item.pos[0].y
      const y = Math.abs(dis) < 10 ? (dis<0 ? item.pos[0].y-1 : item.pos[0].y+1) : dis < 0 ? item.pos[0].y-10 : item.pos[0].y+10
      ctx.moveTo(item.pos[0].x - w/2+0.5, y+0.5)
      ctx.lineTo(item.pos[0].x + w/2+0.5, y+0.5)
    }
    //横线
    else{
      const dis = item.pos[1].x - item.pos[0].x
      const x = Math.abs(dis) < 10 ? (dis<0 ? item.pos[0].x-1 : item.pos[0].x+1) : dis < 0 ? item.pos[0].x-10 : item.pos[0].x+10
      ctx.moveTo(x+0.5, item.pos[0].y - w/2+0.5)
      ctx.lineTo(x+0.5, item.pos[0].y + w/2+0.5)
    }

    //绘制终点标志
    //竖线
    if(item.pos[posLen-2].x === item.pos[posLen-1].x){
      const dis = item.pos[posLen-1].y - item.pos[posLen-2].y
      const y = Math.abs(dis) < 10 ? (dis<0 ? item.pos[posLen-1].y+1 : item.pos[posLen-1].y-1) : dis < 0 ? item.pos[posLen-1].y+10 : item.pos[posLen-1].y-10
      ctx.moveTo(item.pos[posLen-1].x - w/2+0.5, y+0.5)
      ctx.lineTo(item.pos[posLen-1].x + w/2+0.5, y+0.5)
      ctx.stroke()
      //绘制分叉
      if([1,2].includes(item.numLineTypes)){
        ctx.moveTo(item.pos[posLen-1].x - w/2+0.5, item.pos[posLen-1].y+0.5)
        ctx.lineTo(item.pos[posLen-1].x+0.5, y+0.5)
        ctx.lineTo(item.pos[posLen-1].x + w/2+0.5, item.pos[posLen-1].y+0.5)
        ctx.stroke()
      }
      //绘制圆圈
      if([1,4].includes(item.numLineTypes)){
        ctx.beginPath()
        const arcX = item.pos[posLen-1].x
        const arcY = dis<0? (y+w/2) : (y-w/2)
        ctx.arc(arcX, arcY, (w-2)/2, 0, 360, false);
        ctx.fillStyle="#fff";
        ctx.fill();
        ctx.stroke()
      }
    }
    //横线
    else{
      const dis = item.pos[posLen-1].x - item.pos[posLen-2].x
      const x = Math.abs(dis) < 10 ? (dis<0 ? item.pos[posLen-1].x+1 : item.pos[posLen-1].x-1) : dis < 0 ? item.pos[posLen-1].x+10 : item.pos[posLen-1].x-10
      ctx.moveTo(x+0.5, item.pos[posLen-1].y - w/2+0.5)
      ctx.lineTo(x+0.5, item.pos[posLen-1].y + w/2+0.5)
      ctx.stroke()
      //绘制分叉
      if([1,2].includes(item.numLineTypes)){
        ctx.moveTo(item.pos[posLen-1].x+0.5, item.pos[posLen-1].y - w/2+0.5)
        ctx.lineTo(x+0.5, item.pos[posLen-1].y+0.5)
        ctx.lineTo(item.pos[posLen-1].x+0.5, item.pos[posLen-1].y + w/2+0.5)
        ctx.stroke()
      }
      //绘制圆圈
      if([1,4].includes(item.numLineTypes)){
        ctx.beginPath()
        const arcX = dis<0? (x+w/2) : (x-w/2)
        const arcY = item.pos[posLen-1].y
        ctx.arc(arcX, arcY, (w-2)/2, 0, 360, false);
        ctx.fillStyle="#fff";
        ctx.fill();
        ctx.stroke()
      }
    }

    ctx.restore()
  }

  //绘制所有实体
  _drawNodes() {
    var _this = this

    this._data.nodeDataArray.forEach(item => {
      (item!==_this.focusTarget) && _this._drawNode(item)
    });

    this.focusTarget && (this.focusTarget.attributes||this.focusTarget.type==="inclusive"||this.focusTarget.type==="exclusive") && _this._drawNode(this.focusTarget)
  }

  //绘制单个实体
  _drawNode(item){
    var ctx = this.cacheCtx

    ctx.save()
    var w = Number(item.width) || 100
    var h = Number(item.height) || 50
    var x = Number(item.loc.x)
    var y = Number(item.loc.y)
    
    ctx.strokeStyle = item === this.focusTarget || item === this.hoverTarget ? '#477DE9' : '#000'
    ctx.fillStyle = item.bgC || '#fff'
    //分支节点
    if(['exclusive', 'inclusive'].includes(item.type)){
      ctx.beginPath();
      ctx.arc(x+w/2+0.5,y+w/2+0.5,w/2,0,Math.PI,1)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      if(item.type === 'exclusive'){
        ctx.moveTo(x+12, y+6)
        ctx.lineTo(x+w-12, y+h-3)
        ctx.moveTo(x+w-12, y+6)
        ctx.lineTo(x+12, y+h-3)
        ctx.stroke();
      }
    }
    //圆角矩形
    else{
      ctx.drawRoundedRect(x+0.5, y+0.5, w, h, item.quotePrimaryKey ? 4 : 0, true, true, item.physicalTables&&item.physicalTables.length>1, true)//绘制圆角矩形
    }

    //绘制表名
    item.tableName && this._drawTitle(item.tableName, w, x, y);
    
    //绘制表体文字
    item.attributes && this._drawBody(item.attributes, w, h, x, y, item.bgC);
    
    //绘制检出状态
    if(item.checkoutInfo && item.checkoutInfo.imgUrl){
      //已经加载完成 -> 直接绘制
      if(this.imgList[item.key]){
        const bdC = item.checkoutInfo.operator === 1 ? '#53C41B' : '#477DE9'
        this._drawIcon(this.imgList[item.key], w, x, y, bdC)
      }
      //未加载完成 -> 先进行缓存
      else{
        this._loadImg(item)
      }
    }

    //记录最大宽高
    if(x+w > this.maxWidth) this.maxWidth = x+w
    if(y+h > this.maxHeight) this.maxHeight = y+h
    
    //绘制聚焦节点标识
    if(item === this.focusTarget && !['exclusive', 'inclusive'].includes(item.type)) this._drawFocus(x, y,w, h)

    ctx.restore()
  }

  //绘制聚焦标识
  _drawFocus(x, y, w, h){
    var ctx = this.cacheCtx

    ctx.save()

    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#B4B4B4'
    ctx.shadowColor = "#DADADA";
    ctx.shadowBlur = 5;
    ctx.fillRect(x-3, y-3, 6, 6)
    ctx.fillRect(x+w/2-3, y-3, 6, 6)
    ctx.fillRect(x+w-3, y-3, 6, 6)
    ctx.fillRect(x-3, y+h/2-3, 6, 6)
    ctx.fillRect(x+w-3, y+h/2-3, 6, 6)
    ctx.fillRect(x-3, y+h-3, 6, 6)
    ctx.fillRect(x+w/2-3, y+h-3, 6, 6)
    ctx.fillRect(x+w-3, y+h-3, 6, 6)

    ctx.strokeRect(x-3+0.5, y-3+0.5, 6, 6)
    ctx.strokeRect(x+w/2-3+0.5, y-3+0.5, 6, 6)
    ctx.strokeRect(x+w-3+0.5, y-3+0.5, 6, 6)
    ctx.strokeRect(x-3+0.5, y+h/2-3+0.5, 6, 6)
    ctx.strokeRect(x+w-3+0.5, y+h/2-3+0.5, 6, 6)
    ctx.strokeRect(x-3+0.5, y+h-3+0.5, 6, 6)
    ctx.strokeRect(x+w/2-3+0.5, y+h-3+0.5, 6, 6)
    ctx.strokeRect(x+w-3+0.5, y+h-3+0.5, 6, 6)
    
    ctx.restore()
  }

  //绘制表名
  _drawTitle (tableName, w, x, y) {
    var ctx = this.cacheCtx, _this = this

    ctx.save()
    // 设置字体
    ctx.font = "15px " + this.fontFamily;
    // 设置颜色
    ctx.fillStyle = "#000";
    // 设置水平对齐方式
    ctx.textAlign = "left";
    // 设置垂直对齐方式
    ctx.textBaseline = "top";
    ctx.fillText(ctx.fittingString(tableName, w-14), x, y-24)
    ctx.restore()
  }

  //绘制表信息
  _drawBody (attributes = [], w, h, x, y, bgC='#fff'){
    var ctx = this.cacheCtx, _this = this, padding = 8, lineHeight = 16
    ctx.save()
    // 设置字体
    ctx.font = "15px " + this.fontFamily;
    // 设置颜色
    ctx.fillStyle = this.isLight(bgC)? "#000" : "#fff";
    // 设置水平对齐方式
    ctx.textAlign = "left";
    // 设置垂直对齐方式
    ctx.textBaseline = "top";

    //处理主键&非主键
    var primaryKeyList = [], nonPrimaryKeyList = []
    attributes.forEach(item => {
      item.primaryKey ? primaryKeyList.push(item) : nonPrimaryKeyList.push(item)
    })
    
    //绘制主键
    primaryKeyList.forEach((item, idx) => {
      var textY = padding + y + idx*lineHeight
      //判断是否超出实体框
      if(textY+16 <= h+y) {
        //绘制PF标识
        let attrNameIndent = 0
        if(item.foreignKey){
          attrNameIndent = 18
          ctx.save()
          // 设置字体
          ctx.font = "12px " + this.fontFamily;
          // 设置颜色
          ctx.fillStyle = '#4D55D0'
          ctx.fillText('PF ',  padding + x, textY+3)
          ctx.restore()
        }
        
        //开始绘制主键
        ctx.fillText(ctx.fittingString(item.attrName, w-padding*2-attrNameIndent), padding + x + attrNameIndent, textY)
      }
    })

    //绘制主键/非主键分割线
    var primaryKeyEndY = (primaryKeyList.length||1)*lineHeight + y + padding
    if(primaryKeyEndY < h+y){
      ctx.beginPath()
      ctx.strokeStyle = '#000'
      ctx.moveTo(x+0.5, primaryKeyEndY+0.5)
      ctx.lineTo(x+w+0.5, primaryKeyEndY+0.5)
      ctx.stroke()
    }

    //绘制非主键
    nonPrimaryKeyList.forEach((item, idx) => {
      var textY = padding + primaryKeyEndY + idx*lineHeight
      //判断是否超出实体框
      if(textY+16 <= h+y){
        //绘制F标识
        let attrNameIndent = 0
        if(item.foreignKey){
          attrNameIndent = 11
          ctx.save()
          // 设置字体
          ctx.font = "12px " + this.fontFamily;
          // 设置颜色
          ctx.fillStyle = '#4D55D0'
          ctx.fillText('F ',  padding + x, textY+3)
          ctx.restore()
        }

        //开始绘制非主键
        ctx.fillText(ctx.fittingString(item.attrName, w-padding*2-attrNameIndent), padding + x + attrNameIndent, textY )
      }
    })
    ctx.restore()
  }

  //缓存图片元素
  _loadImg (item){
    const _this = this

    //开始图片预加载
    const img = new Image()
    img.src = item.checkoutInfo.imgUrl
    img.onload = function(){
      _this.imgList[item.key] = img
      _this.update()
    }
  }

  //绘制检出标志
  _drawIcon (img, w, x, y, bdC){
    const ctx = this.cacheCtx

    ctx.save()
    ctx.beginPath();
    ctx.strokeStyle = bdC
    ctx.lineWidth = 3
    ctx.arc(x+w-6, y-18, 9, 0, 2*Math.PI);
    ctx.clip()
    ctx.drawImage(img, x+w-15, y-27, 18, 18)
    ctx.stroke()
    ctx.restore()
  }

  //绘制备注信息
  _drawMark () {
    const ctx = this.cacheCtx, _this = this, data = this._data

    data.markDataArray.forEach(item => {
      var w = Number(item.width)
      var h = Number(item.height)
      var x = Number(item.loc.x)
      var y = Number(item.loc.y)

      ctx.save()
      ctx.lineWidth = 2.5
      ctx.strokeStyle = item.bdC || '#000000'
      ctx.drawRoundedRect(x+0.5, y+0.5, w, h, 0, false, true, false, false)//绘制圆角矩形
      ctx.restore()

      //记录最大宽高
      if(x+w > _this.maxWidth) _this.maxWidth = x+w
      if(y+h > _this.maxHeight) _this.maxHeight = y+h
      
      if(item === _this.focusTarget) _this._drawFocus(x, y, w, h)
    })
  }

  //绘制备注文本信息
  _drawNote () {
    const ctx = this.cacheCtx, _this = this, data = this._data

    data.noteDataArray.forEach(item => {
      var w = ctx.measureText(item.text).width
      var h = 16
      var x = Number(item.loc.x)
      var y = Number(item.loc.y)

      ctx.save()
      // 设置字体
      ctx.font = "15px " + this.fontFamily;
      // 设置颜色
      ctx.fillStyle = item.color || "#000";
      // 设置水平对齐方式
      ctx.textAlign = "left";
      // 设置垂直对齐方式
      ctx.textBaseline = "top";
      ctx.fillText(item.text, x, y)
      ctx.restore()

      //记录最大宽高
      if(x+w > _this.maxWidth) _this.maxWidth = x+w
      if(y+h > _this.maxHeight) _this.maxHeight = y+h
      
      if(item === _this.focusTarget) _this._drawFocus(x, y-2, w, h)
    })
  }

  //绘制滚动条
  _drawScroll (){
    var ctx = this.ctx

    ctx.save()
    ctx.fillStyle = '#F8F9FA'
    //横向滚动条背景
    ctx.fillRect(0, this.height-10, this.width, 10)
    //竖向滚动条背景
    ctx.fillRect(this.width-10, 0, 10, this.height)

    //横线滚动条
    _drawScrollRect(this.scrollLeft/this.scrollElPar.scrollWidth*this.width, this.height-9, this.width*this.width/this.scrollElPar.scrollWidth, 8, 4)
    //竖向滚动条
    _drawScrollRect(this.width-9, this.scrollTop/this.scrollElPar.scrollHeight*this.height, 8, this.height*this.height/this.scrollElPar.scrollHeight, 4)

    ctx.restore()

    //绘制滚动条
    function _drawScrollRect(x, y, w, h, r){
      ctx.save()
      ctx.fillStyle = '#DFE0E1'
      ctx.drawRoundedRect(x, y, w, h, r, true)
      ctx.restore()
    }
  }

  //根据最新的最大宽高设置滚动条
  resetScroll () {
    // var w = Math.max(this.width, this.maxWidth), h = Math.max(this.height, this.maxHeight)
    // var maxWidth = (w + (w===this.width ? 0 : this.bufferWidth))*this.scaleRatio
    // var maxHeight = (h + (h===this.height ? 0 : this.bufferWidth))*this.scaleRatio
    // this.scrollEl.style.width = maxWidth+'px'
    // this.scrollEl.style.height = maxHeight+'px'

    // if(maxWidth>this.width || maxHeight>this.height) this._drawScroll(maxWidth, maxHeight)
    var max = Math.max(this.width, this.maxWidth, this.height, this.maxHeight)*this.scaleRatio
    this.scrollEl.style.width = this.scrollEl.style.height = max+'px'
    // if(max>this.width || max>this.height) this._drawScroll()
  }

  //重置canvas大小
  resizeCanvas() {
    this.eventFn.resize.fn()
  }

  /**
   * 放大&缩小视图
   * 参数：scale - 原始大小：100；2倍大小200...
   */
  changeCanvasScale (scale){
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.scaleRatio = scale/100
    
    this.update()
  }

  //挂载监听
  addListener (){
    var _this = this, ctx = this.cacheCtx, eventObj = {}

    //在画布上的滚动事件(兼容FF)
    var mousewheel = typeof window.onmousewheel==='object' ? 'mousewheel' : 'DOMMouseScroll'
    //缓存所有事件函数，以便注销事件
    this.eventFn = {
      //鼠标按下
      mousedown: [{
        el: this.el,
        fn: function(ev){
          var data = _this._data, evX = Math.floor((ev.offsetX+_this.scrollLeft)/_this.scaleRatio), evY = Math.floor((ev.offsetY+_this.scrollTop)/_this.scaleRatio)
    
          //查看是否是添加节点
          if(_this.editType === 'addNode'){
            const newNode = Object.assign(_this.addNodeDefaultAttr, {
              loc: {x: evX-25, y: evY-25},
              width: 50, 
              height: 50
            })
    
            _this.externalFn.addNode(newNode)
            _this.addNodeDefaultAttr = {}
            _this.editType = ''
            _this.el.style.cursor = 'default'
            _this.update()
            return
          }
    
          //查看是否是添加框
          if(_this.editType === 'addMark'){
            const newMark = {
              key: _this.createKey(), 
              loc: {x: evX, y: evY},
              width: 0, 
              height: 0,
              type: 'mark'
            }
    
            _this.externalFn.addMark(newMark)
            _this.editType = ''
            _this.el.style.cursor = 'default'
          }
    
          //查看是否添加文本备注
          if(_this.editType === 'addNote'){
            const newNote = {
              key: _this.createKey(), 
              loc: {x: evX, y: evY},
              text: '',
              type: 'note'
            }
    
            _this.externalFn.addNote(newNote)
            _this.editType = ''
            _this.el.style.cursor = 'default'
          }
          
          //查看是否节点触发
          for(let i=0, len=data.nodeDataArray.length; i<len; i++){
            var w = Number(data.nodeDataArray[i].width) || 100
            var h = Number(data.nodeDataArray[i].height) || 50
            var x = Number(data.nodeDataArray[i].loc.x)
            var y = Number(data.nodeDataArray[i].loc.y)
    
            if(_this.focusTarget && evX > x-3 && evX < x+3 && evY > y-3 && evY < y+3){
              console.log('左上角')
              _this.focusTarget = data.nodeDataArray[i]
              eventObj.targetDirection = 'LT'
              eventObj.target = data.nodeDataArray[i]
              return
            }else if(_this.focusTarget && evX > x+w/2-3 && evX < x+w/2+3 && evY > y-3 && evY < y+3){
              console.log('上中')
              _this.focusTarget = data.nodeDataArray[i]
              eventObj.targetDirection = 'TM'
              eventObj.target = data.nodeDataArray[i]
              return
            }else if(_this.focusTarget && evX > x+w-3 && evX < x+w+3 && evY > y-3 && evY < y+3){
              console.log('右上角')
              _this.focusTarget = data.nodeDataArray[i]
              eventObj.targetDirection = 'RT'
              eventObj.target = data.nodeDataArray[i]
              return
            }else if(_this.focusTarget && evX > x-3 && evX < x+3 && evY > y+h/2-3 && evY < y+h/2+3){
              console.log('左中')
              _this.focusTarget = data.nodeDataArray[i]
              eventObj.targetDirection = 'LM'
              eventObj.target = data.nodeDataArray[i]
              return
            }else if(_this.focusTarget && evX > x+w-3 && evX < x+w+3 && evY > y+h/2-3 && evY < y+h/2+3){
              console.log('右中')
              _this.focusTarget = data.nodeDataArray[i]
              eventObj.targetDirection = 'RM'
              eventObj.target = data.nodeDataArray[i]
              return
            }else if(_this.focusTarget && evX > x-3 && evX < x+3 && evY > y+h-3 && evY < y+h+3){
              console.log('左下角')
              _this.focusTarget = data.nodeDataArray[i]
              eventObj.targetDirection = 'LB'
              eventObj.target = data.nodeDataArray[i]
              return
            }else if(_this.focusTarget && evX > x+w/2-3 && evX < x+w/2+3 && evY > y+h-3 && evY < y+h+3){
              console.log('下中')
              _this.focusTarget = data.nodeDataArray[i]
              eventObj.targetDirection = 'BM'
              eventObj.target = data.nodeDataArray[i]
              return
            }else if(_this.focusTarget && evX > x+w-3 && evX < x+w+3 && evY > y+h-3 && evY < y+h+3){
              console.log('右下角')
              _this.focusTarget = data.nodeDataArray[i]
              eventObj.targetDirection = 'RB'
              eventObj.target = data.nodeDataArray[i]
              return
            }else if(evX>x && evX<w+x && evY>y && evY<h+y){
              console.log('节点触发')
              _this.focusTarget = data.nodeDataArray[i]
              eventObj.target = data.nodeDataArray[i]
              eventObj.targetX = evX - x
              eventObj.targetY = evY - y
    
              //查看是否添加连线
              if(_this.editType === 'primaryKey' || _this.editType === 'foreignKey' || _this.editType === 'branchLine'){
                _this.chooseTargets.push(_this.focusTarget)
    
                if(_this.chooseTargets.length === 2){
                  _this.editType === 'branchLine' ? _this.createBranchLine() : _this.createLine(_this.editType)
                  _this.chooseTargets = []
                  _this.editType = ''
                  _this.el.style.cursor = 'default'
                }
              }
              _this.update()
              return
            }else{
              _this.focusTarget = {}
              _this.update()
            }
          }
          
          //查看是否连线触发
          for(let i=0, len=data.linkDataArray.length; i<len; i++){
            for(let j=0, len=data.linkDataArray[i].pos.length; j<len; j++){
              var nextItem = data.linkDataArray[i].pos[j+1]
              
              if(nextItem && evX>=Math.min(data.linkDataArray[i].pos[j].x-5, nextItem.x+5) && evX<=Math.max(data.linkDataArray[i].pos[j].x-5, nextItem.x+5) && evY>=Math.min(data.linkDataArray[i].pos[j].y-5,nextItem.y+5) && evY<=Math.max(data.linkDataArray[i].pos[j].y-5,nextItem.y+5)){
                console.log('线段触发，触发起始点index：'+j)
                _this.focusTarget = data.linkDataArray[i]
                eventObj.target = data.linkDataArray[i]
                eventObj.targetLineStartPointIdx = j
                _this.update()
                return
              }
            }
          }
    
          //查看是否备注文本触发
          for(let i=0, len=data.noteDataArray.length; i<len; i++){
            var w = ctx.measureText(data.noteDataArray[i].text).width
            console.log(w)
            var h = 16
            var x = Number(data.noteDataArray[i].loc.x)
            var y = Number(data.noteDataArray[i].loc.y)
            
            if(evX>=x && evX<=x+w && evY>=y && evY<=y+h){
              console.log('文本触发')
              eventObj.type = 'note'
              _this.focusTarget = data.noteDataArray[i]
              eventObj.target = data.noteDataArray[i]
              eventObj.targetX = evX - x
              eventObj.targetY = evY - y
              _this.update()
              return
            }
          }
    
          //查看是否备注框触发
          for(let i=0, len=data.markDataArray.length; i<len; i++){
            var w = Number(data.markDataArray[i].width)
            var h = Number(data.markDataArray[i].height)
            var x = Number(data.markDataArray[i].loc.x)
            var y = Number(data.markDataArray[i].loc.y)
            if(_this.focusTarget && evX > x+w-3 && evX < x+w+3 && evY > y+h-3 && evY < y+h+3){
              console.log('右下角')
              eventObj.type = 'mark'
              _this.focusTarget = data.markDataArray[i]
              eventObj.targetDirection = 'RB'
              eventObj.target = data.markDataArray[i]
              return
            }else if(_this.focusTarget && evX > x-3 && evX < x+3 && evY > y+h-3 && evY < y+h+3){
              console.log('左下角')
              eventObj.type = 'mark'
              _this.focusTarget = data.markDataArray[i]
              eventObj.targetDirection = 'LB'
              eventObj.target = data.markDataArray[i]
              return
            }else if(_this.focusTarget && evX > x-3 && evX < x+3 && evY > y-3 && evY < y+3){
              console.log('左上角')
              eventObj.type = 'mark'
              _this.focusTarget = data.markDataArray[i]
              eventObj.targetDirection = 'LT'
              eventObj.target = data.markDataArray[i]
              return
            }else if(_this.focusTarget && evX > x+w/2-3 && evX < x+w/2+3 && evY > y-3 && evY < y+3){
              console.log('上中')
              eventObj.type = 'mark'
              _this.focusTarget = data.markDataArray[i]
              eventObj.targetDirection = 'TM'
              eventObj.target = data.markDataArray[i]
              return
            }else if(_this.focusTarget && evX > x+w-3 && evX < x+w+3 && evY > y-3 && evY < y+3){
              console.log('右上角')
              eventObj.type = 'mark'
              _this.focusTarget = data.markDataArray[i]
              eventObj.targetDirection = 'RT'
              eventObj.target = data.markDataArray[i]
              return
            }else if(_this.focusTarget && evX > x-3 && evX < x+3 && evY > y+h/2-3 && evY < y+h/2+3){
              console.log('左中')
              eventObj.type = 'mark'
              _this.focusTarget = data.markDataArray[i]
              eventObj.targetDirection = 'LM'
              eventObj.target = data.markDataArray[i]
              return
            }else if(_this.focusTarget && evX > x+w-3 && evX < x+w+3 && evY > y+h/2-3 && evY < y+h/2+3){
              console.log('右中')
              eventObj.type = 'mark'
              _this.focusTarget = data.markDataArray[i]
              eventObj.targetDirection = 'RM'
              eventObj.target = data.markDataArray[i]
              return
            }else if(_this.focusTarget && evX > x+w/2-3 && evX < x+w/2+3 && evY > y+h-3 && evY < y+h+3){
              console.log('下中')
              eventObj.type = 'mark'
              _this.focusTarget = data.markDataArray[i]
              eventObj.targetDirection = 'BM'
              eventObj.target = data.markDataArray[i]
              return
            }else if(evX>x && evX<w+x && evY>y && evY<h+y){
              console.log('框触发')
              eventObj.type = 'mark'
              _this.focusTarget = data.markDataArray[i]
              eventObj.target = data.markDataArray[i]
              eventObj.targetX = evX - x
              eventObj.targetY = evY - y
    
              _this.update()
              return
            }else{
              _this.focusTarget = {}
              _this.update()
            }
          }
    
    
          //非关键点触发：记录鼠标点-》移动画布
          eventObj.button = ev.button
        },
      },
      {
        el: this.thumbnailEl,
        fn: function(ev){
          // var data = _this._data, evX = Math.floor(ev.offsetX+_this.scrollLeft), evY = Math.floor(ev.offsetY+_this.scrollTop)
          eventObj.target = _this.thumbnailEl
        }
      }],
      //鼠标抬起
      mouseup: [{
        el: this.el,
        fn: function(ev){
          eventObj = {}
        }
      },{
        el: this.thumbnailEl,
        fn: function(ev){
          eventObj = {}
        }
      }],
      //鼠标移出
      mouseout:[{
        el: this.el,
        fn: function(ev){
          eventObj = {}
        }
      },{
        el: this.thumbnailEl,
        fn: function(ev){
          eventObj = {}
        }
      }],
      //鼠标移动
      mousemove: [{
        el: this.el,
        fn: function(ev){
        var fn = _this.throttle(function(){
          var data = _this._data, evX = Math.floor((ev.offsetX+_this.scrollLeft)/_this.scaleRatio), evY = Math.floor((ev.offsetY+_this.scrollTop)/_this.scaleRatio)
          //按住节点/线操作
          if(_this.editable===1 && eventObj.target && !eventObj.type && !_this.editType){
            
            //移动焦点在角上
            if(eventObj.targetDirection){
              // console.log('尺寸修改')
              //修改尺寸
              _this.resizeNode(evX, evY, eventObj)
            } 
            //移动焦点在节点上
            else if(eventObj.target.loc){
              var nodeNewLoc = {x: (evX-eventObj.targetX), y: (evY-eventObj.targetY)}
              if((eventObj.target.loc.x===nodeNewLoc.x)&&(eventObj.target.loc.y===nodeNewLoc.y)) return
              
              //节点相关线段移动
              data.linkDataArray.forEach(item => {
                if(item.from === eventObj.target.key || item.to === eventObj.target.key){
                  item.from===item.to ? _this.moveLineForSameNode(item, eventObj) : _this.moveLineForNode(item, eventObj, nodeNewLoc)
                }
              })
              
              //节点自身移动
              eventObj.target.loc = nodeNewLoc
            }
            //移动焦点在线段上
            else{
              var mouseLoc = {x: evX, y: evY}
              for(let i=0,len=eventObj.target.pos.length-1; i<len; i++){
                if(eventObj.lastEvLoc && isPointBelongLine(eventObj.lastEvLoc, [eventObj.target.pos[i], eventObj.target.pos[i+1]])){
                  eventObj.targetLineStartPointIdx = i
                  break
                }
              }
              eventObj.lastEvLoc = mouseLoc
              console.log('线段移动中，' + eventObj.targetLineStartPointIdx)
              _this.moveLineForLine(eventObj, mouseLoc)
            }
      
            _this.update()
  
            //判断鼠标位置是否在当前线段上
            function isPointBelongLine(pointLoc, lineLoc){
              //竖线
              if(lineLoc[0].x === lineLoc[1].x){
                var min = Math.min(lineLoc[0].y, lineLoc[1].y),
                max = Math.max(lineLoc[0].y, lineLoc[1].y)
                // console.log('竖线')
                return pointLoc.y > min && pointLoc.y < max && pointLoc.x===lineLoc[0].x
              }
              //横线
              else if(lineLoc[0].y === lineLoc[1].y){
                var min = Math.min(lineLoc[0].x, lineLoc[1].x),
                max = Math.max(lineLoc[0].x, lineLoc[1].x)
                
                return pointLoc.x > min && pointLoc.x < max && pointLoc.y===lineLoc[0].y
              }
              //斜线
              else{
                console.error('isPointBelongLine方法接收参数错误：传入lineLoc是一条斜线')
              }
            }
          }
          //按住备注框操作
          else if(_this.editable===1 && eventObj.target && eventObj.type==='mark'){
            //移动焦点在角上
            if(eventObj.targetDirection){
              _this.resizeNode(evX, evY, eventObj, 1)
            } 
            //移动焦点在节点上
            else if(eventObj.target.loc){
              //节点自身移动
              var nodeNewLoc = {x: (evX-eventObj.targetX), y: (evY-eventObj.targetY)}
              eventObj.target.loc = nodeNewLoc
            }
            _this.update()
          }
          //按住备注文字操作
          else if(_this.editable===1 && eventObj.target && eventObj.type==='note'){
            var noteNewLoc = {x: (evX-eventObj.targetX), y: (evY-eventObj.targetY)}
            eventObj.target.loc = noteNewLoc
            _this.update()
          }
          //不是按住节点操作：悬停时改变光标样式
          else{
            
            //按住画布拖动 -> 移动画布
            if(typeof eventObj.button === 'number'){
              _this.el.style.cursor = 'move'
              _this.scrollElPar.scrollTop = _this.scrollTop - ev.movementY
              _this.scrollElPar.scrollLeft = _this.scrollLeft - ev.movementX
            }
            //添加节点状态
            else if(_this.editType === 'addNode'){
              _this.el.style.cursor = 'crosshair'
            }
            //添加框状态
            else if(_this.editType === 'addMark'){
              _this.el.style.cursor = 'crosshair'
            }
            //添加文本状态
            else if(_this.editType === 'addNote'){
              _this.el.style.cursor = 'text'
            }
            //添加连线状态
            else if(_this.editType === 'primaryKey' || _this.editType === 'foreignKey' || _this.editType === 'branchLine'){
              _this.el.style.cursor = 'crosshair'
            }
            //之前没有具体操作时 -> 改变鼠标样式
            else{
              //查看是否到达连线位置
              for(let i=0, len=data.linkDataArray.length; i<len; i++){
                for(let j=0, len=data.linkDataArray[i].pos.length; j<len; j++){
                  var nextItem = data.linkDataArray[i].pos[j+1]
                  if(nextItem && evX>=Math.min(data.linkDataArray[i].pos[j].x-5, nextItem.x+5) && evX<=Math.max(data.linkDataArray[i].pos[j].x-5, nextItem.x+5) && evY>=Math.min(data.linkDataArray[i].pos[j].y-5,nextItem.y+5) && evY<=Math.max(data.linkDataArray[i].pos[j].y-5,nextItem.y+5)){
                    console.log('线')
                    _this.hoverTarget = data.linkDataArray[i]
                    _this.el.style.cursor = 'move'
                    _this.update()
                    return
                  }
                }
              }
    
              //查看是否节点触发
              for(let i=0, len=data.nodeDataArray.length; i<len; i++){
                var w = Number(data.nodeDataArray[i].width) || 100
                var h = Number(data.nodeDataArray[i].height) || 50
                var x = Number(data.nodeDataArray[i].loc.x)
                var y = Number(data.nodeDataArray[i].loc.y)
    
                if(_this.focusTarget && evX > x-3 && evX < x+3 && evY > y-3 && evY < y+3){
                  console.log('左上角')
                  _this.hoverTarget = data.nodeDataArray[i]
                  _this.el.style.cursor = 'se-resize'
                  _this.update()
                  return
                }else if(_this.focusTarget && evX > x+w/2-3 && evX < x+w/2+3 && evY > y-3 && evY < y+3){
                  console.log('上中')
                  _this.hoverTarget = data.nodeDataArray[i]
                  _this.el.style.cursor = 's-resize'
                  _this.update()
                  return
                }else if(_this.focusTarget && evX > x+w-3 && evX < x+w+3 && evY > y-3 && evY < y+3){
                  console.log('右上角')
                  _this.hoverTarget = data.nodeDataArray[i]
                  _this.el.style.cursor = 'ne-resize'
                  _this.update()
                  return
                }else if(_this.focusTarget && evX > x-3 && evX < x+3 && evY > y+h/2-3 && evY < y+h/2+3){
                  console.log('左中')
                  _this.hoverTarget = data.nodeDataArray[i]
                  _this.el.style.cursor = 'w-resize'
                  _this.update()
                  return
                }else if(_this.focusTarget && evX > x+w-3 && evX < x+w+3 && evY > y+h/2-3 && evY < y+h/2+3){
                  console.log('右中')
                  _this.hoverTarget = data.nodeDataArray[i]
                  _this.el.style.cursor = 'w-resize'
                  _this.update()
                  return
                }else if(_this.focusTarget && evX > x-3 && evX < x+3 && evY > y+h-3 && evY < y+h+3){
                  console.log('左下角')
                  _this.hoverTarget = data.nodeDataArray[i]
                  _this.el.style.cursor = 'ne-resize'
                  _this.update()
                  return
                }else if(_this.focusTarget && evX > x+w/2-3 && evX < x+w/2+3 && evY > y+h-3 && evY < y+h+3){
                  console.log('下中')
                  _this.hoverTarget = data.nodeDataArray[i]
                  _this.el.style.cursor = 's-resize'
                  _this.update()
                  return
                }else if(_this.focusTarget && evX > x+w-3 && evX < x+w+3 && evY > y+h-3 && evY < y+h+3){
                  console.log('右下角')
                  _this.hoverTarget = data.nodeDataArray[i]
                  _this.el.style.cursor = 'se-resize'
                  _this.update()
                  return
                }else if(evX>x && evX<w+x && evY>y && evY<h+y){
                  console.log('块')
                  _this.hoverTarget = data.nodeDataArray[i]
                  _this.el.style.cursor = 'move'
                  _this.update()
                  return
                }
              }
  
              //查看是否框触发
              for(let i=0, len=data.markDataArray.length; i<len; i++){
                var w = Number(data.markDataArray[i].width)
                var h = Number(data.markDataArray[i].height)
                var x = Number(data.markDataArray[i].loc.x)
                var y = Number(data.markDataArray[i].loc.y)
    
                if(_this.focusTarget && evX > x-3 && evX < x+3 && evY > y-3 && evY < y+3){
                  console.log('左上角')
                  _this.hoverTarget = data.markDataArray[i]
                  _this.el.style.cursor = 'se-resize'
                  _this.update()
                  return
                }else if(_this.focusTarget && evX > x+w/2-3 && evX < x+w/2+3 && evY > y-3 && evY < y+3){
                  console.log('上中')
                  _this.hoverTarget = data.markDataArray[i]
                  _this.el.style.cursor = 's-resize'
                  _this.update()
                  return
                }else if(_this.focusTarget && evX > x+w-3 && evX < x+w+3 && evY > y-3 && evY < y+3){
                  console.log('右上角')
                  _this.hoverTarget = data.markDataArray[i]
                  _this.el.style.cursor = 'ne-resize'
                  _this.update()
                  return
                }else if(_this.focusTarget && evX > x-3 && evX < x+3 && evY > y+h/2-3 && evY < y+h/2+3){
                  console.log('左中')
                  _this.hoverTarget = data.markDataArray[i]
                  _this.el.style.cursor = 'w-resize'
                  _this.update()
                  return
                }else if(_this.focusTarget && evX > x+w-3 && evX < x+w+3 && evY > y+h/2-3 && evY < y+h/2+3){
                  console.log('右中')
                  _this.hoverTarget = data.markDataArray[i]
                  _this.el.style.cursor = 'w-resize'
                  _this.update()
                  return
                }else if(_this.focusTarget && evX > x-3 && evX < x+3 && evY > y+h-3 && evY < y+h+3){
                  console.log('左下角')
                  _this.hoverTarget = data.markDataArray[i]
                  _this.el.style.cursor = 'ne-resize'
                  _this.update()
                  return
                }else if(_this.focusTarget && evX > x+w/2-3 && evX < x+w/2+3 && evY > y+h-3 && evY < y+h+3){
                  console.log('下中')
                  _this.hoverTarget = data.markDataArray[i]
                  _this.el.style.cursor = 's-resize'
                  _this.update()
                  return
                }else if(_this.focusTarget && evX > x+w-3 && evX < x+w+3 && evY > y+h-3 && evY < y+h+3){
                  console.log('右下角')
                  _this.hoverTarget = data.markDataArray[i]
                  _this.el.style.cursor = 'se-resize'
                  _this.update()
                  return
                }else if(evX>x && evX<w+x && evY>y && evY<h+y){
                  console.log('块')
                  _this.hoverTarget = data.markDataArray[i]
                  _this.el.style.cursor = 'move'
                  _this.update()
                  return
                }
              }
  
              //查看是否备注文本触发
              for(let i=0, len=data.noteDataArray.length; i<len; i++){
                var w = ctx.measureText(data.noteDataArray[i].text).width
                var h = 16
                var x = Number(data.noteDataArray[i].loc.x)
                var y = Number(data.noteDataArray[i].loc.y)
                
                if(evX>=x && evX<=x+w && evY>=y && evY<=y+h){
                  _this.hoverTarget = data.noteDataArray[i]
                  _this.el.style.cursor = 'move'
                  _this.update()
                  return
                }
              }
    
              //空白处
              _this.el.style.cursor = 'default'
              _this.hoverTarget = {}
              _this.update()
            }
          }
        })
  
        fn(ev)
        }
      },
      //缩略图移动方法
      {
        el: this.thumbnailEl,
        fn: function(ev){
          var fn = _this.throttle(function(){
            //移动缩略图canvas
            if(eventObj.target === _this.thumbnailEl){
              // _this.thumbnailEl.style.right = Number(_this.thumbnailEl.style.right.replace(/px/,'')) - ev.movementX + 'px'
              // _this.thumbnailEl.style.bottom = Number(_this.thumbnailEl.style.bottom.replace(/px/,'')) - ev.movementY + 'px'
              // debugger
              _this.scrollElPar.scrollTop = _this.scrollTop + ev.movementY*_this.scaleRatio/_this.thumbnailScale
              _this.scrollElPar.scrollLeft = _this.scrollLeft + ev.movementX*_this.scaleRatio/_this.thumbnailScale
            }
          })

          fn(ev)
        }
      }],
      //键盘抬起
      keyup: {
        el: window,
        fn: function(ev){
          //删除
          if(_this.editable===1 && ev.keyCode === 46 && Object.keys(_this.focusTarget).length){
            //实体
            if(_this.focusTarget.attributes){
              _this.externalFn.delNode && _this.externalFn.delNode(_this.focusTarget.key)
            }
            //分支
            else if(['exclusive', 'inclusive'].includes(_this.focusTarget.type)){
              _this.externalFn.delFilter && _this.externalFn.delFilter(_this.focusTarget.key)
            }
            //连线
            else if(['primaryKey', 'foreignKey', 'toFilter', 'fromFilter'].includes(_this.focusTarget.type)){
              _this.externalFn.delLine && _this.externalFn.delLine(_this.focusTarget.key)
            }
            //框
            else if(_this.focusTarget.type === 'mark'){
              _this.externalFn.delMark && _this.externalFn.delMark(_this.focusTarget.key)
            }
            //备注文本
            else if(_this.focusTarget.type === 'note'){
              _this.externalFn.delNote && _this.externalFn.delNote(_this.focusTarget.key)
            }
            //未检测到
            else{
              console.error(`未检测到删除对象所属类型：${_this.focusTarget}`)
            }
            _this.focusTarget = {}
          }
          //ESC终止创建
          else if(ev.keyCode === 27){
            _this.editType = ''
            _this.chooseTargets = []
            _this.el.style.cursor = 'default'
          }
        }
      },
      //窗口尺寸改变
      resize: {
        el: window,
        fn: function(){
          var fn = _this.throttle(function(){
            const w = _this.parentEl.clientWidth
            const h = _this.parentEl.clientHeight
      
            _this.el.width = _this.cacheEl.width = _this.width = w
            _this.el.height = _this.cacheEl.height = _this.height = h
      
            _this.update()
          }, 100)

          fn()
        }
      },
      //双击事件
      dblclick: {
        el: this.el,
        fn: function(ev){
          if(Object.keys(_this.focusTarget).length){
            //实体
            if(_this.focusTarget.attributes){
              _this.externalFn.dbEntity && _this.externalFn.dbEntity(_this.focusTarget.key)
            }
            //分支
            else if(['exclusive', 'inclusive'].includes(_this.focusTarget.type)){
              _this.externalFn.dbFilter && _this.externalFn.dbFilter(_this.focusTarget.key)
            }
            //连线
            else if(['primaryKey', 'foreignKey', 'toFilter', 'fromFilter'].includes(_this.focusTarget.type)){
              _this.externalFn.dbLine && _this.externalFn.dbLine(_this.focusTarget.key)
            }
            //框
            else if(_this.focusTarget.type === 'mark'){
              _this.externalFn.dbMark && _this.externalFn.dbMark(_this.focusTarget.key)
            }
            //备注文本
            else if(_this.focusTarget.type === 'note'){
              _this.externalFn.dbNote && _this.externalFn.dbNote(_this.focusTarget.key)
            }
            //未检测到
            else{
              console.error(`未检测到双击对象所属类型：${_this.focusTarget}`)
            }
          }
        }
      },
      //滚动事件
      scroll: {
        el: this.scrollElPar,
        fn: function(ev){
          _this.scrollTop = ev.target.scrollTop
          _this.scrollLeft = ev.target.scrollLeft
          _this.update()
        }
      },
      //滚轮事件
      [mousewheel]: {
        el: this.el,
        fn: function(ev){
          var dis = mousewheel === 'mousewheel' ? 30 : -30
          console.log('滚动')
          //chrome向下
          if(ev.wheelDelta < 0){
            _this.scrollElPar.scrollTop = _this.scrollTop + dis
          }
          //chrome向上
          else{
            _this.scrollElPar.scrollTop = _this.scrollTop - dis
          }
        }
      }
    }
    
    //循环事件对象 -> 挂载事件
    for(const eventName in this.eventFn){
      const eventArr = Array.isArray(this.eventFn[eventName]) ? this.eventFn[eventName] : [this.eventFn[eventName]]
      
      for(const eventItem of eventArr){
        eventItem.el.addEventListener(eventName, eventItem.fn)
      }
    }

  }

  //事件销毁机制
  removeListener (){
    //循环注销当前画布的所有事件
    for(let eventName in this.eventFn){
      const eventArr = Array.isArray(this.eventFn[eventName]) ? this.eventFn[eventName] : [this.eventFn[eventName]]
      
      for(const eventItem of eventArr){
        eventItem.el.removeEventListener(eventName, eventItem.fn)
      }
    }
  }

  //找到连线点在节点的哪条边上
  getPointBelongBord (nodeInfo, pointInfo){
    if(pointInfo.x === nodeInfo.loc.x){
      return 'L'
    }else if(pointInfo.x === nodeInfo.loc.x+nodeInfo.width){
      return 'R'
    }else if(pointInfo.y === nodeInfo.loc.y){
      return 'T'
    }else if(pointInfo.y === nodeInfo.loc.y+nodeInfo.height){
      return 'B'
    }else{
      console.error('getPointBelongBord未找到匹配边，detail:', JSON.parse(JSON.stringify(nodeInfo)),JSON.parse(JSON.stringify(pointInfo)))
    }
  }

  //修改节点尺寸
  resizeNode (evX, evY, eventObj, minWidth=50){
    //分支不允许修改尺寸
    if(['exclusive', 'inclusive'].includes(eventObj.target.type)) return

    //开始修改尺寸逻辑
    var _this = this
    var copyEventObjTarget = JSON.parse(JSON.stringify(eventObj.target))

    //左上
    if(eventObj.targetDirection === 'LT'){
      var newWidth = eventObj.target.width + eventObj.target.loc.x - evX
      var newHeight = eventObj.target.height + eventObj.target.loc.y - evY
      
      eventObj.target.loc.x = newWidth<minWidth? eventObj.target.loc.x : evX
      eventObj.target.loc.y = newHeight<minWidth? eventObj.target.loc.y: evY
      eventObj.target.width = newWidth<minWidth? eventObj.target.width : newWidth
      eventObj.target.height = newHeight<minWidth? eventObj.target.height : newHeight
      moveKeyPoint()
    }
    //上中
    else if(eventObj.targetDirection === 'TM'){
      var newHeight = eventObj.target.height + eventObj.target.loc.y - evY
      
      eventObj.target.loc.y = newHeight<minWidth? eventObj.target.loc.y: evY
      eventObj.target.height = newHeight<minWidth? eventObj.target.height : newHeight
      moveKeyPoint()
    }
    //右上
    else if(eventObj.targetDirection === 'RT'){
      var newWidth = evX - eventObj.target.loc.x
      var newHeight = eventObj.target.height + eventObj.target.loc.y - evY
      
      eventObj.target.loc.y = newHeight<minWidth? eventObj.target.loc.y: evY
      eventObj.target.width = newWidth<minWidth? eventObj.target.width : newWidth
      eventObj.target.height = newHeight<minWidth? eventObj.target.height : newHeight
      moveKeyPoint()
    }
    //左中
    else if(eventObj.targetDirection === 'LM'){
      var newWidth = eventObj.target.width + eventObj.target.loc.x - evX
      
      eventObj.target.loc.x = newWidth<minWidth? eventObj.target.loc.x : evX
      eventObj.target.width = newWidth<minWidth? eventObj.target.width : newWidth
      moveKeyPoint()
    }
    //右中
    else if(eventObj.targetDirection === 'RM'){
      var newWidth = evX - eventObj.target.loc.x
      
      eventObj.target.width = newWidth<minWidth? eventObj.target.width : newWidth
      moveKeyPoint()
    }
    //左下
    else if(eventObj.targetDirection === 'LB'){
      var newWidth = eventObj.target.width + eventObj.target.loc.x - evX
      var newHeight = evY - eventObj.target.loc.y
      
      eventObj.target.loc.x = newWidth<minWidth? eventObj.target.loc.x : evX
      eventObj.target.width = newWidth<minWidth? eventObj.target.width : newWidth
      eventObj.target.height = newHeight<minWidth? eventObj.target.height : newHeight
      moveKeyPoint()
    }
    //下中
    else if(eventObj.targetDirection === 'BM'){
      var newHeight = evY - eventObj.target.loc.y
      
      eventObj.target.height = newHeight<minWidth? eventObj.target.height : newHeight
      moveKeyPoint()
    }
    //右下
    else if(eventObj.targetDirection === 'RB'){
      var newWidth = evX - eventObj.target.loc.x
      var newHeight = evY - eventObj.target.loc.y
      
      eventObj.target.width = newWidth<minWidth? eventObj.target.width : newWidth
      eventObj.target.height = newHeight<minWidth? eventObj.target.height : newHeight
      moveKeyPoint()
    }


    //根据节点最新位置更新该节点上的连线关键点函数
    function moveKeyPoint () {
      //如果方块没有最小宽度限度证明是备注框，无需判断连线
      if(!minWidth) return
      
      _this._data.linkDataArray.forEach(item => {
        //判断该条线的起始节点和终结节点是不同的实体：如果不同走实体影响线的函数；如果相同代表是自己连自己的情况，走单独的函数
        const diffFlag = item.from !== item.to

        if(item.from === eventObj.target.key){
          diffFlag && updateKeyPoint(item, 0)
          diffFlag ? _this.moveLineForNode(item, eventObj, eventObj.target.loc) : _this.moveLineForSameNode(item, eventObj)
        }
        if(item.to === eventObj.target.key){
          diffFlag && updateKeyPoint(item, item.pos.length-1)
          diffFlag ? _this.moveLineForNode(item, eventObj, eventObj.target.loc) : _this.moveLineForSameNode(item, eventObj)
        }
      })

      //更新关键点函数
      function updateKeyPoint(item, idx){
        //左边
        if(item.pos[idx].x === copyEventObjTarget.loc.x){
          item.pos[idx].x = eventObj.target.loc.x
          item.pos[idx].y = item.pos[idx].y < eventObj.target.loc.y ? eventObj.target.loc.y+1 : item.pos[idx].y>eventObj.target.loc.y+eventObj.target.height ? eventObj.target.loc.y+eventObj.target.height-1 : item.pos[idx].y
        }
        //右边
        else if(item.pos[idx].x === copyEventObjTarget.loc.x+copyEventObjTarget.width){
          item.pos[idx].x = eventObj.target.loc.x + eventObj.target.width
          item.pos[idx].y = item.pos[idx].y < eventObj.target.loc.y ? eventObj.target.loc.y+1 : item.pos[idx].y>eventObj.target.loc.y+eventObj.target.height ? eventObj.target.loc.y+eventObj.target.height-1 : item.pos[idx].y
        }
        //上边
        else if(item.pos[idx].y === copyEventObjTarget.loc.y){
          item.pos[idx].x = item.pos[idx].x <= eventObj.target.loc.x ? eventObj.target.loc.x+1 : item.pos[idx].x >= eventObj.target.loc.x + eventObj.target.width ? eventObj.target.loc.x + eventObj.target.width-1 : item.pos[idx].x
          item.pos[idx].y = eventObj.target.loc.y
        }
        //下边
        else if(item.pos[idx].y === copyEventObjTarget.loc.y+copyEventObjTarget.height){
          item.pos[idx].x = item.pos[idx].x <= eventObj.target.loc.x ? eventObj.target.loc.x+1 : item.pos[idx].x >= eventObj.target.loc.x + eventObj.target.width ? eventObj.target.loc.x + eventObj.target.width-1 : item.pos[idx].x
          item.pos[idx].y = eventObj.target.loc.y + eventObj.target.height
        }
      }
    }

  }

  //根据四个边获取坐标点
  getNodePosFromBoreder (targetNode, direction) {
    var pos = {}
    switch (direction) {
      case 'T':
        pos = {
          start: targetNode.loc,
          end: {
            x: targetNode.loc.x+targetNode.width,
            y: targetNode.loc.y
          }
        }
        break
      case 'B':
        pos = {
          start: {
            x: targetNode.loc.x,
            y: targetNode.loc.y+targetNode.height
          },
          end: {
            x: targetNode.loc.x+targetNode.width,
            y: targetNode.loc.y+targetNode.height
          }
        }
        break
      case 'L':
        pos = {
          start: targetNode.loc,
          end: {
            x: targetNode.loc.x,
            y: targetNode.loc.y+targetNode.height
          }
        }
        break
      case 'R':
        pos = {
          start: {
            x: targetNode.loc.x+targetNode.width,
            y: targetNode.loc.y
          },
          end: {
            x: targetNode.loc.x+targetNode.width,
            y: targetNode.loc.y+targetNode.height
          }
        }
        break
    }
    return pos
  }

  //更新 节点移动 触发的更改线条路径
  moveLineForNode (linkInfo, eventObj, nodeNewLoc) {
    var fromNode, toNode, total = 0, posMaxIdx = linkInfo.pos.length - 1,
    distance = {x: nodeNewLoc.x - eventObj.target.loc.x, y: nodeNewLoc.y - eventObj.target.loc.y}
    //找到该线段影响的两个节点信息
    this._data.nodeDataArray.forEach(item => {
      if(total === 2){
        return
      }
      if(item.key === linkInfo.from){
        fromNode = item
        ++total
      }
      if(item.key === linkInfo.to){
        toNode = item
        ++total
      }
    });

    var fromNodeBord = this.getPointBelongBord(fromNode, linkInfo.pos[0])
    var toNodeBord = this.getPointBelongBord(toNode, linkInfo.pos[posMaxIdx])

    var moveTargetIsFrom = eventObj.target.key === fromNode.key
    //拖动节点是from节点
    if(moveTargetIsFrom){
      //更新首点定位
      linkInfo.pos[0].x = nodeNewLoc.x + Math.abs(eventObj.target.loc.x - linkInfo.pos[0].x)
      linkInfo.pos[0].y = nodeNewLoc.y + Math.abs(eventObj.target.loc.y - linkInfo.pos[0].y)
    }
    //拖动节点是to节点
    else{
      //更新末点定位
      linkInfo.pos[posMaxIdx].x = nodeNewLoc.x + Math.abs(eventObj.target.loc.x - linkInfo.pos[posMaxIdx].x)
      linkInfo.pos[posMaxIdx].y = nodeNewLoc.y + Math.abs(eventObj.target.loc.y - linkInfo.pos[posMaxIdx].y)
    }

    //根据最新的定位点更新连线点坐标
    //直线情况
    if(posMaxIdx === 1){
      linkInfo.pos.splice(1, 0, {x: linkInfo.pos[0].x , y: linkInfo.pos[0].y}, {x: linkInfo.pos[0].x , y: linkInfo.pos[0].y})
    }
    //二折情况
    else if(posMaxIdx === 2){
      if(fromNodeBord === 'R' && toNodeBord === 'B'){
        //正常向下
        if(this.getNodePosFromBoreder(toNode, 'B').start.y < linkInfo.pos[0].y){
          linkInfo.pos[1] = {x: linkInfo.pos[2].x, y: linkInfo.pos[0].y}
        }
        //变横向一折
        else{
          const idx1X = this.getNodePosFromBoreder(fromNode, 'R').start.x < this.getNodePosFromBoreder(toNode, 'L').start.x ? this.getNodePosFromBoreder(toNode, 'L').start.x : this.getNodePosFromBoreder(toNode, 'R').start.x
          linkInfo.pos[1] = {x: idx1X+(moveTargetIsFrom ? 0 :distance.x), y: linkInfo.pos[0].y+distance.y}
          linkInfo.pos.splice(2)
        }

        //向右变竖向一折
        if(linkInfo.pos[2] && linkInfo.pos[2].x <= linkInfo.pos[0].x){
          linkInfo.pos[0] = {x: linkInfo.pos[0].x-1, y: fromNode.loc.y+(moveTargetIsFrom ? distance.y: 0)}
          linkInfo.pos[1] = {x: linkInfo.pos[2].x, y: linkInfo.pos[2].y}
          linkInfo.pos.splice(2)
        }
      }
      else if(fromNodeBord === 'B' && toNodeBord === 'R'){
        if(fromNode.loc.y+fromNode.height < linkInfo.pos[1].y){
          linkInfo.pos[1] = {x: linkInfo.pos[0].x, y: linkInfo.pos[2].y}
        }
        //变一折
        else{
          if(['exclusive', 'inclusive'].includes(fromNode.type)){
            linkInfo.pos[1] = {x: linkInfo.pos[0].x, y: Math.max(this.getNodePosFromBoreder(fromNode, 'B').start.y, this.getNodePosFromBoreder(toNode, 'B').start.y)+20}
            linkInfo.pos[2] = {x: toNode.loc.x+Math.floor(toNode.width/2) + (moveTargetIsFrom ? 0 : distance.x), y: linkInfo.pos[1].y}
            linkInfo.pos[3] = {x: linkInfo.pos[2].x, y: this.getNodePosFromBoreder(toNode, 'B').start.y+ (moveTargetIsFrom ? 0 : distance.y)}
          }else{
            linkInfo.pos[0] = {x: fromNode.loc.x+ (eventObj.target.key===fromNode.key ? distance.x : 0), y: linkInfo.pos[1].y}
            linkInfo.pos[1] = {x: linkInfo.pos[2].x, y: linkInfo.pos[2].y}
            linkInfo.pos.splice(2)
          }
        }
        
        if(linkInfo.pos[1].x < toNode.loc.x + toNode.width){
          linkInfo.pos[1].y = toNode.loc.y + (eventObj.target.key===toNode.key ? distance.y : 0)
          linkInfo.pos.splice(2)
        }
      }
      else if(fromNodeBord === 'L' && toNodeBord === 'B'){
        //正常向下
        if(this.getNodePosFromBoreder(toNode, 'B').start.y < linkInfo.pos[0].y){
          linkInfo.pos[1] = {x: linkInfo.pos[2].x, y: linkInfo.pos[0].y}
        }
        //变横向一折
        else{
          linkInfo.pos[1] = {x: toNode.loc.x+toNode.width+(eventObj.target.key === toNode.key? distance.x : 0), y: linkInfo.pos[0].y}
          linkInfo.pos.splice(2)
        }
        //变竖向一折
        if(linkInfo.pos[1].x >= eventObj.target.loc.x && this.getNodePosFromBoreder(toNode, 'B').start.y < this.getNodePosFromBoreder(fromNode, 'T').start.y){
          linkInfo.pos[0] = {x: linkInfo.pos[0].x+(moveTargetIsFrom ? distance.x : 0)-1, y: fromNode.loc.y+(moveTargetIsFrom ? distance.y : 0)}
          linkInfo.pos[1] = {x: linkInfo.pos[2].x, y: linkInfo.pos[2].y}
          linkInfo.pos.splice(2)
        }
      }
      else if(fromNodeBord === 'B' && toNodeBord === 'L'){
        linkInfo.pos[1].x = linkInfo.pos[0].x
        linkInfo.pos[1].y = linkInfo.pos[2].y
        if(linkInfo.pos[1].x > toNode.loc.x){
          linkInfo.pos[1].y = toNode.loc.y+(eventObj.target.key === toNode.key ? distance.y : 0)
          linkInfo.pos.splice(2)
        }
        if(linkInfo.pos[1].y < linkInfo.pos[0].y){
          if(['exclusive', 'inclusive'].includes(fromNode.type)){
            linkInfo.pos[1] = {x: linkInfo.pos[0].x, y: Math.max(this.getNodePosFromBoreder(fromNode, 'B').start.y, this.getNodePosFromBoreder(toNode, 'B').start.y)+20}
            linkInfo.pos[2] = {x: toNode.loc.x+Math.floor(toNode.width/2) + (moveTargetIsFrom ? 0 : distance.x), y: linkInfo.pos[1].y}
            linkInfo.pos[3] = {x: linkInfo.pos[2].x, y: this.getNodePosFromBoreder(toNode, 'B').start.y+ (moveTargetIsFrom ? 0 : distance.y)}
          }else{
            linkInfo.pos[1].x = this.getNodePosFromBoreder(fromNode, 'R').start.x + (eventObj.target.key === fromNode.key ? distance.x : 0)
            linkInfo.pos[1].y = this.getNodePosFromBoreder(fromNode, 'B').start.y + (eventObj.target.key === fromNode.key ? distance.y : 0)
            linkInfo.pos.splice(0, 1)
          }
        }
      }
      else if(fromNodeBord === 'R' && toNodeBord === 'T'){
        linkInfo.pos[1].x = linkInfo.pos[2].x
        linkInfo.pos[1].y = linkInfo.pos[0].y
        if(linkInfo.pos[1].x < linkInfo.pos[0].x){
          linkInfo.pos[1].y = this.getNodePosFromBoreder(fromNode, 'B').start.y + (eventObj.target.key === fromNode.key ? distance.y : 0)
          linkInfo.pos.splice(0, 1)
        }
        if(linkInfo.pos[2] && linkInfo.pos[1].y > linkInfo.pos[2].y){
          if(['exclusive', 'inclusive'].includes(toNode.type)){
            linkInfo.pos[0] = {x: fromNode.loc.x+Math.floor(fromNode.width/2), y: fromNode.loc.y+(moveTargetIsFrom ? distance.y:0)}
            linkInfo.pos[1]= {x: linkInfo.pos[0].x, y: linkInfo.pos[0].y-20}
            linkInfo.pos[2]= {x: linkInfo.pos[2].x, y: linkInfo.pos[1].y}
            linkInfo.pos[3]= {x: linkInfo.pos[2].x, y: toNode.loc.y+ (moveTargetIsFrom ? 0 : distance.y)}
          }else{
            linkInfo.pos[1].x = toNode.loc.x + (moveTargetIsFrom ? 0: distance.x )
            linkInfo.pos[1].y = toNode.loc.y + (moveTargetIsFrom ? 0: distance.y)
            linkInfo.pos.splice(2)
          }
        }
      }
      else if(fromNodeBord === 'T' && toNodeBord === 'R'){
        linkInfo.pos[1].x = linkInfo.pos[0].x
        linkInfo.pos[1].y = linkInfo.pos[2].y
        if(linkInfo.pos[1].x < linkInfo.pos[2].x){
          linkInfo.pos[1].y = this.getNodePosFromBoreder(toNode, 'B').start.y+(eventObj.target.key === toNode.key ? distance.y : 0)
          linkInfo.pos.splice(2)
        }
        if(linkInfo.pos[0].y < linkInfo.pos[1].y ){
          linkInfo.pos[1].x = fromNode.loc.x + (eventObj.target.key === fromNode.key ? distance.x : 0)
          linkInfo.pos[1].y = fromNode.loc.y + (eventObj.target.key === fromNode.key ? distance.y : 0)
          linkInfo.pos.splice(0, 1)
        }
      }
      else if(fromNodeBord === 'T' && toNodeBord === 'L'){
        linkInfo.pos[1].x = linkInfo.pos[0].x
        linkInfo.pos[1].y = linkInfo.pos[2].y
        if(linkInfo.pos[1].x > linkInfo.pos[2].x){
          linkInfo.pos[1].y = this.getNodePosFromBoreder(toNode, 'B').start.y + (eventObj.target.key === toNode.key ? distance.y : 0)
          linkInfo.pos.splice(2)
        }
        if(linkInfo.pos[1].y > linkInfo.pos[0].y){
          linkInfo.pos[1].x = this.getNodePosFromBoreder(fromNode, 'R').start.x + (eventObj.target.key === fromNode.key ? distance.x : 0)
          linkInfo.pos.splice(0, 1)
        }
      }
      else if(fromNodeBord === 'L' && toNodeBord === 'T'){
        linkInfo.pos[1].x = linkInfo.pos[2].x
        linkInfo.pos[1].y = linkInfo.pos[0].y
        if(linkInfo.pos[1].y > linkInfo.pos[2].y){
          if(['exclusive', 'inclusive'].includes(toNode.type)){
            linkInfo.pos[0] = {x: fromNode.loc.x+Math.floor(fromNode.width/2), y: fromNode.loc.y+(moveTargetIsFrom ? distance.y:0)}
            linkInfo.pos[1]= {x: linkInfo.pos[0].x, y: linkInfo.pos[0].y-20}
            linkInfo.pos[2]= {x: linkInfo.pos[2].x, y: linkInfo.pos[1].y}
            linkInfo.pos[3]= {x: linkInfo.pos[2].x, y: toNode.loc.y+ (moveTargetIsFrom ? 0 : distance.y)}
          }else{
            linkInfo.pos[1].x = this.getNodePosFromBoreder(toNode, 'R').start.x + (eventObj.target.key === toNode.key ? distance.x : 0)
            linkInfo.pos.splice(2)
          }
        }
        if(linkInfo.pos[1].x > linkInfo.pos[0].x){
          linkInfo.pos[1].y = this.getNodePosFromBoreder(fromNode, 'B').start.y + (eventObj.target.key === fromNode.key ? distance.y : 0)
          linkInfo.pos.splice(0, 1)
        }
      }
    }
    //三折情况
    else if(posMaxIdx === 3){
      var middleX = Math.floor(Math.abs(linkInfo.pos[0].x - linkInfo.pos[posMaxIdx].x)/2)
      var middleY = Math.floor(Math.abs(linkInfo.pos[0].y - linkInfo.pos[posMaxIdx].y)/2)

      if(fromNodeBord === 'B' && toNodeBord === 'B'){
        // 正常向下移动
        if(this.getNodePosFromBoreder(fromNode, 'T').start.y < this.getNodePosFromBoreder(toNode, 'B').start.y){
          //正常向下
          if(this.getNodePosFromBoreder(fromNode, 'B').start.y < linkInfo.pos[1].y){
            const idx1and2Y = linkInfo.pos[2].y - toNode.loc.y - toNode.height +linkInfo.pos[3].y
            linkInfo.pos[0] = {x: linkInfo.pos[0].x, y: linkInfo.pos[0].y}
            linkInfo.pos[1] = {x: linkInfo.pos[0].x, y: idx1and2Y}
            linkInfo.pos[2] = {x: linkInfo.pos[3].x, y: idx1and2Y}
            // linkInfo.pos[3] = {x: linkInfo.pos[3].x, y: linkInfo.pos[3].y}
          }
          //二折
          else{
            const idx0X = fromNode.loc.x + fromNode.width > linkInfo.pos[3].x ? fromNode.loc.x : fromNode.loc.x + fromNode.width
            const idx1and2Y = linkInfo.pos[2].y - toNode.loc.y - toNode.height +linkInfo.pos[3].y
            linkInfo.pos[0] = {x: idx0X + (eventObj.target.key === fromNode.key?distance.x:0), y: idx1and2Y}
            linkInfo.pos[1] = {x: linkInfo.pos[3].x, y: idx1and2Y}
            linkInfo.pos[2] = {x: linkInfo.pos[3].x, y: linkInfo.pos[3].y}
            //删除最后一位
            linkInfo.pos.splice(3)
          }
        }
        // from和to重合点 -> 变成T to B
        else{
          if(['exclusive', 'inclusive'].includes(fromNode.type)){
            linkInfo.pos[1] = {x: linkInfo.pos[0].x, y: fromNode.loc.y+fromNode.height+20}
            linkInfo.pos[2] = {x: linkInfo.pos[3].x, y: linkInfo.pos[1].y}
          }else{
            console.log('T->B')
            linkInfo.pos[0] = {x: linkInfo.pos[0].x, y: linkInfo.pos[0].y - fromNode.height}
            linkInfo.pos[1] = {x: linkInfo.pos[0].x, y: linkInfo.pos[0].y + Math.floor((fromNode.loc.y-toNode.loc.y-toNode.height)/2)}
            linkInfo.pos[2] = {x: linkInfo.pos[3].x, y: linkInfo.pos[0].y + Math.floor((fromNode.loc.y-toNode.loc.y-toNode.height)/2)}
          }
        }
      }else if(fromNodeBord === 'B' && toNodeBord === 'T'){
        // from高 to低
        if(fromNode.loc.y+fromNode.height < toNode.loc.y){
          linkInfo.pos[1] = {x: linkInfo.pos[0].x, y: linkInfo.pos[0].y + middleY}
          linkInfo.pos[2] = {x: linkInfo.pos[3].x, y: linkInfo.pos[0].y + middleY}
        }
        // from和to重合点 -> 变成B to B
        else if(fromNode.loc.y+fromNode.height >= toNode.loc.y){
          if(['exclusive', 'inclusive'].includes(toNode.type)){
            linkInfo.pos[0] = {x: linkInfo.pos[0].x, y: linkInfo.pos[0].y-fromNode.height}
            linkInfo.pos[1] = {x: linkInfo.pos[0].x, y: linkInfo.pos[0].y-20}
            linkInfo.pos[2] = {x: linkInfo.pos[3].x, y: linkInfo.pos[1].y}
          }else{
            console.log('B->B')
            linkInfo.pos[1] = {x: linkInfo.pos[0].x, y: toNode.loc.y + toNode.height+20 }
            linkInfo.pos[2] = {x: linkInfo.pos[3].x, y: toNode.loc.y + toNode.height+20 }
            linkInfo.pos[3] = {x: linkInfo.pos[3].x, y: linkInfo.pos[3].y + toNode.height }
          }
        }
      }else if(fromNodeBord === 'T' && toNodeBord === 'T'){
        if(['exclusive', 'inclusive'].includes(fromNode.type) || ['exclusive', 'inclusive'].includes(toNode.type)){
          var y = linkInfo.pos[1].y+distance.y > Math.min(fromNode.loc.y, toNode.loc.y) - 20 ? Math.min(fromNode.loc.y, toNode.loc.y) - 20 :linkInfo.pos[1].y+distance.y 
          linkInfo.pos[1] = {x: linkInfo.pos[0].x, y: y}
          linkInfo.pos[2] = {x: linkInfo.pos[3].x, y: y}
        }
        else if(linkInfo.pos[1].y < eventObj.target.loc.y){
          linkInfo.pos[1] = {x: linkInfo.pos[0].x, y: linkInfo.pos[1].y}
          linkInfo.pos[2] = {x: linkInfo.pos[3].x, y: linkInfo.pos[2].y}
        }else{
          console.log('B->B')
          linkInfo.pos[0] = {x: linkInfo.pos[0].x, y: linkInfo.pos[0].y+fromNode.height}
          linkInfo.pos[1] = {x: linkInfo.pos[0].x, y: Math.max(fromNode.loc.y+fromNode.height,toNode.loc.y+toNode.height)+20}
          linkInfo.pos[2] = {x: linkInfo.pos[3].x, y: Math.max(fromNode.loc.y+fromNode.height,toNode.loc.y+toNode.height)+20}
          linkInfo.pos[3] = {x: linkInfo.pos[3].x, y: linkInfo.pos[3].y+toNode.height}
        }
      }else if(fromNodeBord === 'T' && toNodeBord === 'B'){
        if(fromNode.loc.y>toNode.loc.y+toNode.height){
          linkInfo.pos[1] = {x: linkInfo.pos[0].x, y: linkInfo.pos[0].y - middleY}
          linkInfo.pos[2] = {x: linkInfo.pos[3].x, y: linkInfo.pos[3].y + middleY}
        }
        // from和to重合点 -> 变成B to B
        else if(fromNode.loc.y <= toNode.loc.y+toNode.height){
          console.log('B->B')
          linkInfo.pos[0] = {x: linkInfo.pos[0].x, y: linkInfo.pos[0].y+fromNode.height }
          linkInfo.pos[1] = {x: linkInfo.pos[0].x, y: linkInfo.pos[0].y+20 }
          linkInfo.pos[2] = {x: linkInfo.pos[3].x, y: linkInfo.pos[0].y+20 }
        }
      }else if(fromNodeBord === 'L' && toNodeBord === 'L'){
        //拖动的是to节点
        if(eventObj.target.key === toNode.key){
          linkInfo.pos[2] = {x: nodeNewLoc.x -(toNode.loc.x - linkInfo.pos[2].x), y: linkInfo.pos[3].y}
          linkInfo.pos[1] = {x: linkInfo.pos[2].x, y: linkInfo.pos[0].y}
        }
        //拖动的是from节点
        else{
          linkInfo.pos[1] = {x: linkInfo.pos[2].x, y: linkInfo.pos[0].y}
        }
        //变成二折
        if(linkInfo.pos[1].x > fromNode.loc.x && linkInfo.pos[1].x < fromNode.loc.x+fromNode.width){
          console.log('变成二折')
          linkInfo.pos.splice(0, 1)
          ++linkInfo.pos[0].x
          linkInfo.pos[0].y = (linkInfo.pos[1].y < this.getNodePosFromBoreder(fromNode, 'T').start.y ? this.getNodePosFromBoreder(fromNode, 'T').start.y : this.getNodePosFromBoreder(fromNode, 'B').start.y) + (eventObj.target.key === fromNode.key ? distance.y : 0)
        }


      }else if(fromNodeBord === 'L' && toNodeBord === 'R'){
        if(fromNode.loc.x > toNode.loc.x+toNode.width){
          linkInfo.pos[1] = {x: linkInfo.pos[0].x - middleX, y: linkInfo.pos[0].y}
          linkInfo.pos[2] = {x: linkInfo.pos[1].x, y: linkInfo.pos[3].y}
        }
        // from和to重合 -> 变成R to R
        else{
          linkInfo.pos[0] = {x: linkInfo.pos[0].x+fromNode.width, y: linkInfo.pos[0].y }
          linkInfo.pos[1] = {x: linkInfo.pos[0].x+20, y: linkInfo.pos[0].y }
          linkInfo.pos[2] = {x: linkInfo.pos[0].x+20, y: linkInfo.pos[3].y }
        }
      }else if(fromNodeBord === 'R' && toNodeBord === 'L'){
        //from在to左边
        if(fromNode.loc.x+fromNode.width < toNode.loc.x){
          linkInfo.pos[1] = {x: linkInfo.pos[0].x + middleX, y: linkInfo.pos[0].y}
          linkInfo.pos[2] = {x: linkInfo.pos[0].x + middleX, y: linkInfo.pos[3].y}
        }else{
          linkInfo.pos[1] = {x: linkInfo.pos[0].x+toNode.width + 20, y: linkInfo.pos[0].y}
          linkInfo.pos[2] = {x: linkInfo.pos[0].x+toNode.width + 20, y: linkInfo.pos[3].y}
          linkInfo.pos[3] = {x: linkInfo.pos[3].x+toNode.width, y: linkInfo.pos[3].y}
        }
      }else if(fromNodeBord === 'R' && toNodeBord === 'R'){
        //拖动的是to节点
        if(eventObj.target.key === toNode.key){
          linkInfo.pos[2] = {x: nodeNewLoc.x -(toNode.loc.x - linkInfo.pos[2].x), y: linkInfo.pos[3].y}
          linkInfo.pos[1] = {x: linkInfo.pos[2].x, y: linkInfo.pos[0].y}
        }
        //拖动的是from节点
        else{
          linkInfo.pos[1] = {x: linkInfo.pos[2].x, y: linkInfo.pos[0].y}
        }
        //变成二折
        if(linkInfo.pos[1].x > fromNode.loc.x && linkInfo.pos[1].x < fromNode.loc.x+fromNode.width){
          console.log('变成二折')
          linkInfo.pos.splice(0, 1)
          --linkInfo.pos[0].x
          linkInfo.pos[0].y = (linkInfo.pos[1].y < this.getNodePosFromBoreder(fromNode, 'T').start.y ? this.getNodePosFromBoreder(fromNode, 'T').start.y : this.getNodePosFromBoreder(fromNode, 'B').start.y) + (eventObj.target.key === fromNode.key ? distance.y : 0)
        }
      }
    }

  }

  //更新 节点移动 触发的更改线条路径(自己连自己的情况)
  moveLineForSameNode (linkInfo, eventObj){
    // const disY = copyEventObjTarget.loc.y+copyEventObjTarget.height-linkInfo.pos[0].y
    // const disX = copyEventObjTarget.loc.x+copyEventObjTarget.width-linkInfo.pos[4].x
    const disY = 20
    const disX = 20
    console.log(disX,disY)
    const dis0to1 = linkInfo.pos[1].x - linkInfo.pos[0].x
    const dis1to2 = linkInfo.pos[2].y - linkInfo.pos[1].y

    linkInfo.pos[0] = {x: eventObj.target.loc.x+eventObj.target.width , y: eventObj.target.loc.y+eventObj.target.height-disY }
    linkInfo.pos[4] = {x: eventObj.target.loc.x+eventObj.target.width-disX , y: eventObj.target.loc.y+eventObj.target.height }
    linkInfo.pos[1] = {x: linkInfo.pos[0].x+dis0to1, y: linkInfo.pos[0].y}
    linkInfo.pos[2] = {x: linkInfo.pos[1].x, y: linkInfo.pos[1].y+dis1to2}
    linkInfo.pos[3] = {x: linkInfo.pos[4].x, y: linkInfo.pos[2].y}
  }

  //更新 路径移动 触发的更改线条路径
  moveLineForLine (eventObj, mouseLoc){
    var fromNode, toNode, total=0, eventPos = eventObj.target.pos, posMaxIdx = eventPos.length - 1
    
    this._data.nodeDataArray.forEach(item => {
      if(item.key === eventObj.target.from){
        fromNode = item
        total++
      }
      if(item.key === eventObj.target.to){
        toNode = item
        total++
      }
      if(total === 2) return
    })
    
    //分支节点位置限制: from
    if(['exclusive', 'inclusive'].includes(fromNode.type)){
      //挨着from的竖线
      if(eventObj.targetLineStartPointIdx===0 && (eventPos[eventObj.targetLineStartPointIdx].x === eventPos[eventObj.targetLineStartPointIdx+1].x)&&(this.getNodePosFromBoreder(fromNode, 'L').start.x >= mouseLoc.x || this.getNodePosFromBoreder(fromNode, 'R').start.x <= mouseLoc.x)) return
      //中间横线
      if(eventObj.targetLineStartPointIdx===1 && (eventPos[eventObj.targetLineStartPointIdx].y === eventPos[eventObj.targetLineStartPointIdx+1].y)&&(this.getNodePosFromBoreder(fromNode, 'B').start.y >= mouseLoc.y)) return
      //挨着to的竖线
      if(eventObj.targetLineStartPointIdx===2 && (eventPos[eventObj.targetLineStartPointIdx].x === eventPos[eventObj.targetLineStartPointIdx+1].x)&&(this.getNodePosFromBoreder(toNode, 'L').start.x >= mouseLoc.x || this.getNodePosFromBoreder(toNode, 'R').start.x <= mouseLoc.x)) return
    }
    //分支节点位置限制: to
    else if(['exclusive', 'inclusive'].includes(toNode.type)){
      //一折线不能移动
      if(posMaxIdx===1) return
      //二折线竖线不能动
      if(posMaxIdx===2 && eventObj.targetLineStartPointIdx===1) return
      //二折线横线限制
      if(posMaxIdx===2 && eventObj.targetLineStartPointIdx===0 && this.getNodePosFromBoreder(toNode, 'T').start.y < mouseLoc.y) return
      //三折最后的线不能动
      if(posMaxIdx===3 && eventObj.targetLineStartPointIdx===2) return
      //三折中间横线位置限制
      if(posMaxIdx===3 && eventObj.targetLineStartPointIdx===1 && this.getNodePosFromBoreder(toNode, 'T').start.y < mouseLoc.y) return
      //三折第一条线位置限制
      if(posMaxIdx===3 && eventObj.targetLineStartPointIdx===0 && (this.getNodePosFromBoreder(fromNode, 'L').start.x >= mouseLoc.x || this.getNodePosFromBoreder(fromNode, 'R').start.x <= mouseLoc.x)) return
    }
    
    //一折情况
    if(posMaxIdx === 1){
      //横线
      if( eventPos[0].y === eventPos[1].y ){
        //更新y坐标
        eventPos[0].y = mouseLoc.y
        eventPos[1].y = mouseLoc.y
        //更新x坐标
        if(this.getNodePosFromBoreder(fromNode, 'T').start.y > mouseLoc.y || this.getNodePosFromBoreder(fromNode, 'B').start.y < mouseLoc.y){
          eventPos[0].x = fromNode.loc.x + fromNode.width/2
          eventPos.unshift({x: fromNode.loc.x + fromNode.width/2, y: this.getNodePosFromBoreder(fromNode, 'T').start.y > mouseLoc.y ? fromNode.loc.y : fromNode.loc.y + fromNode.height})
        }
        if(this.getNodePosFromBoreder(toNode, 'T').start.y > mouseLoc.y || this.getNodePosFromBoreder(toNode, 'B').start.y < mouseLoc.y){
          eventPos[eventPos.length-1].x = toNode.loc.x + toNode.width/2
          eventPos.push({x: toNode.loc.x + toNode.width/2, y: this.getNodePosFromBoreder(toNode, 'T').start.y > mouseLoc.y ? toNode.loc.y : toNode.loc.y+toNode.height})
        }
      }
      //竖线
      else{
        //更新x坐标
        eventPos[0].x = mouseLoc.x
        eventPos[1].x = mouseLoc.x
        //更新y坐标
        if((this.getNodePosFromBoreder(fromNode, 'L').start.x > mouseLoc.x || this.getNodePosFromBoreder(fromNode, 'R').start.x < mouseLoc.x)){
          eventPos[0].y = fromNode.loc.y + fromNode.height/2
          eventPos.unshift({x: this.getNodePosFromBoreder(fromNode, 'R').start.x < mouseLoc.x ? fromNode.loc.x + fromNode.width : fromNode.loc.x, y: fromNode.loc.y + fromNode.height/2})
        }
        if(this.getNodePosFromBoreder(toNode, 'L').start.x > mouseLoc.x || this.getNodePosFromBoreder(toNode, 'R').start.x < mouseLoc.x){
          eventPos[eventPos.length-1].y = toNode.loc.y + toNode.height/2
          eventPos.push({x: this.getNodePosFromBoreder(toNode, 'R').start.x < mouseLoc.x ? toNode.loc.x + toNode.width : toNode.loc.x, y: toNode.loc.y + toNode.height/2})
        }
      }

    }
    //二折情况
    else if(posMaxIdx === 2){
      //横线
      if(eventPos[eventObj.targetLineStartPointIdx].y === eventPos[eventObj.targetLineStartPointIdx+1].y){
        eventPos[eventObj.targetLineStartPointIdx].y = mouseLoc.y
        eventPos[eventObj.targetLineStartPointIdx+1].y = mouseLoc.y
        //超出from节点边界
        if((this.getNodePosFromBoreder(fromNode, 'B').start.y < mouseLoc.y || this.getNodePosFromBoreder(fromNode, 'T').start.y > mouseLoc.y) && eventObj.targetLineStartPointIdx===0){
          eventPos[eventObj.targetLineStartPointIdx].x = fromNode.loc.x + fromNode.width/2
          eventPos.unshift({x: fromNode.loc.x + fromNode.width/2, y: this.getNodePosFromBoreder(fromNode, 'T').start.y > mouseLoc.y ? fromNode.loc.y : fromNode.loc.y + fromNode.height})
        }
        //超出to节点边界
        if((this.getNodePosFromBoreder(toNode, 'B').start.y < mouseLoc.y || this.getNodePosFromBoreder(toNode, 'T').start.y > mouseLoc.y)  && eventObj.targetLineStartPointIdx===1){
          eventPos[eventObj.targetLineStartPointIdx+1].x = toNode.loc.x + toNode.width/2
          eventPos.push({x: toNode.loc.x + toNode.width/2, y: this.getNodePosFromBoreder(toNode, 'T').start.y > mouseLoc.y ? toNode.loc.y : toNode.loc.y + toNode.height})
        }
        //进入from内
        if(eventObj.targetLineStartPointIdx === 1 && this.getNodePosFromBoreder(fromNode, 'B').start.y > mouseLoc.y && this.getNodePosFromBoreder(fromNode, 'T').start.y < mouseLoc.y){
          // console.log('from内')
          eventPos.splice(0, 1)
          eventPos[0].x = toNode.loc.x > fromNode.loc.x ? fromNode.loc.x + fromNode.width : fromNode.loc.x
        }
        //进入to内
        if(eventObj.targetLineStartPointIdx === 0 && this.getNodePosFromBoreder(toNode, 'B').start.y > mouseLoc.y && this.getNodePosFromBoreder(toNode, 'T').start.y < mouseLoc.y){
          // console.log('to内')
          eventPos.splice(eventPos.length-1, 1)
          eventPos[eventPos.length-1].x = fromNode.loc.x > toNode.loc.x ? toNode.loc.x + toNode.width : toNode.loc.x
        }
      }
      //竖线
      else{
        eventPos[eventObj.targetLineStartPointIdx].x = mouseLoc.x
        eventPos[eventObj.targetLineStartPointIdx+1].x = mouseLoc.x
        //超出from节点边界
        if((this.getNodePosFromBoreder(fromNode, 'L').start.x > mouseLoc.x || this.getNodePosFromBoreder(fromNode, 'R').start.x < mouseLoc.x) && eventObj.targetLineStartPointIdx===0){
          console.log('超出from')
          eventPos[eventObj.targetLineStartPointIdx].y = fromNode.loc.y + fromNode.height/2
          eventPos.unshift({x: this.getNodePosFromBoreder(fromNode, 'L').start.x > mouseLoc.x ? fromNode.loc.x : fromNode.loc.x+fromNode.width, y: fromNode.loc.y + fromNode.height/2})
        }
        //超出to节点边界
        if((this.getNodePosFromBoreder(toNode, 'L').start.x > mouseLoc.x || this.getNodePosFromBoreder(toNode, 'R').start.x < mouseLoc.x)  && eventObj.targetLineStartPointIdx===1){
          console.log('超出to')
          eventPos[eventObj.targetLineStartPointIdx+1].y = toNode.loc.y + toNode.height/2
          eventPos.push({x: this.getNodePosFromBoreder(toNode, 'L').start.x > mouseLoc.x ? toNode.loc.x : toNode.loc.x+toNode.width, y: toNode.loc.y + toNode.height/2})
        }
        //进入from内
        if(eventObj.targetLineStartPointIdx === 1 && this.getNodePosFromBoreder(fromNode, 'L').start.x < mouseLoc.x && this.getNodePosFromBoreder(fromNode, 'R').start.x > mouseLoc.x){
          // console.log('from内')
          eventPos.splice(0, 1)
          eventPos[0].y = toNode.loc.y > fromNode.loc.y ? fromNode.loc.y + fromNode.height : fromNode.loc.y
        }
        //进入to内
        if(eventObj.targetLineStartPointIdx === 0 && this.getNodePosFromBoreder(toNode, 'L').start.x < mouseLoc.x && this.getNodePosFromBoreder(toNode, 'R').start.x > mouseLoc.x){
          // console.log('to内')
          eventPos.splice(eventPos.length-1, 1)
          eventPos[eventPos.length-1].y = fromNode.loc.y > toNode.loc.y ? toNode.loc.y + toNode.height : toNode.loc.y
        }
      }
    }
    //三折情况
    else if(posMaxIdx === 3){
      //横线
      if(eventPos[eventObj.targetLineStartPointIdx].y === eventPos[eventObj.targetLineStartPointIdx+1].y){
        eventPos[eventObj.targetLineStartPointIdx].y = mouseLoc.y
        eventPos[eventObj.targetLineStartPointIdx+1].y = mouseLoc.y
        //触发线段是挨着from节点
        if(eventObj.targetLineStartPointIdx===0){
          //Z形状
          if(judgeLineShapeIsZ(eventPos)){
            //超出最高点
            if(eventPos[0].y < this.getNodePosFromBoreder(fromNode, 'T').start.y){
              eventPos[0] = {x: this.getNodePosFromBoreder(fromNode, 'T').start.x+fromNode.width/2, y: fromNode.loc.y }
              eventPos[1] = {x: eventPos[0].x, y: mouseLoc.y}
              if(mouseLoc.y < this.getNodePosFromBoreder(toNode, 'T').start.y || mouseLoc.y > this.getNodePosFromBoreder(toNode, 'B').start.y){
                eventPos[2] = {x: this.getNodePosFromBoreder(toNode, 'L').start.x + toNode.width/2, y: mouseLoc.y }
                eventPos[3] = {x: eventPos[2].x, y: mouseLoc.y < this.getNodePosFromBoreder(toNode, 'T').start.y ? this.getNodePosFromBoreder(toNode, 'T').start.y : this.getNodePosFromBoreder(toNode, 'B').start.y}
              }else{
                eventPos[2] = {x: eventPos[1].x < this.getNodePosFromBoreder(toNode, 'R').start.x ? this.getNodePosFromBoreder(toNode, 'L').start.x : this.getNodePosFromBoreder(toNode, 'R').start.x, y: mouseLoc.y}
                eventPos.splice(3)
              }
            }
            //超出最低点
            else if(eventPos[0].y > this.getNodePosFromBoreder(fromNode, 'B').start.y){
              eventPos[0] = {x: this.getNodePosFromBoreder(fromNode, 'T').start.x+fromNode.width/2, y: this.getNodePosFromBoreder(fromNode, 'B').start.y }
              eventPos[1] = {x: eventPos[0].x, y: mouseLoc.y}
              if(mouseLoc.y < this.getNodePosFromBoreder(toNode, 'T').start.y || mouseLoc.y > this.getNodePosFromBoreder(toNode, 'B').start.y){
                eventPos[2] = {x: this.getNodePosFromBoreder(toNode, 'L').start.x + toNode.width/2, y: mouseLoc.y }
                eventPos[3] = {x: eventPos[2].x, y: mouseLoc.y < this.getNodePosFromBoreder(toNode, 'T').start.y ? this.getNodePosFromBoreder(toNode, 'T').start.y : this.getNodePosFromBoreder(toNode, 'B').start.y}
              }else{
                eventPos[2] = {x: eventPos[1].x < this.getNodePosFromBoreder(toNode, 'R').start.x ? this.getNodePosFromBoreder(toNode, 'L').start.x : this.getNodePosFromBoreder(toNode, 'R').start.x, y: mouseLoc.y}
                eventPos.splice(3)
              }
            }
          }
          //C形状
          else{
            if(mouseLoc.y < this.getNodePosFromBoreder(fromNode, 'T').start.y){
              eventPos[0].y = this.getNodePosFromBoreder(fromNode, 'T').start.y
              eventPos[1].y = this.getNodePosFromBoreder(fromNode, 'T').start.y
            }else if(mouseLoc.y > this.getNodePosFromBoreder(fromNode, 'B').start.y){
              eventPos[0].y = this.getNodePosFromBoreder(fromNode, 'B').start.y
              eventPos[1].y = this.getNodePosFromBoreder(fromNode, 'B').start.y
            }
          }
        }
        //触发线段是挨着to节点
        else if(eventObj.targetLineStartPointIdx===eventPos.length-2){
          //Z形状
          if(judgeLineShapeIsZ(eventPos)){
            //超出最高点
            if(eventPos[3].y < this.getNodePosFromBoreder(toNode, 'T').start.y){
              eventPos[3] = {x: this.getNodePosFromBoreder(toNode, 'T').start.x+toNode.width/2, y: toNode.loc.y }
              eventPos[2] = {x: eventPos[3].x, y: mouseLoc.y}
              if(mouseLoc.y < this.getNodePosFromBoreder(fromNode, 'T').start.y || mouseLoc.y > this.getNodePosFromBoreder(fromNode, 'B').start.y){
                eventPos[1] = {x: this.getNodePosFromBoreder(fromNode, 'L').start.x + fromNode.width/2, y: mouseLoc.y }
                eventPos[0] = {x: eventPos[1].x, y: mouseLoc.y < this.getNodePosFromBoreder(fromNode, 'T').start.y ? this.getNodePosFromBoreder(fromNode, 'T').start.y : this.getNodePosFromBoreder(fromNode, 'B').start.y}
              }else{
                eventPos[1] = {x: eventPos[2].x > this.getNodePosFromBoreder(fromNode, 'R').start.x ? this.getNodePosFromBoreder(fromNode, 'R').start.x : this.getNodePosFromBoreder(fromNode, 'L').start.x, y: mouseLoc.y}
                eventPos.splice(0, 1)
              }
            }
            //超出最低点
            else if(eventPos[3].y > this.getNodePosFromBoreder(toNode, 'B').start.y){
              eventPos[3] = {x: this.getNodePosFromBoreder(toNode, 'L').start.x+toNode.width/2, y: this.getNodePosFromBoreder(toNode, 'B').start.y }
              eventPos[2] = {x: eventPos[3].x, y: mouseLoc.y}
              if(mouseLoc.y < this.getNodePosFromBoreder(fromNode, 'T').start.y || mouseLoc.y > this.getNodePosFromBoreder(fromNode, 'B').start.y){
                eventPos[1] = {x: this.getNodePosFromBoreder(fromNode, 'L').start.x + fromNode.width/2, y: mouseLoc.y }
                eventPos[0] = {x: eventPos[1].x, y: mouseLoc.y < this.getNodePosFromBoreder(fromNode, 'T').start.y ? this.getNodePosFromBoreder(fromNode, 'T').start.y : this.getNodePosFromBoreder(fromNode, 'B').start.y}
              }else{
                eventPos[1] = {x: eventPos[2].x > this.getNodePosFromBoreder(fromNode, 'R').start.x ? this.getNodePosFromBoreder(fromNode, 'R').start.x : this.getNodePosFromBoreder(fromNode, 'L').start.x, y: mouseLoc.y}
                eventPos.splice(0, 1)
              }
            }
          }
          //C形状
          else{
            if(mouseLoc.y < this.getNodePosFromBoreder(toNode, 'T').start.y){
              eventPos[2].y = this.getNodePosFromBoreder(toNode, 'T').start.y
              eventPos[3].y = this.getNodePosFromBoreder(toNode, 'T').start.y
            }else if(mouseLoc.y > this.getNodePosFromBoreder(toNode, 'B').start.y){
              eventPos[2].y = this.getNodePosFromBoreder(toNode, 'B').start.y
              eventPos[3].y = this.getNodePosFromBoreder(toNode, 'B').start.y
            }
          }
        }
        //触发线段是中间部位
        else{
          //from变化
          if(mouseLoc.y > this.getNodePosFromBoreder(fromNode, 'T').start.y && mouseLoc.y < this.getNodePosFromBoreder(fromNode, 'B').start.y){
            eventPos.splice(0,1)
            eventPos[0].x = eventPos[1].x < this.getNodePosFromBoreder(fromNode, 'L').start.x ? this.getNodePosFromBoreder(fromNode, 'L').start.x : this.getNodePosFromBoreder(fromNode, 'R').start.x
          }
          //to变化
          if(mouseLoc.y > this.getNodePosFromBoreder(toNode, 'T').start.y && mouseLoc.y < this.getNodePosFromBoreder(toNode, 'B').start.y){
            eventPos[eventPos.length-2].x = eventPos[eventPos.length-3].x < this.getNodePosFromBoreder(toNode, 'L').start.x ? this.getNodePosFromBoreder(toNode, 'L').start.x : this.getNodePosFromBoreder(toNode, 'R').start.x
            eventPos.splice(eventPos.length-1)
          }
        }
      }
      //竖线
      else{
        eventPos[eventObj.targetLineStartPointIdx].x = mouseLoc.x
        eventPos[eventObj.targetLineStartPointIdx+1].x = mouseLoc.x

        //触发线段是挨着from节点
        if(eventObj.targetLineStartPointIdx===0){
          console.log('from节点')
          // Z形状
          if(judgeLineShapeIsN(eventPos)){
            //超出最左点
            if(eventPos[0].x < this.getNodePosFromBoreder(fromNode, 'L').start.x){
              eventPos[0] = {x: this.getNodePosFromBoreder(fromNode, 'L').start.x, y: this.getNodePosFromBoreder(fromNode, 'L').start.y+fromNode.height/2 }
              eventPos[1] = {x: mouseLoc.x, y: eventPos[0].y}
              if(mouseLoc.x < this.getNodePosFromBoreder(toNode, 'L').start.x || mouseLoc.x > this.getNodePosFromBoreder(toNode, 'R').start.x){
                eventPos[2] = {x: mouseLoc.x, y: this.getNodePosFromBoreder(toNode, 'T').start.y+toNode.height/2 }
                eventPos[3] = {x: mouseLoc.x < this.getNodePosFromBoreder(toNode, 'L').start.x ? this.getNodePosFromBoreder(toNode, 'L').start.x : this.getNodePosFromBoreder(toNode, 'R').start.x, y: eventPos[2].y}
              }else{
                eventPos[2] = {x: mouseLoc.x, y: eventPos[1].y < this.getNodePosFromBoreder(toNode, 'T').start.y ? this.getNodePosFromBoreder(toNode, 'T').start.y : this.getNodePosFromBoreder(toNode, 'B').start.y}
                eventPos.splice(3)
              }
            }
            //超出最右点
            else if(eventPos[0].x > this.getNodePosFromBoreder(fromNode, 'R').start.x){
              eventPos[0] = {x: this.getNodePosFromBoreder(fromNode, 'R').start.x, y: this.getNodePosFromBoreder(fromNode, 'R').start.y+fromNode.height/2 }
              eventPos[1] = {x: mouseLoc.x, y: eventPos[0].y}
              if(mouseLoc.x < this.getNodePosFromBoreder(toNode, 'L').start.x || mouseLoc.x > this.getNodePosFromBoreder(toNode, 'R').start.x){
                eventPos[2] = {x: mouseLoc.x, y: this.getNodePosFromBoreder(toNode, 'T').start.y+toNode.height/2 }
                eventPos[3] = {x: mouseLoc.x < this.getNodePosFromBoreder(toNode, 'L').start.x ? this.getNodePosFromBoreder(toNode, 'L').start.x : this.getNodePosFromBoreder(toNode, 'R').start.x, y: eventPos[2].y}
              }else{
                eventPos[2] = {x: mouseLoc.x, y: eventPos[1].y < this.getNodePosFromBoreder(toNode, 'T').start.y ? this.getNodePosFromBoreder(toNode, 'T').start.y : this.getNodePosFromBoreder(toNode, 'B').start.y}
                eventPos.splice(3)
              }
            }
          }
          //C形状
          else{
            if(mouseLoc.x < this.getNodePosFromBoreder(fromNode, 'L').start.x){
              eventPos[0].x = this.getNodePosFromBoreder(fromNode, 'L').start.x+1
              eventPos[1].x = this.getNodePosFromBoreder(fromNode, 'L').start.x+1
            }else if(mouseLoc.x > this.getNodePosFromBoreder(fromNode, 'R').start.x){
              eventPos[0].x = this.getNodePosFromBoreder(fromNode, 'R').start.x-1
              eventPos[1].x = this.getNodePosFromBoreder(fromNode, 'R').start.x-1
            }
          }
        }
        //触发线段是挨着to节点
        else if(eventObj.targetLineStartPointIdx===eventPos.length-2){
          console.log('to节点')
          //Z形状
          if(judgeLineShapeIsN(eventPos)){
            //超出最左点
            if(eventPos[3].x < this.getNodePosFromBoreder(toNode, 'L').start.x){
              eventPos[3] = {x: this.getNodePosFromBoreder(toNode, 'L').start.x, y: this.getNodePosFromBoreder(toNode, 'L').start.y+toNode.height/2 }
              eventPos[2] = {x: mouseLoc.x, y: eventPos[3].y}
              //超出对面节点
              if(mouseLoc.x < this.getNodePosFromBoreder(fromNode, 'L').start.x || mouseLoc.x > this.getNodePosFromBoreder(fromNode, 'R').start.x){
                eventPos[1] = {x: mouseLoc.x, y: this.getNodePosFromBoreder(fromNode, 'T').start.y + fromNode.height/2 }
                eventPos[0] = {x: mouseLoc.x < this.getNodePosFromBoreder(fromNode, 'L').start.x ? this.getNodePosFromBoreder(fromNode, 'L').start.x : this.getNodePosFromBoreder(fromNode, 'R').start.x, y: eventPos[1].y}
              }else{
                eventPos[1] = {x: mouseLoc.x, y: eventPos[2].y > this.getNodePosFromBoreder(fromNode, 'B').start.y ? this.getNodePosFromBoreder(fromNode, 'B').start.y : this.getNodePosFromBoreder(fromNode, 'T').start.y}
                eventPos.splice(0, 1)
              }
            }
            //超出最右点
            else if(eventPos[3].x > this.getNodePosFromBoreder(toNode, 'R').start.x){
              eventPos[3] = {x: this.getNodePosFromBoreder(toNode, 'R').start.x, y: this.getNodePosFromBoreder(toNode, 'R').start.y+toNode.height/2 }
              eventPos[2] = {x: mouseLoc.x, y: eventPos[3].y}
              //超出对面节点
              if(mouseLoc.x < this.getNodePosFromBoreder(fromNode, 'L').start.x || mouseLoc.x > this.getNodePosFromBoreder(fromNode, 'R').start.x){
                eventPos[1] = {x: mouseLoc.x, y: this.getNodePosFromBoreder(fromNode, 'T').start.y + fromNode.height/2 }
                eventPos[0] = {x: mouseLoc.x < this.getNodePosFromBoreder(fromNode, 'L').start.x ? this.getNodePosFromBoreder(fromNode, 'L').start.x : this.getNodePosFromBoreder(fromNode, 'R').start.x, y: eventPos[1].y}
              }else{
                eventPos[1] = {x: mouseLoc.x, y: eventPos[2].y > this.getNodePosFromBoreder(fromNode, 'B').start.y ? this.getNodePosFromBoreder(fromNode, 'B').start.y : this.getNodePosFromBoreder(fromNode, 'T').start.y}
                eventPos.splice(0, 1)
              }
            }
          }
          //C形状
          else{
            if(mouseLoc.x < this.getNodePosFromBoreder(toNode, 'L').start.x){
              eventPos[2].x = this.getNodePosFromBoreder(toNode, 'L').start.x+1
              eventPos[3].x = this.getNodePosFromBoreder(toNode, 'L').start.x+1
            }else if(mouseLoc.x > this.getNodePosFromBoreder(toNode, 'R').start.x){
              eventPos[2].x = this.getNodePosFromBoreder(toNode, 'R').start.x-1
              eventPos[3].x = this.getNodePosFromBoreder(toNode, 'R').start.x-1
            }
          }
        }
        //触发线段是中间部位
        else{
          console.log('中间')
          //from变化
          if(mouseLoc.x > this.getNodePosFromBoreder(fromNode, 'L').start.x && mouseLoc.x < this.getNodePosFromBoreder(fromNode, 'R').start.x){
            eventPos.splice(0,1)
            eventPos[0].y = eventPos[1].y < this.getNodePosFromBoreder(fromNode, 'T').start.y ? this.getNodePosFromBoreder(fromNode, 'T').start.y : this.getNodePosFromBoreder(fromNode, 'B').start.y
          }
          //to变化
          if(mouseLoc.x > this.getNodePosFromBoreder(toNode, 'L').start.x && mouseLoc.x < this.getNodePosFromBoreder(toNode, 'R').start.x){
            eventPos[eventPos.length-2].y = eventPos[eventPos.length-3].y < this.getNodePosFromBoreder(toNode, 'T').start.y ? this.getNodePosFromBoreder(toNode, 'T').start.y : this.getNodePosFromBoreder(toNode, 'B').start.y
            eventPos.splice(eventPos.length-1)
          }
        }
      }
    }

    //判断连线形状是不是Z形状（false为C）
    function judgeLineShapeIsZ(eventPos){
      var judgeWidth = 0
      for (let i = 0, len = eventPos.length-1; i< len; i++) {
        judgeWidth += Math.abs(eventPos[i].x - eventPos[i+1].x)
      }

      return judgeWidth===Math.abs(eventPos[0].x - eventPos[eventPos.length-1].x)
    }
    //判断连线形状是不是N形状（false为|__|）
    function judgeLineShapeIsN(eventPos){
      var judgeHeight = 0
      for (let i = 0, len = eventPos.length-1; i< len; i++) {
        judgeHeight += Math.abs(eventPos[i].y - eventPos[i+1].y)
      }

      return judgeHeight===Math.abs(eventPos[0].y - eventPos[eventPos.length-1].y)
    }
  }

  //新增结点
  addNode (defaultAttr){
    this.addNodeDefaultAttr = defaultAttr
    this.editType = 'addNode'
  }

  /**
   * 包装结点信息方法
   * @param {Object} addNodeDefaultAttr 默认信息
   * @param {Object} mouseLoc 当前鼠标位置
   */
  packNodeInfo (addNodeDefaultAttr, mouseLoc){
    const evX = Math.floor((mouseLoc.x+this.scrollLeft)/this.scaleRatio), evY = Math.floor((mouseLoc.y+this.scrollTop)/this.scaleRatio)

    const newNode = Object.assign(addNodeDefaultAttr, {
      loc: {x: evX-25, y: evY-25},
      width: 50, 
      height: 50
    })

    return newNode
  }

  //新增连线
  addLine (lineType){
    this.editType = lineType
  }

  //新增框
  addMark (){
    this.editType = 'addMark'
  }

  //新增备注
  addNote (){
    this.editType = 'addNote'
  }

  //改变颜色
  changeColor (value){
    if(this.focusTarget && Object.keys(this.focusTarget).length){
      //实体
      if(this.focusTarget.attributes){
        this.focusTarget.bgC = value
      }
      //框
      else if(this.focusTarget.type === 'mark'){
        this.focusTarget.bdC = value
      }
      //备注文本
      else if(this.focusTarget.type === 'note'){
        this.focusTarget.color = value
      }
      this.update()
    }
  }

  /**
   * 根据chooseTargets数据创建新的连线
   * @param {String} lineType     必选，创建的线型
   * @param {Object} defaultData  可选，带有默认数据的线，当该参数有值证明是批量建线
   */
  createLine (lineType, defaultData){
    var chooseTargets = this.chooseTargets,
    chooseTargets0Loc = this.getNodePosFromBoreder(chooseTargets[0], 'L'),
    chooseTargets1Loc = this.getNodePosFromBoreder(chooseTargets[1], 'L')

    var pos = []
    //起始节点和终止节点是同一个
    if(chooseTargets[0].key === chooseTargets[1].key){
      pos[0] = {x: chooseTargets[0].loc.x+chooseTargets[0].width, y: chooseTargets[0].loc.y+chooseTargets[0].height-20}
      pos[1] = {x: chooseTargets[0].loc.x+chooseTargets[0].width+20, y: chooseTargets[0].loc.y+chooseTargets[0].height-20}
      pos[2] = {x: chooseTargets[0].loc.x+chooseTargets[0].width+20, y: chooseTargets[0].loc.y+chooseTargets[0].height+20}
      pos[3] = {x: chooseTargets[0].loc.x+chooseTargets[0].width-20, y: chooseTargets[0].loc.y+chooseTargets[0].height+20}
      pos[4] = {x: chooseTargets[0].loc.x+chooseTargets[0].width-20, y: chooseTargets[0].loc.y+chooseTargets[0].height}
    }
    //起始节点是分支节点
    else if(['exclusive', 'inclusive'].includes(chooseTargets[0].type)){
      //分支上 to下 -> N形状
      if(chooseTargets0Loc.end.y < chooseTargets1Loc.start.y){
        pos[0] = {x: chooseTargets0Loc.end.x+Math.floor((chooseTargets[0].width/2)), y: chooseTargets0Loc.end.y}
        pos[1] = {x: pos[0].x, y: pos[0].y+Math.floor((chooseTargets1Loc.start.y-chooseTargets0Loc.end.y)/2)}
        pos[2] = {x: chooseTargets1Loc.start.x+Math.floor((chooseTargets[1].width/2)), y: pos[1].y}
        pos[3] = {x: pos[2].x, y: chooseTargets1Loc.start.y}
      }
      //分支下 to上 -> U形状
      else{
        pos[0] = {x: chooseTargets0Loc.end.x+Math.floor((chooseTargets[0].width/2)), y: chooseTargets0Loc.end.y}
        pos[1] = {x: pos[0].x, y: Math.max(chooseTargets0Loc.end.y,chooseTargets1Loc.start.y)+20}
        pos[2] = {x: chooseTargets1Loc.start.x+Math.floor((chooseTargets[1].width/2)), y: pos[1].y}
        pos[3] = {x: pos[2].x, y: chooseTargets1Loc.end.y}
      }
    }
    //终止节点是分支节点
    else if(['exclusive', 'inclusive'].includes(chooseTargets[1].type)){
      //from上 分支下
      if(chooseTargets0Loc.end.y < chooseTargets1Loc.start.y){
        pos[0] = {x: chooseTargets0Loc.end.x+Math.floor((chooseTargets[0].width/2)), y: chooseTargets0Loc.end.y}
        pos[1] = {x: pos[0].x, y: chooseTargets1Loc.start.y}
      }
      //from下分支上
      else{
        pos[0] = {x: chooseTargets0Loc.end.x+Math.floor((chooseTargets[0].width/2)), y: chooseTargets0Loc.start.y}
        pos[1] = {x: pos[0].x, y: Math.min(chooseTargets0Loc.end.y,chooseTargets1Loc.start.y)-20}
        pos[2] = {x: chooseTargets1Loc.start.x+Math.floor((chooseTargets[1].width/2)), y: pos[1].y}
        pos[3] = {x: pos[2].x, y: chooseTargets1Loc.start.y}
      }
      
    }
    //起始节点是普通节点
    else{
      //from左  to右
      if(this.getNodePosFromBoreder(chooseTargets[0], 'R').start.x < this.getNodePosFromBoreder(chooseTargets[1], 'L').start.x){
        //有重合 -> 直线
        if((chooseTargets1Loc.start.y - chooseTargets0Loc.end.y)*(chooseTargets1Loc.end.y - chooseTargets0Loc.start.y)<0){
          console.log('有重合')
          var y = Math.max(chooseTargets0Loc.start.y,chooseTargets1Loc.start.y) + Math.abs(Math.floor((Math.min(chooseTargets0Loc.end.y, chooseTargets1Loc.end.y)-Math.max(chooseTargets0Loc.start.y,chooseTargets1Loc.start.y))/2))
          pos[0] = {x: this.getNodePosFromBoreder(chooseTargets[0], 'R').start.x, y: y}
          pos[1] = {x: this.getNodePosFromBoreder(chooseTargets[1], 'L').start.x, y: y}
        }
        //无重合 -> 二折
        else{
          console.log('无重合')
          //from下  to上
          if(chooseTargets0Loc.start.y > chooseTargets1Loc.end.y){
            pos[0] = {x: chooseTargets0Loc.start.x+Math.floor(chooseTargets[0].width/2), y: chooseTargets0Loc.start.y}
            pos[1] = {x: pos[0].x, y: chooseTargets1Loc.start.y+Math.floor(chooseTargets[1].height/2)}
            pos[2] = {x: chooseTargets1Loc.start.x, y: pos[1].y}
          }
          //from上  to下
          else{
            pos[0] = {x: this.getNodePosFromBoreder(chooseTargets[0], 'R').start.x, y: chooseTargets0Loc.start.y+Math.floor(chooseTargets[0].height/2)}
            pos[1] = {x: this.getNodePosFromBoreder(chooseTargets[1], 'L').start.x+Math.floor(chooseTargets[1].width/2), y: pos[0].y}
            pos[2] = {x: pos[1].x, y: this.getNodePosFromBoreder(chooseTargets[1], 'L').start.y}
          }
        }
      }
      //from右  to左
      else if(this.getNodePosFromBoreder(chooseTargets[0], 'L').start.x > this.getNodePosFromBoreder(chooseTargets[1], 'R').start.x){
        //有重合 -> 直线
        if((chooseTargets1Loc.start.y - chooseTargets0Loc.end.y)*(chooseTargets1Loc.end.y - chooseTargets0Loc.start.y)<0){
          console.log('有重合')
          var y = Math.max(chooseTargets0Loc.start.y,chooseTargets1Loc.start.y) + Math.abs(Math.floor((Math.min(chooseTargets0Loc.end.y, chooseTargets1Loc.end.y)-Math.max(chooseTargets0Loc.start.y,chooseTargets1Loc.start.y))/2))
          pos[0] = {x: this.getNodePosFromBoreder(chooseTargets[0], 'L').start.x, y: y}
          pos[1] = {x: this.getNodePosFromBoreder(chooseTargets[1], 'R').start.x, y: y}
        }
        //无重合 -> 二折
        else{
          console.log('无重合')
          //from下  to上
          if(chooseTargets0Loc.start.y > chooseTargets1Loc.end.y){
            pos[0] = {x: chooseTargets0Loc.start.x+Math.floor(chooseTargets[0].width/2), y: chooseTargets0Loc.start.y}
            pos[1] = {x: pos[0].x, y: chooseTargets1Loc.start.y+Math.floor(chooseTargets[1].height/2)}
            pos[2] = {x: this.getNodePosFromBoreder(chooseTargets[1], 'R').start.x, y: pos[1].y}
          }
          //from上  to下
          else{
            pos[0] = {x: this.getNodePosFromBoreder(chooseTargets[0], 'L').start.x, y: chooseTargets0Loc.start.y+Math.floor(chooseTargets[0].height/2)}
            pos[1] = {x: this.getNodePosFromBoreder(chooseTargets[1], 'L').start.x+Math.floor(chooseTargets[1].width/2), y: pos[0].y}
            pos[2] = {x: pos[1].x, y: this.getNodePosFromBoreder(chooseTargets[1], 'L').start.y}
          }
        }
      }
      //from下 to上 上下非重叠重合 -> 直线
      else if(chooseTargets0Loc.start.y > chooseTargets1Loc.end.y){
        var startX = Math.max(chooseTargets0Loc.start.x, chooseTargets1Loc.start.x)
        var endX = Math.min(this.getNodePosFromBoreder(chooseTargets[0], 'R').start.x, this.getNodePosFromBoreder(chooseTargets[1], 'R').start.x)
        var x = startX + Math.floor((endX-startX)/2)
  
        pos[0] = {x: x, y: chooseTargets0Loc.start.y}
        pos[1] = {x: x, y: chooseTargets1Loc.end.y}
      }
      //from上 to下&重叠在一起
      else{
        var startX = Math.max(chooseTargets0Loc.start.x, chooseTargets1Loc.start.x)
        var endX = Math.min(this.getNodePosFromBoreder(chooseTargets[0], 'R').start.x, this.getNodePosFromBoreder(chooseTargets[1], 'R').start.x)
        var x = startX + Math.floor((endX-startX)/2)
  
        pos[0] = {x: x, y: chooseTargets0Loc.end.y}
        pos[1] = {x: x, y: chooseTargets1Loc.start.y}
      }
    }
    
    //生成完整的线信息，通知外部更新数据
    if(pos.length){
      //没有线的默认数据 -> 创建单根线情况
      if(!defaultData){
        const newLine = {
          key: this.createKey(),
          from: chooseTargets[0].key,
          to: chooseTargets[1].key,
          pos: pos,
          type: lineType
        }
        this.externalFn.addLine(newLine)
      }
      //有线的默认数据 -> 批量创建线的情况
      else{
        defaultData.pos = pos
        this.externalFn.addLine(defaultData)
      }
    }
    //线信息生成失败
    else{
      console.error('createLine方法错误：未生成对应关键点坐标')
    }
    
  }

  //根据chooseTargets数据创建新的节点连线
  createBranchLine (){
    var chooseTargets = [].concat(this.chooseTargets),
    chooseTargets0Loc = this.getNodePosFromBoreder(chooseTargets[0], 'L'),
    chooseTargets1Loc = this.getNodePosFromBoreder(chooseTargets[1], 'L')

    //from上 to下 且间距>50（因为branch分支块的高度是40）-> 取两块中点放置分支
    const loc = chooseTargets0Loc.end.y+50 < chooseTargets1Loc.start.y
                  ? {x: chooseTargets0Loc.start.x + Math.floor(chooseTargets[0].width/2)-20, y: chooseTargets0Loc.end.y+Math.floor((chooseTargets1Loc.start.y-chooseTargets0Loc.end.y)/2)-10}
                  : {x: chooseTargets1Loc.start.x + Math.floor(chooseTargets[1].width/2)-20, y: Math.min(chooseTargets0Loc.start.y, chooseTargets1Loc.start.y)-50}
    //生成过滤器节点
    const newBranchFilter = {
      key: this.createKey(),
      loc: loc,
      width: 40, 
      height: 20,
      type: 'exclusive',
      fromKey: chooseTargets[0].key
    }
    /**
     * status是外部的addFilter（创建分支）方法的返回值，他一共有三种情况：
     *    1.1 - 继续创建分支线逻辑
     *    2.2 - 终止创建分支线逻辑
     *    3.3 - 创建分支线逻辑变为创建非主键线
     */
    const status = this.externalFn.addFilter(newBranchFilter)
    
    //继续创建分支线逻辑
    if(status === 1){
      //创建from节点与分支的连线
      this.chooseTargets = [chooseTargets[0], data.nodeDataArray[data.nodeDataArray.length-1]]
      this.createLine('toFilter')
  
      //创建分支节点与to节点的连线
      this.chooseTargets = [data.nodeDataArray[data.nodeDataArray.length-1], chooseTargets[1]]
      this.createLine('fromFilter')
    }
    //终止创建分支逻辑，变为创建非主键线
    else if(status === 3){
      //创建非主键线
      this.createLine('foreignKey')
    }

  }

  //根据key找到对应的节点
  getNodeWithKey(key) {
    for(const item of this._data.nodeDataArray){
      if(item.key === key){
        return item
      }
    }
  }

  //批量创建连线
  createLines (lineList){
    /**
     * lineList = [{key: 1234, from: 1, to: 2}]
     */
    for(const item of lineList){
      //目前没考虑过滤器的情况
      this.chooseTargets = [this.getNodeWithKey(item.from), this.getNodeWithKey(item.to)]
      this.createLine(item.type, item)
    }
    this.update()
  }

  //生成最大key方法（目前未做重复性判断）
  createKey (){
    //格式：时间戳 + 随机数
    return (+new Date()) + '' + Math.floor(Math.random()*100000)
  }

  //节流函数
  throttle (fn, delay = 50) {
    var timer;
    return function () {
        var _this = this;
        var args = arguments;
        if (timer) {
            return;
        }
        timer = setTimeout(function () {
            fn.apply(_this, args);
            timer = null; // 在delay后执行完fn之后清空timer，此时timer为假，throttle触发可以进入计时器
        }, delay)
    }
  }

  //hex色值转换为rgb颜色
  hexToRgb (hex) {
    //把诸如#fff转为#ffffff
    hex.length===4 && (hex = hex.slice(0,2)+hex.slice(1,2)+hex.slice(2,3)+hex.slice(2,3)+hex.slice(3,4)+hex.slice(3,4))
    return "rgb(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + ")";
  }

  //判断是否是浅色系
  isLight (color) {
    const rgbStr = color.includes('rgb') ? color : this.hexToRgb(color)
    const rgbArr = rgbStr.replace(/rgb\(|rgba\(|\)/g,'').split(',')
    
    return (
      0.213 * rgbArr[0] +
      0.715 * rgbArr[1] +
      0.072 * rgbArr[2] >
      255 / 2
    )
  }

}

export default ErgRenderer