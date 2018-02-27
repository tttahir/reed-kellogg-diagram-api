class GraphEdge():
    def __init__(self, node_par=None, node_ch=None, edge_label = None):
        self.label = edge_label
        self.node_par = node_par
        self.node_ch = node_ch


class GraphNode():
    def __init__(self, text=None, parent=None, value=None, raw_relation = None, meta = None):
        self.childs = [] # list of graph edges
        self.text = text
        self.parent = parent
        self.value = value
        self.raw_relation = raw_relation
        self.meta = meta
    def add_child(self, graph_node_child, relation=None):
        self.childs.append(graph_node_child)#GraphEdge(self, graph_node_child, relation))
    def edit_text(self, text):
        self.text = [text]
class Graph():
    def __init__(self):
        self.root = GraphNode()

def get_part_of_speech(tag):
    if tag in parts_of_speech:
        return parts_of_speech[tag]
    return 'Punctuation mark'

def get_dependent(rel):
    if rel in dependencies:
        return dependencies[rel]
    return 'Unknown dependence'

dependencies = {
'acomp': 'adjectival complement',
'advcl': 'adverbial clause modifier',
'advmod': 'adverb modifier',
'agent': 'agent',
'amod': 'adjectival modifier',
'appos': 'appositional modifier',
'aux': 'auxiliary',
'auxpass': 'passive auxiliary',
'cc': 'coordination',
'ccomp': 'clausal complement',
'conj': 'conjunct',
'cop': 'copula',
'csubj': 'clausal subject',
'csubjpass': 'clausal passive subject',
'dep': 'dependent',
'det': 'determiner',
'discourse': 'discourse element',
'dobj': 'direct object',
'expl': 'expletive',
'goeswith': 'goes with',
'iobj': 'indirect object',
'mark': 'marker',
'mwe': 'multi-word expression',
'neg': 'negation modifier',
'nn': 'noun compound modifier',
'npadvmod': 'noun phrase as adverbial modifier',
'nsubj': 'nominal subject',
'nsubjpass': 'passive nominal subject',
'num': 'numeric modifier',
'number': 'element of compound number',
'parataxis': 'parataxis',
'pcomp': 'prepositional complement',
'pobj': 'object of a preposition',
'poss': 'possession modifier',
'possessive': 'possessive modifier',
'preconj': 'preconjunct',
'predet': 'predeterminer',
'prep': 'prepositional modifier',
'prepc': 'prepositional clausal modifier',
'prt': 'phrasal verb particle',
'punct': 'punctuation',
'quantmod': 'quantifier phrase modifier',
'rcmod': 'relative clause modifier',
'ref': 'referent',
'root': 'root',
'tmod': 'temporal modifier',
'vmod': 'reduced non-finite verbal modifier',
'xcomp': 'open clausal complement',
'xsubj': 'controlling subject'
}

parts_of_speech = {
'CC': 'Coordinating conjunction',
'CD': 'Cardinal number',
'DT': 'Determiner',
'EX': 'Existential there',
'FW': 'Foreign word',
'IN': 'Preposition or subordinating conjunction',
'JJ': 'Adjective',
'JJR': 'Adjective, comparative',
'JJS': 'Adjective, superlative',
'LS': 'List item marker',
'MD': 'Modal',
'NN': 'Noun, singular or mass',
'NNS': 'Noun, plural',
'NNP': 'Proper noun, singular',
'NNPS': 'Proper noun, plural',
'PDT': 'Predeterminer',
'POS': 'Possessive ending',
'PRP': 'Personal pronoun',
'PRP$': 'Possessive pronoun',
'RB': 'Adverb',
'RBR': 'Adverb, comparative',
'RBS': 'Adverb, superlative',
'RP': 'Particle',
'SYM': 'Symbol',
'TO': 'to',
'UH': 'Interjection',
'VB': 'Verb, base form',
'VBD': 'Verb, past tense',
'VBG': 'Verb, gerund or present participle',
'VBN': 'Verb, past participle',
'VBP': 'Verb, non-3rd person singular present',
'VBZ': 'Verb, 3rd person singular present',
'WDT': 'Wh-determiner',
'WP': 'Wh-pronoun',
'WP$': 'Possessive wh-pronoun',
'WRB': 'Wh-adverb'
}