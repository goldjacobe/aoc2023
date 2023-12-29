
from z3 import Solver, Real
import sys
path = sys.argv[1]

stones = []
with open(path, 'r') as f:
    for line in f:
        [p, v] = line.split('@')
        [x, y, z] = map(lambda x:  int(x.strip()), p.split(','))
        [vx, vy, vz] = map(lambda x: int(x.strip()), v.split(','))
        stones.append([x, y, z, vx, vy, vz])

# Using Z3, find a [x, y, z, vx, vy, vz] such that the line it determines
# intersects with every stone.
x = Real('x')
y = Real('y')
z = Real('z')
vx = Real('vx')
vy = Real('vy')
vz = Real('vz')
s = Solver()
for i, stone in enumerate(stones[:3]):
    t = Real('t' + str(i))
    s.add(x + vx * t == stone[0] + stone[3] * t)
    s.add(y + vy * t == stone[1] + stone[4] * t)
    s.add(z + vz * t == stone[2] + stone[5] * t)
    s.add(t > 0)
s.check()
m = s.model()
print(int(str(m[x])) + int(str(m[y])) + int(str(m[z])))
