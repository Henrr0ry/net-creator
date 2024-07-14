 
class Topology {
    constructor() {
      this.nodes = [];
      this.links = [];
      this.canvas = document.getElementById('topo-canvas');
      this.context = this.canvas.getContext('2d');
      this.context.lineWidth = 2;
      this.context.strokeStyle = 'black';
    }
  
    addNode(name) {
      // create a new node object with the given name
      const node = { name, x: Math.random() * (this.canvas.width - 100), y: Math.random() * (this.canvas.height - 100) };
      this.nodes.push(node);
      // draw the node on the canvas
      this.drawNode(node);
    }
  
    addLink(sourceNode, targetNode) {
      // create a new link object with the given source and target nodes
      const link = { source: sourceNode, target: targetNode };
      this.links.push(link);
      // draw the link on the canvas
      this.drawLink(link);
    }
  
    drawNode(node) {
      // draw a circle for the node
      this.context.beginPath();
      this.context.arc(node.x, node.y, 20, 0, Math.PI * 2);
      this.context.fill();
      // draw the node name text
      this.context.font = '12px Arial';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillText(node.name, node.x, node.y - 10);
    }
  
    drawLink(link) {
      // draw a line between the source and target nodes
      this.context.beginPath();
      this.context.moveTo(link.source.x, link.source.y);
      this.context.lineTo(link.target.x, link.target.y);
      this.context.stroke();
    }
  }
  
  // create a new Topology instance and start drawing nodes and links
  const topology = new Topology();
  document.getElementById('add-node').addEventListener('click', () => {
    const nodeName = document.getElementById('node-name').value;
    topology.addNode(nodeName);
  });
  document.getElementById('add-link').addEventListener('click', () => {
    const sourceNodeSelect = document.getElementById('link-source');
    const targetNodeSelect = document.getElementById('link-target');
    const sourceNode = nodes.find((node) => node.name === sourceNodeSelect.value);
    const targetNode = nodes.find((node) => node.name === targetNodeSelect.value);
    topology.addLink(sourceNode, targetNode);
  });