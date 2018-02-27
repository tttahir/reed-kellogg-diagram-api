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
    return 'Unknown part of speech:' + tag

def get_dependent(rel):
    if rel in dependencies:
        return dependencies[rel]
    return 'Unknown dependence: ' + rel

# relcl
dependencies = {
'acl': 'clausal modifier of noun (adjectival clause)',
'acomp': 'adjectival complement',
'advcl': 'adverbial clause modifier',
'advmod': 'adverb modifier',
'agent': 'agent',
'amod': 'adjectival modifier',
'appos': 'appositional modifier',
'attr': 'attribute',
'aux': 'auxiliary',
'auxpass': 'passive auxiliary',
'case': 'case marking',
'cc': 'coordination',
'ccomp': 'clausal complement',
'clf': 'classifier',
'compound': 'compound',
'complm': 'complementizer',
'conj': 'conjunct',
'cop': 'copula',
'csubj': 'clausal subject',
'csubjpass': 'clausal passive subject',
'dep': 'dependent',
'det': 'determiner',
'discourse': 'discourse element',
'dislocated': 'dislocated elements',
'dobj': 'direct object',
'expl': 'expletive',
'fixed': 'fixed multiword expression',
'flat': 'flat multiword expression',
'hmod': 'modifier in hyphenation',
'hyph': 'hyphen',
'goeswith': 'goes with',
'infmod': 'infinitival modifier',
'intj': 'interjection',
'iobj': 'indirect object',
'list': 'list',
'mark': 'marker',
'meta': 'meta modifier',
'mwe': 'multi-word expression',
'neg': 'negation modifier',
'nmod': 'modifier of nominal',
'nn': 'noun compound modifier',
'npadvmod': 'noun phrase as adverbial modifier',
'nsubj': 'nominal subject',
'nsubjpass': 'passive nominal subject',
'num': 'numeric modifier',
'nummod': 'numeric modifier',
'number': 'element of compound number',
'oprd': 'object predicate',
'obj': 'object',
'obl': 'oblique nominal',
'orphan': 'orphan',
'parataxis': 'parataxis',
'partmod': 'participal modifier',
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
'relcl': 'relative clause modifier',
'reparandum': 'overridden disfluency',
'root': 'root',
'tmod': 'temporal modifier',
'vmod': 'reduced non-finite verbal modifier',
'vocative': 'vocative',
'xcomp': 'open clausal complement',
'xsubj': 'controlling subject'
}

parts_of_speech = {
'-LRB-': 'left round bracket',
'-RRB-': 'right round bracket',
',': 'punctuation mark, comma',
':': 'punctuation mark, colon or ellipsis',
'.': 'punctuation mark, sentence closer',
"''": 'closing quotation mark',
'""': 'closing quotation mark',
'#': 'symbol, number sign',
'``': 'opening quotation mark',
'$': 'symbol, currency',
'ADD': 'email',
'AFX': 'affix',
'BES': 'auxiliary "be"',
'CC': 'Coordinating conjunction',
'CD': 'Cardinal number',
'DT': 'Determiner',
'EX': 'Existential there',
'FW': 'Foreign word',
'GW': 'additional word in multi-word expression',
'HVS': 'forms of "have"',
'HYPH': 'PunctType=dash  punctuation mark, hyphen',
'IN': 'Preposition or subordinating conjunction',
'JJ': 'Adjective',
'JJR': 'Adjective, comparative',
'JJS': 'Adjective, superlative',
'LS': 'List item marker',
'MD': 'Modal',
'NFP': 'Superfluous punctuation',
'NIL': 'Missing tag',
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
'_SP': 'Space',
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
'WRB': 'Wh-adverb',
'XX': 'Unknown'
}