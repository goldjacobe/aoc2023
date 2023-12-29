import sys
import networkx as nx
import matplotlib.pyplot as plt

G = nx.Graph()
with open(sys.argv[1]) as f:
    for line in f:
        [left, right] = line.split(':')
        for to in right.strip().split(' '):
            G.add_edge(left.strip(), to.strip())

nx.draw(G, with_labels=True)
plt.show()
G.remove_edge('lms', 'tmc')
G.remove_edge('nhg', 'jjn')
G.remove_edge('xnn', 'txf')

nx.draw(G, with_labels=True)
plt.show()
