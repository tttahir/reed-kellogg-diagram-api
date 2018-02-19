import os
import spacy
import graph
import sys

nlp = spacy.load('en_core_web_sm')
print('Spacy version:', spacy.__version__)

class rule():
    def get_rule(self):
        return self.rule_num
    def in_rule(self, rule):
        return rule in self.set_rules
    def get_action(self, rule):
        return self.action_set[rule]
    def draw_rule(self, parent_word, node_word, rule):
        return self.rule_draw[self.get_action(rule)](node_word, parent_word)

class rule_1(rule):
    # main sentence __|_____ rule
    #                 |
    def __init__(self):
        self.rule_num = 1
        self.set_rules = {"nsubj", "nsubjpass", "dobj"}
        self.action_set = {"nsubj":0, "nsubjpass":0, "csubj":0, "csubj":0, "csubjpass":0, "dobj":1}
        self.rule_draw = [lambda child, root : "__"+child+"__|__"+root+"__"+"\n"+" "*(len("__"+child+"__"))+"|", lambda child, root: "__"+root+"__|__"+child+"__"]

class rule_2(rule):
    # complement ___\____ rule
    def __init__(self):
        self.rule_num = 2
        self.set_rules = {"attr", "acomp", "complm"}
        self.action_set = {key:0 for key in self.set_rules}
        self.rule_draw = [lambda child, root: "__"+root+"__\\__"+child+"__"]
        # self.rule_draw = ["___root_node___\\___child_node____"]

class rule_3(rule):
    # modifiers ______ rule
    #               \
    def __init__(self):
        self.rule_num = 3
        self.set_rules = {"advmod", "neg", "nmod", "appos", "det", "infmod", "nn", "num", "partmod", "possessive", "predet", "pcomp", "number", "amod", "meta", "poss"}
        self.action_set = {key:0 for key in self.set_rules}
        self.rule_draw = [lambda child, root: "__"+root+"__\n\t\\\n\t \\"+child]
        # self.rule_draw = ["_____root_node____\n\t\t\\\n\t\t \\child_node"]

class rule_4(rule):
    # preposition ________ rule
    #                \
    #                 \_____
    def __init__(self):
        self.rule_num = 4
        self.set_rules = {"agent", "pcomp", "pobj", "prep"}
        self.action_set = {"agent":0, "pcomp":0, "prep":0, "pobj":1}
        self.rule_draw = [lambda child, root: "__"+root+"__\n\t\\\n\t \\"+child+"\n\t  \\________", lambda child, root: "____\n\t\\\n\t \\"+root+"\n\t  \\__"+child+"__"]
        # self.rule_draw = ["__parent_node___\n\t\\\n\t \\child_node", "_____\n\t\\\n\t \\root_node\n\t  ___child_node__"]

class rule_5(rule):
    # indirect ________ rule
    #                \
    #                 \_____
    def __init__(self):
        self.rule_num = 5
        self.set_rules = {"iobj"}
        self.action_set = {"iobj":0}
        self.rule_draw = [lambda child, root: "__"+root+"__\n\t\\\n\t \\\n\t  \\__"+child+"__"]

class rule_6(rule):
    # TODO check that conjucted items have childrens nsubj, if that then this is 10 -th rule
    def __init__(self):
        self.rule_num = 6
        self.set_rules = {"cc", "conj"}
        self.action_set = {"cc":0, "conj":1}
        self.rule_draw = [lambda child, root: "_______________" +"\n" + " "*len("_______________")+"|\\\n"  + " "*(len("_______________") - len(" " + child + " "))+ " " + child + " | \\" + "_"+root+"_" + "\n"+ " "*(len("_______________")) +"| /", lambda child, root: "__"+child+"__" +"\n" + " "*len("__"+child+"__")+"|\\\n"  + " "*(len("__"+child+"__"))+"| \\" + "_"+root+"_" + "\n"+ " "*(len("__"+child+"__")) +"| /" ]

class rule_7(rule):
    # TODO check that word do not have in childs to
    def __init__(self):
        self.rule_num = 7
        self.set_rules = {"relcl", "npadvmod", "rcmod", "quantmod", "advcl", "mark"}
        self.action_set = {"relcl":0, "npadvmod":0, "rcmod":0, "quantmod":0, "advcl":0, "mark":1}
        self.rule_draw = [lambda child, root: "__first_sentence_root:_ " + root + "__\n\t|\n\t|\n\t| \n  __second_sentence_root:_" + child + "__", lambda child, root:"__first_sentence_root:_ " + root + "__\n\t|\n\t"+child+"\n\t|"]

class rule_8(rule):
    # TODO somehow check if word have to in childs
    def __init__(self):
        self.rule_num = 8
        self.set_rules = {"relcl_jnj;"}
        self.action_set = {"relcl":0, "npadvmod":0, "rcmod":0, "quantmod":0, "advcl":0, "mark":0}
        self.rule_draw = [lambda child, root: "__first_sentence_root:__" + root + "__\n\t\\\n\t \\to\n\t  \\__second_sentence_root:_" + child + "__"]

class rule_9(rule):
    def __init__(self):
        self.rule_num = 9
        self.set_rules = {"xcomp", "csubj", "ccomp", "csubjpass"}
        self.action_set = {"xcomp":1, "ccomp":1, "csubj":0, "csubjpass":0}
        self.rule_draw = [lambda child, root: " "*(len(" "*8+"_________/\\______|_second_") - len("_first_sentence_root:_"))+"_first_sentence_root:_"+child+"_" +("\n" + " "*len(" "*8+"_________/") + "|")*3 +"\n" +" "*8+"_________/\\______|_second_sentence_root:_" + root + "_",lambda child, root: " "*(len(" "*4+"__|_second_sentence_root:_" + root + "_\\/") - len("_first_sentence_root:_"))+"_first_sentence_root:_"+child+"_" +("\n" + " "*len(" "*4+"__|_second_sentence_root:_" + root + "_\\_/") + "|")*3 +"\n" +" "*4+"__|_second_sentence_root:_" + root + "_\\_/\\"]

class rule_10(rule):
    def __init__(self):
        self.rule_num = 10
        # Nothing here, make switcher somewhere else
        self.set_rules = {"cc1", "conj1"}
        self.action_set = {"cc":1, "conj":0}
        self.rule_draw = [lambda child, root: "__first_sentence_root:_" + root + "__\n\t|\n\t|\n\t|\n___second_sentence_root:_" + child + "__", lambda child, root: "__first_sentence_root:_" + root + "__\n\t|\n\t|"+child+"\n\t|\n"]

class rule_merge(rule):
    def __init__(self):
        self.rule_num = 11
        self.set_rules = {"aux"}
        self.rule_draw = [lambda child, root: ""]
    def get_action(self, rule):
        return 0

class rule_default(rule):
    def __init__(self):
        self.rule_num = 0
        self.rule_draw = [lambda child, root: ""]
    def in_rule(self, rule):
        return True
    def get_action(self, rule):
        return 0

class relations_map():
    def __init__(self):
        self.rules = [rule_1(), rule_2(), rule_3(), rule_4(), rule_5(), rule_6(), rule_7(), rule_8(), rule_9(), rule_10(), rule_merge(), rule_default()]
    def find_rule(self, relation, all_childs=None):
        for i in range(len(self.rules)):
            if self.rules[i].in_rule(relation):
                return i, self.rules[i]
    # def complicated_rules
        return -1

def dfs_tree(node):
    if node is None:
        return
    # print("Type node: ", type(node))
    if node.parent is None:
        pass
        # print("Node: |", node.value, " | parent: | root | relation: |", node.text, "|" )
    else:
        pass
        # print("Node: |", node.value, " | parent: |",node.parent.value, "| relation: |", node.text, "|" )
    # print("Node: ", node)
    # print("To parent relation: ", node.dep_)
    # print("Node childs: ", list(node.children))
    # print("Childrens type: ", type(node.children))
    res = [dfs_tree(child) for child in node.childs]

relation_base_obj = relations_map()

def decide_rule(relation_type, parent, child, all_childs=None):
    res = relation_base_obj.find_rule(relation_type, all_childs=all_childs)
    if isinstance(res, int):
        res = res
    else:
        res = res[1]
        # print("All childs: ", all_childs)
        # print("All childs: ", [x.dep_ for x in list(child.children)], " for ", child.orth_)
        # print("All childs: ", [x.dep_ for x in list(parent.children)], " for ", parent.orth_)
        if isinstance(res, rule_6):
            nsubj_child = False
            # print("-------------------------------")
            # print("Node: ", child.pos_)
            # print("All childs: ", all_childs)
            # print("--------------------------------")
            # for child_r in all_childs:
            for child_r in child.children:
                if child_r.dep_ == 'nsubj':
                # if child_r[1] == 'nsubj':
                    # print("Find sentences conj")
                    nsubj_child = True
                    break
            nsubj_par = False
            for child_r in parent.children:
                if  child_r.dep_ == "nsubj":
                    nsubj_par = True
            if nsubj_child & nsubj_par:
                # print("Finded sentences conj")
                res = relation_base_obj.rules[9]
        # print("RES: ",res)
        if isinstance(res, rule_7):
            for child_r in child.children:
                if child_r.orth_ == 'to':
                    # print("Find instance 8 rule!!!!!!!!!!!!")
                    res = relation_base_obj.rules[7]
                    break
    return res
    # return "_".join([str(x) for x in res])

def modify_graph(root, nodes_relation, graph_root, all_childs=None):
    # for relation in nodes_relation:
    child  = nodes_relation[0]#relation[0]
    relation_type = nodes_relation[1]#relation[1]
    diagram_relation_type  = decide_rule(relation_type, root, child, all_childs= all_childs)
    child_graph_node = graph.GraphNode(text=diagram_relation_type, parent=graph_root, value=child.orth_, raw_relation = relation_type)
    # print("Created child: |", child.orth_+ " " + str(child.i), "| for |", root.orth_ + " " + str(root.i), "|", " relation |", relation_type, "| decided rule: |", diagram_relation_type, "|")
    return child_graph_node
    # add child nodes to root, then check if they must be merged - merge

def construct_sent_diagram(sentence):
    root = sentence.root
    # print("TYPE SENTENCE: ", type(sentence))
    # print("TYPE NODE: ", type(root))
    # sys.exit(1)
    root_graph_node = graph.GraphNode(text="root", value=root.orth_)
    truly_root = root_graph_node
    visited_nodes = [(root, root_graph_node)]
    subtrees = {str(root.orth_)+"_"+str(root.i) : {"nodes":set(root.subtree), "parent":None, "childs":[]}}
    puncts = []
    while len(visited_nodes) > 0:
        root, root_graph_node = visited_nodes.pop(0)
        childs = [child for child in root.children]
        nodes_relation = [(child, child.dep_) for child in childs ]
        for relation in nodes_relation:
            child_graph_node = modify_graph(root, relation, root_graph_node, all_childs=nodes_relation)
            if relation[0].dep_ == "punct" or relation[0].dep_ == "cc":
                puncts.append((relation[0].orth_, relation[0].dep_))
            if isinstance(child_graph_node.text, rule_10):
                    # root_subtree = set(root.subtree)
                    root_subtree = subtrees[str(root.orth_)+"_"+str(root.i)]["nodes"]#set(root.subtree)

                    child_root_subtree = set(relation[0].subtree)
                    subtrees[str(root.orth_) + "_" + str(root.i)] = {"nodes":root_subtree - child_root_subtree, "parent":subtrees[str(root.orth_) + "_" + str(root.i)]["parent"],"childs":subtrees[str(root.orth_) + "_" + str(root.i)]["childs"]+[str(relation[0].orth_) + "_" + str(relation[0].i)], "r_node":root_graph_node}
                    subtrees[str(relation[0].orth_) + "_" + str(relation[0].i)] = {"nodes":child_root_subtree, "parent":str(root.orth_) + "_" + str(root.i), "childs":[], "r_node":child_graph_node}
                    # for el in root_subtree:
                    #     el_childs_tags = set([x.dep_ for x in el.children])
                    #     if (not "conj" in el_childs_tags) and ("cc" in el_childs_tags):
                    #         print("FIND ONE: ", el.orth_)
                    #         res_cc = None
                    #         for el_chld in el.children:
                    #             if el_chld.dep_ == "cc":
                    #                 res_cc = el_chld.orth_
                    #                 nbor = el_chld.i
                    #                 break
                    #         print("CC : ", res_cc)
                    #         print("NBOR: ", nbor)
                    # print("SUBTREE: ", root_subtree - child_root_subtree)
                    # print("SUBTREE: ", list(relation[0].subtree))
            # print("ROOT LINK TYPE: ", child_graph_node.value)
            # print("ROOT CHILDS: ", root_graph_node.text)
            if child_graph_node.value == "to" and isinstance(root_graph_node.text,rule_8):
                # print("SKIP TO FOR 8 RULE INSTANCE")
                continue
            # print("ROOT CHILDS: ", [chd.text for chd in root_graph_node.childs])
            root_graph_node.add_child(child_graph_node)
            visited_nodes.append([relation[0], child_graph_node])

    for key in subtrees:
        right_most = -1
        right_most_token = None
        nodes = subtrees[key]["nodes"]
        childs = subtrees[key]["childs"]
        for node in nodes:
            if node.i > right_most and node.dep_ != "punct":
                right_most = node.i
                right_most_token = node
        if right_most_token.dep_ == "cc":
            # print("Interest token: ", right_most_token, " | ", right_most, " | childs: ", childs, " | root: ", key)
            root_graph_node = subtrees[key]["r_node"]
            nodes_to_visit = [root_graph_node]
            while len(nodes_to_visit) > 0:
                node_to_visit = nodes_to_visit.pop(0)
                childs = node_to_visit.childs
                for child_index in range(len(childs)):
                    if childs[child_index].value == right_most_token.orth_:
                        # print("Find")
                        child_moved = node_to_visit.childs.pop(child_index)
                        child_moved.text = relation_base_obj.rules[9]
                        root_graph_node.childs.append(child_moved)
                        child_moved.parent = root_graph_node
                        nodes_to_visit = []
                        break
                    else:
                        # print("Not find: ", childs[child_index].value)
                        nodes_to_visit.append(childs[child_index])
        # print(" token: ", right_most_token, " | ", right_most, " | childs: ", childs, " | key: ", key)
        # print("Rightest token: ", right_most_token, " | ", right_most)
        # if right most token is cc then update created graph. Find this cc in new created graph and to the parent of cc add related sentence as child
    return truly_root

def construct_redkillog_graph(text):
    doc = nlp(text)
    roots = []
    for sent in doc.sents:
        root = construct_sent_diagram(sent)
        dfs_tree(root)
        roots.append(root)
    return roots

def draw_tree(node):
    if node is None:
        return
    # print("Type node: ", type(node))
    # print('text', node.text)
    if node.parent is None:
        pass
        # print("Node: |", node.value, " | parent: | root | relation: |", node.text, "|")
    else:
        print("==========================================================")
        print('node.raw_relation', node.raw_relation, 'node.text', node.text)
        print(node.text.draw_rule(node.parent.value, node.value, node.raw_relation))
        # print('Node: |', node.value, ' | parent: |', node.parent.value, '| relation: ', node.raw_relation)#text.draw_rule(node.parent.value, node.value, node.raw_relation))

    for child in node.childs:
        draw_tree(child)

# text = "Hello i'm your daughter"
# text = "Ellen needs help"
# text = "She's not as old as Mary"
# text = "The visitors from El Paso"
# text = "My parents saw them at a concert a long time ago."
# text = "Jennifer took on two paper routes to earn money for camp."
# text = "The house looks tidy, but the yard is a mess."
# text = "Tom stopped to take a close look at the car."
# text = "The guy must pass several trials to see and to take his bride away."
# text = "The fighter seems out of shape."
# text = "To know him is to love him."
# text = "John, Mary and Sam were there"
# text = "You choose a color that you like"
# text = "The people who live on this street seem pleasant"
# text = "We enjoy talking"
# text = "My brother and I are getting together for dinner."
# text = "He left early because he felt sick."
# text = "We are campers tired but happy."
# text = "He can and should finish the job."
# text = "How many apples does mary has."
# text = "Everyone wondered when would start to play."
# text = "A long time ago a the house looked neat and nice, like a new one, but eventually became obsolete."
# text = "house looks, but yard is"
# text = "The students worked so very hard"
# text = "How many apples does mary has. "


def process_tree(node):
    i = 0
    ch = node['childs']
    while i < len(ch):
        r = ch[i]['rule']
        sr = ch[i]['subRule']
        pr = ch[i]['parent']['rule']
        psr = ch[i]['parent']['subRule']
        pas = ch[i]['parent']['as']
        ch[i]['as'] = 'child'

        # RuleDefault и RuleMerge прибавляем к родителю и удаляем
        if r == 0 or r == 11:
            if not ch[i]['value'] in {'-','!','?',',','.'}:
                vlist = ch[i]['parent']['value'].split(' ')
                value =  ' '.join(vlist[:-1]) + ' ' + ch[i]['value'] + ' ' + vlist[-1]
                ch[i]['parent']['value'] = value.strip()
            if len(ch[i]['childs']) > 0:
                # Добавлем их потомков в потомки родителя
                ch.extend(ch[i]['childs'])
            del ch[i]
            continue

        # Заменяем parent.rule на 6 во ижбежание дублирования рисовки
        elif r == 6:
            if pr == 6:
                if psr == 1 and sr == 0:
                    ch[i]['parent']['rule'] = r
                    ch[i]['parent']['subRule'] = 0
                    ch[i]['parent']['as'] = 'parent'
            else:
                if (pr == 2 or pr == 3 or pr == 8) and pas != 'parent':
                    if sr == 0:
                        parent6 = ch[i]['parent'].copy()
                        parent6['rule'] = r
                        parent6['subRule'] = 0
                        parent6['as'] = 'parent'
                        parent6['childs'] = ch[i]['parent']['childs'].copy()
                        parent6['parent'] = ch[i]['parent']
                        ch[i]['parent']['value'] = ''
                        ch[i]['parent']['childs'] = [parent6]
                else:
                    ch[i]['parent']['rule'] = r
                    ch[i]['parent']['subRule'] = 0
                    ch[i]['parent']['as'] = 'parent'

        if pas != 'parent':
            # Если parent.rule == ch[i] == ch[i+1] == 3
            # то перемещаем ch[i+1] в ch[i] и меняем их значения
            if pr == r == 3:
                ch[i]['subRule'] = 1
                if i + 1 < len(ch):
                    if r == ch[i + 1]['rule'] == 3:
                        print('3,1 move to 3,1')
                        ch[i + 1]['subRule'] = 1
                        ch[i]['value'], ch[i + 1]['value'] = [ch[i + 1]['value'], ch[i]['value']]
                        ch[i]['childs'].append(ch[i + 1])
                        del ch[i + 1]

            # Если в (4,0) вложен (4,0) прибавляем его к родителю
            elif pr == r == 4 and psr == sr == 0:
                ch[i]['parent']['value'] += ' ' + ch[i]['value']
                ch[i]['parent']['childs'] = ch[i]['childs']
                for child in ch[i]['childs']:
                    child['parent'] = ch[i]['parent']
                print('4,0->4,0')

        # Если после (10,0) идет (10,1) перемещаем его в (10,0)
        if i + 1 < len(ch):
            if r == ch[i + 1]['rule'] == 10:
                print('10,1 move to 10,0')
                ch[i]['childs'].append(ch[i + 1])
                del ch[i + 1]

        process_tree(ch[i])
        i += 1

def parse_sentence(sentence):
    result = []
    roots = construct_redkillog_graph(sentence)

    for i in range(len(roots)):
        print('\n=====================================================')
        print('=========================', i, '=========================')
        draw_tree(roots[i])
        r, sr = get_root_rule(roots[i].childs)
        result.append({
            'rule': r,
            'subRule': sr,
            'value': roots[i].value,
            'as': 'parent',
            'childs': []
        })
        node2dict(roots[i], result[i])
        process_tree(result[i])
        toJSON(result[i]);
    return result

def node2dict(node, new_node):
    ch = node.childs
    for i in range(len(ch)):
        raw = ch[i].raw_relation
        new_node['childs'].append({
            'rule': ch[i].text.get_rule(),
            'subRule': ch[i].text.get_action(raw),
            'value': ch[i].value,
            'parent': new_node,
            'childs': [],
        })
        node2dict(ch[i], new_node['childs'][i])

def get_root_rule(childs):
    for child in childs:
        rt = child.text.get_rule()
        srt = child.text.get_action(child.raw_relation)
        if rt != 0 and rt != 11:
            return rt, srt
    return 1, 1

def toJSON(node):
    for child in node['childs']:
        del child['parent']
        toJSON(child)

if __name__ == "__main__":
    print(parse_sentence(text))
# roots = construct_redkillog_graph(text)
# for root in roots:
#     draw_tree(root)
# doc = nlp(text)
# for sent in doc.sents:
#         dfs_tree(sent.root)

# print("NLTK version: ", nltk.__version__)
