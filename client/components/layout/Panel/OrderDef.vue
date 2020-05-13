<template>
  <div>
    <div class="order-body" role="group">
      <!-- <caption>惰性状态：不参与互斥（禁用），不主动跳转到此状态<br/>
      活跃状态：参与互斥（禁用），可<strong>按照排列顺序</strong>主动跳转到此状态（由上往下）</caption> -->
      <div class="row">
        <div class="col">
          <div class="order-input" v-for="(item, key) in statusMap" :key="key">
            <span v-text="statusToName[key]" class="input-name"/>
            <div/>
            <span v-text="statusToName[item]" class="input-value"/>
          </div>
        </div>
        <div class="col" id="chart">
          <div class="chart">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import go from 'gojs';
import { deepCopy } from "@/utils";
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  components: {
  },
  data() {
    return {
      statusMap: {},
      statusToName: {},
      diagram: null,
      nodeDataArray: [
        {key: "iscroll容器-1", name: "iscroll容器-1", compId: "111", color: "pink", cursor: "grab",loc: "0 0"},
        {key: "iscroll容器-2", name: "iscroll容器-1", compId: "222", color: "pink", cursor: "grab",loc: "0 -100"},
      ],
      relation: [
        {from: "111", fromNodeType: "component", to: "222", toNodeType: "event"},
      ]
    }
  },
  computed: {
    ...mapState({
      currentFuncId: state => state.tempModule.currentFuncId,
      statusSetStep: state => state.pulicModule.statusSetStep,
      funcDefine: (state, getters) => getters.funcDefine,
    }),
  },
  mounted() {
    // this.diagram = new gojs.Diagram('chart');
    // console.log(this.diagram);

    var mySelf = this;
    const MAKE = go.GraphObject.make;
      mySelf.myDiagram  = MAKE(go.Diagram, "chart",{
      initialContentAlignment: go.Spot.Center, // 居中显示
      "undoManager.isEnabled": true ,// 支持 Ctrl-Z 和 Ctrl-Y 操作
      "toolManager.hoverDelay": 100,//tooltip提示显示延时
      "toolManager.toolTipDuration": 10000,//tooltip持续显示时间
      //isReadOnly:true,//只读
      "grid.visible":true,//显示网格
      allowMove:true,//允许拖动
      // allowDragOut:true,
      allowDelete:false,
      allowCopy:false,
      allowClipboard:false,
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,//有鼠标滚轮事件放大和缩小，而不是向上和向下滚动
      layout:MAKE(go.TreeLayout,{
        angle: 0,
        layerSpacing: 35
        })
      });//构建gojs对象
      console.log(mySelf.myDiagram);
      mySelf.myDiagram.addDiagramListener("ObjectSingleClicked",function (e) {
      });
 
      mySelf.myDiagram.addDiagramListener("BackgroundSingleClicked",function (e) {
      });
 
      mySelf.myDiagram.addDiagramListener("ClipboardPasted",function (e) {
      });
 
    // define a simple Node template
    // 定义个简单的 Node 模板
    mySelf.myDiagram.nodeTemplate =
      MAKE(go.Node,
      new go.Binding("location", "loc", go.Point.parse),
      MAKE(go.Shape, "RoundedRectangle", { fill: "#44CCFF",stroke: 'green',strokeWidth:2,angle:15 }),
      "Auto",//Vertical,Auto,Horizontal
        // 为整个Node背景设置为浅蓝色
        // { background: "#44CCFF" },
         
        // MAKE(go.Picture,
        //   // Pictures 应该指定宽高.
        //   // 当没有图片时显示红色的背景
        //   // 或者当图片为透明的时候也是.
        //   { source:"../assets/img/01.png",margin: 10, width: 50, height: 50, background: "red" },
        //   // Picture.source参数值与模型数据中的"source"字段绑定
        //   new go.Binding("source")),
        // MAKE(go.TextBlock,
        //   "Default Text",  // 初始化默认文本
        //   // 文字周围的空隙, 大号字体, 白色笔画:
        //   { margin: 12, stroke: "white", font: "bold 16px sans-serif",
        //     width:75,
        //     wrap: go.TextBlock.WrapDesiredSize
        //   },
        //   // TextBlock.text参数值与模型数据中的"name"字段绑定
        //   new go.Binding("text", "name1")),
          MAKE(go.Panel, "Horizontal",{padding:5},
            MAKE(go.Panel, "Vertical",
              MAKE(go.Picture,
                { margin: 10, width: 50, height: 50, background: "red" },
                new go.Binding("source","img")
              )
            ),
            MAKE(go.Panel, "Vertical",
              MAKE(go.TextBlock, "Default Text", {margin: 12, stroke: "white", font: "bold 16px sans-serif",},new go.Binding("text", "name1")),
              MAKE(go.TextBlock, { stroke: "red" },{margin: 5},new go.Binding("text", "name2")),
              MAKE(go.TextBlock, { background: "lightblue" },{margin: 5,},new go.Binding("text", "name3")),
            ),
          ),
          {
            mouseEnter:function(e,node,prev){
              console.log('mouseEnter');
            },
            mouseLeave:function(e,node,prev){
              mySelf.detailShow = false;
            },
          },
          {
            toolTip:MAKE(go.Adornment, "Spot",
              //{background:"transparent" },
              MAKE(go.Shape,"RoundedRectangle", {
                // fill: "blue" ,
                  height:30,
                  fill: MAKE(go.Brush, "Linear", { 0.0: "blue", 1.0: "red", start: go.Spot.Bottom, end: go.Spot.Top })
                }),
              MAKE(go.TextBlock,
              //{alignment:go.Spot.Top,alignmentFocus:go.Spot.Bottom,stroke:"red" },
              { margin: 4,stroke: "white" },new go.Binding("text", "name1"))
            )  // end of Adornment
          }
      );
      mySelf.myDiagram.linkTemplate = MAKE(go.Link,
        //{ curve: go.Link.Bezier },  // 贝塞尔曲线
        { routing: go.Link.Orthogonal, corner: 5 },
        MAKE(go.Shape, { strokeWidth: 2, stroke: "#e4393c" }),
        MAKE(go.Shape, { toArrow:"Standard",fill:"#000",stroke:null }),//箭头
        MAKE(go.TextBlock,
          {
            //margin: 20,
            stroke: "blue",
            //font: "14px sans-serif",
            //width:50,
            //wrap: go.TextBlock.WrapDesiredSize
          },
          new go.Binding("text", "linktext")),
          {
            toolTip:MAKE(go.Adornment, "Auto",
              MAKE(go.Shape, { fill: "#FFFFCC" }),
              MAKE(go.TextBlock, { margin: 4 },new go.Binding("text", "name1"))
            )  // end of Adornment
          }
        );// the link shape
    // let myModel = MAKE(go.Model);//如果不需要连线可以用这样的方法创建model
    // let myModel = MAKE(go.GraphLinksModel);//也可以创建link model;需要配置myModel.linkDataArray 如下
    let myModel = MAKE(go.TreeModel);
    myModel.nodeDataArray =
    [ // note that each node data object holds whatever properties it needs;
      // for this app we add the "name" and "source" properties
      {key:"1", name1: "董事长",name2: "秘书1", name3: "秘书2", img: require("@assets/img/loading.png"), },
      {key:"2", parent:"1", name1: "秘书", name2: "秘书1", name3: "秘书2", linktext:"link", img: require("@assets/img/loading.png") },
      {key:"3", parent:"1", name1: "CEO",  name2: "秘书1", name3: "秘书2", linktext:"link", img: require("@assets/img/loading.png") },
      {key:"4", parent:"3", name1: "总经理",  name2: "秘书1", name3: "秘书2", linktext:"link", img: require("@assets/img/loading.png") },
      {key:"5", parent:"4", name1: "二狗子",  name2: "秘书1", name3: "秘书2", linktext:"link", img: require("@assets/img/loading.png") },
    ];
    // myModel.linkDataArray = [
    //   {from:"1",to:"2"},
    //   {from:"1",to:"3"},
    //   {from:"1",to:"4"},
    //   {from:"1",to:"5"},
    // ];
    // function diagramInfo(myModel) {
    //   return "myModel:\n" + myModel.nodeDataArray.length + " nodes, " +myModel.linkDataArray.length + " links";
    // }
    // mySelf.myDiagram.toolTip = MAKE(go.Adornment, "Auto",
    //   MAKE(go.Shape, { fill: "#CCFFCC" }),
    //   MAKE(go.TextBlock, { margin: 4 },
    //     // use a converter to display information about the diagram model
    //     new go.Binding("text", "", diagramInfo))
    // );
    mySelf.myDiagram.model = myModel;

    this.createdNode();
    this.statusMap = deepCopy(this.funcDefine[this.currentFuncId].map);
    // 提取status对应的name
    const statusDefine = this.funcDefine[this.currentFuncId].statusDefine;
    Object.keys(statusDefine).forEach(status => {
      this.statusToName[status] = statusDefine[status].name;
    });
  },
  methods: {
    ...mapMutations({
      setTempModule: "SET_TEMP_MODULE",
      setPulicModule: "SET_PULIC_MODULE",
    }),
    ...mapActions({
      editTempFunc: "EDIT_TEMP_FUNC",
    }),
    async settingDone() {
      console.log(this.diagram);
      // // 深复制funcDefine
      // const subFuncDefine = deepCopy(this.funcDefine[this.currentFuncId]);
      // subFuncDefine.order = order;
      // await this.editTempFunc(subFuncDefine);
      // // 设置完成，数据初始化
      // this.setTempModule(["currentFuncId", false]);
      // this.setTempModule(["activeStatusList", null]);
      // this.setPulicModule(["statusSetStep", 0]);
    },
    createdNode() {
      let $ = gojs.GraphObject.make;
      this.diagram.nodeTemplate = $(gojs.Node, 'Auto',
        {
          // 添加点击事件
          click: function(e, obj) {}
        },
        // 将节点数据nodeDataArray .loc与图表位置建立联系
        new gojs.Binding('position', 'loc', gojs.Point.parse),
        //设置节点形状：带圆角的长方形
        $(gojs.Shape, 'RoundedRectangle',
          // 设置大小，边框大小、颜色，背景色，鼠标手势
          {desiredSize: new gojs.Size(160, NaN), strokeWidth: 0, fill: 'white', cursor: 'grab'},
          //将节点数据nodeDataArray .color与节点背景色建立联系
          new gojs.Binding('fill', 'color'), 
         //将节点数据nodeDataArray .cursor与节点鼠标手势建立联系
          new gojs.Binding('cursor', 'cursor')
        ),
        // 设置文本节点
        $(gojs.TextBlock,
          // 设置文本样式：大小，是否换行，margin
          {
            desiredSize: new gojs.Size(100, NaN),
            wrap: gojs.TextBlock.WrapFit,
            margin: 8
          }, 
          // bind TextBlock.text to Node.data.name
          new gojs.Binding('text', 'name'), 
          new gojs.Binding('cursor', 'cursor')
        )
      )
      this.diagram.linkTemplate = $(gojs.Link,
        $(gojs.Shape, // the link shape
          {strokeWidth: 2, stroke: 'white'}),
        $(gojs.Shape, // the arrowhead
          {toArrow: 'OpenTriangle',
            fill: null, stroke: 'white'})
      );
      // 将图表在画布中居中显示
      this.diagram.initialContentAlignment = go.Spot.Center;
      // 操作支持ctrl+z、ctrl+Y 实现undo和redo
      this.diagram.undoManager.isEnabled = true;
      // 通过节点数据和关系数组完成关系图。
      this.diagram.model = new gojs.GraphLinksModel(this.nodeDataArray, this.relation); //nodeDataArray:graph, linkDataArray: relation
    }
  }
}
</script>
