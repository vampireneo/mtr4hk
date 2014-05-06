import csv
from itertools import izip
a = izip(*csv.reader(open("loadfactor.csv", "rb")))
csv.writer(open("loadfactor_pivot.csv", "wb")).writerows(a)
