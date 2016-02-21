
var selectedNode=[];
var JsonData=[];     
var diagramGlobal;
var myDiagram;
var $ = go.GraphObject.make;


function clickNode(ctrl,node){
  //  e = window.event;
  
    var link = node.findTreeParentLink() ;
    if(link!== null){
     
    }
  if (!ctrl) {
    selectedNode =[];
      
  }
    selectedNode.push(node);
    
    displayNode(node);
   
}

function getSelectedNode(){
    return selectedNode;
}

function resetClick(){
    selectedNode=[];
}

function doubleClickNode(e,b){
    var node = b.part.adornedPart;
    prompt("Name : ",node.data.n);
}




function setContextNode(){
    var contextNode;
    contextNode = $(go.Adornment, "Vertical",  // that has one button
            $("ContextMenuButton",
              $(go.TextBlock, "add daughter"),
              { click: addChild }
             ),
            $("ContextMenuButton",
              $(go.TextBlock, "add son"),
              { click: addChild }
             ),
            $("ContextMenuButton",
              $(go.TextBlock, "add spouse"),
              { click: addSpouse }
             ),
            $("ContextMenuButton",
              $(go.TextBlock, "Edit Node"),
              {click : editNode }
             )
                    
            // more ContextMenuButtons would go here
          );
    return contextNode;
}




//ตรวจว่าเป็นผญไหม-หาเส้นโยงคู่-เจอเส้นที่โยงแต่งงาน-เจอคีย์ผู้ชาย-ได้เส้นออกมา-เอาเส้นมาเพิ่มโหนด
function addChild(e, b) {
    var buttontext = b.elt(1).text; 
    alert(buttontext);
    // take a button panel in an Adornment, get its Adornment, and then get its adorned Node
    
    var newnode = {n:"newNode"};
    if(buttontext == "add son")
        newnode = {n:"newNode" ,s:"M"};
    else if(buttontext == "add daughter")
        newnode = {n:"newNode" ,s:"F"};
    var keyCou;
    var node = b.part.adornedPart;
    var isMarried;
    node.findNodesOutOf().each(function(n) { 
        isMarried = findMarriage(myDiagram,n.data.key,node.data.key);
        alert(isMarried.data.category);
        keyCou = n.data.key;
    });
    if(isMarried == null){
        var keyInto=[];
        node.findNodesInto().each(function(n) { 
        keyInto.push(n.data.key);
    });
        var keyCou = keyInto[0].split(',');
        keyCou = keyCou[0];
        isMarried = findMarriage(myDiagram,keyCou[0],node.data.key);
        alert(isMarried.data.category+" with :"+keyCou);
        //keyCou = n.data.key;
    }
    if(node.data.s == "F"){
        if(isMarried.data.category == "Marriage" ){
        newnode["m"] = node.data.key;
        newnode["f"] = keyCou;
            
    }
    }
    
    // we are modifying the model, so conduct a transaction
  
    myDiagram.startTransaction("add node and link");
    // have the Model add the node data
   
    myDiagram.model.addNodeData(newnode);
     var mdata = isMarried.data;
     var mlabkey = mdata.labelKeys[0];
     var cdata = { from: mlabkey, to: newnode.key };
    // and then add a link data connecting the original node with the new one
   // var newlink = { from: node.data.key, to: newnode.key };
    
    myDiagram.model.addLinkData(cdata);
    myDiagram.model.addLinkData(newlink);
    // finish the transaction
    myDiagram.commitTransaction("add node and link");
  }

function editNode(e,b){
    
   var node =  b.part.adornedPart.data;
   var newName = prompt("Name : ",b.part.adornedPart.data.n);
    
    
      myDiagram.model.startTransaction("modified Node")
      myDiagram.model.setDataProperty(node, "n", newName);
      myDiagram.model.commitTransaction("modified Node");
 
    
    
    
}

function addSpouse(e,b){
     var node = b.part.adornedPart;
    var newnode = {n:"Spouse",cou:node.data.key};
    if(node.data.s == "M"){
        
        newnode["s"] = "F";
        
    }else if(node.data.s == "F"){
        
        newnode["s"] = "M";
        
    }
    
    myDiagram.startTransaction("add Spouse");
    // have the Model add the node data
    myDiagram.model.addNodeData(newnode);
     var mdata = node.data;
    // and then add a link data connecting the original node with the new one
   // var newlink = { from: node.data.key, to: newnode.key };

    
    myDiagram.commitTransaction("add Spouse");
   setupMarriages(myDiagram);
    setupParents(myDiagram);
    /*
    var cdata = { from: node.data.key, to: newnode.data.key, labelKeys: [mlab.key], category: "Marriage",s: "LinkLabel" };
    myDiagram.model.addLinkData(cdata);
    myDiagram.commitTransaction("add Spouse and Marriage");
    */
}
//oat edit
      
             
  


function init(data) {1
        
    alert(JSON.stringify(data));
            
        
      //if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
      
      myDiagram =
        $(go.Diagram, "myDiagram",
          {
            initialAutoScale: go.Diagram.Uniform,
            initialContentAlignment: go.Spot.Center,
            // when a node is selected, draw a big yellow circle behind it
          click:resetClick,
            nodeSelectionAdornmentTemplate:
          
              $(go.Adornment, "Auto",
                { layerName: "Grid" },  // the predefined layer that is behind everything else
                $(go.Shape, "Circle", { fill: "yellow", stroke: null } ),
                $(go.Placeholder)
                  
                
//----------------------------------------
                
//-----------------------------------------
               
               ),
          
      
            layout:  // use a custom layout, defined below
              $(GenogramLayout, { direction: 90, layerSpacing: 30, columnSpacing: 10 })
          
          
          });
    
    
    
   myDiagram.allowDrop = true;
    
   

      // determine the color for each attribute shape
      function attrFill(a) {
        switch (a) {
          case "A": return "green";
          case "B": return "orange";
          case "C": return "red";
          case "D": return "cyan";
          case "E": return "gold";
          case "F": return "pink";
          case "G": return "blue";
          case "H": return "brown";
          case "I": return "purple";
          case "J": return "chartreuse";
          case "K": return "lightgray";
          case "L": return "magenta";
          case "S": return "red";
          default: return "transparent";
        }
      }

      // determine the geometry for each attribute shape in a male;
      // except for the slash these are all squares at each of the four corners of the overall square
      var tlsq = go.Geometry.parse("F M1 1 l19 0 0 19 -19 0z");
      var trsq = go.Geometry.parse("F M20 1 l19 0 0 19 -19 0z");
      var brsq = go.Geometry.parse("F M20 20 l19 0 0 19 -19 0z");
      var blsq = go.Geometry.parse("F M1 20 l19 0 0 19 -19 0z");
      var slash = go.Geometry.parse("F M38 0 L40 0 40 2 2 40 0 40 0 38z");
      function maleGeometry(a) {
        switch (a) {
          case "A": return tlsq;
          case "B": return tlsq;
          case "C": return tlsq;
          case "D": return trsq;
          case "E": return trsq;
          case "F": return trsq;
          case "G": return brsq;
          case "H": return brsq;
          case "I": return brsq;
          case "J": return blsq;
          case "K": return blsq;
          case "L": return blsq;
          case "S": return slash;
          default: return tlsq;
        }
      }

      // determine the geometry for each attribute shape in a female;
      // except for the slash these are all pie shapes at each of the four quadrants of the overall circle
      var tlarc = go.Geometry.parse("F M20 20 B 180 90 20 20 19 19 z");
      var trarc = go.Geometry.parse("F M20 20 B 270 90 20 20 19 19 z");
      var brarc = go.Geometry.parse("F M20 20 B 0 90 20 20 19 19 z");
      var blarc = go.Geometry.parse("F M20 20 B 90 90 20 20 19 19 z");
      function femaleGeometry(a) {
        switch (a) {
          case "A": return tlarc;
          case "B": return tlarc;
          case "C": return tlarc;
          case "D": return trarc;
          case "E": return trarc;
          case "F": return trarc;
          case "G": return brarc;
          case "H": return brarc;
          case "I": return brarc;
          case "J": return blarc;
          case "K": return blarc;
          case "L": return blarc;
          case "S": return slash;
          default: return tlarc;
        }
      }

    
    
    

      // two different node templates, one for each sex,
      // named by the category value in the node data object
      myDiagram.nodeTemplateMap.add("M",  // male
        $(go.Node, "Vertical",
          { locationSpot: go.Spot.Center, locationObjectName: "ICON" },{
          doubleClick: doubleClickNode,
          click:function(e,node){
              clickNode(window.event.ctrlKey,node)
          },selectionAdornmentTemplate:
          $(go.Adornment, "Spot",
            $(go.Panel, "Auto",
              // this Adornment has a rectangular blue Shape around the selected node
              $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
              $(go.Placeholder)
            )
          ),
          contextMenu:   setContextNode()  // define a context menu for each node
      },
          $(go.Panel,
            { name: "ICON" },
            $(go.Shape, "Square",
              { width: 40, height: 40, strokeWidth: 2, fill: "white", portId: "" }),
            $(go.Panel,
              { // for each attribute show a Shape at a particular place in the overall square
                itemTemplate:
                  $(go.Panel,
                    $(go.Shape,
                      { stroke: null, strokeWidth: 0 },
                      new go.Binding("fill", "", attrFill),
                      new go.Binding("geometry", "", maleGeometry))
                  ),
                margin: 1
              },
              new go.Binding("itemArray", "a")
            )
          ),
          $(go.TextBlock,
            { textAlign: "center", maxSize: new go.Size(80, NaN) },
            new go.Binding("text", "n"))
          
          
        ));

      myDiagram.nodeTemplateMap.add("F",  // female
        $(go.Node, "Vertical",
          { locationSpot: go.Spot.Center, locationObjectName: "ICON" },{
          doubleClick: doubleClickNode,
          click:function(e,node){
              clickNode(window.event.ctrlKey,node)
          }
          ,selectionAdornmentTemplate:
          $(go.Adornment, "Spot",
            $(go.Panel, "Auto",
              // this Adornment has a rectangular blue Shape around the selected node
              $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
              $(go.Placeholder)
            )
          ),
          contextMenu:   setContextNode()
      },
          
          $(go.Panel,
            { name: "ICON" },
            $(go.Shape, "Circle",
              { width: 40, height: 40, strokeWidth: 2, fill: "white", portId: "" }),
            $(go.Panel,
              { // for each attribute show a Shape at a particular place in the overall circle
                itemTemplate:
                  $(go.Panel,
                    $(go.Shape,
                      { stroke: null, strokeWidth: 0 },
                      new go.Binding("fill", "", attrFill),
                      new go.Binding("geometry", "", femaleGeometry))
                  ),
                margin: 1
              },
              new go.Binding("itemArray", "a")
            )
          ),
          $(go.TextBlock,
            { textAlign: "center", maxSize: new go.Size(80, NaN) },
            new go.Binding("text", "n"))
        ));

    
    
      // the representation of each label node -- nothing shows on a Marriage L ink
      myDiagram.nodeTemplateMap.add("LinkLabel",
        $(go.Node, { selectable: false, width: 1, height: 1, fromEndSegmentLength: 20 }));


      myDiagram.linkTemplate =  // for parent-child relationships
        $(go.Link,
          {
            routing: go.Link.Orthogonal, curviness: 10,
            layerName: "Background", selectable: false,
            fromSpot: go.Spot.Bottom, toSpot: go.Spot.Top
          },
          $(go.Shape, { strokeWidth: 2 })
        );

      myDiagram.linkTemplateMap.add("Marriage",  // for marriage relationships
        $(go.Link, { selectable: false },
          $(go.Shape, { strokeWidth: 2, stroke: "darkgreen" })
      ));


      // n: name, s: sex, m: mother, f: father, ux: wife, vir: husband, a: attributesขข/markers
    
      setupDiagram(myDiagram, data,1 /* focus on this person */);
    

  

}




    // create and initialize the Diagram.model given an array of node data representing people
    function setupDiagram(diagram, array, focusId) {
      diagram.model =
        go.GraphObject.make(go.GraphLinksModel,
          { // declare support for link label nodes
            linkLabelKeysProperty: "labelKeys",
            // this property determines which template is used
            nodeCategoryProperty: "s",
            // create all of the nodes for people
            nodeDataArray: array
          });
      setupMarriages(diagram);
      setupParents(diagram);
        
        myDiagram =diagram;

      var node = diagram.findNodeForKey(focusId);
      if (node !== null) {
        diagram.select(node);
        node.linksConnected.each(function(l) {
          if (!l.isLabeledLink) return;
          l.opacity = 0;
          var spouse = l.getOtherNode(node);
          spouse.opacity = 0;
          spouse.pickable = false;
            
            
            
        });
      }
    }

    function findMarriage(diagram, a, b) {  // A and B are node keys
      var nodeA = diagram.findNodeForKey(a);
      var nodeB = diagram.findNodeForKey(b);
      if (nodeA !== null && nodeB !== null) {
        var it = nodeA.findLinksBetween(nodeB);  // in either direction
        while (it.next()) {
          var link = it.value;
          // Link.data.category === "Marriage" means it's a marriage relationship
          if (link.data !== null ) return link;
        }
      }
      return null;
    }

    // now process the node data to determine marriages
    function setupMarriages(diagram) {
      var model = diagram.model;
      var nodeDataArray = model.nodeDataArray;
      for (var i = 0; i < nodeDataArray.length; i++) {
        var data = nodeDataArray[i];
        var key = data.key;
        var uxs = data.cou;
        if (uxs !== undefined) {
          if (typeof uxs === "number") uxs = [ uxs ];
          for (var j = 0; j < uxs.length; j++) {
            var wife = uxs[j];
            if (key === wife) {
              // or warn no reflexive marriages
              continue;
            }
            var link = findMarriage(diagram, key, wife);
            if (link === null) {
              // add a label node for the marriage link
              var mlab = { s: "LinkLabel" };
              model.addNodeData(mlab);
              // add the marriage link itself, also referring to the label node
              var mdata = { from: key, to: wife, labelKeys: [mlab.key], category: "Marriage" };
              model.addLinkData(mdata);
              
            }
          }
        }
        
      }
        
        
       
    }

    // process parent-child relationships once all marriages are known
    function setupParents(diagram) {
      var model = diagram.model;
      var nodeDataArray = model.nodeDataArray;
      for (var i = 0; i < nodeDataArray.length; i++) {
        var data = nodeDataArray[i];
        var key = data.key;
        var mother = data.m;
        var father = data.f;
        if (mother !== undefined && father !== undefined) {
          var link = findMarriage(diagram, mother, father);
          if (link === null) {
            // or warn no known mother or no known father or no known marriage between them
            if (window.console) window.console.log("unknown marriage: " + mother + " & " + father);
            continue;
          }
          var mdata = link.data;
          var mlabkey = mdata.labelKeys[0];
          var cdata = { from: mlabkey, to: key };
          myDiagram.model.addLinkData(cdata);
        }
          /*
          else if(mother !== undefined || father !== undefined){
              alert("Key :"+key);
            var parNode;
              if(mother!== undefined){
               parNode = myDiagram.findNodeForKey(mother);
            }else{
               parNode = myDiagram.findNodeForKey(father);
            }  
                var link = parNode.findLinksConnected();
              
          var mdata = link.data;
          var mlabkey = mdata.labelKeys;
          var cdata = { from: mlabkey, to: key };
          myDiagram.model.addLinkData(cdata);
              
          }
          */
      }
        
         //oat edit
      diagramGlobal =  diagram;
        
    }


    // A custom layout that shows the two families related to a person's parents
    function GenogramLayout() {
      go.LayeredDigraphLayout.call(this);
      this.initializeOption = go.LayeredDigraphLayout.InitDepthFirstIn;
    }
    go.Diagram.inherit(GenogramLayout, go.LayeredDigraphLayout);

    /** @override */
    GenogramLayout.prototype.makeNetwork = function(coll) {
      // generate LayoutEdges for each parent-child Link
      var net = this.createNetwork();
      if (coll instanceof go.Diagram) {
        this.add(net, coll.nodes, true);
        this.add(net, coll.links, true);
      } else if (coll instanceof go.Group) {
        this.add(net, coll.memberParts, false);
      } else if (coll.iterator) {
        this.add(net, coll.iterator, false);
      }
      return net;
    };

    // internal method for creating LayeredDigraphNetwork where husband/wife pairs are represented
    // by a single LayeredDigraphVertex corresponding to the label Node on the marriage Link
    GenogramLayout.prototype.add = function(net, coll, nonmemberonly) {
      // consider all Nodes in the given collection
      var it = coll.iterator;
      while (it.next()) {
        var node = it.value;
        if (!(node instanceof go.Node)) continue;
        if (!node.isLayoutPositioned || !node.isVisible()) continue;
        if (nonmemberonly && node.containingGroup !== null) continue;
        // if it's an unmarried Node, or if it's a Link Label Node, create a LayoutVertex for it
        if (node.isLinkLabel) {
          // get marriage Link
          var link = node.labeledLink;
          var spouseA = link.fromNode;
          var spouseB = link.toNode;
          // create vertex representing both husband and wife
          var vertex = net.addNode(node);
          // now define the vertex size to be big enough to hold both spouses
          vertex.width = spouseA.actualBounds.width + 30 + spouseB.actualBounds.width;
          vertex.height = Math.max(spouseA.actualBounds.height, spouseB.actualBounds.height);
          vertex.focus = new go.Point(spouseA.actualBounds.width + 30/2, vertex.height/2);
        } else {
          // don't add a vertex for any married person!
          // instead, code above adds label node for marriage link
          // assume a marriage Link has a label Node
          if (!node.linksConnected.any(function(l) { return l.isLabeledLink; })) {
            var vertex = net.addNode(node);
          }
        }
      }
      // now do all Links
      it.reset();
      while (it.next()) {
        var link = it.value;
        if (!(link instanceof go.Link)) continue;
        if (!link.isLayoutPositioned || !link.isVisible()) continue;
        if (nonmemberonly && link.containingGroup !== null) continue;
        // if it's a parent-child link, add a LayoutEdge for it
        if (!link.isLabeledLink) {
          var parent = net.findVertex(link.fromNode);  // should be a label node
          var child = net.findVertex(link.toNode);
          if (child !== null) {  // an unmarried child
            net.linkVertexes(parent, child, link);
          } else {  // a married child
            link.toNode.linksConnected.each(function(l) {
              if (!l.isLabeledLink) return;  // if it has no label node, it's a parent-child link
              // found the Marriage Link, now get its label Node
              var mlab = l.labelNodes.first();
              // parent-child link should connect with the label node,
              // so the LayoutEdge should connect with the LayoutVertex representing the label node
              var mlabvert = net.findVertex(mlab);
              if (mlabvert !== null) {
                net.linkVertexes(parent, mlabvert, link);
              }
            });
          }
        }
      }
    };

    /** @override */
    GenogramLayout.prototype.assignLayers = function() {
      go.LayeredDigraphLayout.prototype.assignLayers.call(this);
      var horiz = this.direction == 0.0 || this.direction == 180.0;
      // for every vertex, record the maximum vertex width or height for the vertex's layer
      var maxsizes = [];
      this.network.vertexes.each(function(v) {
        var lay = v.layer;
        var max = maxsizes[lay];
        if (max === undefined) max = 0;
        var sz = (horiz ? v.width : v.height);
        if (sz > max) maxsizes[lay] = sz;
      });
      // now make sure every vertex has the maximum width or height according to which layer it is in,
      // and aligned on the left (if horizontal) or the top (if vertical)
      this.network.vertexes.each(function(v) {
        var lay = v.layer;
        var max = maxsizes[lay];
        if (horiz) {
          v.focus = new go.Point(0, v.height / 2);
          v.width = max;
        } else {
          v.focus = new go.Point(v.width / 2, 0);
          v.height = max;
        }
      });
      // from now on, the LayeredDigraphLayout will think that the Node is bigger than it really is
      // (other than the ones that are the widest or tallest in their respective layer).
    };

    /** @override */
    GenogramLayout.prototype.commitNodes = function() {
      go.LayeredDigraphLayout.prototype.commitNodes.call(this);
      // position regular nodes
      this.network.vertexes.each(function(v) {
        if (v.node !== null && !v.node.isLinkLabel) {
          v.node.position = new go.Point(v.x, v.y);
        }
      });
      // position the spouses of each marriage vertex
      var layout = this;
      this.network.vertexes.each(function(v) {
        if (v.node === null) return;
        if (!v.node.isLinkLabel) return;
        var labnode = v.node;
        var lablink = labnode.labeledLink;
        // In case the spouses are not actually moved, we need to have the marriage link
        // position the label node, because LayoutVertex.commit() was called above on these vertexes.
        // Alternatively we could override LayoutVetex.commit to be a no-op for label node vertexes.
        lablink.invalidateRoute();
        var spouseA = lablink.fromNode;
        var spouseB = lablink.toNode;
        // prefer fathers on the left, mothers on the right
        if (spouseA.data.s === "F") {  // sex is female
          var temp = spouseA;
          spouseA = spouseB;
          spouseB = temp;
        }
        // see if the parents are on the desired sides, to avoid a link crossing
        var aParentsNode = layout.findParentsMarriageLabelNode(spouseA);
        var bParentsNode = layout.findParentsMarriageLabelNode(spouseB);
        if (aParentsNode !== null && bParentsNode !== null && aParentsNode.position.x > bParentsNode.position.x) {
          // swap the spouses
          var temp = spouseA;
          spouseA = spouseB;
          spouseB = temp;
        }
        spouseA.position = new go.Point(v.x, v.y);
        spouseB.position = new go.Point(v.x + spouseA.actualBounds.width + 30, v.y);
        if (spouseA.opacity === 0) {
          var pos = new go.Point(v.centerX - spouseA.actualBounds.width/2, v.y);
          spouseA.position = pos;
          spouseB.position = pos;
        } else if (spouseB.opacity === 0) {
          var pos = new go.Point(v.centerX - spouseB.actualBounds.width/2, v.y);
          spouseA.position = pos;
          spouseB.position = pos;
        }
      });
    };

    GenogramLayout.prototype.findParentsMarriageLabelNode = function(node) {
      var it = node.findNodesInto();
      while (it.next()) {
        var n = it.value;
        if (n.isLinkLabel) return n;
      }
        
      return null;
    };
      
      

//************************

function addNode(data){
    myDiagram.startTransaction('new node');
          var data = {key:5,n: New,s:F,m:2,f:3,a:[B,H]};
          myDiagram.model.addNodeData(data);
          part = myDiagram.findPartForData(data);
          part.location =               myDiagram.toolManager.contextMenuTool.mouseDownPoint;
          myDiagram.commitTransaction('new node');
}



      
//******************************

function openFile(event) {
    var input = event.target;
    var data=[];
    
    var reader = new FileReader();
    reader.onload = function(){
      var text = reader.result;
      var lines = text.split("\r\n");
       
    for(var line = 0; line < lines.length; line++){
        
     data.push(readByLine(lines[line]));
       
    }
         //alert(JSON.stringify(data));
        init(data);
    
    function readByLine(line){
        var attribute = line.split(',');
        var obj ={};
        for(var item = 0; item < attribute.length; item++){
            var buddle = attribute[item].split(':');
            var key = buddle[0];
            var value = buddle[1]
            obj[key] = value;
        }
        return obj;
    
    }
                                                                    
        
    };
    reader.readAsText(input.files[0]);
    
  };

//*************************

function changeData(){
    var newData=[
        {key:1,n:"Hello"},
        {key:2,n:"World"}];
    init(newData);
     setupDiagram(myDiagram, newData,1 /* focus on this person */);
    
}