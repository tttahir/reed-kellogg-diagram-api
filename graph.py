



class GraphEdge():
    def __init__(self, node_par=None, node_ch=None, edge_label = None):
        self.label = edge_label
        self.node_par = node_par
        self.node_ch = node_ch


class GraphNode():
    def __init__(self, text=None, parent=None, value=None, raw_relation = None):
        self.childs = [] # list of graph edges
        self.text = text
        self.parent = parent
        self.value = value
        self.raw_relation = raw_relation
    def add_child(self, graph_node_child, relation=None):
        self.childs.append(graph_node_child)#GraphEdge(self, graph_node_child, relation))
    def edit_text(self, text):
        self.text = [text]
class Graph():
    def __init__(self):
        self.root = GraphNode()
